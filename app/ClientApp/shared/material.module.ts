import { NgModule } from '@angular/core';
import
{
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatListModule, MatGridListModule,
    MatSidenavModule, MatIconModule, MatInputModule, MatMenuModule, MatTooltipModule,
    MatCardModule, MatTableModule, MatPaginatorModule, MatButtonToggleModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule, MatCheckboxModule, MatToolbarModule, MatListModule, MatGridListModule,
        MatSidenavModule, MatIconModule, MatInputModule, MatMenuModule, MatTooltipModule,
        MatCardModule, MatTableModule, MatPaginatorModule, MatButtonToggleModule
    ],
    exports: [
        MatButtonModule, MatCheckboxModule, MatToolbarModule, MatListModule, MatGridListModule,
        MatSidenavModule, MatIconModule, MatInputModule, MatMenuModule, MatTooltipModule,
        MatCardModule, MatTableModule, MatPaginatorModule, MatButtonToggleModule
    ]
})
export class SchemesMaterialControlsModule
{

}
