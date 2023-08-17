import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, hasShadowDom } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { createColorClasses, hostContext, openURL } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, Color } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot icon-only - Should be used on an icon in a button that has no text.
 * @slot start - Content is placed to the left of the button text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the button text in LTR, and to the left in RTL.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 */
@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss',
  },
  shadow: true,
})
export class Button implements ComponentInterface, AnchorInterface, ButtonInterface {
  private inItem = false;
  private inListHeader = false;
  private inToolbar = false;
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
   * The type of button.
   */
  @Prop({ mutable: true }) buttonType = 'button';

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;
  @Watch('disabled')
  disabledChanged() {
    const { disabled } = this;
    if (this.formButtonEl) {
      this.formButtonEl.disabled = disabled;
    }
  }

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * with square corners and no left or right borders.
   */
  @Prop({ reflect: true }) expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button that resembles a flat button, to `"outline"`
   * for a transparent button with a border, or to `"solid"` for a button with a filled background.
   * The default fill is `"solid"` except inside of a toolbar, where the default is `"clear"`.
   */
  @Prop({ reflect: true, mutable: true }) fill?: 'clear' | 'outline' | 'solid' | 'default';

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
   * Set to `"round"` for a button with more rounded corners.
   */
  @Prop({ reflect: true }) shape?: 'round';

  /**
   * Set to `"small"` for a button with less height and padding, to `"default"`
   * for a button with the default height and padding, or to `"large"` for a button
   * with more height and padding. By default the size is unset, unless the button
   * is inside of an item, where the size is `"small"` by default. Set the size to
   * `"default"` inside of an item to make it a standard size button.
   */
  @Prop({ reflect: true }) size?: 'small' | 'default' | 'large';

  /**
   * If `true`, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * The HTML form element or form element id. Used to submit a form when the button is not a child of the form.
   */
  @Prop() form?: string | HTMLFormElement;

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * This is responsible for rendering a hidden native
   * button element inside the associated form. This allows
   * the users to submit a form by pressing enter when a text
   * field inside of the form is focused. The native button
   * rendered inside of `ion-button` is in the Shadow DOM
   * and therefore does not participate in form submission
   * which is why the following code is necessary.
   */
  private renderHiddenButton() {
    const formEl = (this.formEl = this.findForm());
    if (formEl) {
      const { formButtonEl } = this;

      /**
       * If the form already has a rendered form button
       * then do not append a new one again.
       */
      if (formButtonEl !== null && formEl.contains(formButtonEl)) {
        return;
      }

      // Create a hidden native button inside of the form
      const newFormButtonEl = (this.formButtonEl = document.createElement('button'));
      newFormButtonEl.type = this.type;
      newFormButtonEl.style.display = 'none';
      // Only submit if the button is not disabled.
      newFormButtonEl.disabled = this.disabled;

      formEl.appendChild(newFormButtonEl);
    }
  }

  componentWillLoad() {
    this.inToolbar = !!this.el.closest('ion-buttons');
    this.inListHeader = !!this.el.closest('ion-list-header');
    this.inItem = !!this.el.closest('ion-item') || !!this.el.closest('ion-item-divider');
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  private get hasIconOnly() {
    return !!this.el.querySelector('[slot="icon-only"]');
  }

  private get rippleType() {
    const hasClearFill = this.fill === undefined || this.fill === 'clear';

    // If the button is in a toolbar, has a clear fill (which is the default)
    // and only has an icon we use the unbounded "circular" ripple effect
    if (hasClearFill && this.hasIconOnly && this.inToolbar) {
      return 'unbounded';
    }

    return 'bounded';
  }

  /**
   * Finds the form element based on the provided `form` selector
   * or element reference provided.
   */
  private findForm(): HTMLFormElement | null {
    const { form } = this;
    if (form instanceof HTMLFormElement) {
      return form;
    }
    if (typeof form === 'string') {
      // Check if the string provided is a form id.
      const el: HTMLElement | null = document.getElementById(form);
      if (el) {
        if (el instanceof HTMLFormElement) {
          return el;
        } else {
          /**
           * The developer specified a string for the form attribute, but the
           * element with that id is not a form element.
           */
          printIonWarning(
            `Form with selector: "#${form}" could not be found. Verify that the id is attached to a <form> element.`,
            this.el
          );
          return null;
        }
      } else {
        /**
         * The developer specified a string for the form attribute, but the
         * element with that id could not be found in the DOM.
         */
        printIonWarning(
          `Form with selector: "#${form}" could not be found. Verify that the id is correct and the form is rendered in the DOM.`,
          this.el
        );
        return null;
      }
    }
    if (form !== undefined) {
      /**
       * The developer specified a HTMLElement for the form attribute,
       * but the element is not a HTMLFormElement.
       * This will also catch if the developer tries to pass in null
       * as the form attribute.
       */
      printIonWarning(
        `The provided "form" element is invalid. Verify that the form is a HTMLFormElement and rendered in the DOM.`,
        this.el
      );
      return null;
    }
    /**
     * If the form element is not set, the button may be inside
     * of a form element. Query the closest form element to the button.
     */
    return this.el.closest('form');
  }

  private submitForm(ev: Event) {
    // this button wants to specifically submit a form
    // climb up the dom to see if we're in a <form>
    // and if so, then use JS to submit it
    if (this.formEl && this.formButtonEl) {
      ev.preventDefault();

      this.formButtonEl.click();
    }
  }

  private handleClick = (ev: Event) => {
    const { el } = this;
    if (this.type === 'button') {
      openURL(this.href, ev, this.routerDirection, this.routerAnimation);
    } else if (hasShadowDom(el)) {
      this.submitForm(ev);
    }
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  render() {
    const mode = getIonMode(this);
    const {
      buttonType,
      type,
      disabled,
      rel,
      target,
      size,
      href,
      color,
      expand,
      hasIconOnly,
      shape,
      strong,
      inheritedAttributes,
    } = this;
    const finalSize = size === undefined && this.inItem ? 'small' : size;
    const TagType = href === undefined ? 'button' : ('a' as any);
    const attrs =
      TagType === 'button'
        ? { type }
        : {
            download: this.download,
            href,
            rel,
            target,
          };
    let fill = this.fill;
    /**
     * We check both undefined and null to
     * work around https://github.com/ionic-team/stencil/issues/3586.
     */
    if (fill == null) {
      fill = this.inToolbar || this.inListHeader ? 'clear' : 'solid';
    }

    /**
     * We call renderHiddenButton in the render function to account
     * for any properties being set async. For example, changing the
     * "type" prop from "button" to "submit" after the component has
     * loaded would warrant the hidden button being added to the
     * associated form.
     */
    {
      type !== 'button' && this.renderHiddenButton();
    }

    return (
      <Host
        onClick={this.handleClick}
        aria-disabled={disabled ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
          [buttonType]: true,
          [`${buttonType}-${expand}`]: expand !== undefined,
          [`${buttonType}-${finalSize}`]: finalSize !== undefined,
          [`${buttonType}-${shape}`]: shape !== undefined,
          [`${buttonType}-${fill}`]: true,
          [`${buttonType}-strong`]: strong,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'in-buttons': hostContext('ion-buttons', this.el),
          'button-has-icon-only': hasIconOnly,
          'button-disabled': disabled,
          'ion-activatable': true,
          'ion-focusable': true,
        })}
      >
        <TagType
          {...attrs}
          class="button-native"
          part="native"
          disabled={disabled}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...inheritedAttributes}
        >
          <span class="button-inner">
            <slot name="icon-only"></slot>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </span>
          {mode === 'md' && <ion-ripple-effect type={this.rippleType}></ion-ripple-effect>}
        </TagType>
      </Host>
    );
  }
}
