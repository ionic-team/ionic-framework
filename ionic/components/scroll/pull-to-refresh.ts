import {Component, View, NgIf, NgClass, ElementRef, EventEmitter, Host} from 'angular2/angular2'

import {Content} from '../content/content';

import * as util from 'ionic/util';
import {raf, ready, CSS} from 'ionic/util/dom';

/**
 * @name ionRefresher
 * @description
 * Allows you to add pull-to-refresh to an ionContent component.
 *
 * Place it as the first child of your ionContent or ionScroll element.
 *
 * When refreshing is complete, call `refresher.complete()` from your controller.
 *
 *  @usage
 *  ```ts
 *  <ion-refresher (starting)="doStarting()" (refresh)="doRefresh($event, refresher)" (pulling)="doPulling($event, amt)">
 *
 *
 *  doRefresh(refresher) {
 *    console.log('Refreshing!', refresher);
 *
 *    setTimeout(() => {
 *      console.log('Pull to refresh complete!', refresher);
 *      refresher.complete();
 *    })
 *  }
 *
 *  doStarting() {
 *    console.log('Pull started!');
 *  }
 *
 *  doPulling(amt) {
 *    console.log('You have pulled', amt);
 *  }
 *  ```
 */
@Component({
  selector: 'ion-refresher',
  events: ['refresh', 'starting', 'pulling'],
  properties: [
    'pullingIcon',
    'pullingText',
    'refreshingIcon',
    'refreshingText',
    'spinner',
    'disablePullingRotation'
  ],
  host: {
    '[class.active]': 'isActive',
    '[class.refreshing]': 'isRefreshing',
    '[class.refreshingTail]': 'isRefreshingTail'
  }
})
@View({
  template: `<div class="refresher-content" [class.refresher-with-text]="pullingText || refreshingText">
      <div class="icon-pulling">
        <i class="icon" [ng-class]="pullingIcon"></i>
      </div>
      <div class="text-pulling" [inner-html]="pullingText" *ng-if="pullingText"></div>
      <div class="icon-refreshing">
        <!--<ion-spinner ng-if="showSpinner" icon="{{spinner}}"></ion-spinner>-->
        <i class="icon" [ng-class]="refreshingIcon"></i>
      </div>
      <div class="text-refreshing" [inner-html]="refreshingText" *ng-if="refreshingText"></div>
    </div>`,
  directives: [NgIf, NgClass]
})
export class Refresher {
  /**
   * TODO
   * @param {Content} content  TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    @Host() content: Content,
    element: ElementRef
  ) {
    this.ele = element.nativeElement;
    this.ele.classList.add('content');

    this.content = content;

    this.refresh = new EventEmitter('refresh');
    this.starting = new EventEmitter('starting');
    this.pulling = new EventEmitter('pulling');
  }

  onInit() {
    this.initEvents();
  }

  /**
   * Initialize touch and scroll event listeners.
   */
  initEvents() {

    let sp = this.content.getNativeElement();
    let sc = this.content.scrollElement;

    this.isDragging = false;
    this.isOverscrolling = false;
    this.dragOffset = 0;
    this.lastOverscroll = 0;
    this.ptrThreshold = 60;
    this.activated = false;
    this.scrollTime = 500;
    this.startY = null;
    this.deltaY = null;
    this.canOverscroll = true;
    this.scrollHost = sp;
    this.scrollChild = sc;

    util.defaults(this, {
      pullingIcon: 'ion-android-arrow-down',
      refreshingIcon: 'ion-ionic'
      //refreshingText: 'Updating'
    })

    this.showSpinner = !util.isDefined(this.refreshingIcon) && this.spinner != 'none';

    this.showIcon = util.isDefined(this.refreshingIcon);

    this._touchMoveListener = this._handleTouchMov.bind(this);
    this._touchEndListener = this._handleTouchEnd.bind(this);
    this._handleScrollListener = this._handleScroll.bind(this);
    sc.addEventListener('touchmove', this._touchMoveListener);
    sc.addEventListener('touchend', this._touchEndListener);
    sc.addEventListener('scroll', this._handleScrollListener);
  }

  onDehydrate() {
    console.log('DEHYDRATION');
    let sc = this.content.scrollElement;
    sc.removeEventListener('touchmove', this._touchMoveListener);
    sc.removeEventListener('touchend', this._touchEndListener);
    sc.removeEventListener('scroll', this._handleScrollListener);
  }

  /**
   * TODO
   * @param {TODO} val  TODO
   */
  overscroll(val) {
    this.scrollChild.style[CSS.transform] = 'translateY(' + val + 'px)';
    this.lastOverscroll = val;
  }

  /**
   * TODO
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
   * TODO
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
   * TODO
   */
  activate() {
    //this.ele.classList.add('active');
    this.isActive = true;
    //this.starting.next();
  }

  /**
   * TODO
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

  start() {
    // startCallback
    this.isRefreshing = true;
    this.refresh.next(this);
    //$scope.$onRefresh();
  }

  /**
   * TODO
   */
  show() {
    // showCallback
    this.ele.classList.remove('invisible');
  }

  /**
   * TODO
   */
  hide() {
    // showCallback
    this.ele.classList.add('invisible');
  }

  /**
   * TODO
   */
  tail() {
    // tailCallback
    this.ele.classList.add('refreshing-tail');
  }

  /**
   * TODO
   */
  complete() {
    setTimeout(() => {
      raf(this.tail.bind(this));

      // scroll back to home during tail animation
      this.scrollTo(0, this.scrollTime, this.deactivate.bind(this));

      // return to native scrolling after tail animation has time to finish
      setTimeout(() => {
        if(this.isOverscrolling) {
          this.isOverscrolling = false;
          this.setScrollLock(false);
        }
      }, this.scrollTime);

    }, this.scrollTime);
  }

/**
 * TODO
 * @param {TODO} Y  TODO
 * @param {TODO} duration  TODO
 * @param {Function} callback  TODO
 */
  scrollTo(Y, duration, callback) {
    // scroll animation loop w/ easing
    // credit https://gist.github.com/dezinezync/5487119
    var start = Date.now(),
        from = this.lastOverscroll;

    if (from === Y) {
      callback();
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

      this.overscroll(parseInt((easedT * (Y - from)) + from, 10));

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
        this.nativescroll(this.scrollHost, parseInt(this.deltaY - this.dragOffset, 10) * -1);
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
    this.overscroll(parseInt((this.deltaY - this.dragOffset) / 3, 10));

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
