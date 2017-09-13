import { ActionTypeNames, Action } from "./schemes.action-sets";
import { SchemeEntry, SchemesSide } from "../model/scheme.entry";
import { SchemesFilters } from "../model/schemes.filters";
import { PageOptions } from "../model/page.options";
import { SchemesList } from "../model/schemes.lists";

export const SchemesFeature: keyof FeatureState = "CS";

export interface ActionError 
{
    readonly errorMessage: string,
    readonly originalError: any,
    readonly source: ActionTypeNames | Action
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

export interface State
{
    readonly schemes: SchemesState
}

export interface FeatureState
{
    /** CS - Color Schemes */
    readonly CS: State
}

export const initialState: State = {
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