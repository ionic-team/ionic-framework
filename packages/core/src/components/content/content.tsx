import { Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { getPageElement } from '../../utils/helpers';

@Component({
  tag: 'ion-content',
  styleUrl: 'content.scss'
})
export class Content {

  private cTop = 0;
  private cBottom = 0;
  private dirty = false;
  private scrollEl: HTMLIonScrollElement|null;

  mode: string;
  color: string;

  @Element() private el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  /**
   * If true, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Prop() fullscreen = false;

  /**
   * If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
   * If the content exceeds the bounds of ionContent, nothing will change.
   * Note, the does not disable the system bounce on iOS. That is an OS level setting.
   */
  @Prop() forceOverscroll: boolean;


  @Prop() scrollEvents = false;

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

  @Method()
  scrollByPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    return this.scrollEl.scrollByPoint(x, y, duration, done);
  }

  @Method()
  scrollToPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    return this.scrollEl.scrollToPoint(x, y, duration, done);
  }

  private resize() {
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
      this.dom.write(() => this.scrollEl && this.scrollEl.removeAttribute('style'));
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

  hostData() {
    return {
      class: {
        'statusbar-padding': this.config.getBoolean('statusbarPadding')
      }
    };
  }

  render() {
    this.resize();

    return [
      <ion-scroll
        mode={this.mode}
        scrollEvents={this.scrollEvents}
        forceOverscroll={this.forceOverscroll}>
        <slot></slot>
      </ion-scroll>,
      <slot name='fixed'></slot>
    ];
  }
}
