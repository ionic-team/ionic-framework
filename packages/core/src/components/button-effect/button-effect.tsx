import { Component, Element, Listen, State } from '@stencil/core';
import { now } from '../../utils/helpers';

interface Ripple {
  x: number;
  y: number;
  size: number;
  time?: number;
}

@Component({
  tag: 'ion-button-effect',
  styleUrl: 'button-effect.scss'
})
export class ButtonEffect {

  private lastClick = 0;
  @Element() el: HTMLElement;

  @State() state = 0;

  @Listen('mousedown')
  @Listen('touchstart')
  pointerDown(ev: MouseEvent) {
    const timeStamp = now(ev);
    if (this.lastClick < (timeStamp - DELAY)) {
      this.addRipple(ev.clientX, ev.clientY);
      this.lastClick = timeStamp;
    }
  }

  private addRipple(pageX: number, pageY: number) {
    const rect = this.el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const size = Math.sqrt(width * width + height * height) * 2;
    const x = pageX - rect.left - size / 2;
    const y = pageY - rect.top - size / 2;

    this.schedule({x, y, size});
  }

  private schedule({x, y, size}: Ripple) {
    const div = document.createElement('div');
    div.classList.add('button-effect');
    const style = div.style;
    const duration = Math.max(800 * Math.sqrt(size / TOUCH_DOWN_ACCEL) + 0.5, 260);
    style.top = y + 'px';
    style.left = x + 'px';
    style.width = size + 'px';
    style.height = size + 'px';
    style.animationDuration = duration + 'ms';

    this.el.appendChild(div);
    setTimeout(() => this.el.removeChild(div), duration + 50);
  }

}
const TOUCH_DOWN_ACCEL = 350;
const DELAY = 50;
