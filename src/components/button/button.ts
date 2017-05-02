import { Component, h, Ionic, Prop } from '../index';
type CssClassObject = { [className: string]: boolean };

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
  *  <button ion-button>Default</button>
  *
  *  <button ion-button color="secondary">Secondary</button>
  *
  *  <button ion-button color="danger">Danger</button>
  *
  *  <button ion-button color="light">Light</button>
  *
  *  <button ion-button color="dark">Dark</button>
  *
  *  <!-- Shapes -->
  *  <button ion-button full>Full Button</button>
  *
  *  <button ion-button block>Block Button</button>
  *
  *  <button ion-button round>Round Button</button>
  *
  *  <!-- Outline -->
  *  <button ion-button full outline>Outline + Full</button>
  *
  *  <button ion-button block outline>Outline + Block</button>
  *
  *  <button ion-button round outline>Outline + Round</button>
  *
  *  <!-- Icons -->
  *  <button ion-button icon-left>
  *    <ion-icon name="star"></ion-icon>
  *    Left Icon
  *  </button>
  *
  *  <button ion-button icon-right>
  *    Right Icon
  *    <ion-icon name="star"></ion-icon>
  *  </button>
  *
  *  <button ion-button icon-only>
  *    <ion-icon name="star"></ion-icon>
  *  </button>
  *
  *  <!-- Sizes -->
  *  <button ion-button large>Large</button>
  *
  *  <button ion-button>Default</button>
  *
  *  <button ion-button small>Small</button>
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
  getElementClassList(role: string, mode: string): string[] {
    if (!role) {
      return [];
    }
    return [
      role,
      `${role}-${mode}`
    ];
  }


  /**
   * @hidden
   */
  getClassList(role: string, type: string, mode: string): string[] {
    if (!type) {
      return [];
    }
    type = type.toLocaleLowerCase();
    return [
      `${role}-${type}`,
      `${role}-${type}-${mode}`
    ];
  }

  /**
   * @hidden
   */
  getColorClassList(color: string, role: string, style: string, mode: string): string | null {
    if (!color) {
      return null;
    }
    style = (role !== 'bar-button' && style === 'solid') ? 'default' : style;
    let className =
      role +
      ((style && style !== 'default') ?
        '-' + style.toLowerCase() :
        '');

    console.log(role, style, className, mode, color);

    return `${className}-${mode}-${color}`;
  }

  getStyleClassList(role: string): string[] {
    if (!this.color) {
      return [];
    }

    var classList = [].concat(
      this.outline ? this.getColorClassList(this.color, role, 'outline', this.mode) : [],
      this.clear ? this.getColorClassList(this.color, role, 'clear', this.mode) : [],
      this.solid ? this.getColorClassList(this.color, role, 'solid', this.mode) : []
    );

    if (classList.length === 0) {
      classList = [this.getColorClassList(this.color, role, 'default', this.mode)];
    }

    return classList;
  }

  render() {
    var role = 'button';

    var size =
      (this.large ? 'large' : null) ||
      (this.small ? 'small' : null) ||
      (this.default ? 'default' : null);

    var shape = (this.round ? 'round' : null);

    var display =
      (this.block ? 'block' : null) ||
      (this.full ? 'full' : null);

    var decorator = (this.strong ? 'strong' : null);

    var buttonClasses: CssClassObject = []
      .concat(
        this.getElementClassList(role, this.mode),
        this.getClassList(role, shape, this.mode),
        this.getClassList(role, display, this.mode),
        this.getClassList(role, size, this.mode),
        this.getClassList(role, decorator, this.mode),
        this.getStyleClassList(role)
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    return h(this,
      h('button', {
        class: buttonClasses,
        props: {
          disabled: this.disabled
        }
      },
        [
          h('span', {
              class: {
                'button-inner': true
              }
            },
            h('slot')
          ),
          h('div', {
              class: {
                'button-effect': true
              }
            }
          )
        ]
      )
    );
  }
}
