import { Component, Element, Listen, Prop } from '@stencil/core';
import { Color, CssClassMap, Mode, RouterDirection } from '../../interface';
import { createThemedClasses, getElementClassMap, openURL } from '../../utils/theme';


@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss'
  }
})
export class Item {

  private itemStyles: { [key: string]: CssClassMap } = {};

  @Element() el!: HTMLStencilElement;

  @Prop({ context: 'window' }) win!: Window;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  /**
   * If true, a button tag will be rendered and the item will be tappable. Defaults to `false`.
   */
  @Prop() button = false;

  /**
   * If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
   * is `ios` and an `href`, `onclick` or `button` property is present.
   */
  @Prop() detail?: boolean;

  /**
   * If true, the user cannot interact with the item. Defaults to `false`.
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
  @Prop() routerDirection?: RouterDirection;


  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    const tagName: string = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail as any;
    const updatedKeys = Object.keys(ev.detail);
    const newStyles = {} as any;
    const childStyles = this.itemStyles[tagName] || {};
    let hasStyleChange = false;
    for (const key of updatedKeys) {
      const itemKey = `item-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[itemKey]) {
        hasStyleChange = true;
      }
      newStyles[itemKey] = newValue;
    }

    if (hasStyleChange) {
      this.itemStyles[tagName] = newStyles;
      this.el.forceUpdate();
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
    const childStyles = {};
    for (const key in this.itemStyles) {
      Object.assign(childStyles, this.itemStyles[key]);
    }

    const clickable = !!(this.href || this.el.onclick || this.button);

    const TagType = clickable
      ? this.href ? 'a' : 'button'
      : 'div';

    const attrs = (TagType === 'button')
      ? { type: 'button' }
      : { href: this.href };

    const showDetail = this.detail != null ? this.detail : (this.mode === 'ios' && clickable);

    const themedClasses = {
      ...childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      ...getElementClassMap(this.el.classList),
      'item-disabled': this.disabled,
      'item-detail-push': showDetail,
      [`item-lines-${this.lines}`]: !!this.lines,
      [`item-${this.mode}-lines-${this.lines}`]: !!this.lines
    };

    return (
      <TagType
        {...attrs}
        class={themedClasses}
        onClick={(ev) => openURL(this.win, this.href, ev, this.routerDirection)}>
        <slot name="start"></slot>
        <div class="item-inner">
          <div class="input-wrapper">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
        { clickable && this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </TagType>
    );
  }

}
