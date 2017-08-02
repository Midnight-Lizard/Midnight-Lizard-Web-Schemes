import { SchemeSide } from "./scheme.side";

export interface SchemesFilter
{
    name: string;
    side: SchemeSide;
    liked?: boolean;
    favorites?: boolean;
}

export enum SchemesRouteFilter
{
    all,
    my,
    favorites,
    liked,
    popular,
    dark,
    light
}