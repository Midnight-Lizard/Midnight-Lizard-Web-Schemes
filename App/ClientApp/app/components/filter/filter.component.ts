import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { SchemesService } from "../../services/schemes.service";
import { SchemesFilter, SchemesRouteFilter } from "../../models/schemes.filter";
import { SchemeSide } from "../../models/scheme.side";
import { ActivatedRoute } from '@angular/router';
import { MdButtonToggle } from "@angular/material";

const filters = SchemesRouteFilter, x = filters;

@Component({
    selector: 'cs-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class SchemesFilterComponent implements OnInit
{
    public navigationCompleted = false;
    public readonly filter: SchemesFilter = { name: "", side: SchemeSide.None };

    constructor(
        protected readonly _service: SchemesService,
        protected readonly _route: ActivatedRoute) { }

    ngOnInit(): void
    {
        this._route.paramMap.subscribe(params =>
        {
            this.navigationCompleted = false;
            this.filter.liked = false;
            this.filter.favorites = false;
            this.filter.side = SchemeSide.None;

            const filterValue = params.get("filter");
            switch (filterValue)
            {
                case undefined:
                case null:
                    break;

                case filters[x.my]:
                    break;

                case filters[x.favorites]:
                    this.filter.favorites = true;
                    break;

                case filters[x.liked]:
                    this.filter.liked = true;
                    break;

                case filters[x.popular]:
                    break;

                case filters[x.dark]:
                    this.filter.side = SchemeSide.Dark;
                    break;

                case filters[x.light]:
                    this.filter.side = SchemeSide.Light;
                    break;

                default:
                    break;
                //throw new Error(`There is no [${filterValue}] filter option.`);
            }
            this.applyFilter();
            //requestAnimationFrame(() => this.navigationCompleted = true);
            setTimeout(() => this.navigationCompleted = true, 1);
        });
    }

    applyFilter(): void
    {
        this._service.setFilter(this.filter);
    }
}
