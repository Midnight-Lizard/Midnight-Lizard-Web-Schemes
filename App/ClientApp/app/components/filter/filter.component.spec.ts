/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { expect as assume } from 'chai';
import { TestBed, fakeAsync, tick, inject, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { NgForm } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SchemesFilterComponent } from './filter.component';
import { SchemesService } from "../../services/schemes.service";
import { SchemesAccessor } from "../../services/schemes.accessor";
import { SchemesFilter, SchemesRouteFilter } from "../../models/schemes.filter";
import { ActivatedRoute } from "@angular/router";
import { ActivatedRouteStub } from "../../../test/stubs/ActivatedRouteStub";
import { nameof } from "../../../test/utils/nameof";
import { SchemeSide } from "../../models/scheme.side";
import { click } from "../../../test/utils/click.helper";
import { MdButtonToggleGroup, MdButtonToggle } from "@angular/material";
import { SharedModule } from "../../modules/shared.module";

let component: SchemesFilterComponent;
let fixture: ComponentFixture<SchemesFilterComponent>;
const filters = SchemesRouteFilter, x = filters;

describe('SchemesFilterComponent', () =>
{
    beforeEach(fakeAsync(() =>
    {
        const SchemesServiceStub = {
            setFilter: (filter: SchemesFilter) =>
            {
                console.log(filter)
            }
        };
        TestBed.configureTestingModule({
            declarations: [SchemesFilterComponent],
            imports: [SharedModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: SchemesService, useValue: SchemesServiceStub },
                { provide: ActivatedRoute, useClass: ActivatedRouteStub }
            ]
        });
        fixture = TestBed.createComponent(SchemesFilterComponent);
        component = fixture.componentInstance;
        spyOn(TestBed.get(SchemesService), nameof(SchemesServiceStub.setFilter));
    }));

    beforeEach(fakeAsync(() =>
    {
        component.navigationCompleted = true;
    }));

    it('should set service filter to default on route without params', fakeAsync(inject(
        [SchemesService, ActivatedRoute],
        (srv: SchemesService, route: ActivatedRouteStub) =>
        {
            route.testParamMap = {};
            const expectedFilter: SchemesFilter = {
                favorites: false,
                liked: false,
                name: "",
                side: SchemeSide.None
            };
            tick(1);
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to dark on route param /dark', fakeAsync(inject(
        [SchemesService, ActivatedRoute],
        (srv: SchemesService, route: ActivatedRouteStub) =>
        {
            route.testParamMap = { filter: filters[x.dark] };
            const expectedFilter: SchemesFilter = {
                favorites: false,
                liked: false,
                name: "",
                side: SchemeSide.Dark
            };
            tick(1);
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to light on route param /light', fakeAsync(inject(
        [SchemesService, ActivatedRoute],
        (srv: SchemesService, route: ActivatedRouteStub) =>
        {
            route.testParamMap = { filter: filters[x.light] };
            const expectedFilter: SchemesFilter = {
                favorites: false,
                liked: false,
                name: "",
                side: SchemeSide.Light
            };
            tick(1);
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to favorites on route param /favorites', fakeAsync(inject(
        [SchemesService, ActivatedRoute],
        (srv: SchemesService, route: ActivatedRouteStub) =>
        {
            route.testParamMap = { filter: filters[x.favorites] };
            const expectedFilter: SchemesFilter = {
                favorites: true,
                liked: false,
                name: "",
                side: SchemeSide.None
            };
            tick(1);
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to liked on route param /liked', fakeAsync(inject(
        [SchemesService, ActivatedRoute],
        (srv: SchemesService, route: ActivatedRouteStub) =>
        {
            route.testParamMap = { filter: filters[x.liked] };
            const expectedFilter: SchemesFilter = {
                favorites: false,
                liked: true,
                name: "",
                side: SchemeSide.None
            };
            tick(1);
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to dark on dark toggle checked', fakeAsync(inject(
        [SchemesService], (srv: SchemesService) =>
        {
            const darkToggle = fixture.debugElement.query(By.css("md-button-toggle[value='1']"));
            (darkToggle.componentInstance as MdButtonToggle).checked = true;
            fixture.detectChanges();
            tick();
            const expectedFilter: SchemesFilter = {
                name: "",
                side: `${SchemeSide.Dark}` as any
            };
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to dark on component.filter.side set to dark', fakeAsync(inject(
        [SchemesService], (srv: SchemesService) =>
        {
            component.filter.side = SchemeSide.Dark;
            fixture.detectChanges();
            tick();
            const expectedFilter: SchemesFilter = {
                name: "",
                side: SchemeSide.Dark
            };
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to light on light toggle checked', fakeAsync(inject(
        [SchemesService], (srv: SchemesService) =>
        {
            const lightToggle = fixture.debugElement.query(By.css("md-button-toggle[value='2']"));
            (lightToggle.componentInstance as MdButtonToggle).checked = true;
            fixture.detectChanges();
            tick();
            const expectedFilter: SchemesFilter = {
                name: "",
                side: `${SchemeSide.Light}` as any
            };
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter to light on component.filter.side set to light', fakeAsync(inject(
        [SchemesService], (srv: SchemesService) =>
        {
            component.filter.side = SchemeSide.Light;
            fixture.detectChanges();
            tick();
            const expectedFilter: SchemesFilter = {
                name: "",
                side: SchemeSide.Light
            };
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));

    it('should set service filter name to text entered into the search box', fakeAsync(inject(
        [SchemesService], (srv: SchemesService) =>
        {
            const testString = "test";
            const nameFilter = fixture.debugElement.query(By.css("#nameFilter")).nativeElement as HTMLInputElement;
            nameFilter.value = testString;
            nameFilter.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            var form = fixture.debugElement.query(By.directive(NgForm));
            form.triggerEventHandler("submit", null);
            const expectedFilter: SchemesFilter = {
                name: testString,
                side: SchemeSide.None
            };
            expect(srv.setFilter).toHaveBeenCalledWith(expectedFilter);
        })));
});