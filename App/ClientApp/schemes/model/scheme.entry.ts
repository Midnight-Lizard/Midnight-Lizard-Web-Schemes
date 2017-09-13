export class SchemeScreenshot
{
    constructor(
        readonly url: string
    ) { }
}

export abstract class SchemesSide
{
    static readonly none = "none";
    static readonly dark = "dark";
    static readonly light = "light";
}
export declare type SchemesSides = (typeof SchemesSide)[keyof typeof SchemesSide];

export declare type SchemeId = number;
export declare type SchemeName = string;

export class SchemeEntry
{
    constructor(
        readonly id: SchemeId,
        readonly name: SchemeName,
        readonly liked: boolean,
        readonly likes: number,
        readonly favorited: boolean,
        readonly side: SchemesSides,
        readonly screenshots: SchemeScreenshot[]
    ) { }
}

export class SchemeDetails extends SchemeEntry
{
    constructor(
        id: number,
        name: string,
        liked: boolean,
        likes: number,
        favorited: boolean,
        side: SchemesSides,
        screenshots: SchemeScreenshot[])
    {
        super(id, name, liked, likes, favorited, side, screenshots);
    }
}