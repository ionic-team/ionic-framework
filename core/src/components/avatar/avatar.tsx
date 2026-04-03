import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import type { BadgeObserver } from '@utils/helpers';
import { createBadgeObserver } from '@utils/helpers';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    ionic: 'avatar.ionic.scss',
  },
  shadow: true,
})
export class Avatar implements ComponentInterface {
  @Element() el!: HTMLElement;
  private badgeObserver?: BadgeObserver;

  /**
   * Set to `"xxsmall"` for the smallest size.
   * Set to `"xsmall"` for a very small size.
   * Set to `"small"` for a compact size.
   * Set to `"medium"` for the default height and width.
   * Set to `"large"` for a larger size.
   * Set to `"xlarge"` for the largest dimensions.
   *
   * Defaults to `"medium"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * Set to `"soft"` for an avatar with slightly rounded corners,
   * `"round"` for an avatar with fully rounded corners, or `"rectangular"`
   * for an avatar without rounded corners.
   *
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * If `true`, the user cannot interact with the avatar.
   */
  @Prop() disabled = false;

  componentDidLoad(): void {
    this.setupBadgeObserver();
  }

  disconnectedCallback() {
    this.destroyBadgeObserver();
  }

  get hasImage() {
    return !!this.el.querySelector('ion-img') || !!this.el.querySelector('img');
  }

  get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  private get hasBadge() {
    return !!this.el.querySelector('ion-badge');
  }

  private onSlotChanged = () => {
    /**
     * Badges can be added or removed dynamically to mimic use
     * cases like notifications. Based on the presence of a
     * badge, we need to set up or destroy the badge observer.
     *
     * If the badge observer is already set up and there is a badge, then we don't need to do anything.
     */
    if (this.hasBadge && this.badgeObserver) {
      return;
    }

    if (this.hasBadge) {
      this.setupBadgeObserver();
    } else {
      this.destroyBadgeObserver();
    }
  };

  private setupBadgeObserver() {
    this.destroyBadgeObserver();

    // Only set up the badge observer if there is a badge and it's anchored
    const badge = this.el.querySelector('ion-badge[vertical]') as HTMLElement | null;

    if (!badge) {
      return;
    }

    this.badgeObserver = createBadgeObserver({
      host: this.el,
      badge,
    });
  }

  private destroyBadgeObserver() {
    this.badgeObserver?.disconnect();
  }

  private getSize(): string | undefined {
    const { size } = this;

    if (size === undefined) {
      return 'medium';
    }

    return size;
  }

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-10755): Remove theme check when shapes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  render() {
    const { hasImage, hasIcon, disabled } = this;
    const theme = getIonTheme(this);
    const size = this.getSize();
    const shape = this.getShape();

    return (
      <Host
        class={{
          [theme]: true,
          [`avatar-${size}`]: size !== undefined,
          [`avatar-${shape}`]: shape !== undefined,
          [`avatar-image`]: hasImage,
          [`avatar-icon`]: hasIcon,
          [`avatar-disabled`]: disabled,
        }}
      >
        <slot onSlotchange={this.onSlotChanged}></slot>
      </Host>
    );
  }
}
