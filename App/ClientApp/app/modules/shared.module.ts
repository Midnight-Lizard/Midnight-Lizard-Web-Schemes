import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { SchemesMaterialControlsModule } from "./material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        SchemesMaterialControlsModule,
        HttpModule,
        FlexLayoutModule
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        SchemesMaterialControlsModule,
        HttpModule,
        FlexLayoutModule
    ]
})
export class SharedModule
{
}