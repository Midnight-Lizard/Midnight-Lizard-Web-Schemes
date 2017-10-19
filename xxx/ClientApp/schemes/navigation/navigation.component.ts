import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'cs-nav',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class SchemesNavigationComponent
{
    constructor(readonly route: ActivatedRoute)
    {
    }
}
