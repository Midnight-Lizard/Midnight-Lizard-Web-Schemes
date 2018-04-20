import { SchemesState, ActionError } from "./schemes.state";
import { Action, ActionType } from "./schemes.action-sets";
import { filtersAreEqual } from "../model/schemes.filters";
import { isNextPageOptions } from "../model/page.options";
import { SchemeEntry, SchemeId } from "../model/scheme.entry";

export function schemesReducer(state: SchemesState, action: Action): SchemesState
{
    switch (action.type)
    {
        case ActionType.SchemesSettingsUpdated: {
            return { ...state, ...action.payload };
        }

        case ActionType.SchemesCurrentPageLoaded: {
            return { ...state, ...action.payload };
        }

        case ActionType.SchemesNextPageLoaded: {
            return { ...state, ...action.payload };
        }

        case ActionType.LikeScheme: {
            return updateScheme(state, action.payload.id, scheme => ({
                liked: true,
                likes: scheme.likes + 1
            }));
        }

        case ActionType.LikeSchemeFailed: {
            return updateScheme(
                updateError(state, action.payload.error),
                action.payload.id, scheme => ({
                    liked: false,
                    likes: scheme.likes - 1
                }));
        }

        case ActionType.SchemeLiked: {
            return updateScheme(state, action.payload.id, {
                liked: true,
                likes: action.payload.likes
            });
        }

        case ActionType.DislikeScheme: {
            return updateScheme(state, action.payload.id, scheme => ({
                liked: false,
                likes: scheme.likes - 1
            }));
        }

        case ActionType.DislikeSchemeFailed: {
            return updateScheme(
                updateError(state, action.payload.error),
                action.payload.id, scheme => ({
                    liked: true,
                    likes: scheme.likes + 1
                }));
        }

        case ActionType.SchemeDisliked: {
            return updateScheme(state, action.payload.id, {
                liked: false,
                likes: action.payload.likes
            });
        }

        case ActionType.AddSchemeToFavorites:
        case ActionType.SchemeAddedToFavorites: {
            return updateScheme(state, action.payload.id, { favorited: true });
        }

        case ActionType.AddSchemeToFavoritesFailed: {
            return updateScheme(
                updateError(state, action.payload.error),
                action.payload.id, { favorited: true });
        }

        case ActionType.RemoveSchemeFromFavorites:
        case ActionType.SchemeRemovedFromFavorites: {
            return updateScheme(state, action.payload.id, { favorited: false });
        }

        case ActionType.RemoveSchemeFromFavoritesFailed: {
            return updateScheme(
                updateError(state, action.payload.error),
                action.payload.id, { favorited: false });
        }

        default: {
            return state;
        }
    }
}

function updateError(state: SchemesState, error: ActionError)
{
    return { ...state, error };
}

function updateScheme(state: SchemesState, id: SchemeId,
    update: Partial<SchemeEntry> | ((scheme: SchemeEntry) => Partial<SchemeEntry>))
{
    const pages = { currPage: 0, prevPage: 0, nextPage: 0 };
    let pageName: keyof typeof pages;
    for (pageName in pages)
    {
        const page = state[pageName];
        if (page)
        {
            const pageClone = [...page];
            const index = pageClone.findIndex(s => s.id === id);
            if (index !== -1)
            {
                if (typeof (update) === "function")
                {
                    update = update(pageClone[index]);
                }
                pageClone[index] = { ...pageClone[index], ...update };
                return { ...state, [pageName]: pageClone };
            }
        }
    }
    return state;
}