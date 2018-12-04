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
   * Sets the type of ripple-effect:
   *
   * - `bounded`: the ripple effect expands from the user's click position
   * - `unbounded`: the ripple effect expands from the center of the button and overflows the container.
   *
   * NOTE: Surfaces for bounded ripples should have the overflow property set to hidden,
   * while surfaces for unbounded ripples should have it set to visible.
   */
  @Prop() type: 'bounded' | 'unbounded' = 'bounded';

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
        const maxDim = Math.max(height, width);
        const maxRadius = this.unbounded ? maxDim : hypotenuse + PADDING;
        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
        const finalScale = maxRadius / initialSize;
        let posX = pageX - rect.left;
        let posY = pageY - rect.top;
        if (this.unbounded) {
          posX = width * 0.5;
          posY = height * 0.5;
        }
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

  private get unbounded() {
    return this.type === 'unbounded';
  }

  hostData() {
    return {
      role: 'presentation',
      class: {
        'unbounded': this.unbounded
      }
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
