import { NgModule } from '@angular/core';
import { SchemesModule } from "./schemes.module";

@NgModule({
    imports: [SchemesModule],
    exports: [SchemesModule]
})
export class SchemesClientModule { }
export default SchemesClientModule;