import {Component, ElementRef, EventEmitter, Host, Input, Output} from 'angular2/core'
import {NgIf, NgClass} from 'angular2/common';

import {Content} from '../content/content';
import {Icon} from '../icon/icon';
import {isDefined, defaults} from '../../util/util';
import {raf, ready, CSS} from '../../util/dom';


/**
 * @name Refresher
 * @description
 * Allows you to add pull-to-refresh to an Content component.
 * Place it as the first child of your Content or Scroll element.
 *
 * When refreshing is complete, call `refresher.complete()` from your controller.
 *
 *  @usage
 *  ```html
 *  <ion-content>
 *    <ion-refresher (starting)="doStarting()"
 *                   (refresh)="doRefresh($event, refresher)"
 *                   (pulling)="doPulling($event, amt)">
 *    </ion-refresher>
 *
 *  </ion-content>

 *  ```
 *
 *  ```ts
 *  export class MyClass {
 *  constructor(){}
 *    doRefresh(refresher) {
 *      console.log('Refreshing!', refresher);
 *
 *      setTimeout(() => {
 *        console.log('Pull to refresh complete!', refresher);
 *        refresher.complete();
 *      })
 *    }
 *
 *    doStarting() {
 *      console.log('Pull started!');
 *    }
 *
 *    doPulling(amt) {
 *      console.log('You have pulled', amt);
 *    }
 *  }
 *  ```
 *  @demo /docs/v2/demos/refresher/
 *
 *  @property {string} [pullingIcon] - the icon you want to display when you begin to pull down
 *  @property {string} [pullingText] - the text you want to display when you begin to pull down
 *  @property {string} [refreshingIcon] - the icon you want to display when performing a refresh
 *  @property {string} [refreshingText] - the text you want to display when performing a refresh
 *
 *  @property {any} (refresh) - the methond on your class you want to perform when you refreshing
 *  @property {any} (starting) - the methond on your class you want to perform when you start pulling down
 *  @property {any} (pulling) - the methond on your class you want to perform when you are pulling down
 *
 */
@Component({
  selector: 'ion-refresher',
  host: {
    '[class.active]': 'isActive',
    '[class.refreshing]': 'isRefreshing',
    '[class.refreshingTail]': 'isRefreshingTail'
  },
  template:
    '<div class="refresher-content" [class.refresher-with-text]="pullingText || refreshingText">' +
      '<div class="icon-pulling">' +
        '<ion-icon [name]="pullingIcon"></ion-icon>' +
      '</div>' +
      '<div class="text-pulling" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
      '<div class="icon-refreshing">' +
        '<ion-icon [name]="refreshingIcon"></ion-icon>' +
      '</div>' +
      '<div class="text-refreshing" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
    '</div>',
  directives: [NgIf, NgClass, Icon]
})
export class Refresher {
  private ele: HTMLElement;
  private _touchMoveListener;
  private _touchEndListener;
  private _handleScrollListener;
  
  isActive: boolean;
  isDragging: boolean = false;
  isOverscrolling: boolean = false;
  dragOffset: number = 0;
  lastOverscroll: number = 0;
  ptrThreshold: number = 0;
  activated: boolean = false;
  scrollTime: number = 500;
  canOverscroll: boolean = false;
  startY;
  deltaY;
  scrollHost;
  scrollChild;
  showIcon: boolean;
  showSpinner: boolean;
  isRefreshing: boolean;
  isRefreshingTail: boolean;
  
  @Input() pullingIcon: string;
  @Input() pullingText: string;
  @Input() refreshingIcon: string;
  @Input() refreshingText: string;
  @Input() spinner: string;
  
  @Output() pulling: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Output() starting: EventEmitter<any> = new EventEmitter();
  
  
  constructor(
    @Host() private content: Content,
    element: ElementRef
  ) {
    this.ele = element.nativeElement;
    this.ele.classList.add('content');
  }

  /**
   * @private
   */
  ngOnInit() {
    let sp = this.content.getNativeElement();
    let sc = this.content.scrollElement;

    this.startY = null;
    this.deltaY = null;
    this.scrollHost = sp;
    this.scrollChild = sc;

    defaults(this, {
      pullingIcon: 'md-arrow-down',
      refreshingIcon: 'ionic'
    })

    this.showSpinner = !isDefined(this.refreshingIcon) && this.spinner != 'none';
    this.showIcon = isDefined(this.refreshingIcon);

    this._touchMoveListener = this._handleTouchMove.bind(this);
    this._touchEndListener = this._handleTouchEnd.bind(this);
    this._handleScrollListener = this._handleScroll.bind(this);
    
    sc.addEventListener('touchmove', this._touchMoveListener);
    sc.addEventListener('touchend', this._touchEndListener);
    sc.addEventListener('scroll', this._handleScrollListener);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    let sc = this.content.scrollElement;
    sc.removeEventListener('touchmove', this._touchMoveListener);
    sc.removeEventListener('touchend', this._touchEndListener);
    sc.removeEventListener('scroll', this._handleScrollListener);
  }

  /**
   * @private
   * @param {TODO} val  TODO
   */
  overscroll(val) {
    this.scrollChild.style[CSS.transform] = 'translateY(' + val + 'px)';
    this.lastOverscroll = val;
  }

  /**
   * @private
   * @param {TODO} target  TODO
   * @param {TODO} newScrollTop  TODO
   */
  nativescroll(target, newScrollTop) {
    // creates a scroll event that bubbles, can be cancelled, and with its view
    // and detail property initialized to window and 1, respectively
    target.scrollTop = newScrollTop;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    target.dispatchEvent(e);
  }

  /**
   * @private
   * @param {TODO} enabled  TODO
   */
  setScrollLock(enabled) {
    // set the scrollbar to be position:fixed in preparation to overscroll
    // or remove it so the app can be natively scrolled
    if (enabled) {
      raf(() => {
        this.scrollChild.classList.add('overscroll');
        this.show();
      });

    } else {
      raf(() => {
        this.scrollChild.classList.remove('overscroll');
        this.hide();
        this.deactivate();
      });
    }
  }

  /**
   * @private
   */
  activate() {
    //this.ele.classList.add('active');
    this.isActive = true;
    //this.starting.next();
  }

  /**
   * @private
   */
  deactivate() {
    // give tail 150ms to finish
    setTimeout(() => {
      this.isActive = false;
      this.isRefreshing = false;
      this.isRefreshingTail = false;
      // deactivateCallback
      if (this.activated) this.activated = false;
    }, 150);
  }

  /**
   * @private
   */
  start() {
    // startCallback
    this.isRefreshing = true;
    this.refresh.next(this);
    //$scope.$onRefresh();
  }

  /**
   * @private
   */
  show() {
    // showCallback
    this.ele.classList.remove('invisible');
  }

  /**
   * @private
   */
  hide() {
    // showCallback
    this.ele.classList.add('invisible');
  }

  /**
   * @private
   */
  tail() {
    // tailCallback
    this.ele.classList.add('refreshing-tail');
  }

  /**
   * @private
   */
  complete() {
    setTimeout(() => {
      raf(this.tail.bind(this));

      // scroll back to home during tail animation
      this.scrollTo(0, this.scrollTime, this.deactivate.bind(this));

      // return to native scrolling after tail animation has time to finish
      setTimeout(() => {
        if (this.isOverscrolling) {
          this.isOverscrolling = false;
          this.setScrollLock(false);
        }
      }, this.scrollTime);

    }, this.scrollTime);
  }

/**
 * @private
 * @param {TODO} Y  TODO
 * @param {TODO} duration  TODO
 * @param {Function} callback  TODO
 */
  scrollTo(Y, duration, callback?) {
    // scroll animation loop w/ easing
    // credit https://gist.github.com/dezinezync/5487119
    var start = Date.now(),
        from = this.lastOverscroll;

    if (from === Y) {
      callback && callback();
      return; /* Prevent scrolling to the Y point if already there */
    }

    // decelerating to zero velocity
    function easeOutCubic(t) {
      return (--t) * t * t + 1;
    }

    // scroll loop
    function scroll() {
      var currentTime = Date.now(),
        time = Math.min(1, ((currentTime - start) / duration)),
        // where .5 would be 50% of time on a linear scale easedT gives a
        // fraction based on the easing method
        easedT = easeOutCubic(time);

      this.overscroll( Math.round((easedT * (Y - from)) + from) );

      if (time < 1) {
        raf(scroll.bind(this));

      } else {

        if (Y < 5 && Y > -5) {
          this.isOverscrolling = false;
          this.setScrollLock(false);
        }

        callback && callback();
      }
    }

    // start scroll loop
    raf(scroll.bind(this));
  }

  /**
   * @private
   * TODO
   * @param {Event} e  TODO
   */
  _handleTouchMove(e) {
    //console.log('TOUCHMOVE', e);

    // if multitouch or regular scroll event, get out immediately
    if (!this.canOverscroll || e.touches.length > 1) {
      return;
    }
    //if this is a new drag, keep track of where we start
    if (this.startY === null) {
      this.startY = parseInt(e.touches[0].screenY, 10);
    }

    // how far have we dragged so far?
    this.deltaY = parseInt(e.touches[0].screenY, 10) - this.startY;


    // if we've dragged up and back down in to native scroll territory
    if (this.deltaY - this.dragOffset <= 0 || this.scrollHost.scrollTop !== 0) {

      if (this.isOverscrolling) {
        this.isOverscrolling = false;
        this.setScrollLock(false);
      }

      if (this.isDragging) {
        this.nativescroll(this.scrollHost, Math.round(this.deltaY - this.dragOffset) * -1);
      }

      // if we're not at overscroll 0 yet, 0 out
      if (this.lastOverscroll !== 0) {
        this.overscroll(0);
      }
      return;

    } else if (this.deltaY > 0 && this.scrollHost.scrollTop === 0 && !this.isOverscrolling) {
      // starting overscroll, but drag started below scrollTop 0, so we need to offset the position
      this.dragOffset = this.deltaY;
    }

    // prevent native scroll events while overscrolling
    e.preventDefault();

    // if not overscrolling yet, initiate overscrolling
    if (!this.isOverscrolling) {
      this.isOverscrolling = true;
      this.setScrollLock(true);
    }

    this.isDragging = true;
    
    // overscroll according to the user's drag so far
    this.overscroll( Math.round((this.deltaY - this.dragOffset) / 3) );

    // Pass an incremental pull amount to the EventEmitter
    this.pulling.next(this.lastOverscroll);

    // update the icon accordingly
    if (!this.activated && this.lastOverscroll > this.ptrThreshold) {
      this.activated = true;
      raf(this.activate.bind(this));
      
    } else if (this.activated && this.lastOverscroll < this.ptrThreshold) {
      this.activated = false;
      raf(this.deactivate.bind(this));
    }
  }

  /**
   * @private
   * TODO
   * @param {Event} e  TODO
   */
  _handleTouchEnd(e) {
    console.log('TOUCHEND', e);
    // if this wasn't an overscroll, get out immediately
    if (!this.canOverscroll && !this.isDragging) {
      return;
    }
    // reset Y
    this.startY = null;
    // the user has overscrolled but went back to native scrolling
    if (!this.isDragging) {
      this.dragOffset = 0;
      this.isOverscrolling = false;
      this.setScrollLock(false);
    } else {
      this.isDragging = false;
      this.dragOffset = 0;

      // the user has scroll far enough to trigger a refresh
      if (this.lastOverscroll > this.ptrThreshold) {
        this.start();
        this.scrollTo(this.ptrThreshold, this.scrollTime);

      // the user has overscrolled but not far enough to trigger a refresh
      } else {
        this.scrollTo(0, this.scrollTime, this.deactivate.bind(this));
        this.isOverscrolling = false;
      }
    }
  }

  /**
   * @private
   * TODO
   * @param {Event} e  TODO
   */
  _handleScroll(e) {
    console.log('SCROLL', e.target.scrollTop);
  }
}
