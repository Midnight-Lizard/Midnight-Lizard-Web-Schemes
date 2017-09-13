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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17880136_1983863495175218_8889275720830076097_o.png?oh=9e4ae79ae77330a51cfca71571360f29&oe=59CCDBD5" }
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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17917549_1983863505175217_5608182037326519772_o.png?oh=684a0ab40af2f83f44e69d7834439a88&oe=59D26790" }
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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17157594_1962351067326461_8209520558779490120_o.png?oh=1d3d81ec3f23a3b0331e946ad6348af4&oe=59CDCA2C" }
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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/15776902_1927113247516910_1850860440997664456_o.png?oh=b74302d59217c8c2fe477a1790519fc5&oe=59FF4D1E" }
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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17016890_1962351083993126_8861157301122852580_o.png?oh=69e4008c91c4e6cef8238ea75a55f580&oe=59FDAAC6" }
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
                { "url": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17017218_1962351090659792_3108768005585377946_o.png?oh=3e1d77141a3b3db608b7c64c72f99f2c&oe=59CCE7EF" }
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
