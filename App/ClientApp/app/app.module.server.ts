import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from "./components/app/app.component";

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule, AppModuleShared
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: "http://localhost:80" }
    ]
})
export class AppModule {
}
