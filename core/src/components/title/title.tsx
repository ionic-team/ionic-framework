import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color, StyleEventDetail } from '../../interface';
import type { Hue } from '../../themes/themes.interfaces';

import type { IonTitleSize } from './title.interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-title',
  styleUrl: 'title.scss',
  shadow: true,
})
export class ToolbarTitle implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"bold"` for a title with vibrant, bold colors or to `"subtle"` for
   * a title with muted, subtle colors.
   *
   * Defaults to `"bold"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: Hue;

  /**
   * The size of the toolbar title.
   *
   * Defaults to `"medium"` if both the size property and theme config are unset.
   */
  @Prop() size?: IonTitleSize;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('size')
  protected sizeChanged() {
    this.emitStyle();
  }

  connectedCallback() {
    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      [`title-size-${this.sizeValue}`]: true,
    });
  }

  /**
   * Gets the title size. Uses the `size` property if set, otherwise
   * checks the theme config and falls back to 'medium' if neither is provided.
   */
  get sizeValue(): IonTitleSize {
    const sizeConfig = config.getObjectValue('IonTitle.size', 'medium') as IonTitleSize;

    return this.size || sizeConfig;
  }

  /**
   * Gets the title hue. Uses the `hue` property if set, otherwise
   * checks the theme config and falls back to 'bold' if neither is provided.
   */
  get hueValue(): Hue {
    const hueConfig = config.getObjectValue('IonTitle.hue', 'bold') as Hue;

    return this.hue || hueConfig;
  }

  render() {
    const { hueValue, sizeValue } = this;

    return (
      <Host
        class={createColorClasses(this.color, {
          [`title-size-${sizeValue}`]: true,
          [`title-hue-${hueValue}`]: true,
        })}
      >
        <div class="toolbar-title">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
