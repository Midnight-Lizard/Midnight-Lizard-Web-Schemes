import { Actions } from "./schemes.actions";
import { ROUTER_NAVIGATION, RouterNavigationAction } from "@ngrx/router-store";
import { Observable } from "rxjs/Observable";
import { Constructor } from "@angular/material/typings/core/common-behaviors/constructor";

declare module "@ngrx/effects" {
    export class Actions<V> extends Observable<V>
    {
        ofType<T extends ActionTypeNames>(...allowedTypes: T[]): Actions<ActionType<T>>;
    }
}

export declare type Action = typeof Actions[keyof typeof Actions]["prototype"];
export declare type ActionTypeNames = typeof Actions[keyof typeof Actions]["prototype"]["type"];
declare type actionClassNameToTypeName = {[x in keyof typeof Actions]: typeof Actions[x]["prototype"]["type"]};
export const ActionType = (() =>
{
    const actType: Readonly<actionClassNameToTypeName> = {} as any;
    let actionClassName: ids;
    for (actionClassName in Actions)
    {
        (actType as any)[actionClassName] = new ((Actions[actionClassName].prototype as any)
            .constructor as Constructor<Action>)().type
    }
    return actType;
})();

declare type ids = keyof typeof Actions;
declare type idsToActionType = {[id in ids]:
    {[x in typeof Actions[id]["prototype"]["type"]]: id} &
    {[x in typeof Actions[ids]["prototype"]["type"]]: never}
};
declare type actionTypesToNever = idsToActionType[keyof idsToActionType];
declare type ActionTypeNameToClassName = {[type in ActionTypeNames]: actionTypesToNever[type]};
declare type ActionClassNameToClass = {[x in ids]: typeof Actions[x]["prototype"]};

export type ActionType<T extends ActionTypeNames> =
    ActionClassNameToClass[ActionTypeNameToClassName[T]];