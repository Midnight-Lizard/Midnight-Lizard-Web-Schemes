import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Subscribable } from "rxjs/Observable";
import { MediaChange } from "@angular/flex-layout";
import { NextObserver, ErrorObserver, CompletionObserver } from "rxjs/Observer";
import { AnonymousSubscription } from "rxjs/Subscription";

export type MqAlias = "xs" | "sm" | "md" | "lg" | "xl" | "xx" | "default";

@Injectable()
export class ObservableMediaStub implements Subscribable<MediaChange>
{
    protected readonly _mediaChangeSubject = new Subject<MediaChange>();

    public readonly subscribe
    : (observerOrNext?: NextObserver<MediaChange> | ErrorObserver<MediaChange> | CompletionObserver<MediaChange> | ((value: MediaChange) => void), error?: (error: any) => void, complete?: () => void) => AnonymousSubscription
    = this._mediaChangeSubject.subscribe.bind(this._mediaChangeSubject);

    public changeMedia(newMedia: MqAlias)
    {
        this._mediaChangeSubject.next(new MediaChange(true, newMedia, newMedia, newMedia));
    }
}