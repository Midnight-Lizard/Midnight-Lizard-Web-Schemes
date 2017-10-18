import "rxjs/add/operator/delay";
import { Injectable } from '@angular/core';
import { of } from "rxjs/observable/of";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { PageOptions } from "../model/page.options";
import { SchemesFilters } from "../model/schemes.filters";
import { SchemesList } from "../model/schemes.lists";
import { SchemeEntry, SchemesSide, SchemeId } from "../model/scheme.entry";
import { Observable } from "rxjs/Observable";

export declare type PageResult = {
    total: number,
    pageOptions: PageOptions,
    pageOptionsChanged: boolean,
    currPage: SchemeEntry[]
};

export declare type LikeResult = { likes: number };

const fakeDelay = 300;

@Injectable()
export class SchemesService
{
    private static readonly _schemes = new Array<SchemeEntry>(
        {
            "id": 1,
            "name": "Apple Mint",
            "favorited": false,
            "liked": true,
            "likes": 45,
            "side": SchemesSide.dark,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/szBFviBG1jz3r6jopNGLkHRL-raFjLuYeCmJ5as9G1vVme9AyEFSwa8qEowxhat46bpZwK-iAMuPY9vRhhrA_5ykuQRXklpfhHhs=w1920-h1200" }
            ]
        },
        {
            "id": 2,
            "name": "Sunset Sails",
            "favorited": true,
            "liked": false,
            "likes": 25,
            "side": SchemesSide.dark,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/2elQVTWkqkLpWtqOtm6Qirt_Wl0thuhyEhQqCxzlR1MbmdSkhN4uaFKitqHtxCH2H_gpz0vuMkPOhmuOI05tOAgFdfM8cXbKLAxp=w1920-h1200" }
            ]
        },
        {
            "id": 3,
            "name": "Dimmed Dust",
            "favorited": false,
            "liked": true,
            "likes": 50,
            "side": SchemesSide.dark,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/dzvDXQGLmzdBwaxU5qyCe08ewaFskfISVCDgtH14V57GdNRXe6WlbO8pGX20KDybqecFYWNjtLDQUuMwLuceUp0iNam9cRo_0hlE=w1920-h1200" }
            ]
        },
        {
            "id": 4,
            "name": "Morning Mist",
            "favorited": false,
            "liked": false,
            "likes": 5,
            "side": SchemesSide.light,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/iv67RC1_Dncgw4Ylhq-DjTZzYaivx21vaTM6_uQ-x5TLkwo4lTu2MOYsINVIyZ5CxvXgzR5gZ4UZDHa-6CeQyA_xgbPG5p-nZp8=w1920-h1200" }
            ]
        },
        {
            "id": 5,
            "name": "Inverted Grayscale",
            "favorited": false,
            "liked": false,
            "likes": 4,
            "side": SchemesSide.dark,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/QiZPT1yLxr0-Ob9QuDtrshGO6Fsw701tL1yKCWq5aqHLjBrsRbmSXKKTi3mK9b4pXhGyU8vi1X1McamyzYGkT-YyjGmXLmXkXNtC=w1920-h1200" }
            ]
        },
        {
            "id": 6,
            "name": "Inverted Light",
            "favorited": true,
            "liked": true,
            "likes": 20,
            "side": SchemesSide.dark,
            "screenshots": [
                { "url": "https://lh3.googleusercontent.com/xGFHyTjX8IWoU8W4GypW-rKZ-O83MDhP3dr5sBWvj0cpG7ITyD-GkhVk1jE-bLtyDO5FtDReCLdPUA-J51-vbD13ibL54_CIMagf=w1920-h1200" }
            ]
        }
    );

    public getSchemes(filters: SchemesFilters, pageOptions: PageOptions, list: SchemesList): Observable<PageResult>
    {
        const filterName = filters.name ? filters.name.toLowerCase() : "";
        const totalSchemes =
            SchemesService._schemes.filter(s =>
                (!filterName || s.name.toLowerCase().indexOf(filterName) !== -1)
                &&
                (filters.side === SchemesSide.none || filters.side === s.side)
                &&
                (list !== SchemesList.favorites || s.favorited)
                &&
                (list !== SchemesList.liked || s.liked)
            );
        const totalLength = totalSchemes.length;
        let pageOptionsChanged = false;
        if (pageOptions.pageIndex >= totalLength / pageOptions.pageSize)
        {
            const newPageIndex = Math.max(Math.ceil(totalLength / pageOptions.pageSize) - 1, 0);
            if (pageOptions.pageIndex !== newPageIndex)
            {
                pageOptionsChanged = true;
                pageOptions = { pageIndex: newPageIndex, pageSize: pageOptions.pageSize };
            }
        }
        return of(
            {
                total: totalLength,
                pageOptions: pageOptions,
                pageOptionsChanged: pageOptionsChanged,
                currPage: totalSchemes.slice(
                    pageOptions.pageIndex * pageOptions.pageSize,
                    (pageOptions.pageIndex + 1) * pageOptions.pageSize)
                    .map(x => ({ ...x }))
            }).delay(fakeDelay * 2);
    }

    public likeScheme(id: SchemeId): Observable<LikeResult>
    {
        const scheme: { liked: boolean, likes: number } | undefined =
            SchemesService._schemes.find(s => s.id === id);
        if (scheme)
        {
            scheme.liked = true;
            scheme.likes++;
            return of({ likes: scheme.likes }).delay(fakeDelay);
        }
        throw new Error("Scheme not found");
    }

    public dislikeScheme(id: SchemeId): Observable<LikeResult>
    {
        const scheme: { liked: boolean, likes: number } | undefined =
            SchemesService._schemes.find(s => s.id === id);
        if (scheme)
        {
            scheme.liked = false;
            scheme.likes--;
            return of({ likes: scheme.likes }).delay(fakeDelay);
        }
        throw new Error("Scheme not found");
    }

    public addSchemeToFavorites(id: SchemeId)
    {
        const scheme: { favorited: boolean } | undefined =
            SchemesService._schemes.find(s => s.id === id);
        if (scheme)
        {
            scheme.favorited = true;
            return of({}).delay(fakeDelay);
        }
        throw new Error("Scheme not found");
    }

    public removeSchemeFromFavorites(id: SchemeId)
    {
        const scheme: { favorited: boolean } | undefined =
            SchemesService._schemes.find(s => s.id === id);
        if (scheme)
        {
            scheme.favorited = false;
            return of({}).delay(fakeDelay);
        }
        throw new Error("Scheme not found");
    }
}
