import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
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
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    let hasChildStyleChange = false;

    let tagName: string = (ev.target as HTMLElement).tagName;
    let updatedStyles: any = ev.detail;

    for (var key in updatedStyles) {
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
    // Add item-button classes to each ion-button in the item
    const buttons = this.el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].itemButton = true;
    }
  }

  render() {
    let childStyles = {};

    for (var key in this.itemStyles) {
      childStyles = Object.assign(childStyles, this.itemStyles[key]);
    }

    let themedClasses = {
      ...childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      'item-block': true
    };

    this.hasStyleChange = false;

    // TODO add support for button items
    const TagType = this.href ? 'a' : 'div';

    return (
      <TagType class={themedClasses}>
        <slot name='start'></slot>
        <div class='item-inner'>
          <div class='input-wrapper'>
            <slot></slot>
          </div>
          <slot name='end'></slot>
        </div>
        <div class='button-effect'></div>
      </TagType>
    );
  }

}
