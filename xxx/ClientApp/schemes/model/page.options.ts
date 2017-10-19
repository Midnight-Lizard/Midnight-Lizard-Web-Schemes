import { Params, ActivatedRouteSnapshot } from "@angular/router";

export interface PageOptions
{
    readonly pageIndex: number;
    readonly pageSize: number;
}

export function getPageOptionsFromRoute(
    route: ActivatedRouteSnapshot,
    defaultPageOptions: PageOptions): PageOptions
{
    return {
        pageIndex: route.queryParams.pi ? parseInt(route.queryParams.pi) : defaultPageOptions.pageIndex,
        pageSize: route.queryParams.ps ? parseInt(route.queryParams.ps) : defaultPageOptions.pageSize
    };
}

export function createRouteParamsFromPageOptions(page: PageOptions): Params
{
    const params: Params = {};
    params.pi = page.pageIndex || 0;
    if (page.pageSize) params.ps = page.pageSize;
    return params;
}

export function isNextPageOptions(oldPageOptions: PageOptions, newPageOptions: PageOptions)
{
    return oldPageOptions.pageSize == newPageOptions.pageSize &&
        newPageOptions.pageIndex - oldPageOptions.pageIndex === 1;
}

export function isPrevPageOptions(oldPageOptions: PageOptions, newPageOptions: PageOptions)
{
    return oldPageOptions.pageSize == newPageOptions.pageSize &&
        oldPageOptions.pageIndex - newPageOptions.pageIndex === 1;
}

export function pageOptionsAreEqual(first: PageOptions, second: PageOptions)
{
    return first.pageIndex == second.pageIndex && first.pageSize == second.pageSize;
}