import { Params, ActivatedRouteSnapshot } from "@angular/router";
import { SchemesSide, SchemesSides } from "./scheme.entry";

export interface SchemesFilters
{
    readonly name: string;
    readonly side: SchemesSides;
}

export function getFiltersFromRoute(route: ActivatedRouteSnapshot): SchemesFilters
{
    return {
        name: route.queryParams.sn || '',
        side: route.queryParams.ss ? route.queryParams.ss : SchemesSide.none
    };
}

export function createRouteParamsFromFilters(filters: SchemesFilters): Params
{
    const params: Params = {};

    params.sn = filters.name || '';
    params.ss = filters.side;

    return params;
}

export function filtersAreEqual(first: SchemesFilters, second: SchemesFilters)
{
    return first.name === second.name && first.side === second.side;
}