import { Component, Element, Event, EventEmitter, Listen, Method, Prop, PropDidChange, State } from '@stencil/core';
import { ScrollDetail, StencilElement } from '../../index';

const enum Position {
  Top = 'top',
  Bottom = 'bottom',
}

/**
 * @name InfiniteScroll
 * @description
 * The Infinite Scroll allows you to perform an action when the user
 * scrolls a specified distance from the bottom or top of the page.
 *
 * The expression assigned to the `infinite` event is called when
 * the user scrolls to the specified distance. When this expression
 * has finished its tasks, it should call the `complete()` method
 * on the infinite scroll instance.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="let i of items">{% raw %}{{i}}{% endraw %}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *    <ion-infinite-scroll-content></ion-infinite-scroll-content>
 *  </ion-infinite-scroll>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * @Component({...})
 * export class NewsFeedPage {
 *   items = [];
 *
 *   constructor() {
 *     for (let i = 0; i < 30; i++) {
 *       this.items.push( this.items.length );
 *     }
 *   }
 *
 *   doInfinite(infiniteScroll) {
 *     console.log('Begin async operation');
 *
 *     setTimeout(() => {
 *       for (let i = 0; i < 30; i++) {
 *         this.items.push( this.items.length );
 *       }
 *
 *       console.log('Async operation has ended');
 *       infiniteScroll.complete();
 *     }, 500);
 *   }
 *
 * }
 * ```
 *
 * ## `waitFor` method of InfiniteScroll
 *
 * In case if your async operation returns promise you can utilize
 * `waitFor` method inside your template.
 *
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="let item of items">{{item}}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite-scroll (ionInfinite)="$event.waitFor(doInfinite())">
 *    <ion-infinite-scroll-content></ion-infinite-scroll-content>
 *  </ion-infinite-scroll>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * @Component({...})
 * export class NewsFeedPage {
 *   items = [];
 *
 *   constructor() {
 *     for (var i = 0; i < 30; i++) {
 *       this.items.push( this.items.length );
 *     }
 *   }
 *
 *   doInfinite(): Promise<any> {
 *     console.log('Begin async operation');
 *
 *     return new Promise((resolve) => {
 *       setTimeout(() => {
 *         for (var i = 0; i < 30; i++) {
 *           this.items.push( this.items.length );
 *         }
 *
 *         console.log('Async operation has ended');
 *         resolve();
 *       }, 500);
 *     })
 *   }
 * }
 * ```
 *
 * ## Infinite Scroll Content
 *
 * By default, Ionic uses the infinite scroll spinner that looks
 * best for the platform the user is on. However, you can change the
 * default spinner or add text by adding properties to the
 * `ion-infinite-scroll-content` component.
 *
 *  ```html
 *  <ion-content>
 *
 *    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *      <ion-infinite-scroll-content
 *        loadingSpinner="bubbles"
 *        loadingText="Loading more data...">
 *      </ion-infinite-scroll-content>
 *    </ion-infinite-scroll>
 *
 *  </ion-content>
 *  ```
 *
 *
 * ## Further Customizing Infinite Scroll Content
 *
 * The `ion-infinite-scroll` component holds the infinite scroll logic.
 * It requires a child component in order to display the content.
 * Ionic uses `ion-infinite-scroll-content` by default. This component
 * displays the infinite scroll and changes the look depending
 * on the infinite scroll's state. Separating these components allows
 * developers to create their own infinite scroll content components.
 * You could replace our default content with custom SVG or CSS animations.
 *
 * @demo /docs/demos/src/infinite-scroll/
 *
 */
@Component({
  tag: 'ion-infinite-scroll',
  styleUrl: 'infinite-scroll.scss'
})
export class InfiniteScroll {

  private thrPx: number = 0;
  private thrPc: number = 0.15;
  private scrollEl: HTMLIonScrollElement;
  private didFire = false;
  private isBusy = false;
  private init = false;

  @Element() private el: HTMLElement;
  @State() isLoading: boolean = false;

  /**
   * @input {string} The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   * Default is `15%`.
   */
  @Prop() threshold: string = '15%';
  @PropDidChange('threshold')
  protected thresholdChanged(val: string) {
    if (val.lastIndexOf('%') > -1) {
      this.thrPx = 0;
      this.thrPc = (parseFloat(val) / 100);

    } else {
      this.thrPx = parseFloat(val);
      this.thrPc = 0;
    }
  }


  /**
   * @input {boolean} If true, Whether or not the infinite scroll should be
   * enabled or not. Setting to `false` will remove scroll event listeners
   * and hide the display.
   *
   * Call `enable(false)` to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This method is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   * @param {boolean} shouldEnable  If the infinite scroll should be
   * enabled or not. Setting to `false` will remove scroll event listeners
   * and hide the display.
   */
  @Prop() enabled: boolean = true;
  @PropDidChange('enabled')
  protected enabledChanged(val: boolean) {
    this.enableScrollEvents(val);
  }

  /**
   * @input {string} The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   * Default is `bottom`.
   */
  @Prop() position: string = Position.Bottom;

  /**
   * @output {Event} Emitted when the scroll reaches
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Event() ionInfinite: EventEmitter;

  ionViewWillLoad() {
    const scrollEl = this.el.closest('ion-scroll') as StencilElement;
    return scrollEl.componentOnReady().then((el) => {
      this.scrollEl = el as HTMLIonScrollElement;
    });
  }

  ionViewDidLoad() {
    if (this.init) {
      console.warn('instance was already initialized');
      return;
    }
    this.init = true;
    this.thresholdChanged(this.threshold);
    this.enableScrollEvents(this.enabled);
    if (this.position === Position.Top) {
      Context.dom.write(() => this.scrollEl.scrollToBottom(0));
    }
  }

  ionViewDidUnload() {
    this.enableScrollEvents(false);
    this.scrollEl = null;
  }

  @Listen('ionScroll', {enabled: false})
  protected onScroll(ev: CustomEvent) {
    const detail = ev.detail as ScrollDetail;
    if (!this.canStart()) {
      return 1;
    }

    const infiniteHeight = this.el.offsetHeight;
    if (!infiniteHeight) {
      // if there is no height of this element then do nothing
      return 2;
    }
    const scrollTop = detail.scrollTop;
    const scrollHeight = this.scrollEl.scrollHeight;
    const height = this.scrollEl.offsetHeight;
    const threshold = this.thrPc ? (height * this.thrPc) : this.thrPx;

    let distanceFromInfinite: number;

    if (this.position === Position.Bottom) {
      distanceFromInfinite = scrollHeight - infiniteHeight - scrollTop - threshold - height;
    } else {
      // assert(this.position === Position.Top, '_position should be top');
      distanceFromInfinite = scrollTop - infiniteHeight - threshold;
    }

    if (distanceFromInfinite < 0) {
      if (!this.didFire) {
        this.isLoading = true;
        this.didFire = true;
        this.ionInfinite.emit(this);
        return 3;
      }
    } else {
      this.didFire = false;
    }

    return 4;
  }

  private canStart(): boolean {
    return (
      this.enabled &&
      !this.isBusy &&
      this.scrollEl &&
      !this.isLoading);
  }

  /**
   * Call `complete()` within the `infinite` output event handler when
   * your async operation has completed. For example, the `loading`
   * state is while the app is performing an asynchronous operation,
   * such as receiving more data from an AJAX request to add more items
   * to a data list. Once the data has been received and UI updated, you
   * then call this method to signify that the loading has completed.
   * This method will change the infinite scroll's state from `loading`
   * to `enabled`.
   */
  @Method()
  complete() {
    if (!this.isLoading) {
      return;
    }
    this.isLoading = false;

    if (this.position === Position.Top) {
      /** New content is being added at the top, but the scrollTop position stays the same,
       * which causes a scroll jump visually. This algorithm makes sure to prevent this.
       * (Frame 1)
       *    - complete() is called, but the UI hasn't had time to update yet.
       *    - Save the current content dimensions.
       *    - Wait for the next frame using _dom.read, so the UI will be updated.
       * (Frame 2)
       *    - Read the new content dimensions.
       *    - Calculate the height difference and the new scroll position.
       *    - Delay the scroll position change until other possible dom reads are done using _dom.write to be performant.
       * (Still frame 2, if I'm correct)
       *    - Change the scroll position (= visually maintain the scroll position).
       *    - Change the state to re-enable the InfiniteScroll.
       *    - This should be after changing the scroll position, or it could
       *    cause the InfiniteScroll to be triggered again immediately.
       * (Frame 3)
       *    Done.
       */
      this.isBusy = true;
      // ******** DOM READ ****************
      // Save the current content dimensions before the UI updates
      const prev = this.scrollEl.scrollHeight - this.scrollEl.scrollTop;

      // ******** DOM READ ****************
      Context.dom.read(() => {
        // UI has updated, save the new content dimensions
        const scrollHeight = this.scrollEl.scrollHeight;
        // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
        const newScrollTop = scrollHeight - prev;

        // ******** DOM WRITE ****************
        Context.dom.write(() => {
          this.scrollEl.scrollTop = newScrollTop;
          this.isBusy = false;
        });
      });
    }
  }

  /**
  * Pass a promise inside `waitFor()` within the `infinite` output event handler in order to
  * change state of infiniteScroll to "complete"
  */
  waitFor(action: Promise<any>) {
    const enable = this.complete.bind(this);
    action.then(enable, enable);
  }


  /**
   * @hidden
   */
  private enableScrollEvents(shouldListen: boolean) {
    Context.enableListener(this, 'ionScroll', shouldListen, this.scrollEl);
  }

  hostData() {
    return {
      class: {
        'infinite-scroll-loading': this.isLoading,
        'infinite-scroll-enabled': this.enabled
      }
    };
  }


  protected render() {
    return <slot></slot>;
  }

}
