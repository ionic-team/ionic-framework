import { Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Color, Config, Mode, QueueController } from '../../interface';


@Component({
  tag: 'ion-content',
  styleUrl: 'content.scss'
})
export class Content {

  private cTop = -1;
  private cBottom = -1;
  private dirty = false;
  private scrollEl?: HTMLIonScrollElement;

  mode!: Mode;
  color?: Color;

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'queue' }) queue!: QueueController;

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
  @Prop() forceOverscroll?: boolean;

  @Prop() scrollEnabled = true;

  @Prop() scrollEvents = false;

  @Listen('body:ionNavDidChange')
  onNavChanged() {
    this.resize();
  }

  componentDidLoad() {
    this.resize();
  }

  componentDidUnload() {
    this.scrollEl = undefined as any;
  }

  /**
   * Scroll to the top of the content component.
   *
   * Duration of the scroll animation in milliseconds. Defaults to `300`.
   * Returns a promise which is resolved when the scroll has completed.
   */
  @Method()
  scrollToTop(duration = 300) {
    if (!this.scrollEl) {
      throw new Error('content is not scrollable');
    }
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
    if (!this.scrollEl) {
      throw new Error('content is not scrollable');
    }
    return this.scrollEl.scrollToBottom(duration);
  }

  @Method()
  scrollByPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    if (!this.scrollEl) {
      throw new Error('content is not scrollable');
    }
    return this.scrollEl.scrollByPoint(x, y, duration, done);
  }

  @Method()
  scrollToPoint(x: number, y: number, duration: number, done?: Function): Promise<any> {
    if (!this.scrollEl) {
      throw new Error('content is not scrollable');
    }
    return this.scrollEl.scrollToPoint(x, y, duration, done);
  }

  private resize() {
    if (!this.scrollEl) {
      return;
    }
    if (this.fullscreen) {
      this.queue.read(() => {
        this.queue.read(this.readDimensions.bind(this));
        this.queue.write(this.writeDimensions.bind(this));
      });
    } else {
      this.cTop = this.cBottom = -1;
      this.queue.write(() => this.scrollEl && this.scrollEl.removeAttribute('style'));
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
    this.resize();

    return [
      (this.scrollEnabled)
      ? <ion-scroll
          ref={el => this.scrollEl = el as any}
          mode={this.mode}
          scrollEvents={this.scrollEvents}
          forceOverscroll={this.forceOverscroll}>
          <slot></slot>
        </ion-scroll>
      : <div class="scroll-inner"><slot></slot></div>,
      <slot name="fixed"></slot>
    ];
  }
}

function getParentElement(el: any) {
  if (el.parentElement ) {
    // normal element with a parent element
    return el.parentElement;
  }
  if (el.parentNode && el.parentNode.host) {
    // shadow dom's document fragment
    return el.parentNode.host;
  }
  return null;
}

function getPageElement(el: HTMLElement) {
  const tabs = el.closest('ion-tabs');
  if (tabs) {
    return tabs;
  }
  const page = el.closest('ion-app,ion-page,.ion-page,page-inner');
  if (page) {
    return page;
  }
  return getParentElement(el);
}
