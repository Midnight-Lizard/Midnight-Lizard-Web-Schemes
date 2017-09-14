import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { Router } from "@angular/router";
import { provideMockActions } from '@ngrx/effects/testing';
import { TestScheduler } from "jasmine-marbles/src/scheduler";
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { SchemesTestingModule } from "../schemes.testing-module";
import { Actions as Act } from "./schemes.actions";
import { Action, ActionType } from "./schemes.action-sets";
import { SchemesEffects, throttlingDuration } from './schemes.effects';
import { SchemesService } from "../backend/schemes.service";
import { RouterStub } from "../../test/stubs/router.stub";
import { MarbleSchedulerInjector } from "../../test/utils/marble-scheduler-injector";

describe('SchemesEffects', function ()
{
    let effects: SchemesEffects;
    let actions$: Observable<Action>;
    let schemesService: jasmine.SpyObj<SchemesService>;
    let scheduler: TestScheduler;

    beforeEach(() =>
    {
        const serviceStub = jasmine.createSpyObj<SchemesService>("schemesServiceStub",
            Object.keys(SchemesService.prototype));
        TestBed.configureTestingModule({
            imports: [SchemesTestingModule],
            providers: [
                SchemesEffects,
                provideMockActions(() => actions$),
                { provide: SchemesService, useValue: serviceStub },
                { provide: Router, useClass: RouterStub }
            ]
        });
        scheduler = getTestScheduler();
        scheduler.maxFrames = throttlingDuration * 100;
        MarbleSchedulerInjector.inject(scheduler);
        effects = TestBed.get(SchemesEffects) as SchemesEffects;
        schemesService = TestBed.get(SchemesService) as jasmine.SpyObj<SchemesService>;
    });

    describe(ActionType.LikeScheme, () =>
    {
        it('should dispatch SchemeLiked EventAction', () =>
        {
            const testId = 123, testLikes = 456;

            actions$ = hot('-a-', { a: new Act.LikeScheme({ id: testId }) });
            schemesService.likeScheme.and.returnValue(cold('-r|', { r: { likes: testLikes } }));

            const nextAction = cold('--e', { e: new Act.SchemeLiked({ id: testId, likes: testLikes }) });
            expect(effects.likeScheme$).toBeObservable(nextAction);
        });

        it('should ignore consequent LikeScheme CommandActions related to the same scheme', () =>
        {
            const testId = 123, testLikes = 456;

            actions$ = hot('-a-a-', { a: new Act.LikeScheme({ id: testId }) });
            schemesService.likeScheme.and.returnValue(cold('-r|', { r: { likes: testLikes } }));

            const nextAction = cold('--e', { e: new Act.SchemeLiked({ id: testId, likes: testLikes }) });
            expect(effects.likeScheme$).toBeObservable(nextAction);
        });

        it('should process consequent LikeScheme CommandActions related to the different schemes', () =>
        {
            const testId = 123, testLikes = 456;

            actions$ = hot('-a-b-', {
                a: new Act.LikeScheme({ id: testId }),
                b: new Act.LikeScheme({ id: testId + 1 })
            });
            schemesService.likeScheme.and.returnValues(
                cold('-r|', { r: { likes: testLikes } }),
                cold('-r|', { r: { likes: testLikes } }));

            const nextActions = cold('--a-b', {
                a: new Act.SchemeLiked({ id: testId, likes: testLikes }),
                b: new Act.SchemeLiked({ id: testId + 1, likes: testLikes })
            });
            expect(effects.likeScheme$).toBeObservable(nextActions);
        });

        it('should process consequent LikeScheme CommandActions related to the different schemes and ignore to the same scheme', () =>
        {
            const testId = 123, testLikes = 456;

            actions$ = hot('-a-b-a-', {
                a: new Act.LikeScheme({ id: testId }),
                b: new Act.LikeScheme({ id: testId + 1 })
            });
            schemesService.likeScheme.and.returnValues(
                cold('-r|', { r: { likes: testLikes } }),
                cold('-r|', { r: { likes: testLikes } }));

            const nextActions = cold('--a-b', {
                a: new Act.SchemeLiked({ id: testId, likes: testLikes }),
                b: new Act.SchemeLiked({ id: testId + 1, likes: testLikes })
            });
            expect(effects.likeScheme$).toBeObservable(nextActions);
        });

        it('should process consequent LikeScheme CommandActions related to the same scheme ' +
            'after throttling period exceeded', () =>
            {
                const delay = Array(throttlingDuration + 10).join('-');
                const testId = 123, testLikes = 456;

                actions$ = hot(`-a${delay}a-`, { a: new Act.LikeScheme({ id: testId }) });
                schemesService.likeScheme.and.returnValues(
                    cold('-r|', { r: { likes: testLikes } }),
                    cold('-r|', { r: { likes: testLikes } })
                );

                const nextActions = cold(`--a${delay}b`, {
                    a: new Act.SchemeLiked({ id: testId, likes: testLikes }),
                    b: new Act.SchemeLiked({ id: testId, likes: testLikes })
                });
                expect(effects.likeScheme$).toBeObservable(nextActions);
            });
    });
});