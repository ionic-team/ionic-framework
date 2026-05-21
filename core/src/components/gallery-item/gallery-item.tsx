import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, State, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Wrap elements that should be grouped in an `ion-gallery`.
 */
@Component({
  tag: 'ion-gallery-item',
  styleUrl: 'gallery-item.scss',
  shadow: true,
})
export class GalleryItem implements ComponentInterface {
  private hasWarnedInvalidParent = false;
  private galleryEl?: HTMLIonGalleryElement;
  private galleryClassObserver?: MutationObserver;

  @Element() el!: HTMLIonGalleryItemElement;

  /**
   * The layout of the parent `ion-gallery` component.
   */
  @State() galleryLayout?: 'uniform' | 'masonry';

  componentWillLoad() {
    this.galleryEl = this.el.closest('ion-gallery') ?? undefined;
    this.syncLayoutClasses();
  }

  componentDidLoad() {
    this.watchGalleryLayoutClasses();
    this.warnInvalidParent();
  }

  disconnectedCallback() {
    this.galleryClassObserver?.disconnect();
    this.galleryClassObserver = undefined;
    this.galleryEl = undefined;
  }

  private onSlotChange = () => {
    this.warnInvalidParent();
  };

  private warnInvalidParent() {
    if (this.hasWarnedInvalidParent || this.galleryEl !== undefined) {
      return;
    }

    printIonWarning(
      '[ion-gallery-item] - This component should be used as a child of an "ion-gallery" component.',
      this.el
    );
    this.hasWarnedInvalidParent = true;
  }

  private watchGalleryLayoutClasses() {
    const galleryEl = this.galleryEl;
    if (galleryEl === undefined) {
      return;
    }

    this.galleryClassObserver?.disconnect();
    this.galleryClassObserver = new MutationObserver(() => this.syncLayoutClasses());
    this.galleryClassObserver.observe(galleryEl, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  private syncLayoutClasses() {
    const layout = this.galleryEl?.layout;
    this.galleryLayout = layout === 'masonry' || layout === 'uniform' ? layout : undefined;
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
