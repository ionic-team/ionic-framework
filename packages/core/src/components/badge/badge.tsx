import { Component, Prop } from '@stencil/core';

/**
  * @name Badge
  * @module ionic
  * @description
  * Badges are simple components in Ionic containing numbers or text. You can display a
  * badge to indicate that there is new information associated with the item it is on.
  *
  * @usage
  *
  * ```html
  * <ion-content>
  *   <ion-list>
  *     <ion-item>
  *       <ion-badge slot="start">
  *         34
  *       </ion-badge>
  *       My Item
  *       <ion-badge slot="end">
  *         2
  *       </ion-badge>
  *     </ion-item>
  *   </ion-list>
  * </ion-content>
  * ```
  *
  * @see {@link /docs/components/#badges Badges Component Docs}
  */
@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.ios.scss',
    md: 'badge.md.scss',
    wp: 'badge.wp.scss'
  },
  host: {
    theme: 'badge'
  }
})
export class Badge {

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md' | 'wp';

  protected render() {
    return <slot></slot>;
  }
}
