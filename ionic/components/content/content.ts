import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {ScrollTo} from '../../animations/scroll-to';
import {hasFocusedTextInput} from '../../util/dom';


@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ]
})
@View({
  template: '<scroll-content><ng-content></ng-content></scroll-content>'
})
export class Content extends Ion {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
    this.scrollPadding = 0;
  }

  onIonInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('scroll', handler);

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

  addTouchMoveListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('touchmove', handler);

    this.scrollElement.addEventListener('touchmove', handler);

    return () => {
      this.scrollElement.removeEventListener('touchmove', handler);
    }
  }

  scrollTo(x, y, duration, tolerance) {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this.scrollElement);

    return this._scrollTo.start(x, y, duration, tolerance);
  }

  getDimensions() {
    let scrollElement = this.scrollElement;
    let parentElement = scrollElement.parentElement;

    return {
      contentHeight: parentElement.offsetHeight,
      contentTop: parentElement.offsetTop,
      contentBottom: parentElement.offsetTop + parentElement.offsetHeight,

      contentWidth: parentElement.offsetWidth,
      contentLeft: parentElement.offsetLeft,
      contentRight: parentElement.offsetLeft + parentElement.offsetWidth,

      scrollHeight: scrollElement.scrollHeight,
      scrollTop: scrollElement.scrollTop,
      scrollBottom: scrollElement.scrollTop + scrollElement.scrollHeight,

      scrollWidth: scrollElement.scrollWidth,
      scrollLeft: scrollElement.scrollLeft,
      scrollRight: scrollElement.scrollLeft + scrollElement.scrollWidth,
    }
  }

  addKeyboardPadding(addPadding) {
    if (addPadding > this.scrollPadding) {
      this.scrollPadding = addPadding;
      this.scrollElement.style.paddingBottom = addPadding + 'px';
    }
  }

  pollFocus() {
    if (hasFocusedTextInput()) {
      this.isPollingFocus = true;

      setTimeout(() => {
        this.pollFocus();
      }, 500);

    } else {
      this.isPollingFocus = false;

      if (this.scrollPadding) {
        this.scrollPadding = 0;
        this.scrollElement.style.paddingBottom = '';
      }
    }
  }

}
