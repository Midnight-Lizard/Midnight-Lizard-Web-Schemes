import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PageOptions, getDefaultPageOptions } from "../models/page.options";
import { SchemesAccessor } from "./schemes.accessor";
import { SchemesFilter } from "../models/schemes.filter";
import { SchemeSide } from "../models/scheme.side";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class SchemesService
{
    protected _filter: SchemesFilter = { name: "", side: SchemeSide.None };
    protected _prevPage: ReplaySubject<any> = new ReplaySubject<any>();
    protected _prevPageSub: Subscription | null = null;
    protected _prevPageUnSub = false;
    protected _nextPage: ReplaySubject<any> = new ReplaySubject<any>();
    protected _nextPageSub: Subscription | null = null;
    protected _nextPageUnSub = false;
    protected readonly _schemes: BehaviorSubject<any[]> = new BehaviorSubject(new Array<any>());
    public readonly schemes$: Observable<any[]> = this._schemes.asObservable();
    protected readonly _pageOptions = new BehaviorSubject(getDefaultPageOptions());
    public readonly pageOptions$ = this._pageOptions.asObservable();

    constructor(protected readonly _accessor: SchemesAccessor) { }

    public setPage(pageOptions: PageOptions)
    {
        const currentPageOptions = this._pageOptions.getValue();
        if (currentPageOptions.pageSize === pageOptions.pageSize)
        {
            if (currentPageOptions.pageIndex == pageOptions.pageIndex - 1)
            {
                this._pageOptions.next(pageOptions);
                this.resetPrevPage();
                this._prevPage.next(this._schemes.getValue());
                this._nextPageUnSub = false;
                this._nextPageSub = this._nextPage.subscribe(data =>
                {
                    if (this._nextPageSub)
                    {
                        this._nextPageSub.unsubscribe();
                        this._nextPageSub = null;
                    }
                    else
                    {
                        this._nextPageUnSub = true;
                    }
                    this._schemes.next(data);
                    this.getNextPage();
                });
                if (this._nextPageUnSub && this._nextPageSub)
                {
                    this._nextPageSub.unsubscribe();
                    this._nextPageSub = null;
                }
                return;
            }
            else if (currentPageOptions.pageIndex == pageOptions.pageIndex + 1)
            {
                this._pageOptions.next(pageOptions);
                this.resetNextPage();
                this._nextPage.next(this._schemes.getValue());
                this._prevPageUnSub = false;
                this._prevPageSub = this._prevPage.subscribe(data =>
                {
                    if (this._prevPageSub)
                    {
                        this._prevPageSub.unsubscribe();
                        this._prevPageSub = null;
                    }
                    else
                    {
                        this._prevPageUnSub = true;
                    }
                    this._schemes.next(data);
                });
                if (this._prevPageUnSub && this._prevPageSub)
                {
                    this._prevPageSub.unsubscribe();
                    this._prevPageSub = null;
                }
                return;
            }
        }
        else
        {
            this.resetNextPage();
            this.resetPrevPage();
        }

        this._pageOptions.next(pageOptions);
        this.getCurrentPage();
    }

    protected resetNextPage()
    {
        this._nextPage = new ReplaySubject<any>();
    }

    protected resetPrevPage()
    {
        this._prevPage = new ReplaySubject<any>();
    }

    public setFilter(filter: SchemesFilter)
    {
        this._pageOptions.next(getDefaultPageOptions());
        this._filter = filter;
        this.resetNextPage();
        this.resetPrevPage();
        this.getCurrentPage();
    }

    protected getCurrentPage()
    {
        this._accessor.getSchemes(this._filter, this._pageOptions.getValue())
            .subscribe(data =>
            {
                this._pageOptions.next(data.pageOptions)
                this._schemes.next(data.schemes);
                this.getNextPage();
            });
    }

    protected getNextPage()
    {
        const pageOptions = this._pageOptions.getValue();
        if ((pageOptions.pageIndex + 1) * pageOptions.pageSize < pageOptions.length)
        {
            const nextPageOptions = Object.assign({}, pageOptions);
            nextPageOptions.pageIndex++;
            this._accessor.getSchemes(this._filter, nextPageOptions)
                .subscribe(data =>
                {
                    this._nextPage.next(data.schemes);
                });
        }
    }
}
