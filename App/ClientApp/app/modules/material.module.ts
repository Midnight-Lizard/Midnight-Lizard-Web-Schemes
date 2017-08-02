import { NgModule } from '@angular/core';
import
{
    MdButtonModule, MdCheckboxModule, MdToolbarModule, MdListModule, MdGridListModule,
    MdSidenavModule, MdIconModule, MdInputModule, MdMenuModule, MdTooltipModule,
    MdCardModule, MdTableModule, MdPaginatorModule, MdButtonToggleModule
} from '@angular/material';

@NgModule({
    imports: [
        MdButtonModule, MdCheckboxModule, MdToolbarModule, MdListModule, MdGridListModule,
        MdSidenavModule, MdIconModule, MdInputModule, MdMenuModule, MdTooltipModule,
        MdCardModule, MdTableModule, MdPaginatorModule, MdButtonToggleModule
    ],
    exports: [
        MdButtonModule, MdCheckboxModule, MdToolbarModule, MdListModule, MdGridListModule,
        MdSidenavModule, MdIconModule, MdInputModule, MdMenuModule, MdTooltipModule,
        MdCardModule, MdTableModule, MdPaginatorModule, MdButtonToggleModule
    ]
})
export class SchemesMaterialControlsModule
{

}
