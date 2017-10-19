import { Component, Inject } from '@angular/core';
import { PageEvent, MdPaginator } from "@angular/material";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { RootState } from "../store/schemes.state";
import { Observable } from "rxjs/Observable";
import { createRouteParamsFromPageOptions } from "../model/page.options";

@Component({
    selector: 'cs-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class SchemesPaginatorComponent
{
    pageSizeOptions$: Observable<number[]>;
    pageSize$: Observable<number>;
    total$: Observable<number>;
    pageIndex$: Observable<number>;

    constructor(protected _router: Router, protected readonly _store: Store<RootState>)
    {
        this.pageSizeOptions$ = this._store.select(s => s.CS.schemes.pageSizeOptions);
        this.pageSize$ = this._store.select(s => s.CS.schemes.pageOptions.pageSize);
        this.total$ = this._store.select(s => s.CS.schemes.total);
        this.pageIndex$ = this._store.select(s => s.CS.schemes.pageOptions.pageIndex);
    }

    onPageChanged(event: PageEvent)
    {
        const params = createRouteParamsFromPageOptions(event);
        this._router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
    }
}
