import "rxjs/add/operator/map"; 
import "rxjs/add/operator/groupBy";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/withLatestFrom";
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";
import { Operator } from "rxjs/Operator";
import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Params, Router } from "@angular/router";
import { RouterAction, ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store } from "@ngrx/store";

import { SchemesService } from "../backend/schemes.service";
import { SchemesFilters, getFiltersFromRoute, filtersAreEqual, createRouteParamsFromFilters } from "../model/schemes.filters";
import { PageOptions, getPageOptionsFromRoute, isNextPageOptions, isPrevPageOptions, createRouteParamsFromPageOptions, pageOptionsAreEqual } from "../model/page.options";
import { getSchemesListFromRoute } from "../model/schemes.lists";
import { State, FeatureState, initialState } from "./schemes.state";
import { Action, ActionType } from "./schemes.action-sets";
import { Actions as Act } from "./schemes.actions";

export const throttlingDuration = 500;

@Injectable()
export class SchemesEffects
{
    constructor(
        protected readonly actions$: Actions<Action>,
        protected readonly store$: Store<FeatureState>,
        protected readonly service: SchemesService,
        protected readonly router: Router
    ) { }

    @Effect() addSchemeToFavorites$ = this.throttleCommand(ActionType.AddSchemeToFavorites,
        act => this.service.addSchemeToFavorites(act.payload.id)
            .map(result => new Act.SchemeAddedToFavorites({ id: act.payload.id }))
            .catch(error => of(new Act.AddSchemeToFavoritesFailed({
                ...act.payload, error: {
                    originalError: error,
                    source: act,
                    errorMessage: "Adding scheme to favorites has failed."
                }
            }))));


    @Effect() removeSchemeFromFavorites$ = this.throttleCommand(ActionType.RemoveSchemeFromFavorites,
        act => this.service.removeSchemeFromFavorites(act.payload.id)
            .map(result => new Act.SchemeRemovedFromFavorites({ id: act.payload.id }))
            .catch(error => of(new Act.RemoveSchemeFromFavoritesFailed({
                ...act.payload, error: {
                    originalError: error,
                    source: act,
                    errorMessage: "Removing scheme from favorites has failed."
                }
            }))));


    @Effect() likeScheme$ = this.throttleCommand(ActionType.LikeScheme,
        act => this.service.likeScheme(act.payload.id)
            .map(result => new Act.SchemeLiked({ id: act.payload.id, likes: result.likes }))
            .catch(ex => of(new Act.LikeSchemeFailed({
                ...act.payload, error: {
                    originalError: ex,
                    source: act,
                    errorMessage: `System failed to like the scheme ${act.payload.id}.`
                }
            }))));

    @Effect() dislikeScheme$ = this.throttleCommand(ActionType.DislikeScheme,
        act => this.service.dislikeScheme(act.payload.id)
            .map(result => new Act.SchemeDisliked({ id: act.payload.id, likes: result.likes }))
            .catch(error => of(new Act.DislikeSchemeFailed({
                ...act.payload, error: {
                    originalError: error,
                    source: ActionType.DislikeScheme,
                    errorMessage: "Scheme disliking has failed."
                }
            }))));

    @Effect() processCurrentPageUpdate$ =
    this.actions$.ofType(ActionType.SchemesCurrentPageLoaded).switchMap(act =>
    {
        if (act.pageOptionsChanged)
        {
            const params = {
                ...createRouteParamsFromPageOptions(act.payload.pageOptions),
                ...createRouteParamsFromFilters(act.payload.filters)
            };
            this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
        }
        else if (!act.payload.nextPage && (act.payload.pageOptions.pageIndex + 1) *
            act.payload.pageOptions.pageSize < act.payload.total)
        {
            const nextPageOptions = {
                ...act.payload.pageOptions,
                pageIndex: act.payload.pageOptions.pageIndex + 1
            };
            return this.service
                .getSchemes(act.payload.filters, nextPageOptions, act.payload.list)
                .withLatestFrom(this.store$)
                .map(([nextPage, { CS: { schemes: state } }]) =>
                {
                    if (filtersAreEqual(act.payload.filters, state.filters) &&
                        act.payload.list === state.list &&
                        isNextPageOptions(state.pageOptions, nextPageOptions))
                    {
                        return new Act.SchemesNextPageLoaded({
                            nextPage: nextPage.currPage,
                            total: nextPage.total,
                            list: act.payload.list,
                            filters: act.payload.filters
                        });
                    }
                })
                .catch(error => of(new Act.NavigationFailed({
                    error: {
                        originalError: error, source: act,
                        errorMessage: "Current page update has failed."
                    }
                })));
        }
        return of<undefined>();
    });

    @Effect() navigateToSchemesList$ =
    this.handleNavigation("index", (route, state) =>
    {
        const fuck = "debugger";
        const list = getSchemesListFromRoute(route),
            filters = getFiltersFromRoute(route),
            pageOptions = getPageOptionsFromRoute(route, initialState.schemes.pageOptions);

        if (filtersAreEqual(filters, state.schemes.filters) &&
            list === state.schemes.list)
        {
            if (state.schemes.nextPage &&
                isNextPageOptions(state.schemes.pageOptions, pageOptions))
            {
                return of(new Act.SchemesCurrentPageLoaded(
                    {
                        list: list,
                        filters: filters,
                        pageOptions: pageOptions,
                        total: state.schemes.total,
                        currPage: state.schemes.nextPage,
                        prevPage: state.schemes.currPage
                    }));
            }
            else if (state.schemes.prevPage &&
                isPrevPageOptions(state.schemes.pageOptions, pageOptions))
            {
                return of(new Act.SchemesCurrentPageLoaded(
                    {
                        list: list,
                        filters: filters,
                        pageOptions: pageOptions,
                        total: state.schemes.total,
                        currPage: state.schemes.prevPage,
                        nextPage: state.schemes.currPage
                    }));
            }
            else if (state.schemes.currPage &&
                pageOptionsAreEqual(state.schemes.pageOptions, pageOptions))
            {
                return of();
            }
        }

        return this.service.getSchemes(filters, pageOptions, list)
            .map(schemes => new Act.SchemesCurrentPageLoaded({
                list: list,
                filters: filters,
                total: schemes.total,
                currPage: schemes.currPage,
                pageOptions: schemes.pageOptions
            }, schemes.pageOptionsChanged))
            .catch(error => of(new Act.NavigationFailed({
                error: {
                    originalError: error, source: ActionType.RouterNavigation,
                    errorMessage: "System faild to obtain schemes data."
                }
            })));
    });

    private handleNavigation(section: string,
        callback: (route: ActivatedRouteSnapshot, state: State) => Observable<any>)
    {
        const fuck = "debugger";
        const route$ = this.actions$.ofType(ActionType.RouterNavigation)
            .map(navAction => navAction.payload.routerState.root)
            .filter(root => !!root && !!root.firstChild && !!root.firstChild.routeConfig
                && !!root.firstChild.firstChild && !!root.firstChild.firstChild.routeConfig
                && root.firstChild.firstChild.url.length > 0
                && root.firstChild.routeConfig.path === "schemes"
                && root.firstChild.firstChild.url[0].path === section);

        return route$.withLatestFrom(this.store$)
            .switchMap(([route, state]) => callback(route, state.CS))
            .catch(error => of(new Act.NavigationFailed({
                error: {
                    originalError: error,
                    source: ActionType.RouterNavigation,
                    errorMessage: "Navigation has failed."
                }
            })));
    }

    protected throttleCommand<TActionType extends Act.CommandAction["type"], TNextAction>(
        actionType: TActionType,
        toNextAction: ((action: ActionType<TActionType>) => Observable<TNextAction>))
    {
        return this.actions$.ofType(actionType)
            .groupBy((act: Act.CommandAction) => act.payload.id)
            .flatMap(grp => grp.throttleTime(throttlingDuration))
            .flatMap(toNextAction);
    }
}
