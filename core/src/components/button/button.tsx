import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, State } from '@stencil/core';

import { Color, Mode, RouterDirection } from '../../interface';
import { hasShadowDom } from '../../utils/helpers';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
  },
  shadow: true,
})
export class Button implements ComponentInterface {

  private inToolbar = false;

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
   */
  @Prop() mode!: Mode;

  /**
   * The type of button.
   */
  @Prop({ mutable: true }) buttonType = 'button';

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflectToAttr: true }) disabled = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop({ reflectToAttr: true }) expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop({ reflectToAttr: true, mutable: true }) fill?: 'clear' | 'outline' | 'solid' | 'default';

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * The button shape.
   */
  @Prop({ reflectToAttr: true }) shape?: 'round';

  /**
   * The button size.
   */
  @Prop({ reflectToAttr: true }) size?: 'small' | 'default' | 'large';

  /**
   * If `true`, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

  /**
   * The type of the button.
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
    this.inToolbar = !!this.el.closest('ion-buttons');
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onKeyUp = () => {
    this.keyFocus = true;
  }

  private onBlur = () => {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  private onClick = (ev: Event) => {
    if (this.type === 'button') {
      return openURL(this.win, this.href, ev, this.routerDirection);

    } else if (hasShadowDom(this.el)) {
      // this button wants to specifically submit a form
      // climb up the dom to see if we're in a <form>
      // and if so, then use JS to submit it
      const form = this.el.closest('form');
      if (form) {
        ev.preventDefault();

        const fakeButton = document.createElement('button');
        fakeButton.type = this.type;
        fakeButton.style.display = 'none';
        form.appendChild(fakeButton);
        fakeButton.click();
        fakeButton.remove();
      }
    }
    return Promise.resolve(false);
  }

  hostData() {
    const { buttonType, keyFocus, disabled, color, expand, shape, size, strong } = this;
    let fill = this.fill;
    if (fill === undefined) {
      fill = this.inToolbar ? 'clear' : 'solid';
    }
    return {
      'aria-disabled': this.disabled ? 'true' : null,
      class: {
        ...createColorClasses(color),
        [buttonType]: true,
        [`${buttonType}-${expand}`]: expand !== undefined,
        [`${buttonType}-${size}`]: size !== undefined,
        [`${buttonType}-${shape}`]: shape !== undefined,
        [`${buttonType}-${fill}`]: true,
        [`${buttonType}-strong`]: strong,

        'focused': keyFocus,
        'button-disabled': disabled,
        'ion-activatable': true,
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a';
    const attrs = (TagType === 'button')
      ? { type: this.type }
      : { href: this.href };

    return (
      <TagType
        {...attrs}
        class="button-native"
        disabled={this.disabled}
        onFocus={this.onFocus}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
        onClick={this.onClick}
      >
        <span class="button-inner">
          <slot name="icon-only"></slot>
          <slot name="start"></slot>
          <slot></slot>
          <slot name="end"></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect type={this.inToolbar ? 'unbounded' : 'bounded'}></ion-ripple-effect>}
      </TagType>
    );
  }
}
