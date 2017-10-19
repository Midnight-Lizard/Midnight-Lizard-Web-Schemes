import { RouterNavigationAction as RNA, RouterNavigationPayload } from "@ngrx/router-store";
import { RouterStateSnapshot } from "@angular/router";

import { SchemeEntry, SchemeId } from "../model/scheme.entry";
import { SchemesFilters } from "../model/schemes.filters";
import { SchemesList } from "../model/schemes.lists";
import { PageOptions } from "../model/page.options";
import { SchemesState, ActionError } from "./schemes.state";

export declare type SchemePayload = Partial<SchemeEntry> & { id: SchemeId };
export declare type ActionErrorPayload = { error: ActionError };
export declare type SchemeErrorPayload = SchemePayload & ActionErrorPayload;
export declare type LikesPayload = { likes: number };
export declare type SchemeLikesPayload = SchemePayload & LikesPayload;

export declare type CommandAction = LikeScheme | DislikeScheme | AddSchemeToFavorites | RemoveSchemeFromFavorites;

export class RouterNavigation implements RNA
{
    readonly type = "ROUTER_NAVIGATION";
    readonly payload: RouterNavigationPayload<RouterStateSnapshot>;
    constructor() { }
};

export class NavigationFailed
{
    readonly type = "NavigationFailed";
    constructor(readonly payload: ActionErrorPayload) { }
}

export class SchemesCurrentPageLoaded 
{
    readonly type = "SchemesCurrentPageLoaded";
    constructor(
        readonly payload:
            {
                currPage: SchemeEntry[],
                prevPage?: SchemeEntry[],
                nextPage?: SchemeEntry[],
                filters: SchemesFilters,
                list: SchemesList,
                pageOptions: PageOptions,
                total: number
            },
        readonly pageOptionsChanged?: boolean) { }
}

export class SchemesNextPageLoaded
{
    readonly type = "SchemesNextPageLoaded";
    constructor(readonly payload: {
        nextPage: SchemeEntry[],
        filters: SchemesFilters,
        list: SchemesList,
        total: number
    }) { }
}

export class LikeScheme
{
    readonly type = "LikeScheme";
    constructor(readonly payload: SchemePayload) { }
}

export class LikeSchemeFailed 
{
    readonly type = "LikeSchemeFailed";
    constructor(readonly payload: SchemeErrorPayload) { }
}

export class SchemeLiked 
{
    readonly type = "SchemeLiked";
    constructor(readonly payload: SchemeLikesPayload) { }
}

export class DislikeScheme 
{
    readonly type = "DislikeScheme";
    constructor(readonly payload: SchemePayload) { }
}

export class DislikeSchemeFailed 
{
    readonly type = "DislikeSchemeFailed";
    constructor(readonly payload: SchemeErrorPayload) { }
}

export class SchemeDisliked 
{
    readonly type = "SchemeDisliked";
    constructor(readonly payload: SchemeLikesPayload) { }
}

export class AddSchemeToFavorites 
{
    readonly type = "AddSchemeToFavorites";
    constructor(readonly payload: SchemePayload) { }
}

export class AddSchemeToFavoritesFailed 
{
    readonly type = "AddSchemeToFavoritesFailed";
    constructor(readonly payload: SchemeErrorPayload) { }
}

export class SchemeAddedToFavorites 
{
    readonly type = "SchemeAddedToFavorites";
    constructor(readonly payload: SchemePayload) { }
}

export class RemoveSchemeFromFavorites 
{
    readonly type = "RemoveSchemeFromFavorites";
    constructor(readonly payload: SchemePayload) { }
}

export class RemoveSchemeFromFavoritesFailed 
{
    readonly type = "RemoveSchemeFromFavoritesFailed";
    constructor(readonly payload: SchemeErrorPayload) { }
}

export class SchemeRemovedFromFavorites 
{
    readonly type = "SchemeRemovedFromFavorites";
    constructor(readonly payload: SchemePayload) { }
}
