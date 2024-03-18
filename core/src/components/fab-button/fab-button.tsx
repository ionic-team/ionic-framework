import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import { inheritAriaAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { createColorClasses, hostContext, openURL } from '@utils/theme';
import { close } from 'ionicons/icons';

import { getIonTheme } from '../../global/ionic-global';
import type { AnimationBuilder, Color } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 * @part close-icon - The close icon that is displayed when a fab list opens (uses ion-icon).
 */
@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss',
    ionic: 'fab-button.md.scss',
  },
  shadow: true,
})
export class FabButton implements ComponentInterface, AnchorInterface, ButtonInterface {
  private fab: HTMLIonFabElement | null = null;
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the fab button will be show a close icon.
   */
  @Prop() activated = false;

  /**
   * If `true`, the user cannot interact with the fab button.
   */
  @Prop() disabled = false;

  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  @Prop() download: string | undefined;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * When using a router, it specifies the transition animation when navigating to
   * another page using `href`.
   */
  @Prop() routerAnimation: AnimationBuilder | undefined;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * If `true`, the fab button will show when in a fab-list.
   */
  @Prop() show = false;

  /**
   * If `true`, the fab button will be translucent.
   * Only applies when the theme is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * The size of the button. Set this to `small` in order to have a mini fab button.
   */
  @Prop() size?: 'small';

  /**
   * The icon name to use for the close icon. This will appear when the fab button
   * is pressed. Only applies if it is the main button inside of a fab containing a
   * fab list.
   */
  @Prop() closeIcon = close;

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  connectedCallback() {
    this.fab = this.el.closest('ion-fab');
  }

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private onClick = () => {
    const { fab } = this;
    if (!fab) {
      return;
    }

    fab.toggle();
  };

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  render() {
    const { el, disabled, color, href, activated, show, translucent, size, inheritedAttributes } = this;
    const inList = hostContext('ion-fab-list', el);
    const theme = getIonTheme(this);
    const TagType = href === undefined ? 'button' : ('a' as any);
    const attrs =
      TagType === 'button'
        ? { type: this.type }
        : {
            download: this.download,
            href,
            rel: this.rel,
            target: this.target,
          };

    return (
      <Host
        onClick={this.onClick}
        aria-disabled={disabled ? 'true' : null}
        class={createColorClasses(color, {
          [theme]: true,
          'fab-button-in-list': inList,
          'fab-button-translucent-in-list': inList && translucent,
          'fab-button-close-active': activated,
          'fab-button-show': show,
          'fab-button-disabled': disabled,
          'fab-button-translucent': translucent,
          'ion-activatable': true,
          'ion-focusable': true,
          [`fab-button-${size}`]: size !== undefined,
        })}
      >
        <TagType
          {...attrs}
          class="button-native"
          part="native"
          disabled={disabled}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onClick={(ev: Event) => openURL(href, ev, this.routerDirection, this.routerAnimation)}
          {...inheritedAttributes}
        >
          <ion-icon
            aria-hidden="true"
            icon={this.closeIcon}
            part="close-icon"
            class="close-icon"
            lazy={false}
          ></ion-icon>
          <span class="button-inner">
            <slot></slot>
          </span>
          {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
        </TagType>
      </Host>
    );
  }
}
