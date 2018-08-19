import { Component, Element, EventListenerEnable, Listen, Method, Prop, QueueApi, Watch } from '@stencil/core';

import { now } from '../../utils/helpers';

@Component({
  tag: 'ion-ripple-effect',
  styleUrl: 'ripple-effect.scss',
  shadow: true
})
export class RippleEffect {

  private lastClick = -10000;
  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'enableListener' }) enableListener!: EventListenerEnable;
  @Prop({ context: 'window' }) win!: Window;

  @Prop() parent?: HTMLElement | string = 'parent';

  /** If true, the ripple effect will listen to any click events and animate */
  @Prop() tapClick = false;
  @Watch('tapClick')
  tapClickChanged(tapClick: boolean) {
    this.enableListener(this, 'ionActivated', tapClick, this.parent);
    this.enableListener(this, 'touchstart', !tapClick);
    this.enableListener(this, 'mousedown', !tapClick);
  }

  @Listen('ionActivated', { enabled: false })
  ionActivated(ev: CustomEvent) {
    this.addRipple(ev.detail.x, ev.detail.y);
  }

  @Listen('touchstart', { passive: true, enabled: false })
  touchStart(ev: TouchEvent) {
    this.lastClick = now(ev);
    const touches = ev.touches[0];
    this.addRipple(touches.clientX, touches.clientY);
  }

  @Listen('mousedown', { passive: true, enabled: false })
  mouseDown(ev: MouseEvent) {
    const timeStamp = now(ev);
    if (this.lastClick < (timeStamp - 1000)) {
      this.addRipple(ev.pageX, ev.pageY);
    }
  }

  componentDidLoad() {
    this.tapClickChanged(this.tapClick);
  }

  /**
   * Adds the ripple effect to the parent elment
   */
  @Method()
  addRipple(pageX: number, pageY: number) {
    let rIC = (this.win as any).requestIdleCallback;
    if (!rIC) {
      rIC = window.requestAnimationFrame;
    }

    rIC(() => this.prepareRipple(pageX, pageY));
  }

  private prepareRipple(pageX: number, pageY: number) {
    let x: number;
    let y: number;
    let size: number;

    this.queue.read(() => {
      const rect = this.el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      size = Math.min(Math.sqrt(width * width + height * height) * 2, MAX_RIPPLE_DIAMETER);
      x = pageX - rect.left - (size * 0.5);
      y = pageY - rect.top - (size * 0.5);
    });
    this.queue.write(() => {
      const div = this.win.document.createElement('div');
      div.classList.add('ripple-effect');
      const style = div.style;
      const duration = Math.max(RIPPLE_FACTOR * Math.sqrt(size), MIN_RIPPLE_DURATION);
      style.top = y + 'px';
      style.left = x + 'px';
      style.width = style.height = size + 'px';
      style.animationDuration = duration + 'ms';

      const container = this.el.shadowRoot || this.el;
      container.appendChild(div);
      setTimeout(() => div.remove(), duration + 50);
    });
  }
}

const RIPPLE_FACTOR = 35;
const MIN_RIPPLE_DURATION = 260;
const MAX_RIPPLE_DIAMETER = 550;
