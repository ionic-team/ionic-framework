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
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
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
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * Callback function.
   * If this property is set, a button tag will be rendered.
   */
  @Prop() onclick: (this: HTMLElement, ev: MouseEvent) => any;

  /**
   * Whether or not this item should be tappable.
   * If true, a button tag will be rendered. Default `true`.
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

    const themedClasses = {
      ...childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      'item-block': true
    };

    this.hasStyleChange = false;

    const clickable = this.href || this.onclick || this.tappable;

    let TagType = 'div';
    if (clickable) {
      TagType = this.href ? 'a' : 'button';
    }

    return (
      <TagType class={themedClasses}>
        <slot name='start'></slot>
        <div class='item-inner'>
          <div class='input-wrapper'>
            <slot></slot>
          </div>
          <slot name='end'></slot>
        </div>
        { clickable && this.mode === 'md' && <ion-ripple-effect useTapClick={true} /> }
      </TagType>
    );
  }

}
