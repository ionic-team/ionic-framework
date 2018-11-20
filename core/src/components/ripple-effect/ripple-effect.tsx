import { Component, ComponentInterface, Element, Method, Prop, QueueApi } from '@stencil/core';

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
  async addRipple(pageX: number, pageY: number) {
    return new Promise<() => void>(resolve => {
      this.queue.read(() => {
        const rect = this.el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const hypotenuse = Math.sqrt(width * width + height * height);
        const maxRadius = hypotenuse + PADDING;
        const maxDim = Math.max(height, width);
        const posX = pageX - rect.left;
        const posY = pageY - rect.top;

        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
        const finalScale = maxRadius / initialSize;
        const x = posX - initialSize * 0.5;
        const y = posY - initialSize * 0.5;
        const moveX = width * 0.5 - posX;
        const moveY = height * 0.5 - posY;

        this.queue.write(() => {
          const div = this.win.document.createElement('div');
          div.classList.add('ripple-effect');
          const style = div.style;
          style.top = y + 'px';
          style.left = x + 'px';
          style.width = style.height = initialSize + 'px';
          style.setProperty('--final-scale', `${finalScale}`);
          style.setProperty('--translate-end', `${moveX}px, ${moveY}px`);

          const container = this.el.shadowRoot || this.el;
          container.appendChild(div);
          setTimeout(() => {
            resolve(() => {
              removeRipple(div);
            });
          }, 225 + 100);
        });
      });
    });
  }

  hostData() {
    return {
      role: 'presentation'
    };
  }
}

function removeRipple(ripple: HTMLElement) {
  ripple.classList.add('fade-out');
  setTimeout(() => {
    ripple.remove();
  }, 200);
}

const PADDING = 10;
const INITIAL_ORIGIN_SCALE = 0.5;
