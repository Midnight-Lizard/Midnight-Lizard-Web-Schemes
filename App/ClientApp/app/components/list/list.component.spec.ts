/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, fakeAsync, ComponentFixture, ComponentFixtureAutoDetect, inject, tick }
    from '@angular/core/testing';
import { expect as assume } from 'chai';
import { By } from "@angular/platform-browser";
import { SchemesListComponent } from './list.component';
import { SharedModule } from "../../modules/shared.module";
import { ObservableMedia } from "@angular/flex-layout";
import { ObservableMediaStub, MqAlias } from "../../../test/stubs/ObservableMediaStub";
import { Subject } from "rxjs/Subject";
import { SchemesService } from "../../services/schemes.service";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { MdTooltip, MdCardTitle, MdCardImage, MdButton } from "@angular/material";
import { because } from "../../../test/utils/because";

let component: SchemesListComponent;
let fixture: ComponentFixture<SchemesListComponent>;
const testSchemes = [
    {
        "colorSchemeId": "appleMint",
        "colorSchemeName": "Apple Mint",
        "backgroundGrayHue": 174,
        "inFavorites": false,
        "liked": true,
        "imageUrl": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17880136_1983863495175218_8889275720830076097_o.png?oh=9e4ae79ae77330a51cfca71571360f29&oe=59CCDBD5"
    },
    {
        "colorSchemeId": "sunsetSails",
        "colorSchemeName": "Sunset Sails",
        "backgroundGrayHue": 4,
        "inFavorites": true,
        "liked": false,
        "imageUrl": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17917549_1983863505175217_5608182037326519772_o.png?oh=684a0ab40af2f83f44e69d7834439a88&oe=59D26790"
    }];

describe('SchemesListComponent', function (this: { schemes: Subject<typeof testSchemes> })
{
    beforeEach(fakeAsync(() =>
    {
        this.schemes = new Subject();
        const SchemesServiceStub = {
            schemes$: this.schemes.asObservable()
        };
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SchemesListComponent],
            imports: [SharedModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: SchemesService, useValue: SchemesServiceStub },
                { provide: ObservableMedia, useClass: ObservableMediaStub }
            ]
        });
        fixture = TestBed.createComponent(SchemesListComponent);
        component = fixture.componentInstance;
    }));

    beforeEach(fakeAsync(() =>
    {
        this.schemes.next(testSchemes);
        fixture.detectChanges();
    }));

    it("should display cards for all test schemes", fakeAsync(() =>
    {
        const cards = fixture.debugElement.queryAll(By.css("md-card"));
        expect(cards.length).toEqual(testSchemes.length);
    }));

    for (let i = 0; i < testSchemes.length; i++)
    {
        const scheme = testSchemes[i];
        describe(`Card [${i}] for scheme [${scheme.colorSchemeName}]`,
            function (this: { card: DebugElement }) 
            {
                beforeEach(fakeAsync(() =>
                {
                    this.card = fixture.debugElement.queryAll(By.css("md-card"))[i];
                }));

                it(`should have colorSchemeId in sid attribute`, fakeAsync(() =>
                {
                    expect(this.card.attributes["sid"]).toEqual(scheme.colorSchemeId);
                }));

                describe(`Header`, function (this: { header: DebugElement })
                {
                    beforeEach(fakeAsync(() =>
                    {
                        this.header = fixture.debugElement
                            .queryAll(By.css("md-card"))[i]
                            .query(By.css("md-card-header"));
                    }));

                    it(`should have tooltip with scheme name`, fakeAsync(() =>
                    {
                        expect(this.header.attributes["ng-reflect-message"]).toEqual(scheme.colorSchemeName);
                    }));

                    describe(`Title`, function (this: { titleElement: HTMLAnchorElement })
                    {
                        beforeEach(fakeAsync(() =>
                        {
                            this.titleElement = fixture.debugElement
                                .queryAll(By.css("md-card"))[i]
                                .query(By.directive(MdCardTitle))
                                .nativeElement as HTMLAnchorElement;
                        }));
                        it(`should have reference to scheme image url`, fakeAsync(() =>
                        {
                            expect(this.titleElement.href).toEqual(scheme.imageUrl);
                        }));
                        it(`should contain scheme name`, fakeAsync(() =>
                        {
                            expect(this.titleElement.textContent!.trim()).toEqual(scheme.colorSchemeName);
                        }));
                    });
                });

                describe(`Image`, function (this: { image: DebugElement })
                {
                    beforeEach(fakeAsync(() =>
                    {
                        this.image = fixture.debugElement
                            .queryAll(By.css("md-card"))[i]
                            .query(By.directive(MdCardImage));
                    }));

                    it(`should have source bound to scheme image url`, fakeAsync(() =>
                    {
                        expect(this.image.properties["src"]).toEqual(scheme.imageUrl);
                    }));
                });

                describe(`Actions`, function ()
                {
                    it(`should have 5 action buttons`, fakeAsync(() =>
                    {
                        expect(fixture.debugElement
                            .queryAll(By.css("md-card"))[i]
                            .queryAll(By.directive(MdButton)).length).toEqual(5);
                    }));

                    describe(`Like button`, function (this: { likeButton: DebugElement }) 
                    {
                        beforeEach(fakeAsync(() =>
                        {
                            this.likeButton = fixture.debugElement
                                .queryAll(By.css("md-card"))[i]
                                .queryAll(By.directive(MdButton))[0];
                        }));
                        it(`should be filled with accent color if scheme is liked otherwise with primary`, fakeAsync(() =>
                        {
                            assume(this.likeButton.attributes["ng-reflect-color"])
                                .is.equal(scheme.liked ? "accent" : "primary",
                                because(() => scheme.liked));
                        }));
                        it(`should have appropriate tooltip`, fakeAsync(() =>
                        {
                            assume(this.likeButton.attributes["ng-reflect-message"])
                                .equal(scheme.liked ? "Remove like" : "Add like",
                                because(() => scheme.liked));
                        }));
                    });
                    describe(`Favorites button`, function (this: { favoritesButton: DebugElement }) 
                    {
                        beforeEach(fakeAsync(() =>
                        {
                            this.favoritesButton = fixture.debugElement
                                .queryAll(By.css("md-card"))[i]
                                .queryAll(By.directive(MdButton))[1];
                        }));
                        it(`should be filled with warn color if scheme is in favorites otherwise with primary`, fakeAsync(() =>
                        {
                            assume(this.favoritesButton.attributes["ng-reflect-color"])
                                .is.equal(scheme.inFavorites ? "warn" : "primary",
                                because(() => scheme.inFavorites));
                        }));
                        it(`should have appropriate tooltip`, fakeAsync(() =>
                        {
                            assume(this.favoritesButton.attributes["ng-reflect-message"])
                                .is.equal(scheme.inFavorites ? "Remove from favorites" : "Add to favorites",
                                because(() => scheme.inFavorites));
                        }));
                        it(`should have appropriate icon`, fakeAsync(() =>
                        {
                            const iconText = (this.favoritesButton.query(By.css("md-icon")).nativeElement as HTMLElement).textContent;
                            assume(iconText).is.equal(scheme.inFavorites ? "favorite" : "favorite_border",
                                because(() => scheme.inFavorites));
                        }));
                    });
                });
            });
    }

    describe(`Media query`, function ()
    {
        const medium: { mqAlias: MqAlias, cols: number, aspect: string }[] = [
            { mqAlias: "default", cols: 3, aspect: "4:5" },
            { mqAlias: "xx", cols: 3, aspect: "4:5" },
            { mqAlias: "xs", cols: 1, aspect: "4:5" },
            { mqAlias: "sm", cols: 2, aspect: "4:5" },
            { mqAlias: "md", cols: 2, aspect: "6:7" },
            { mqAlias: "lg", cols: 3, aspect: "4:5" },
            { mqAlias: "xl", cols: 4, aspect: "4:5" }
        ];
        for (let media of medium)
        {
            describe(media.mqAlias, function (this: { grid: DebugElement })
            {
                beforeEach(fakeAsync(inject([ObservableMedia], (mediaStub: ObservableMediaStub) =>
                {
                    if (media.mqAlias !== "default")
                    {
                        mediaStub.changeMedia(media.mqAlias);
                    }
                    this.grid = fixture.debugElement.query(By.css("md-grid-list"));
                    fixture.detectChanges();
                })));

                it(`should change grid to ${media.cols} columns`, fakeAsync(() =>
                {
                    assume(this.grid.attributes["ng-reflect-cols"]).equal(media.cols.toString());
                }));

                it(`should change tile aspect ratio to ${media.aspect}`, fakeAsync(() =>
                {
                    assume(this.grid.attributes["ng-reflect-row-height"]).equal(media.aspect.toString());
                }));
            });
        }
    });

    it(`━━━━━━━━━━━━━━━━━━━should display schemes━━━━━━━━━━━━━━━━━━━━━`, fakeAsync(() =>
    {
        const schemes = [
            {
                "colorSchemeId": "appleMint",
                "colorSchemeName": "Apple Mint",
                "backgroundGrayHue": 174,
                "inFavorites": false,
                "liked": true,
                "imageUrl": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17880136_1983863495175218_8889275720830076097_o.png?oh=9e4ae79ae77330a51cfca71571360f29&oe=59CCDBD5"
            },
            {
                "colorSchemeId": "sunsetSails",
                "colorSchemeName": "Sunset Sails",
                "backgroundGrayHue": 4,
                "inFavorites": true,
                "liked": false,
                "imageUrl": "https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/17917549_1983863505175217_5608182037326519772_o.png?oh=684a0ab40af2f83f44e69d7834439a88&oe=59D26790"
            }];
        this.schemes.next(schemes);
        fixture.detectChanges();
        tick();
        const cards = fixture.debugElement.queryAll(By.css("md-card"));
        assume(cards.length).is.equal(2, "two cards should be displayed");
        for (let i = 0; i < schemes.length; i++)
        {
            const scheme = schemes[i], card = cards[i];
            assume(card.attributes["sid"]).is.equal(scheme.colorSchemeId, "Because sid is bound to colorSchemeId");
            assume(card.query(By.css("md-card-header")).attributes["ng-reflect-message"]).is.equal(scheme.colorSchemeName, "Card header should have tooltip with scheme name");
            assume(card.query(By.directive(MdCardTitle)).properties["href"]).is.equal(scheme.imageUrl);
            assume((card.query(By.directive(MdCardTitle)).nativeElement as HTMLAnchorElement).textContent!.trim()).is.equal(scheme.colorSchemeName, "Because card title is bound to scheme name");
            assume(card.query(By.directive(MdCardImage)).properties["src"]).is.equal(scheme.imageUrl, "Because image source is bound to scheme image url");
            const buttons = card.queryAll(By.directive(MdButton));
            assume(buttons.length).is.equal(5, "Each card has 5 action buttons");
            assume(buttons[0].attributes["ng-reflect-color"]).is.equal(scheme.liked ? "accent" : "primary", "liked schemes should have thumb-up sign filled with accent color");
            assume(buttons[0].attributes["ng-reflect-message"]).is.equal(scheme.liked ? "Remove like" : "Add like", "like button should have appropriate tooltip");
            assume(buttons[1].attributes["ng-reflect-color"]).is.equal(scheme.inFavorites ? "warn" : "primary", "favorited schemes should have heart sign filled with warn color");
            assume(buttons[1].attributes["ng-reflect-message"]).is.equal(scheme.inFavorites ? "Remove from favorites" : "Add to favorites", "favorites button should have appropriate tooltip");
        }
    }));
});