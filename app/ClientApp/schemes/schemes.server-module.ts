import { NgModule } from '@angular/core';
import { SchemesModule } from "./schemes.module";
import { Subject } from "rxjs/Subject";

@NgModule({
    imports: [SchemesModule]
})
export class SchemesServerModule { }
export default SchemesServerModule;