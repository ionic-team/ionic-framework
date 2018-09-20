import { Component, ComponentInterface, Element, Method, Prop, QueueApi } from '@stencil/core';

import { rIC } from '../../utils/helpers';

@Component({
  tag: 'ion-ripple-effect',
  styleUrl: 'ripple-effect.scss',
  shadow: true
})
export class RippleEffect implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * Adds the ripple effect to the parent element
   */
  @Method()
  addRipple(pageX: number, pageY: number) {
    if (!location.search.includes('ionic:animate=false')) {
      rIC(() => this.prepareRipple(pageX, pageY));
    }
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
