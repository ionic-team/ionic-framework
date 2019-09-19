import { Observable, Subscriber } from 'rxjs';

export class ViewLifecycles {

  private targetResolve: (target: HTMLElement) => void;

  readonly ionViewWillEnter$: Observable<Event>;
  readonly ionViewDidEnter$: Observable<Event>;
  readonly ionViewWillLeave$: Observable<Event>;
  readonly ionViewDidLeave$: Observable<Event>;

  constructor() {
    const targetPromise = new Promise<HTMLElement>(resolve => {
      this.targetResolve = resolve;
    });
    this.ionViewWillEnter$ = new Observable(o => {
      targetPromise.then(target => bindEvent(target, 'ionViewWillEnter', o));
    });
    this.ionViewDidEnter$ = new Observable(o => {
      targetPromise.then(target => bindEvent(target, 'ionViewDidEnter', o));
    });
    this.ionViewWillLeave$ = new Observable(o => {
      targetPromise.then(target => bindEvent(target, 'ionViewWillLeave', o));
    });
    this.ionViewDidLeave$ = new Observable(o => {
      targetPromise.then(target => bindEvent(target, 'ionViewDidLeave', o));
    });
  }

  /**
   * @internal
   */
  _bind(target: HTMLElement) {
    this.targetResolve(target);
  }
}

const bindEvent = (target: HTMLElement, eventName: string, subscriber: Subscriber<Event>) => {
  const handler = (ev: Event) => subscriber.next(ev);
  target.addEventListener(eventName, handler);
  subscriber.add(() => {
    target.removeEventListener(eventName, handler);
  });
};
