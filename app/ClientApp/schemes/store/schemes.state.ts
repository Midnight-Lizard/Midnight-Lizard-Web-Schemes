import { User } from "oidc-client";

import { ActionFakeTypes, Action } from "./schemes.action-sets";
import { SchemeEntry, SchemesSide } from "../model/scheme.entry";
import { SchemesFilters } from "../model/schemes.filters";
import { PageOptions } from "../model/page.options";
import { SchemesList } from "../model/schemes.lists";

export const SchemesFeature: keyof RootState = "CS";

export interface ActionError 
{
    readonly errorMessage: string,
    readonly originalError: any,
    readonly source: ActionFakeTypes | Action
};

export interface SchemesState
{
    readonly prevPage?: SchemeEntry[],
    readonly currPage?: SchemeEntry[],
    readonly nextPage?: SchemeEntry[],
    readonly filters: SchemesFilters,
    readonly list: SchemesList,
    readonly pageOptions: PageOptions,
    readonly pageSizeOptions: number[],
    readonly error?: ActionError,
    readonly total: number
}

export interface FeatureState
{
    readonly schemes: SchemesState
}

export interface RootState
{
    /** Color Schemes feature */
    readonly CS: FeatureState,
    /** Midnight Lizard app state */
    readonly ML: {
        user?: User
    }
}

export const initialState: FeatureState = {
    schemes: {
        list: SchemesList.full,
        filters: {
            name: "",
            side: SchemesSide.none
        },
        pageOptions: {
            pageIndex: 0,
            pageSize: 10,
        },
        pageSizeOptions: [5, 10, 25, 50, 100],
        total: 0
    }
}