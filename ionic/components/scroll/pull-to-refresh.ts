import {Component, View, ElementRef, EventEmitter, Parent} from 'angular2/angular2'

import {Content} from '../content/content';

import {raf, ready, CSS} from 'ionic/util/dom'

@Component({
  selector: 'ion-refresher',
  events: ['refresh']
})
@View({
  template: '<div class="refresher"></div>',
})
export class Refresher {
  constructor(
    @Parent() content: Content,
    element: ElementRef
  ) {
    this.ele = element.nativeElement;
    this.ele.classList.add('content');

    this.content = content;

    this.refresh = new EventEmitter('refresh');

    setTimeout(() => {
      this.initEvents();
    }, 1000);
  }

  doRefresh() {
    console.log('REFRESH');
    this.refresh.next({
      amt: 0
    });
  }

  initEvents() {

    let sp = this.content;
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
    this.scrollParent = sp;
    this.scrollChild = sc;

    this._touchMoveListener = this._handleTouchMove.bind(this);
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

  overscroll(val) {
    this.scrollChild.style[CSS.transform] = 'translateY(' + val + 'px)';
    this.lastOverscroll = val;
  }

  nativescroll(target, newScrollTop) {
    // creates a scroll event that bubbles, can be cancelled, and with its view
    // and detail property initialized to window and 1, respectively
    target.scrollTop = newScrollTop;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    target.dispatchEvent(e);
  }

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

  show() {
    // showCallback
    this.ele.classList.remove('invisible');
  }

  hide() {
    // showCallback
    this.ele.classList.add('invisible');
  }


  _handleTouchMove(e) {
    console.log('TOUCHMOVE', e);

    // if multitouch or regular scroll event, get out immediately
    if (!this.canOverscroll || e.touches.length > 1) {
      return;
    }
    //if this is a new drag, keep track of where we start
    if (this.startY === null) {
      this.startY = parseInt(e.touches[0].screenY, 10);
    }

    // kitkat fix for touchcancel events http://updates.html5rocks.com/2014/05/A-More-Compatible-Smoother-Touch
    /*
    if (ionic.Platform.isAndroid() && ionic.Platform.version() === 4.4 && scrollParent.scrollTop === 0) {
      isDragging = true;
      e.preventDefault();
    }
    */

    // how far have we dragged so far?
    this.deltaY = parseInt(e.touches[0].screenY, 10) - this.startY;

    // if we've dragged up and back down in to native scroll territory
    if (this.deltaY - this.dragOffset <= 0 || this.scrollParent.scrollTop !== 0) {

      if (this.isOverscrolling) {
        this.isOverscrolling = false;
        this.setScrollLock(false);
      }

      if (this.isDragging) {
        this.nativescroll(this.scrollParent, parseInt(this.deltaY - this.dragOffset, 10) * -1);
      }

      // if we're not at overscroll 0 yet, 0 out
      if (this.lastOverscroll !== 0) {
        this.overscroll(0);
      }
      return;

    } else if (this.deltaY > 0 && this.scrollParent.scrollTop === 0 && !this.isOverscrolling) {
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

    // update the icon accordingly
    if (!this.activated && this.lastOverscroll > this.ptrThreshold) {
      this.activated = true;
      raf(activate)
    } else if (this.activated && this.lastOverscroll < this.ptrThreshold) {
      this.activated = false;
      raf(deactivate);
    }
  }
  _handleTouchEnd(e) {
    console.log('TOUCHEND', e);
  }
  _handleScroll(e) {
    console.log('SCROLL', e.target.scrollTop);
  }
}
