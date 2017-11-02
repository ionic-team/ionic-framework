import { Component, CssClassMap, Element, Prop } from '@stencil/core';

import { getElementClassObject } from '../../utils/theme';

/**
  * @name Button
  * @module ionic
  * @description
  * Buttons are simple components in Ionic. They can consist of text and icons
  * and be enhanced by a wide range of attributes.
  *
  * @usage
  *
  * ```html
  *
  *  <!-- Colors -->
  *  <ion-button>Default</ion-button>
  *
  *  <ion-button color="secondary">Secondary</ion-button>
  *
  *  <ion-button color="danger">Danger</ion-button>
  *
  *  <ion-button color="light">Light</ion-button>
  *
  *  <ion-button color="dark">Dark</ion-button>
  *
  *  <!-- Shapes -->
  *  <ion-button full>Full Button</ion-button>
  *
  *  <ion-button block>Block Button</ion-button>
  *
  *  <ion-button round>Round Button</ion-button>
  *
  *  <!-- Outline -->
  *  <ion-button full outline>Outline + Full</ion-button>
  *
  *  <ion-button block outline>Outline + Block</ion-button>
  *
  *  <ion-button round outline>Outline + Round</ion-button>
  *
  *  <!-- Icons -->
  *  <ion-button>
  *    <ion-icon slot="start" name="star"></ion-icon>
  *    Left Icon
  *  </ion-button>
  *
  *  <ion-button>
  *    Right Icon
  *    <ion-icon slot="end" name="star"></ion-icon>
  *  </ion-button>
  *
  *  <ion-button>
  *    <ion-icon slot="icon-only" name="star"></ion-icon>
  *  </ion-button>
  *
  *  <!-- Sizes -->
  *  <ion-button large>Large</ion-button>
  *
  *  <ion-button>Default</ion-button>
  *
  *  <ion-button small>Small</ion-button>
  * ```
  *
  */
@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss',
    wp: 'button.wp.scss'
  }
})
export class Button {
  @Element() private el: HTMLElement;

  @Prop() itemButton: boolean = false;

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * @input {string} The type of button.
   * Possible values are: `"button"`, `"bar-button"`.
   */
  @Prop() buttonType: string = 'button';

  /**
   * @input {boolean} If true, activates the large button size.
   * Type: size
   */
  @Prop() large: boolean = false;

  /**
   * @input {boolean} If true, activates the small button size.
   * Type: size
   */
  @Prop() small: boolean = false;

  /**
   * @input {boolean} If true, activates the default button size. Normally the default, useful for buttons in an item.
   * Type: size
   */
  @Prop() default: boolean = false;

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * @input {boolean} If true, activates a transparent button style with a border.
   * Type: style
   */
  @Prop() outline: boolean = false;

  /**
   * @input {boolean} If true, activates a transparent button style without a border.
   * Type: style
   */
  @Prop() clear: boolean = false;

  /**
   * @input {boolean} If true, activates a solid button style. Normally the default, useful for buttons in a toolbar.
   * Type: style
   */
  @Prop() solid: boolean = false;

  /**
   * @input {boolean} If true, activates a button with rounded corners.
   * Type: shape
   */
  @Prop() round: boolean = false;

  /**
   * @input {boolean} If true, activates a button style that fills the available width.
   * Type: display
   */
  @Prop() block: boolean = false;

  /**
   * @input {boolean} If true, activates a button style that fills the available width without
   * a left and right border.
   * Type: display
   */
  @Prop() full: boolean = false;

  /**
   * @input {boolean} If true, activates a button with a heavier font weight.
   * Type: decorator
   */
  @Prop() strong: boolean = false;

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
    const buttonType = this.buttonType;
    const mode = this.mode;

    const size =
      (this.large ? 'large' : null) ||
      (this.small ? 'small' : null) ||
      (this.default ? 'default' : null);

    const shape = (this.round ? 'round' : null);

    const display =
      (this.block ? 'block' : null) ||
      (this.full ? 'full' : null);

    const decorator = (this.strong ? 'strong' : null);

    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        getButtonClassList(buttonType, mode),
        getClassList(buttonType, shape, mode),
        getClassList(buttonType, display, mode),
        getClassList(buttonType, size, mode),
        getClassList(buttonType, decorator, mode),
        getStyleClassList(mode, this.color, buttonType, this.outline, this.clear, this.solid),
        getItemClassList(this.itemButton, size)
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType class={buttonClasses} disabled={this.disabled}>
        <span class='button-inner'>
          <slot name='icon-only'></slot>
          <slot name='start'></slot>
          <slot></slot>
          <slot name='end'></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
function getButtonClassList(buttonType: string, mode: string): string[] {
  if (!buttonType) {
    return [];
  }
  return [
    buttonType,
    `${buttonType}-${mode}`
  ];
}


/**
 * Get the classes based on the type
 * e.g. block, full, round, large
 */
function getClassList(buttonType: string, type: string, mode: string): string[] {
  if (!type) {
    return [];
  }
  type = type.toLocaleLowerCase();
  return [
    `${buttonType}-${type}`,
    `${buttonType}-${type}-${mode}`
  ];
}

/**
 * Get the classes for the color
 */
function getColorClassList(color: string, buttonType: string, style: string, mode: string): string[] {
  style = (buttonType !== 'bar-button' && style === 'solid') ? 'default' : style;

  let className =
    buttonType +
    ((style && style !== 'default') ?
      '-' + style.toLowerCase() :
      '');

  // special case for a default bar button
  // if the bar button is default it should get the style
  // but if a color is passed the style shouldn't be added
  if (buttonType === 'bar-button' && style === 'default') {
    className = buttonType;
    if (!color) {
      className += '-' + style.toLowerCase();
    }
  }

  return [`${className}-${mode}`].concat(
      style !== 'default' ? `${className}` : [],
      color ? `${className}-${mode}-${color}` : []
    );
}

/**
 * Get the classes for the style
 * e.g. outline, clear, solid
 */
function getStyleClassList(mode: string, color: string, buttonType: string, outline: boolean, clear: boolean, solid: boolean): string[] {
  let classList = [].concat(
    outline ? getColorClassList(color, buttonType, 'outline', mode) : [],
    clear ? getColorClassList(color, buttonType, 'clear', mode) : [],
    solid ? getColorClassList(color, buttonType, 'solid', mode) : []
  );

  if (classList.length === 0) {
    classList = getColorClassList(color, buttonType, 'default', mode);
  }

  return classList;
}

/**
 * Get the item classes for the button
 */
function getItemClassList(itemButton: boolean, size: string) {
  return itemButton && !size ? ['item-button'] : [];
}
