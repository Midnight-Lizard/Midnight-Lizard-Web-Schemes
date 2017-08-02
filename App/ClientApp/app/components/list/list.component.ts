import { Component, Input } from '@angular/core';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { SchemesService } from "../../services/schemes.service";

@Component({
    selector: 'cs-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class SchemesListComponent
{
    protected _cols: number = 3;
    protected _aspect: string = "4:5";

    constructor(
        protected readonly _service: SchemesService,
        media: ObservableMedia)
    {
        media.subscribe((change: MediaChange) =>
        {
            switch (change.mqAlias)
            {
                case "xs":
                    this._cols = 1;
                    this._aspect = "4:5";
                    break;

                case "sm":
                    this._cols = 2;
                    this._aspect = "4:5";
                    break;

                case "md":
                    this._cols = 2;
                    this._aspect = "6:7";
                    break;

                case "lg":
                    this._cols = 3;
                    this._aspect = "4:5";
                    break;

                case "xl":
                    this._cols = 4;
                    this._aspect = "4:5";
                    break;

                default:
                    this._cols = 3;
                    this._aspect = "4:5";
                    break;
            }
        });
    }
}
