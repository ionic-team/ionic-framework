import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import type { Attributes } from '@utils/helpers';
import { inheritAttributes } from '@utils/helpers';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @part image - The inner `img` element.
 */
@Component({
  tag: 'ion-img',
  styleUrl: 'img.scss',
  shadow: true,
})
export class Img implements ComponentInterface {
  private io?: IntersectionObserver;
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLElement;

  @State() loadSrc?: string;

  @State() loadError?: () => void;

  /**
   * This attribute defines the alternative text describing the image.
   * Users will see this text displayed if the image URL is wrong,
   * the image is not in one of the supported formats, or if the image is not yet downloaded.
   */
  @Prop() alt?: string;

  /**
   * The image URL. This attribute is mandatory for the `<img>` element.
   */
  @Prop() src?: string;
  @Watch('src')
  srcChanged() {
    this.addIO();
  }

  /** Emitted when the img src has been set */
  @Event() ionImgWillLoad!: EventEmitter<void>;

  /** Emitted when the image has finished loading */
  @Event() ionImgDidLoad!: EventEmitter<void>;

  /** Emitted when the img fails to load */
  @Event() ionError!: EventEmitter<void>;

  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['draggable']);
  }

  componentDidLoad() {
    this.addIO();
  }

  private addIO() {
    if (this.src === undefined) {
      return;
    }
    if (
      typeof (window as any) !== 'undefined' &&
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'isIntersecting' in window.IntersectionObserverEntry.prototype
    ) {
      this.removeIO();
      this.io = new IntersectionObserver((data) => {
        /**
         * On slower devices, it is possible for an intersection observer entry to contain multiple
         * objects in the array. This happens when quickly scrolling an image into view and then out of
         * view. In this case, the last object represents the current state of the component.
         */
        if (data[data.length - 1].isIntersecting) {
          this.load();
          this.removeIO();
        }
      });

      this.io.observe(this.el);
    } else {
      // fall back to setTimeout for Safari and IE
      setTimeout(() => this.load(), 200);
    }
  }

  private load() {
    this.loadError = this.onError;
    this.loadSrc = this.src;
    this.ionImgWillLoad.emit();
  }

  private onLoad = () => {
    this.ionImgDidLoad.emit();
  };

  private onError = () => {
    this.ionError.emit();
  };

  private removeIO() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  render() {
    const { loadSrc, alt, onLoad, loadError, inheritedAttributes } = this;
    const { draggable } = inheritedAttributes;
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        <img
          decoding="async"
          src={loadSrc}
          alt={alt}
          onLoad={onLoad}
          onError={loadError}
          part="image"
          draggable={isDraggable(draggable)}
        />
      </Host>
    );
  }
}

/**
 * Enumerated strings must be set as booleans
 * as Stencil will not render 'false' in the DOM.
 * The need to explicitly render draggable="true"
 * as only certain elements are draggable by default.
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable.
 */
const isDraggable = (draggable?: string): boolean | undefined => {
  switch (draggable) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};
