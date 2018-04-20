import { of } from "rxjs/observable/of";
import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { Effect } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import * as Act from "../../schemes/store/schemes.actions";
import { SchemesSettings } from "../../schemes/model/schemes-settings";

@Injectable()
export class AppEffects
{
    constructor(
        protected readonly actions$: Actions<Action>,
        @Inject(PLATFORM_ID) protected readonly platformId: Object
    ) { }

    @Effect() processExternalModuleEvaluetion$ =
    this.actions$.ofType("@ngrx/store/init" as any).switchMap(act =>
    {
        let settings: SchemesSettings;
        if (isPlatformBrowser(this.platformId))
        {
            settings = JSON.parse((document.getElementById("Settings") as HTMLInputElement).value);
        }
        else
        {
            settings = process.env;
        }
        return of(new Act.SchemesSettingsUpdated({ settings: settings }));
    });
}
