import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { Color, Mode, StyleEvent } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss'
  },
  scoped: true
})
export class Label implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The position determines where and how the label behaves inside an item.
   * Possible values are: 'inline' | 'fixed' | 'stacked' | 'floating'
   */
  @Prop() position?: 'fixed' | 'stacked' | 'floating';

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  componentDidLoad() {
    this.positionChanged();
  }

  @Watch('position')
  positionChanged() {
    const position = this.position;
    this.ionStyle.emit({
      'label': true,
      [`label-${position}`]: !!position
    });
  }

  hostData() {
    const position = this.position;
    return {
      class: {
        ...createColorClasses(this.color),
        [`label-${position}`]: !!position,
      }
    };
  }
}
