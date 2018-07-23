import "rxjs";
import { Injectable, NgModuleFactoryLoader, NgModuleFactory, Compiler, Type } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { SchemesModule } from "../schemes/schemes.module";


@Injectable()
export class ExternalModuleLoader implements NgModuleFactoryLoader
{
    constructor(protected readonly compiler: Compiler)
    {
    }

    load(modulePath: string)
    {
        try
        {
            const moduleFactory = this.compiler.compileModuleSync(SchemesModule);
            return Promise.resolve(moduleFactory);
        }
        catch (ex)
        {
            console.error(ex);
        }
        return Promise.resolve(null as any as NgModuleFactory<any>);
    }
}

