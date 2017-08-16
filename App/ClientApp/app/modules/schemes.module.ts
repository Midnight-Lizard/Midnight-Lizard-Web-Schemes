import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SchemesNavigationComponent } from "../components/navigation/navigation.component";
import { SchemesMaterialControlsModule } from "./material.module";
import { SchemesListComponent } from "../components/list/list.component";
import { SchemesService } from "../services/schemes.service";
import { SchemesFilterComponent } from "../components/filter/filter.component";
import { SchemesAccessor } from "../services/schemes.accessor";
import { SchemesPaginatorComponent } from "../components/paginator/paginator.component";
import { SchemesFilter, SchemesRouteFilter } from "../models/schemes.filter";

const filter = SchemesRouteFilter, x = filter;
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
        SchemesMaterialControlsModule,
        RouterModule.forChild([
            { path: '', redirectTo: index, pathMatch: 'full' },
            {
                path: index, pathMatch: 'full', children: [
                    { path: '', component: SchemesListComponent },
                    { path: '', component: SchemesFilterComponent, outlet: 'right-side' },
                    { path: '', component: SchemesNavigationComponent, outlet: 'left-side' }
                ]
            },
            {
                path: `${index}/:filter`, children: [
                    { path: '', component: SchemesListComponent },
                    { path: '', component: SchemesFilterComponent, outlet: 'right-side' },
                    { path: '', component: SchemesNavigationComponent, outlet: 'left-side' }
                ]
            }
        ])
    ],
    providers: [
        SchemesService,
        SchemesAccessor
    ]
})
export class SchemesModule
{
}
export default SchemesModule;
