import { Component, h, Prop } from '../index';
import { CssClassObject } from '../../util/interfaces';

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
  *  <ion-button icon-start>
  *    <ion-icon name="star"></ion-icon>
  *    Left Icon
  *  </ion-button>
  *
  *  <ion-button icon-end>
  *    Right Icon
  *    <ion-icon name="star"></ion-icon>
  *  </ion-button>
  *
  *  <ion-button icon-only>
  *    <ion-icon name="star"></ion-icon>
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
  @Prop() itemButton: boolean = false;

  @Prop() href: string;

  /**
   * @Prop {string} The type of button.
   * Possible values are: `"button"`, `"bar-button"`.
   */
  @Prop() buttonType: string = 'button';

  /**
   * @Prop {boolean} If true, activates the large button size.
   * Type: size
   */
  @Prop() large: boolean = false;

  /**
   * @Prop {boolean} If true, activates the small button size.
   * Type: size
   */
  @Prop() small: boolean = false;

  /**
   * @Prop {boolean} If true, activates the default button size. Normally the default, useful for buttons in an item.
   * Type: size
   */
  @Prop() default: boolean = false;

  /**
   * @Prop {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * @Prop {boolean} If true, activates a transparent button style with a border.
   * Type: style
   */
  @Prop() outline: boolean = false;

  /**
   * @Prop {boolean} If true, activates a transparent button style without a border.
   * Type: style
   */
  @Prop() clear: boolean = false;

  /**
   * @Prop {boolean} If true, activates a solid button style. Normally the default, useful for buttons in a toolbar.
   * Type: style
   */
  @Prop() solid: boolean = false;

  /**
   * @Prop {boolean} If true, activates a button with rounded corners.
   * Type: shape
   */
  @Prop() round: boolean = false;

  /**
   * @Prop {boolean} If true, activates a button style that fills the available width.
   * Type: display
   */
  @Prop() block: boolean = false;

  /**
   * @Prop {boolean} If true, activates a button style that fills the available width without
   * a left and right border.
   * Type: display
   */
  @Prop() full: boolean = false;

  /**
   * @Prop {boolean} If true, activates a button with a heavier font weight.
   * Type: decorator
   */
  @Prop() strong: boolean = false;

  /**
   * @Prop {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md' | 'wp';

  /**
   * @Prop {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @hidden
   */
  getElementClassList(buttonType: string, mode: string): string[] {
    if (!buttonType) {
      return [];
    }
    return [
      buttonType,
      `${buttonType}-${mode}`
    ];
  }


  /**
   * @hidden
   */
  getClassList(buttonType: string, type: string, mode: string): string[] {
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
   * @hidden
   */
  getColorClassList(color: string, buttonType: string, style: string, mode: string): string[] {
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
        color ? `${className}-${mode}-${color}` : []
      );
  }

  /**
   * @hidden
   */
  getStyleClassList(buttonType: string): string[] {
    let classList = [].concat(
      this.outline ? this.getColorClassList(this.color, buttonType, 'outline', this.mode) : [],
      this.clear ? this.getColorClassList(this.color, buttonType, 'clear', this.mode) : [],
      this.solid ? this.getColorClassList(this.color, buttonType, 'solid', this.mode) : []
    );

    if (classList.length === 0) {
      classList = this.getColorClassList(this.color, buttonType, 'default', this.mode);
    }

    return classList;
  }

  /**
   * @hidden
   * Whether or not to add the item-button class
   */
  getItemClassList(size: string) {
    let classList = [].concat(
      this.itemButton && !size ? 'item-button' : []
    );

    return classList;
  }

  render() {
    const size =
      (this.large ? 'large' : null) ||
      (this.small ? 'small' : null) ||
      (this.default ? 'default' : null);

    const shape = (this.round ? 'round' : null);

    const display =
      (this.block ? 'block' : null) ||
      (this.full ? 'full' : null);

    const decorator = (this.strong ? 'strong' : null);

    const buttonClasses: CssClassObject = []
      .concat(
        this.getElementClassList(this.buttonType, this.mode),
        this.getClassList(this.buttonType, shape, this.mode),
        this.getClassList(this.buttonType, display, this.mode),
        this.getClassList(this.buttonType, size, this.mode),
        this.getClassList(this.buttonType, decorator, this.mode),
        this.getStyleClassList(this.buttonType),
        this.getItemClassList(size)
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    return (
      <TagType class={buttonClasses} disabled={this.disabled}>
        <span class='button-inner'>
          <slot name='start'></slot>
          <slot></slot>
          <slot name='end'></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
