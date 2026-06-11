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

  componentDidLoad() {
    this.warnInvalidParent();
  }

  connectedCallback() {
    // Reflect the layout of the gallery the item is currently in.
    // This is necessary because the item may be moved between galleries, and
    // we want to ensure it always reflects the layout of its current parent.
    this.galleryLayout = this.el.closest('ion-gallery')?.layout;
  }

  /**
   * Mirror the parent gallery's layout onto the item so it can keep its
   * layout-specific styles in sync. Called by `ion-gallery`.
   * @internal
   */
  @Method()
  async setGalleryLayout(layout: 'uniform' | 'masonry') {
    this.galleryLayout = layout;
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
