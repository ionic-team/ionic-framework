import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Method, State, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - The content placed inside of the gallery item. This is typically an
 * `img`, but can be any element (e.g. a `figure` wrapping an image and caption).
 */
@Component({
  tag: 'ion-gallery-item',
  styleUrl: 'gallery-item.scss',
  shadow: true,
})
export class GalleryItem implements ComponentInterface {
  private hasWarnedInvalidParent = false;

  @Element() el!: HTMLIonGalleryItemElement;

  /**
   * The layout of the parent `ion-gallery`, mirrored as a class so the item
   * can apply layout-specific styles (e.g. a square aspect ratio in the
   * `uniform` layout, a bottom margin in the `masonry` layout).
   */
  @State() galleryLayout?: 'uniform' | 'masonry';

  componentWillLoad() {
    this.syncGalleryLayout();
  }

  componentDidLoad() {
    this.warnInvalidParent();
  }

  connectedCallback() {
    this.syncGalleryLayout();
  }

  /**
   * Resolve the layout from the parent `ion-gallery`. Called internally on
   * load and connect, and by the gallery when its layout changes.
   * @internal
   */
  @Method()
  async syncGalleryLayout() {
    this.galleryLayout = this.el.closest('ion-gallery')?.layout;
  }

  private onSlotChange = () => {
    this.warnInvalidParent();
  };

  /**
   * Warn when the item is not a descendant of an `ion-gallery`.
   */
  private warnInvalidParent() {
    if (this.hasWarnedInvalidParent || this.el.closest('ion-gallery') !== null) {
      return;
    }

    printIonWarning(
      '[ion-gallery-item] - This component should be used as a child of an "ion-gallery" component.',
      this.el
    );
    this.hasWarnedInvalidParent = true;
  }

  render() {
    const { galleryLayout } = this;
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
          'in-gallery-layout-uniform': galleryLayout === 'uniform',
          'in-gallery-layout-masonry': galleryLayout === 'masonry',
        }}
      >
        <slot onSlotchange={this.onSlotChange} />
      </Host>
    );
  }
}
