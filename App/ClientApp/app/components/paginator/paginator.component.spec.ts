/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, fakeAsync, ComponentFixture, ComponentFixtureAutoDetect, inject, tick }
    from '@angular/core/testing';
import { expect as assume } from 'chai';
import { BrowserModule, By } from "@angular/platform-browser";
import { SchemesPaginatorComponent } from './paginator.component';
import { SharedModule } from "../../modules/shared.module";
import { SchemesService } from "../../services/schemes.service";
import { because } from "../../../test/utils/because";
import { PageOptions, getDefaultPageOptions } from "../../models/page.options";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { nameof } from "../../../test/utils/nameof";
import { click } from "../../../test/utils/click.helper";
import { MdSelect } from "@angular/material";

let component: SchemesPaginatorComponent;
let fixture: ComponentFixture<SchemesPaginatorComponent>;

describe('paginator component',
    function (this:
        {
            pageOptions: BehaviorSubject<PageOptions>,
            rangeLabel: HTMLDivElement,
            pageSizeText: HTMLSpanElement
        })
    {
        beforeEach(fakeAsync(() =>
        {
            this.pageOptions = new BehaviorSubject<PageOptions>(getDefaultPageOptions());
            const SchemesServiceStub = {
                pageOptions$: this.pageOptions.asObservable(),
                setPage(pageOptions) { console.log(pageOptions) }
            };
            TestBed.configureTestingModule({
                declarations: [SchemesPaginatorComponent],
                imports: [SharedModule],
                providers: [
                    { provide: SchemesService, useValue: SchemesServiceStub },
                    { provide: ComponentFixtureAutoDetect, useValue: true }
                ]
            });
            fixture = TestBed.createComponent(SchemesPaginatorComponent);
            component = fixture.componentInstance;
            spyOn(TestBed.get(SchemesService), nameof(SchemesServiceStub.setPage));
        }));

        beforeEach(fakeAsync(() =>
        {
            this.rangeLabel = fixture.debugElement.query(By.css(".mat-paginator-range-label")).nativeElement as HTMLDivElement;
            this.pageSizeText = fixture.debugElement.query(By.css(".mat-select-value-text")).nativeElement as HTMLSpanElement;
        }));

        it('should by default display zero range', fakeAsync(() =>
        {
            assume(this.rangeLabel.textContent).equal("0 of 0");
        }));

        it('should by default display default page size', fakeAsync(() =>
        {
            assume(this.pageSizeText.textContent)
                .equal(getDefaultPageOptions().pageSize.toString());
        }));

        it('should change range label on new page options', fakeAsync(() =>
        {
            const newPageOptions = { pageSize: 5, length: 50, pageIndex: 0 };
            this.pageOptions.next(newPageOptions)
            fixture.detectChanges();
            assume(this.rangeLabel.textContent)
                .equal(PageOptionsToRangeLabel(newPageOptions));
        }));

        it('should call SchemesService.setPage on page size change', fakeAsync(inject(
            [SchemesService],
            (srv: SchemesService) =>
            {
                const originalPageOptions = { pageSize: 5, length: 50, pageIndex: 0 };
                this.pageOptions.next(originalPageOptions);
                fixture.detectChanges();
                const trigger = fixture.debugElement.query(By.css('.mat-select-trigger'));
                click(trigger);
                fixture.detectChanges();
                const pageSize10Option = fixture.debugElement.queryAll(By.css("md-option"))[1];
                click(pageSize10Option);
                fixture.detectChanges();
                tick(1000);
                const expectedPageOptions = Object.assign({}, originalPageOptions);
                expectedPageOptions.pageSize = 10;
                expect(srv.setPage).toHaveBeenCalledWith(expectedPageOptions);
            })));

        it('should call SchemesService.setPage on </> button clicks', fakeAsync(inject(
            [SchemesService],
            (srv: SchemesService) =>
            {
                const originalPageOptions = { pageSize: 5, length: 50, pageIndex: 0 };
                this.pageOptions.next(originalPageOptions)
                fixture.detectChanges();
                const buttons = fixture.debugElement.queryAll(By.css("button"));
                click(buttons[1]);
                tick();
                const expectedPageOptions = Object.assign({}, originalPageOptions);
                expectedPageOptions.pageIndex++;
                expect(srv.setPage).toHaveBeenCalledWith(expectedPageOptions);
                click(buttons[0]);
                tick();
                expect(srv.setPage).toHaveBeenCalledWith(originalPageOptions);
            })));
    });

function PageOptionsToRangeLabel(pageOptions: PageOptions)
{
    const rangeBegin = pageOptions.length / pageOptions.pageSize * pageOptions.pageIndex + 1;
    const rangeEnd = Math.min(pageOptions.length, rangeBegin + pageOptions.pageSize - 1);
    return `${rangeBegin} - ${rangeEnd} of ${pageOptions.length}`;
}