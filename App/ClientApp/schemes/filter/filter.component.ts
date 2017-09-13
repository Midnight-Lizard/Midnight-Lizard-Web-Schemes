import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';

import { SchemesSide } from "../model/scheme.entry";
import { SchemesFilters, createRouteParamsFromFilters } from "../model/schemes.filters";
import { State, FeatureState } from "../store/schemes.state";

@Component({
    selector: 'cs-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class SchemesFilterComponent implements OnDestroy
{
    protected readonly _storeSub: Subscription;
    readonly filtersForm: FormGroup;

    constructor(router: Router, store: Store<FeatureState>, fb: FormBuilder)
    {
        this.filtersForm = fb.group({ name: '', side: SchemesSide[SchemesSide.none] });

        this._storeSub = store.select(s => s.CS.schemes.filters)
            .subscribe(filters =>
            {
                this.filtersForm.reset(filters, { emitEvent: false });
            });

        this.filtersForm.valueChanges.debounceTime(300)
            .subscribe((filters: SchemesFilters) =>
            {
                const params = createRouteParamsFromFilters(filters);
                router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
            });
    }

    ngOnDestroy(): void
    {
        this._storeSub.unsubscribe();
    }
}
