/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, fakeAsync, ComponentFixture, ComponentFixtureAutoDetect, inject, tick }
    from '@angular/core/testing';
import { expect as assume } from 'chai';
import { BrowserModule, By } from "@angular/platform-browser";
import { MdSelect, MdPaginator } from "@angular/material";
import { Router, NavigationExtras } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Store } from "@ngrx/store";

import { SchemesPaginatorComponent } from './paginator.component';
import { SchemesTestingModule } from "../schemes.testing-module";
import { RouterStub } from "../../test/stubs/router.stub";
import { because } from "../../test/utils/because";
import { nameof } from "../../test/utils/nameof";
import { click } from "../../test/utils/click.helper";
import { FeatureState, initialState } from "../store/schemes.state";
import { Actions as Act } from "../store/schemes.actions";
import { PageOptions } from "../model/page.options";
import { SchemesSide } from "../model/scheme.entry";
import { SchemesList } from "../model/schemes.lists";

let component: SchemesPaginatorComponent;
let fixture: ComponentFixture<SchemesPaginatorComponent>;
const initialAction = new Act.SchemesCurrentPageLoaded({
    currPage: [], total: 50, list: SchemesList.full,
    filters: { name: "", side: SchemesSide.none },
    pageOptions: { pageIndex: 1, pageSize: 10 }
})

describe('SchemesPaginatorComponent',
    function (this: { paginator: MdPaginator })
    {
        beforeEach(fakeAsync(() =>
        {
            TestBed.configureTestingModule({
                declarations: [SchemesPaginatorComponent],
                imports: [SchemesTestingModule],
                providers: [
                    { provide: ComponentFixtureAutoDetect, useValue: true },
                    { provide: Router, useClass: RouterStub }
                ]
            });
            fixture = TestBed.createComponent(SchemesPaginatorComponent);
            component = fixture.componentInstance;
            spyOn(TestBed.get(Router) as Router, "navigate");
        }));

        beforeEach(fakeAsync(inject(
            [Store], (store$: Store<FeatureState>) =>
            {
                store$.dispatch(initialAction);
                fixture.detectChanges();
                this.paginator = fixture.debugElement.query(By.directive(MdPaginator)).componentInstance as MdPaginator;
            })));

        it('should react to store changes', fakeAsync(() =>
        {
            const actualPageOptions: PageOptions = {
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize
            };
            expect(actualPageOptions).toEqual(initialAction.payload.pageOptions);
            expect(this.paginator.length).toEqual(initialAction.payload.total);
        }));

        it('should navigate correctly on change', fakeAsync(inject(
            [Router], (router: Router) =>
            {
                const testOptions: PageOptions = {
                    pageSize: initialState.schemes.pageSizeOptions[0],
                    pageIndex: 2
                };
                this.paginator.pageSize = testOptions.pageSize
                this.paginator.pageIndex = testOptions.pageIndex;
                this.paginator.nextPage();
                fixture.detectChanges();
                const expectedParams: NavigationExtras = {
                    queryParams: { pi: testOptions.pageIndex + 1, ps: testOptions.pageSize },
                    queryParamsHandling: 'merge'
                };
                expect(router.navigate).toHaveBeenCalledWith([], expectedParams);
            })));
    });