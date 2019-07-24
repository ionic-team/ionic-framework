import { Component, ComponentInterface, Element, Method, Prop, readTask, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-ripple-effect',
  styleUrl: 'ripple-effect.scss',
  shadow: true
})
export class RippleEffect implements ComponentInterface {

  @Element() el!: HTMLElement;

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
   * Adds the ripple effect to the parent element.
   *
   * @param x The horizontal coordinate of where the ripple should start.
   * @param y The vertical coordinate of where the ripple should start.
   */
  @Method()
  async addRipple(x: number, y: number) {
    return new Promise<() => void>(resolve => {
      readTask(() => {
        const rect = this.el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const hypotenuse = Math.sqrt(width * width + height * height);
        const maxDim = Math.max(height, width);
        const maxRadius = this.unbounded ? maxDim : hypotenuse + PADDING;
        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
        const finalScale = maxRadius / initialSize;
        let posX = x - rect.left;
        let posY = y - rect.top;
        if (this.unbounded) {
          posX = width * 0.5;
          posY = height * 0.5;
        }
        const styleX = posX - initialSize * 0.5;
        const styleY = posY - initialSize * 0.5;
        const moveX = width * 0.5 - posX;
        const moveY = height * 0.5 - posY;

        writeTask(() => {
          const div = document.createElement('div');
          div.classList.add('ripple-effect');
          const style = div.style;
          style.top = styleY + 'px';
          style.left = styleX + 'px';
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
    const mode = getIonMode(this);
    return {
      role: 'presentation',
      class: {
        [mode]: true,
        'unbounded': this.unbounded
      }
    };
  }
}

const removeRipple = (ripple: HTMLElement) => {
  ripple.classList.add('fade-out');
  setTimeout(() => {
    ripple.remove();
  }, 200);
};

const PADDING = 10;
const INITIAL_ORIGIN_SCALE = 0.5;
