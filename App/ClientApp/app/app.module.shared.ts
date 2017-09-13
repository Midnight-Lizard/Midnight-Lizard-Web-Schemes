import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { StoreModule, Action } from '@ngrx/store';
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component'
import { SchemesMaterialControlsModule } from "../shared/material.module";
import { SchemesModule } from '../schemes/schemes.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FlexLayoutModule,
        SchemesMaterialControlsModule,
        HttpModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'schemes', pathMatch: 'full' },
            {
                path: 'schemes',
                loadChildren: schemesLoader//'../schemes/schemes.module#SchemesModule'
            },
            { path: '**', redirectTo: 'schemes' }
        ]/*, { useHash: true }*/),
        StoreRouterConnectingModule,
        StoreModule.forRoot(
            { global: reducer },
            { initialState: { global: {} } }),
        StoreDevtoolsModule.instrument(),
        EffectsModule.forRoot([])
    ]
})
export class AppModuleShared { }

export function schemesLoader()
{
    return SchemesModule;
}

export function reducer(s: {}, a: Action)
{
    return s;
}