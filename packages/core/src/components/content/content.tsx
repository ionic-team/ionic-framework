import { Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Config } from '../../index';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';
import { getPageElement } from '../../utils/helpers';

@Component({
  tag: 'ion-content',
  styleUrls: {
    ios: 'content.ios.scss',
    md: 'content.md.scss'
  }
})
export class Content {

  private cTop = 0;
  private cBottom = 0;
  private dirty = false;
  private scrollEl: HTMLIonScrollElement;

  mode: string;
  color: string;

  @Element() private el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;

  /**
   * @output {ScrollEvent} Emitted when the scrolling first starts.
   */
  @Prop() ionScrollStart: Function;

  /**
   * @output {ScrollEvent} Emitted on every scroll event.
   */
  @Prop() ionScroll: Function;

  /**
   * @output {ScrollEvent} Emitted when scrolling ends.
   */
  @Prop() ionScrollEnd: Function;

  /**
   * @input {boolean} If true, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Prop() fullscreen: boolean = false;

  @Listen('body:ionNavChanged')
  onNavChanged() {
    this.resize();
  }

  componentDidLoad() {
    this.scrollEl = this.el.querySelector('ion-scroll') as HTMLIonScrollElement;
    this.resize();
  }

  componentDidUnload() {
    this.scrollEl = null;
  }

  hostData() {
    return {
      class: {
        'statusbar-padding': this.config.getBoolean('statusbarPadding')
      }
    };
  }

  @Method()
  enableJsScroll() {
    this.scrollEl.jsScroll = true;
  }

  /**
   * Scroll to the top of the content component.
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  @Method()
  scrollToTop(duration: number = 300) {
    return this.scrollEl.scrollToTop(duration);
  }

  /**
   * Scroll to the bottom of the content component.
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  @Method()
  scrollToBottom(duration: number = 300) {
    return this.scrollEl.scrollToBottom(duration);
  }

  resize() {
    if (!this.scrollEl) {
      return;
    }
    if (this.fullscreen) {
      Context.dom.raf(() => {
        Context.dom.read(this.readDimensions.bind(this));
        Context.dom.write(this.writeDimensions.bind(this));
      });
    } else {
      this.cTop = this.cBottom = null;
      Context.dom.write(() => this.scrollEl.removeAttribute('style'));
    }
  }

  private readDimensions() {
    const page = getPageElement(this.el);
    const top = Math.max(this.el.offsetTop, 0);
    const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
    this.dirty = top !== this.cTop || bottom !== this.cBottom;
    this.cTop = top;
    this.cBottom = bottom;
  }

  private writeDimensions() {
    if (this.dirty && this.scrollEl) {
      const style = this.scrollEl.style;
      style.paddingTop = this.cTop + 'px';
      style.paddingBottom = this.cBottom + 'px';
      style.top = -this.cTop + 'px';
      style.bottom = -this.cBottom + 'px';
      this.dirty = false;
    }
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'content');
    const hostClasses = getElementClassObject(this.el.classList);

    const scrollClasses = {
      ...themedClasses,
      ...hostClasses,
    };

    this.resize();

    return [
      <ion-scroll class={scrollClasses}>
        <slot></slot>
      </ion-scroll>,
      <slot name='fixed'></slot>
    ];
  }
}
