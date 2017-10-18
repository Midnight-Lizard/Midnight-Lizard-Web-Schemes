import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpModule } from '@angular/http';
import { StoreModule, Action } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { SchemesMaterialControlsModule } from "../shared/material.module";
import { SchemesFeature, initialState } from "./store/schemes.state";
import { schemesReducer } from "./store/schemes.reducer";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        SchemesMaterialControlsModule,
        HttpModule,
        FlexLayoutModule,
        StoreModule.forRoot(
            { ML: reducer },
            { initialState: { ML: {} } }),
        StoreModule.forFeature(SchemesFeature, { schemes: schemesReducer }, { initialState }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([])
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        SchemesMaterialControlsModule,
        HttpModule,
        FlexLayoutModule
    ]
})
export class SchemesTestingModule
{
}

export function reducer(s: {}, a: Action)
{
    return s;
}