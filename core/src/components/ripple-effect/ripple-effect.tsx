import { Component, Element, EventListenerEnable, Listen, Method, Prop, Watch } from '@stencil/core';
import { now } from '../../utils/helpers';
import { DomController } from '../../global/dom-controller';

@Component({
  tag: 'ion-ripple-effect',
  styleUrl: 'ripple-effect.scss',
})
export class RippleEffect {

  private lastClick = -10000;
  @Element() el: HTMLElement;

  @Prop({context: 'dom'}) dom: DomController;
  @Prop({context: 'enableListener'}) enableListener: EventListenerEnable;

  @Prop({ mutable: true }) useTapClick: boolean;
  @Watch('useTapClick')
  tapClickChanged(useTapClick: boolean) {
    this.enableListener(this, 'parent:ionActivated', useTapClick);
    this.enableListener(this, 'touchstart', !useTapClick);
    this.enableListener(this, 'mousedown', !useTapClick);
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

  componentWillLoad() {
    if (this.useTapClick === undefined) {
      this.useTapClick = !!document.querySelector('ion-tap-click');
    }
  }

  componentDidLoad() {
    this.tapClickChanged(this.useTapClick);
  }

  @Method()
  addRipple(pageX: number, pageY: number) {
    let x: number, y: number, size: number;

    this.dom.read(() => {
      const rect = this.el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      size = Math.min(Math.sqrt(width * width + height * height) * 2, 600);
      x = pageX - rect.left - (size / 2);
      y = pageY - rect.top - (size / 2);
    });
    this.dom.write(() => {
      const div = document.createElement('div');
      div.classList.add('ripple-effect');
      const style = div.style;
      const duration = Math.max(800 * Math.sqrt(size / 350) + 0.5, 260);
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
