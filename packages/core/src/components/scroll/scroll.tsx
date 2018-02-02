import { Component, Element, Event, EventEmitter, Listen, Method, Prop, Watch } from '@stencil/core';
import { Config, DomController, GestureDetail } from '../../index';
import { GestureController, GestureDelegate } from '../gesture-controller/gesture-controller';

declare const Ionic: { gesture: GestureController };


@Component({
  tag: 'ion-scroll'
})
export class Scroll {

  private gesture: GestureDelegate;
  private positions: number[] = [];
  private tmr: any;
  private queued = false;
  private app: HTMLIonAppElement;
  private isScrolling = false;
  private detail: ScrollDetail = {};

  @Element() private el: HTMLElement;

  @Prop({ context: 'config'}) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop({ context: 'isServer' }) isServer: boolean;

  @Prop() disabled = false;

  @Prop() onionScrollStart: ScrollCallback;
  @Prop() onionScroll: ScrollCallback;
  @Prop() onionScrollEnd: ScrollCallback;

  /**
   * Emitted when the scroll has started.
   */
  @Event() ionScrollStart: EventEmitter;

  /**
   * Emitted while scrolling.
   */
  @Event({bubbles: false}) ionScroll: EventEmitter;

  /**
   * Emitted when the scroll has ended.
   */
  @Event() ionScrollEnd: EventEmitter;

  componentDidLoad() {
    if (this.isServer) {
      return;
    }

    const gestureCtrl = Ionic.gesture = Ionic.gesture || new GestureController();
    this.gesture = gestureCtrl.createGesture('scroll', 100, false);
    this.app = this.el.closest('ion-app') as HTMLIonAppElement;
  }

  componentDidUnload() {
    this.gesture && this.gesture.destroy();
    this.gesture = this.detail = this.detail.event = null;
  }

  // Native Scroll *************************

  @Listen('scroll', { passive: true })
  onNativeScroll() {
    if (!this.queued) {
      this.queued = true;

      this.dom.read(timeStamp => {
        this.queued = false;
        this.onScroll(timeStamp);
      });
    }
  }

  @Method()
  scrollToTop(duration: number): Promise<void> {
    return this.scrollToPoint(0, 0, duration);
  }

  @Method()
  scrollToBottom(duration: number): Promise<void> {
    const y = (this.el)
      ? this.el.scrollHeight - this.el.clientHeight
      : 0;

    return this.scrollToPoint(0, y, duration);
  }

  @Method()
  scrollToPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    // scroll animation loop w/ easing
    // credit https://gist.github.com/dezinezync/5487119

    let promise: Promise<any>;
    if (done === undefined) {
      // only create a promise if a done callback wasn't provided
      // done can be a null, which avoids any functions
      promise = new Promise(resolve => {
        done = resolve;
      });
    }

    const self = this;
    const el = self.el;
    if (!el) {
      // invalid element
      done();
      return promise;
    }

    if (duration < 32) {
      el.scrollTop = y;
      el.scrollLeft = x;
      done();
      return promise;
    }

    const fromY = el.scrollTop;
    const fromX = el.scrollLeft;

    const maxAttempts = (duration / 16) + 100;

    let startTime: number;
    let attempts = 0;
    let stopScroll = false;

    // scroll loop
    function step(timeStamp: number) {
      attempts++;

      if (!self.el || stopScroll || attempts > maxAttempts) {
        self.isScrolling = false;
        el.style.transform = el.style.webkitTransform = '';
        done();
        return;
      }

      let time = Math.min(1, ((timeStamp - startTime) / duration));

      // where .5 would be 50% of time on a linear scale easedT gives a
      // fraction based on the easing method
      const easedT = (--time) * time * time + 1;

      if (fromY !== y) {
        el.scrollTop = (easedT * (y - fromY)) + fromY;
      }

      if (fromX !== x) {
        el.scrollLeft = Math.floor((easedT * (x - fromX)) + fromX);
      }

      if (easedT < 1) {
        // do not use DomController here
        // must use nativeRaf in order to fire in the next frame
        self.dom.raf(step);

      } else {
        stopScroll = true;
        self.isScrolling = false;
        el.style.transform = el.style.webkitTransform = '';
        done();
      }
    }

    // start scroll loop
    self.isScrolling = true;

    // chill out for a frame first
    this.dom.write(() => {
      this.dom.write(timeStamp => {
        startTime = timeStamp;
        step(timeStamp);
      });
    });

    return promise;
  }

  private onScroll(timeStamp: number) {
    const detail = this.detail;
    const positions = this.positions;
    const el = this.el;
    if (this.app) {
      this.app.setScrolling();
    }

    detail.timeStamp = timeStamp;

    // get the current scrollTop
    // ******** DOM READ ****************
    detail.scrollTop = el.scrollTop;

    // get the current scrollLeft
    // ******** DOM READ ****************
    detail.scrollLeft = el.scrollLeft;


    if (!this.isScrolling) {
      // currently not scrolling, so this is a scroll start
      this.isScrolling = true;

      // remember the start positions
      detail.startY = detail.scrollTop;
      detail.startX = detail.scrollLeft;

      // new scroll, so do some resets
      detail.velocityY = detail.velocityX = detail.deltaY = detail.deltaX = positions.length = 0;

      // emit only on the first scroll event
      if (this.onionScrollStart) {
        this.onionScrollStart(detail);
      }
      this.ionScrollStart.emit(detail);
    }
    detail.deltaY = (detail.scrollTop - detail.startY);
    detail.deltaX = (detail.scrollLeft - detail.startX);

    // actively scrolling
    positions.push(detail.scrollTop, detail.scrollLeft, detail.timeStamp);

    // move pointer to position measured 100ms ago
    const timeRange = timeStamp - 100;
    let startPos = positions.length - 1;

    while (startPos > 0 && positions[startPos] > timeRange) {
      startPos -= 3;
    }

    if (startPos > 3) {
      // compute relative movement between these two points
      const frequency = 1 / (positions[startPos] - timeStamp);
      const movedY = positions[startPos - 1] - detail.scrollLeft;
      const movedX = positions[startPos - 2] - detail.scrollTop;

      // based on XXms compute the movement to apply for each render step
      // velocity = space/time = s*(1/t) = s*frequency
      detail.velocityX = movedX * frequency;
      detail.velocityY = movedY * frequency;
    } else {
      detail.velocityX = 0;
      detail.velocityY = 0;
    }

    clearTimeout(this.tmr);
    this.tmr = setTimeout(() => {

      // haven't scrolled in a while, so it's a scrollend
      this.isScrolling = false;

      this.dom.read(timeStamp => {
        if (!this.isScrolling) {
          this.onEnd(timeStamp);
        }
      });
    }, 80);

    // emit on each scroll event
    if (this.onionScroll) {
      this.onionScroll(detail);
    } else {
      this.ionScroll.emit(detail);
    }
  }

  private onEnd(timeStamp: number) {
    const detail = this.detail;

    detail.timeStamp = timeStamp;

    // emit that the scroll has ended
    if (this.onionScrollEnd) {
      this.onionScrollEnd(detail);
    }
    this.ionScrollEnd.emit(detail);
  }

  render() {
    return (
      // scroll-inner is used to keep custom user padding
      <div class='scroll-inner'>
        <slot></slot>
      </div>
    );
  }

}

export interface ScrollDetail extends GestureDetail {
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  contentHeight?: number;
  contentWidth?: number;
  contentTop?: number;
  contentBottom?: number;
}

export interface ScrollCallback {
  (detail?: ScrollDetail): boolean|void;
}
