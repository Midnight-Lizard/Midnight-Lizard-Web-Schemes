import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
//import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { EffectsModule, Actions } from "@ngrx/effects";

import { SchemesMaterialControlsModule } from "../shared/material.module";
import { SchemesService } from "./backend/schemes.service";
import { SchemesNavigationComponent } from "./navigation/navigation.component";
import { SchemesListComponent } from "./list/list.component";
import { SchemesFilterComponent } from "./filter/filter.component";
import { SchemesPaginatorComponent } from "./paginator/paginator.component";
import { initialState, SchemesFeature } from "./store/schemes.state";
import { schemesReducer } from "./store/schemes.reducer";
import { SchemesEffects } from "./store/schemes.effects";
import { SchemesFilters } from "./model/schemes.filters";

const index = "index";

@NgModule({
    declarations: [
        SchemesListComponent,
        SchemesNavigationComponent,
        SchemesFilterComponent,
        SchemesPaginatorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        SchemesMaterialControlsModule,
        //StoreRouterConnectingModule,
        RouterModule.forChild([
            { path: '', redirectTo: `${index}/full`, pathMatch: 'full' },
            {
                path: `${index}/:list`, children: [
                    { path: '', component: SchemesListComponent },
                    { path: '', component: SchemesFilterComponent, outlet: 'right-side' },
                    { path: '', component: SchemesNavigationComponent, outlet: 'left-side' }
                ]
            }
        ]),
        StoreModule.forFeature(SchemesFeature, { schemes: schemesReducer }, { initialState }),
        EffectsModule.forFeature([SchemesEffects])
    ],
    providers: [
        SchemesService, SchemesEffects, Actions
    ]
})
export class SchemesModule { }
export default SchemesModule;
