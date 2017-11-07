import { Component, Element, Prop } from '@stencil/core';
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
  *  <ion-button color="secondary">Secondary</ion-button>
  *  <ion-button color="danger">Danger</ion-button>
  *  <ion-button color="light">Light</ion-button>
  *  <ion-button color="dark">Dark</ion-button>
  *
  *  <!-- Shapes -->
  *  <ion-button expand="full">Full Button</ion-button>
  *  <ion-button expand="block">Block Button</ion-button>
  *  <ion-button round>Round Button</ion-button>
  *
  *  <!-- Outline -->
  *  <ion-button expand="full" fill="outline">Outline + Full</ion-button>
  *  <ion-button expand="block" fill="outline">Outline + Block</ion-button>
  *  <ion-button round fill="outline">Outline + Round</ion-button>
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
  *  <ion-button size="large">Large</ion-button>
  *  <ion-button>Default</ion-button>
  *  <ion-button size="small">Small</ion-button>
  * ```
  *
  */
@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
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
   * @input {string} The button size.
   * Possible values are: `"small"`, `"large"`, `"default"`.
   */
  @Prop() size: 'small' | 'large';

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * @input {string} Set to `"clear"` for a transparent button style or to `"outline"` for a transparent
   * button style with a border. The default is `"solid"`.
   */
  @Prop() fill: 'clear' | 'outline' | 'solid' | 'default' = 'default';

  /**
   * @input {boolean} If true, activates a button with rounded corners.
   * Type: shape
   */
  @Prop() round: boolean = false;

  /**
   * @input {string} Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop() expand: 'full' | 'block';

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
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  protected render() {

    const {
      buttonType,
      itemButton,
      color,
      expand,
      fill,
      mode,
      round,
      size,
      strong
    } = this;

    const elementClasses: string[] = []
      .concat(
        getButtonClassList(buttonType, mode),
        getClassList(buttonType, expand, mode),
        getClassList(buttonType, size, mode),
        getClassList(buttonType, round ? 'round' : null, mode),
        getClassList(buttonType, strong ? 'strong' : null, mode),
        getColorClassList(buttonType, color, fill, mode),
        getItemClassList(itemButton, size)
      );

    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...getElementClassObject(this.el.classList),
      ...getElementClassObject(elementClasses)
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

function getColorClassList(buttonType: string, color: string, fill: string, mode: string): string[] {
  let className = buttonType;

  if (buttonType !== 'bar-button' && fill === 'solid') {
    fill = 'default';
  }

  if (fill && fill !== 'default') {
    className += `-${fill.toLowerCase()}`;
  }

  // special case for a default bar button
  // if the bar button is default it should get the fill
  // but if a color is passed the fill shouldn't be added
  if (buttonType === 'bar-button' && fill === 'default') {
    className = buttonType;
    if (!color) {
      className += '-' + fill.toLowerCase();
    }
  }

  return [`${className}-${mode}`].concat(
      fill !== 'default' ? `${className}` : [],
      color ? `${className}-${mode}-${color}` : []
    );
}

function getItemClassList(itemButton: boolean, size: string) {
  return itemButton && !size ? ['item-button'] : [];
}
