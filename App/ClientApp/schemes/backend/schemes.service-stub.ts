import { Observable } from "rxjs/Observable";
import { SchemesService, PageResult, LikeResult } from "./schemes.service";
import { SchemesFilters } from "../model/schemes.filters";
import { PageOptions } from "../model/page.options";
import { SchemeEntry } from "../model/scheme.entry";
import { SchemesList } from "../model/schemes.lists";

export class SchemesServiceStub implements SchemesService
{
    constructor(
        readonly page$: Observable<PageResult>,
        readonly likes$: Observable<LikeResult>,
        readonly favorites$: Observable<any>
    ) { }

    public getSchemes(filters: SchemesFilters, pageOptions: PageOptions, list: SchemesList): Observable<PageResult>
    {
        return this.page$;
    }
    public likeScheme(id: number): Observable<LikeResult>
    {
        return this.likes$;
    }
    public dislikeScheme(id: number): Observable<LikeResult>
    {
        return this.likes$;
    }
    public addSchemeToFavorites(id: number): Observable<any>
    {
        return this.favorites$;
    }
    public removeSchemeFromFavorites(id: number): Observable<any>
    {
        return this.favorites$;
    }

}