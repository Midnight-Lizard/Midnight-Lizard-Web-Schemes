import { TestScheduler } from "jasmine-marbles/src/scheduler";
import { Observable } from "rxjs/Observable";

export class MarbleSchedulerInjector
{
    static inject(scheduler: TestScheduler, ...methods: (keyof Observable<any> | "all")[])
    {
        methods = methods || ["all"];
        if (methods.length === 0) methods.push("all");

        for (let method of methods)
        {
            switch (method)
            {
                case "all":
                    $this.injectIntoDebounceTime(scheduler);
                    $this.injectIntoThrottleTime(scheduler);
                    break;

                case "debounceTime":
                    $this.injectIntoDebounceTime(scheduler);
                    break;

                case "throttleTime":
                    $this.injectIntoThrottleTime(scheduler);
                    break;

                default:
                    throw new Error(`Method [${method}] is not supported for injection.`);
            }
        }
    }

    static readonly originalDebounceTime = Observable.prototype.debounceTime;
    static injectIntoDebounceTime(scheduler: TestScheduler)
    {
        spyOn(Observable.prototype, 'debounceTime').and.callFake(
            function (this: Observable<any>, duration: number)
            {
                return $this.originalDebounceTime.call(this, duration, scheduler);
            });
    }

    static readonly originalThrottleTime = Observable.prototype.throttleTime;
    static injectIntoThrottleTime(scheduler: TestScheduler)
    {
        spyOn(Observable.prototype, 'throttleTime').and.callFake(
            function (this: Observable<any>, duration: number)
            {
                return $this.originalThrottleTime.call(this, duration, scheduler);
            });
    }
}

const $this = MarbleSchedulerInjector;