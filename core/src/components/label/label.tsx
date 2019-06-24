import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, StyleEventDetail } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
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
   * The position determines where and how the label behaves inside an item.
   */
  @Prop() position?: 'fixed' | 'stacked' | 'floating';

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @State() noAnimate = false;

  componentWillLoad() {
    this.noAnimate = (this.position === 'floating');
    this.emitStyle();
  }

  componentDidLoad() {
    if (this.noAnimate) {
      setTimeout(() => {
        this.noAnimate = false;
      }, 1000);
    }
  }

  @Watch('position')
  positionChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    const position = this.position;
    this.ionStyle.emit({
      'label': true,
      [`label-${position}`]: position !== undefined
    });
  }

  hostData() {
    const position = this.position;
    const mode = getIonMode(this);
    return {
      class: {
        ...createColorClasses(this.color),
        [mode]: true,
        [`label-${position}`]: position !== undefined,
        [`label-no-animate`]: (this.noAnimate)
      }
    };
  }
}
