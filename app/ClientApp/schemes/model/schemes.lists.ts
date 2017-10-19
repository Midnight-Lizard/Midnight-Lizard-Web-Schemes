import { ActivatedRouteSnapshot } from "@angular/router";

export enum SchemesList
{
    full,
    my,
    favorites,
    liked,
    popular,
    original,
    community
}


export function getSchemesListFromRoute(route: ActivatedRouteSnapshot): SchemesList
{
    let index = route;
    while (index.firstChild && (index.url.length === 0 || index.url[0].path !== "index"))
    {
        index = index.firstChild;
    }
    return index.params.list ? SchemesList[index.params.list] as any : SchemesList.full;
}