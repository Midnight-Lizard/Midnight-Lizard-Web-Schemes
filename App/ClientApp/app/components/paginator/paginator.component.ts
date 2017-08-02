import { Component, OnInit, ViewChild } from '@angular/core';
import { SchemesService } from "../../services/schemes.service";
import { PageEvent, MdPaginator } from "@angular/material";
import { getDefaultPageOptions, PageSizes } from "../../models/page.options";

@Component({
    selector: 'cs-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class SchemesPaginatorComponent implements OnInit
{
    @ViewChild("paginator")
    protected readonly paginator: MdPaginator;

    constructor(protected readonly _service: SchemesService)
    {
        _service.pageOptions$.subscribe(pageOptions =>
        {
            if (this.paginator)
            {
                this.paginator.pageIndex = pageOptions.pageIndex;
            }
        });
    }

    ngOnInit(): void
    {
        this.paginator.pageSizeOptions = PageSizes;
        this.paginator.pageSize = getDefaultPageOptions().pageSize;
    }

    protected onPageChanged(event: PageEvent)
    {
        this._service.setPage(event);
    }
}
