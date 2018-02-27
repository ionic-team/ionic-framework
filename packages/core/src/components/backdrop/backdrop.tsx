import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { now } from '../../utils/helpers';

@Component({
  tag: 'ion-backdrop',
  styleUrls: {
    ios: 'backdrop.ios.scss',
    md: 'backdrop.md.scss'
  },
  host: {
    theme: 'backdrop'
  }
})
export class Backdrop {

  private lastClick = -10000;

  @Prop() visible = true;
  @Prop() tappable = true;
  @Prop() stopPropagation = true;

  @Event() ionBackdropTap: EventEmitter;

  componentDidLoad() {
    registerBackdrop(this);
  }

  componentDidUnload() {
    unregisterBackdrop(this);
  }

  @Listen('touchstart', {passive: false, capture: true})
  protected onTouchStart(ev: TouchEvent) {
    this.lastClick = now(ev);
    this.emitTap(ev);
  }

  @Listen('mousedown', {passive: false, capture: true})
  protected onMouseDown(ev: TouchEvent) {
    if (this.lastClick < now(ev) - 2500) {
      this.emitTap(ev);
    }
  }

  private emitTap(ev: Event) {
    if (this.stopPropagation) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (this.tappable) {
      this.ionBackdropTap.emit();
    }
  }

  hostData() {
    return {
      tabindex: '-1',
      class: {
        'backdrop-hide': !this.visible,
        'backdrop-no-tappable': !this.tappable,
      }
    };
  }
}

const BACKDROP_NO_SCROLL = 'backdrop-no-scroll';
const activeBackdrops = new Set();

function registerBackdrop(backdrop: any) {
  activeBackdrops.add(backdrop);
  document.body.classList.add(BACKDROP_NO_SCROLL);
}

function unregisterBackdrop(backdrop: any) {
  activeBackdrops.delete(backdrop);
  if (activeBackdrops.size === 0) {
    document.body.classList.remove(BACKDROP_NO_SCROLL);
  }
}
