import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { createThemedClasses, getElementClassMap, openURL } from '../../utils/theme';
import { CssClassMap } from '../../index';


@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss'
  }
})
export class Item {
  private itemStyles: { [key: string]: CssClassMap } = {};

  @Element() private el: HTMLElement;

  @State() hasStyleChange: boolean;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
   * is `ios` and an `href`, `onclick` or `tappable` property is present.
   */
  @Prop() detail: boolean;

  /**
   * If true, the user cannot interact with the item. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * Whether or not this item should be tappable.
   * If true, a button tag will be rendered. Defaults to `false`.
   */
  @Prop() tappable = false;

  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    let hasChildStyleChange = false;

    const tagName: string = (ev.target as HTMLElement).tagName;
    const updatedStyles: any = ev.detail;

    for (const key in updatedStyles) {
      if (('item-' + key) !== key) {
        Object.defineProperty(updatedStyles, 'item-' + key, Object.getOwnPropertyDescriptor(updatedStyles, key));
        delete updatedStyles[key];
        hasChildStyleChange = true;
      }
    }

    this.itemStyles[tagName] = updatedStyles;

    if (hasChildStyleChange) {
      this.hasStyleChange = true;
    }
  }

  componentDidLoad() {
    // Change the button size to small for each ion-button in the item
    // unless the size is explicitly set
    const buttons = this.el.querySelectorAll('ion-button');
    for (let i = 0; i < buttons.length; i++) {
      if (!buttons[i].size) {
        buttons[i].size = 'small';
      }
    }
  }

  render() {
    let childStyles = {};

    for (const key in this.itemStyles) {
      childStyles = Object.assign(childStyles, this.itemStyles[key]);
    }

    const clickable = !!(this.href || this.el.onclick || this.tappable);

    const TagType = clickable
      ? this.href ? 'a' : 'button'
      : 'div';

    const attrs = (TagType === 'button')
      ? {type: 'button'}
      : {href: this.href};

    const showDetail = this.detail != null ? this.detail : (this.mode === 'ios' && clickable);

    const themedClasses = {
      ...childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      ...getElementClassMap(this.el.classList),
      'item-disabled': this.disabled,
      'item-detail-push': showDetail,
    };

    this.hasStyleChange = false;

    return (
      <TagType
        {...attrs}
        class={themedClasses}
        onClick={(ev) => openURL(this.href, ev)}>
        <slot name='start'></slot>
        <div class='item-inner'>
          <div class='input-wrapper'>
            <slot></slot>
          </div>
          <slot name='end'></slot>
        </div>
        { clickable && this.mode === 'md' && <ion-ripple-effect/> }
      </TagType>
    );
  }

}
