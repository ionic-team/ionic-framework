import { Component, Element, EventListenerEnable, Listen, Method, Prop, Watch } from '@stencil/core';
import { QueueController } from '../../interface';
import { now } from '../../utils/helpers';

@Component({
  tag: 'ion-ripple-effect',
  styleUrl: 'ripple-effect.scss',
})
export class RippleEffect {

  private lastClick = -10000;
  @Element() el!: HTMLElement;

  @Prop({context: 'queue'}) queue!: QueueController;
  @Prop({context: 'enableListener'}) enableListener!: EventListenerEnable;
  @Prop({ context: 'document' }) doc!: Document;

  @Prop() tapClick = false;
  @Watch('tapClick')
  tapClickChanged(tapClick: boolean) {
    this.enableListener(this, 'parent:ionActivated', tapClick);
    this.enableListener(this, 'touchstart', !tapClick);
    this.enableListener(this, 'mousedown', !tapClick);
  }

  @Listen('parent:ionActivated', {enabled: false})
  ionActivated(ev: CustomEvent) {
    this.addRipple(ev.detail.x, ev.detail.y);
  }

  @Listen('touchstart', {passive: true, enabled: false})
  touchStart(ev: TouchEvent) {
    this.lastClick = now(ev);
    const touches = ev.touches[0];
    this.addRipple(touches.clientX, touches.clientY);
  }

  @Listen('mousedown', {passive: true, enabled: false})
  mouseDown(ev: MouseEvent) {
    const timeStamp = now(ev);
    if (this.lastClick < (timeStamp - 1000)) {
      this.addRipple(ev.pageX, ev.pageY);
    }
  }

  componentDidLoad() {
    this.tapClickChanged(this.tapClick);
  }

  @Method()
  addRipple(pageX: number, pageY: number) {
    let x: number, y: number, size: number;

    this.queue.read(() => {
      const rect = this.el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      size = Math.min(Math.sqrt(width * width + height * height) * 2, MAX_RIPPLE_DIAMETER);
      x = pageX - rect.left - (size / 2);
      y = pageY - rect.top - (size / 2);
    });
    this.queue.write(() => {
      const div = this.doc.createElement('div');
      div.classList.add('ripple-effect');
      const style = div.style;
      const duration = Math.max(RIPPLE_FACTOR * Math.sqrt(size), MIN_RIPPLE_DURATION);
      style.top = y + 'px';
      style.left = x + 'px';
      style.width = size + 'px';
      style.height = size + 'px';
      style.animationDuration = duration + 'ms';

      this.el.appendChild(div);
      setTimeout(() => div.remove(), duration + 50);
    });
  }
}

const RIPPLE_FACTOR = 35;
const MIN_RIPPLE_DURATION = 260;
const MAX_RIPPLE_DIAMETER = 550;
