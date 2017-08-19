import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component'
import { SchemesMaterialControlsModule } from "./modules/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpModule } from '@angular/http';
import { SchemesModule } from "./modules/schemes.module";

export function schemesModuleFactory()
{
    return SchemesModule;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        SchemesMaterialControlsModule,
        FlexLayoutModule,
        HttpModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'schemes', pathMatch: 'full' },
            { path: 'schemes', loadChildren: schemesModuleFactory },
            { path: '**', redirectTo: 'schemes' }
        ])
    ]
})
export class AppModuleShared { }
