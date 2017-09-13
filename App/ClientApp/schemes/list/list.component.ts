import { Component, Input, OnDestroy, TrackByFunction } from '@angular/core';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";

import { State, FeatureState } from "../store/schemes.state";
import { SchemeEntry } from "../model/scheme.entry";
import { Actions as Act } from "../store/schemes.actions";
import { Subject } from "rxjs/Subject";

@Component({
    selector: 'cs-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class SchemesListComponent implements OnDestroy
{
    cols: number = 2;
    aspect: string = "4:5";
    readonly schemes$: Observable<SchemeEntry[] | undefined>;
    protected readonly _mediaSub: Subscription;
    protected readonly isDestroyed = new Subject();

    constructor(media: ObservableMedia,
        protected readonly store$: Store<FeatureState>)
    {
        this.schemes$ = store$.select(s => s.CS.schemes.currPage);
        this._mediaSub = media.subscribe((change: MediaChange) =>
        {
            switch (change.mqAlias)
            {
                case "xs":
                    this.cols = 1;
                    this.aspect = "4:5";
                    break;

                case "sm":
                    this.cols = 1;
                    this.aspect = "100:95";
                    break;

                case "md":
                    this.cols = 2;
                    this.aspect = "6:7";
                    break;

                case "lg":
                    this.cols = 2;
                    this.aspect = "95:100";
                    break;

                case "xl":
                    this.cols = 3;
                    this.aspect = "95:100";
                    break;

                default:
                    this.cols = 2;
                    this.aspect = "95:100";
                    break;
            }
        });
    }

    toggleSchemeLiked(scheme: SchemeEntry)
    {
        this.store$.dispatch(scheme.liked
            ? new Act.DislikeScheme(scheme)
            : new Act.LikeScheme(scheme));
    }

    toggleSchemeFavorited(scheme: SchemeEntry)
    {
        this.store$.dispatch(scheme.favorited
            ? new Act.RemoveSchemeFromFavorites(scheme)
            : new Act.AddSchemeToFavorites(scheme));
    }

    ngOnDestroy(): void
    {
        this.isDestroyed.next(true);
        this._mediaSub.unsubscribe();
    }

    trackById: TrackByFunction<SchemeEntry> = (index, item) => item.id;
}
