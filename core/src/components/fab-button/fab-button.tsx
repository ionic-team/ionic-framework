import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import { inheritAriaAttributes, hasShadowDom } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createColorClasses, hostContext, openURL } from '@utils/theme';
import { close } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, Color } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 * @part close-icon - The close icon that is displayed when a fab list opens (uses ion-icon).
 */
@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss',
  },
  shadow: true,
})
export class FabButton implements ComponentInterface, AnchorInterface, ButtonInterface {
  private fab: HTMLIonFabElement | null = null;
  private formButtonEl: HTMLButtonElement | null = null;
  private formEl: HTMLFormElement | null = null;
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
  @Watch('disabled')
  disabledChanged() {
    const { disabled } = this;
    if (this.formButtonEl) {
      this.formButtonEl.disabled = disabled;
    }
  }

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
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * The HTML form element or form element id. Used to submit a form when the button is not a child of the form.
   */
  @Prop() form?: string | HTMLFormElement;

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

  private onClick = (ev: Event) => {
    const { el, fab } = this;
    if (this.type !== 'button' && hasShadowDom(el)) {
      this.submitForm(ev);
    }
    if (fab) {
      fab.toggle();
    }
  };

  /**
   * Renders a hidden native button inside the associated form so that pressing
   * Enter on a form field or clicking this component triggers form submission.
   * The shadow DOM button does not participate in form submission natively,
   * which is why this workaround is necessary.
   */
  private renderHiddenButton() {
    const formEl = (this.formEl = this.findForm());
    if (formEl) {
      const { formButtonEl } = this;
      if (formButtonEl !== null && formEl.contains(formButtonEl)) {
        return;
      }
      const newFormButtonEl = (this.formButtonEl = document.createElement('button'));
      newFormButtonEl.type = this.type;
      newFormButtonEl.style.display = 'none';
      newFormButtonEl.disabled = this.disabled;
      formEl.appendChild(newFormButtonEl);
    }
  }

  private findForm(): HTMLFormElement | null {
    const { form } = this;
    if (form instanceof HTMLFormElement) {
      return form;
    }
    if (typeof form === 'string') {
      const el: HTMLElement | null = document.getElementById(form);
      if (el) {
        if (el instanceof HTMLFormElement) {
          return el;
        } else {
          printIonWarning(
            `[ion-fab-button] - Form with selector: "#${form}" could not be found. Verify that the id is attached to a <form> element.`,
            this.el
          );
          return null;
        }
      } else {
        printIonWarning(
          `[ion-fab-button] - Form with selector: "#${form}" could not be found. Verify that the id is correct and the form is rendered in the DOM.`,
          this.el
        );
        return null;
      }
    }
    if (form !== undefined) {
      printIonWarning(
        `[ion-fab-button] - The provided "form" element is invalid. Verify that the form is a HTMLFormElement and rendered in the DOM.`,
        this.el
      );
      return null;
    }
    return this.el.closest('form');
  }

  private submitForm(ev: Event) {
    if (this.formEl && this.formButtonEl) {
      ev.preventDefault();
      this.formButtonEl.click();
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  render() {
    const { el, disabled, color, href, activated, show, translucent, size, inheritedAttributes, type } = this;
    const inList = hostContext('ion-fab-list', el);
    const mode = getIonMode(this);
    const TagType = href === undefined ? 'button' : ('a' as any);
    const attrs =
      TagType === 'button'
        ? { type }
        : {
            download: this.download,
            href,
            rel: this.rel,
            target: this.target,
          };

    if (type !== 'button') {
      this.renderHiddenButton();
    }

    return (
      <Host
        onClick={this.onClick}
        aria-disabled={disabled ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
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
          {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
        </TagType>
      </Host>
    );
  }
}
