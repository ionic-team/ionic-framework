import { Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
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
  @Prop({ context: 'dom' }) dom: DomController;

  /**
   * Emitted when the scrolling first starts.
   */
  @Prop() ionScrollStart: Function;

  /**
   * Emitted on every scroll event.
   */
  @Prop() ionScroll: Function;

  /**
   * Emitted when scrolling ends.
   */
  @Prop() ionScrollEnd: Function;

  /**
   * If true, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Prop() fullscreen = false;

  @Listen('body:ionNavChanged')
  onNavChanged() {
    this.resize();
  }

  componentDidLoad() {
    this.scrollEl = this.el.querySelector('ion-scroll');
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
   * Duration of the scroll animation in milliseconds. Defaults to `300`.
   * Returns a promise which is resolved when the scroll has completed.
   */
  @Method()
  scrollToTop(duration = 300) {
    return this.scrollEl.scrollToTop(duration);
  }

  /**
   * Scroll to the bottom of the content component.
   *
   * Duration of the scroll animation in milliseconds. Defaults to `300`.
   * Returns a promise which is resolved when the scroll has completed.
   */
  @Method()
  scrollToBottom(duration = 300) {
    return this.scrollEl.scrollToBottom(duration);
  }

  resize() {
    if (!this.scrollEl) {
      return;
    }
    if (this.fullscreen) {
      this.dom.raf(() => {
        this.dom.read(this.readDimensions.bind(this));
        this.dom.write(this.writeDimensions.bind(this));
      });
    } else {
      this.cTop = this.cBottom = null;
      this.dom.write(() => this.scrollEl.removeAttribute('style'));
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
