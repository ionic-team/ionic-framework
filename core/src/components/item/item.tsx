import { Component, ComponentInterface, Element, Listen, Prop, State } from '@stencil/core';

import { Color, CssClassMap, Mode, RouterDirection, StyleEventDetail } from '../../interface';
import { createColorClasses, hostContext, openURL } from '../../utils/theme';

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the item text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the item text in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss'
  },
  shadow: true
})
export class Item implements ComponentInterface {
  private itemStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLStencilElement;

  @State() multipleInputs = false;

  @Prop({ context: 'window' }) win!: Window;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * If `true`, a button tag will be rendered and the item will be tappable.
   */
  @Prop() button = false;

  /**
   * If `true`, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
   * is `ios` and an `href` or `button` property is present.
   */
  @Prop() detail?: boolean;

  /**
   * The icon to use when `detail` is set to `true`.
   */
  @Prop() detailIcon = 'ios-arrow-forward';

  /**
   * If `true`, the user cannot interact with the item.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * How the bottom border should be displayed on the item.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * The type of the button. Only used when an `onclick` or `button` property is present.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  @Listen('ionStyle')
  itemStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as any;
    const childStyles = this.itemStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach(key => {
      const itemKey = `item-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[itemKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[itemKey] = true;
      }
    });

    if (hasStyleChange) {
      this.itemStyles.set(tagName, newStyles);
      this.el.forceUpdate();
    }
  }

  componentDidLoad() {
    // Change the button size to small for each ion-button in the item
    // unless the size is explicitly set
    Array.from(this.el.querySelectorAll('ion-button')).forEach(button => {
      if (button.size === undefined) {
        button.size = 'small';
      }
    });

    // Check for multiple inputs to change the position to relative
    const inputs = this.el.querySelectorAll('ion-select, ion-datetime');
    this.multipleInputs = inputs.length > 1 ? true : false;
  }

  private isClickable(): boolean {
    return (this.href !== undefined || this.button);
  }

  hostData() {
    const childStyles = {};
    this.itemStyles.forEach(value => {
      Object.assign(childStyles, value);
    });

    return {
      'aria-disabled': this.disabled ? 'true' : null,
      class: {
        ...childStyles,
        ...createColorClasses(this.color),
        'item': true,
        [`${this.mode}`]: true,
        [`item-lines-${this.lines}`]: this.lines !== undefined,
        'item-disabled': this.disabled,
        'in-list': hostContext('ion-list', this.el),
        'item-multiple-inputs': this.multipleInputs,
        'ion-activatable': this.isClickable(),
        'ion-focusable': true,
      }
    };
  }

  render() {
    const { href, detail, mode, win, detailIcon, routerDirection, type } = this;

    const clickable = this.isClickable();
    const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div' as any;
    const attrs = TagType === 'button' ? { type } : { href };
    const showDetail = detail !== undefined ? detail : mode === 'ios' && clickable;

    return [
      <TagType
        {...attrs}
        class="item-native"
        disabled={this.disabled}
        onClick={(ev: Event) => openURL(win, href, ev, routerDirection)}
      >
        <slot name="start"></slot>
        <div class="item-inner">
          <div class="input-wrapper">
            <slot></slot>
          </div>
          <slot name="end"></slot>
          {showDetail && <ion-icon icon={detailIcon} lazy={false} class="item-detail-icon"></ion-icon>}
          <div class="item-inner-highlight"></div>
        </div>
        {clickable && mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>,
      <div class="item-highlight"></div>
    ];
  }
}
