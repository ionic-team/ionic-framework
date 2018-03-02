import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';

@Component({
  tag: 'ion-scroll',
  styleUrls: {
    ios: 'scroll.ios.scss',
    md: 'scroll.md.scss'
  },
  host: {
    theme: 'scroll'
  }
})
export class Scroll {

  private watchDog: any;
  private isScrolling = false;
  private lastScroll = 0;

  @Element() private el: HTMLElement;

  @Prop({ context: 'config'}) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop({ context: 'isServer' }) isServer: boolean;

  @Prop() mode: string;


  /**
   * If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
   * If the content exceeds the bounds of ionScroll, nothing will change.
   * Note, the does not disable the system bounce on iOS. That is an OS level setting.
   */
  @Prop({mutable: true}) forceOverscroll: boolean;

  /**
   * Emitted when the scroll has started.
   */
  @Event() ionScrollStart: EventEmitter;

  /**
   * Emitted when the scroll has ended.
   */
  @Event() ionScrollEnd: EventEmitter;

  componentWillLoad() {
    if (this.isServer) {
      return;
    }
    if (this.forceOverscroll === undefined) {
      this.forceOverscroll = this.mode === 'ios' && ('ontouchstart' in window);
    }
  }

  @Listen('scroll', { passive: true })
  onScroll() {
    this.lastScroll = Date.now();
    if (!this.isScrolling) {
      this.onScrollStart();
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
  scrollByPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    return this.scrollToPoint(x + this.el.scrollLeft, y + this.el.scrollTop, duration, done);
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


  private onScrollStart() {
    console.debug('scroll start');
    this.isScrolling = true;
    this.ionScrollStart.emit(this.el);

    // watchdog
    this.watchDog = setInterval(() => {
      if (this.lastScroll < Date.now() - 120) {
        this.onScrollEnd();
      }
    }, 100);
  }

  private onScrollEnd() {
    console.debug('scroll end');

    clearInterval(this.watchDog);
    this.watchDog = null;
    this.isScrolling = false;
    this.ionScrollEnd.emit(this.el);
  }

  hostData() {
    return {
      class: {
        overscroll: this.forceOverscroll
      }
    };
  }

  render() {
    return [
      // scroll-inner is used to keep custom user padding
      <div class='scroll-inner'>
        <slot></slot>
      </div>
    ];
  }
}
