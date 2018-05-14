import { Component, Element, Event, EventEmitter, Prop, State } from '@stencil/core';
import { Color, CssClassMap, Mode, RouterDirection } from '../../interface';
import { getButtonClassMap, getElementClassMap, openURL } from '../../utils/theme';


@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
  }
})
export class Button {
  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;

  @State() keyFocus = false;

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
   * The type of button.
   * Possible values are: `"button"`, `"bar-button"`.
   */
  @Prop({ mutable: true }) buttonType = 'button';

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop() expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop() fill: 'clear' | 'outline' | 'solid' | 'default' = 'default';

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection?: RouterDirection;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * The button shape.
   * Possible values are: `"round"`.
   */
  @Prop() shape?: 'round';

  /**
   * The button size.
   * Possible values are: `"small"`, `"default"`, `"large"`.
   */
  @Prop() size?: 'small' | 'default' | 'large';

  /**
   * If true, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

  /**
   * The type of the button.
   * Possible values are: `"submit"`, `"reset"` and `"button"`.
   * Default value is: `"button"`
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  componentWillLoad() {
    if (this.el.closest('ion-buttons')) {
      this.buttonType = 'bar-button';
    }
  }

  onFocus() {
    this.ionFocus.emit();
  }

  onKeyUp() {
    this.keyFocus = true;
  }

  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  protected render() {
    const { buttonType, color, expand, fill, mode, shape, size, strong } = this;

    const TagType = this.href ? 'a' : 'button';
    const buttonClasses = {
      ...getButtonClassMap(buttonType, mode),
      ...getButtonTypeClassMap(buttonType, expand, mode),
      ...getButtonTypeClassMap(buttonType, size, mode),
      ...getButtonTypeClassMap(buttonType, shape, mode),
      ...getButtonTypeClassMap(buttonType, strong ? 'strong' : undefined, mode),
      ...getColorClassMap(buttonType, color, fill, mode),
      ...getElementClassMap(this.el.classList),
      'focused': this.keyFocus
    };

    const attrs = (TagType === 'button')
      ? { type: this.type }
      : { href: this.href };

    return (
      <TagType
        {...attrs}
        class={buttonClasses}
        disabled={this.disabled}
        onFocus={this.onFocus.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onClick={(ev) => openURL(this.win, this.href, ev, this.routerDirection)}>
          <span class="button-inner">
            <slot name="icon-only"></slot>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </span>
          { this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </TagType>
    );
  }
}


/**
 * Get the classes based on the type
 * e.g. block, full, round, large
 */
function getButtonTypeClassMap(buttonType: string, type: string|undefined, mode: Mode): CssClassMap {
  if (!type) {
    return {};
  }
  type = type.toLocaleLowerCase();
  return {
    [`${buttonType}-${type}`]: true,
    [`${buttonType}-${type}-${mode}`]: true
  };
}

function getColorClassMap(buttonType: string, color: string | undefined, fill: string, mode: Mode): CssClassMap {
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
  const map: CssClassMap = {
    [className]: true,
    [`${className}-${mode}`]: true,
  };
  if (color) {
    map[`${className}-${mode}-${color}`] = true;
  }
  return map;
}
