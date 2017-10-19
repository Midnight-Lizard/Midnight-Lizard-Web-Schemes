import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Subject } from "rxjs/Subject";
import { ObservableMedia } from "@angular/flex-layout";

import { AppModuleShared } from './app.module.shared';
import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule, AppModuleShared
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: "http://localhost:80" },
        { provide: ObservableMedia, useClass: Subject }
    ]
})
export class AppModule {
}
