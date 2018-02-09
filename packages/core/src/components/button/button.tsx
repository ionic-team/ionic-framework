import { Component, CssClassMap, Element, Event, EventEmitter, Prop, State } from '@stencil/core';
import { BlurEvent, FocusEvent } from '../../utils/input-interfaces';
import { getButtonClassMap, getElementClassMap } from '../../utils/theme';


@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
  }
})
export class Button {
  @Element() private el: HTMLElement;

  @State() keyFocus: boolean;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * The type of button.
   * Possible values are: `"button"`, `"bar-button"`.
   */
  @Prop() buttonType = 'button';

  /**
   * The button size.
   * Possible values are: `"small"`, `"default"`, `"large"`.
   */
  @Prop() size: 'small' | 'default' | 'large';

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop() fill: 'clear' | 'outline' | 'solid' | 'default' = 'default';

  /**
   * If true, activates a button with rounded corners.
   */
  @Prop() round = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop() expand: 'full' | 'block';

  /**
   * If true, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

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
   * Emitted when the button has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;

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

    const {
      buttonType,
      color,
      expand,
      fill,
      mode,
      round,
      size,
      strong
    } = this;

    const TagType = this.href ? 'a' : 'button';
    const buttonClasses = {
      ...getButtonClassMap(buttonType, mode),
      ...getButtonTypeClassMap(buttonType, expand, mode),
      ...getButtonTypeClassMap(buttonType, size, mode),
      ...getButtonTypeClassMap(buttonType, round ? 'round' : null, mode),
      ...getButtonTypeClassMap(buttonType, strong ? 'strong' : null, mode),
      ...getColorClassMap(buttonType, color, fill, mode),
      ...getElementClassMap(this.el.classList),
      'focused': this.keyFocus
    };

    return (
      <TagType
        class={buttonClasses}
        disabled={this.disabled}
        href={this.href}
        onFocus={this.onFocus.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}>
          <span class='button-inner'>
            <slot name='icon-only'></slot>
            <slot name='start'></slot>
            <span class='button-text'><slot></slot></span>
            <slot name='end'></slot>
          </span>
          { this.mode === 'md' && <ion-ripple-effect useTapClick={true} /> }
      </TagType>
    );
  }
}


/**
 * Get the classes based on the type
 * e.g. block, full, round, large
 */
function getButtonTypeClassMap(buttonType: string, type: string|null, mode: string): CssClassMap {
  if (!type) {
    return {};
  }
  type = type.toLocaleLowerCase();
  return {
    [`${buttonType}-${type}`]: true,
    [`${buttonType}-${type}-${mode}`]: true
  };
}

function getColorClassMap(buttonType: string, color: string, fill: string, mode: string): CssClassMap {
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
