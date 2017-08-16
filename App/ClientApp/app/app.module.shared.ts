import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component'
import SchemesModule from "./modules/schemes.module";
import { SchemesMaterialControlsModule } from "./modules/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpModule } from '@angular/http';

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
            { path: 'schemes', loadChildren: './modules/schemes.module' },
            { path: '**', redirectTo: 'schemes' }
        ])
    ]
})
export class AppModuleShared { }
