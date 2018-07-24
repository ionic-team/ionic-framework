import { Component, Element, Event, EventEmitter, Prop, State } from '@stencil/core';
import { Color, CssClassMap, Mode, RouterDirection } from '../../interface';
import { getParentNode, openURL } from '../../utils/theme';


@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
  },
  shadow: true,
})
export class Button {
  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;

  @State() keyFocus = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
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
  @Prop({ reflectToAttr: true }) disabled = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop({reflectToAttr: true}) expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop({reflectToAttr: true, mutable: true}) fill?: 'clear' | 'outline' | 'solid' | 'default';

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
  @Prop({reflectToAttr: true}) shape?: 'round';

  /**
   * The button size.
   * Possible values are: `"small"`, `"default"`, `"large"`.
   */
  @Prop({reflectToAttr: true}) size?: 'small' | 'default' | 'large';

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
    if (this.fill === undefined) {
      this.fill = this.el.closest('ion-buttons') ? 'clear' : 'solid';
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

  onClick(ev: Event) {
    if (this.type === 'submit') {
      // this button wants to specifically submit a form
      // climb up the dom to see if we're in a <form>
      // and if so, then use JS to submit it

      let node = this.el;
      while ((node = getParentNode(node))) {
        if (node.nodeName.toLowerCase() === 'form') {
          // cool, this submit button is within a <form>, let's submit it

          // prevent the button's default and stop it's propagation
          ev.preventDefault();
          ev.stopPropagation();

          // submit the <form> via JS
          (node as HTMLFormElement).submit();
          break;
        }
      }

    } else {
      openURL(this.win, this.href, ev, this.routerDirection);
    }
  }

  hostData() {
    const { buttonType, color, expand, fill, mode, shape, size, strong } = this;

    return {
      class: {
        ...getButtonClassMap(buttonType, mode),
        ...getButtonTypeClassMap(buttonType, expand, mode),
        ...getButtonTypeClassMap(buttonType, size, mode),
        ...getButtonTypeClassMap(buttonType, shape, mode),
        ...getButtonTypeClassMap(buttonType, strong ? 'strong' : undefined, mode),
        ...getColorClassMap(buttonType, color, fill, mode),
        'focused': this.keyFocus,
      },
      'tappable': true,
    };
  }

  protected render() {

    const TagType = this.href ? 'a' : 'button';
    const attrs = (TagType === 'button')
      ? { type: this.type }
      : { href: this.href };

    return (
      <TagType
        {...attrs}
        class="button-native"
        disabled={this.disabled}
        onFocus={this.onFocus.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onClick={this.onClick.bind(this)}>
          <span class="button-inner">
            <slot name="icon-only"></slot>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </span>
         { this.mode === 'md' && <ion-ripple-effect tapClick={true} parent={this.el} /> }
      </TagType>
    );
  }
}


/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
function getButtonClassMap(buttonType: string | undefined, mode: Mode): CssClassMap {
  if (!buttonType) {
    return {};
  }
  return {
    [buttonType]: true,
    [`${buttonType}-${mode}`]: true
  };
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

function getColorClassMap(buttonType: string, color: string | undefined, fill: string | undefined, mode: Mode): CssClassMap {
  let className = buttonType;

  if (fill) {
    className += `-${fill.toLowerCase()}`;
  }

  const map: CssClassMap = {
    [className]: true,
    [`${className}-${mode}`]: true,
  };
  if (color) {
    map[`ion-color-${color}`] = true;
  }
  return map;
}
