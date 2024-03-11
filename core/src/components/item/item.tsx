import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { inheritAttributes, raf } from '@utils/helpers';
import { createColorClasses, hostContext, openURL } from '@utils/theme';
import { chevronForward } from 'ionicons/icons';

import { getIonTheme } from '../../global/ionic-global';
import type { AnimationBuilder, Color, CssClassMap, StyleEventDetail } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the item text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the item text in LTR, and to the left in RTL.
 *
 * @part native - The native HTML button, anchor or div element that wraps all child elements.
 * @part detail-icon - The chevron icon for the item. Only applies when `detail="true"`.
 */
@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss',
    ionic: 'item.md.scss',
  },
  shadow: true,
})
export class Item implements ComponentInterface, AnchorInterface, ButtonInterface {
  private labelColorStyles = {};
  private itemStyles = new Map<string, CssClassMap>();
  private inheritedAriaAttributes: Attributes = {};

  @Element() el!: HTMLIonItemElement;

  @State() multipleInputs = false;
  @State() focusable = true;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, a button tag will be rendered and the item will be tappable.
   */
  @Prop() button = false;

  /**
   * If `true`, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
   * is `ios` and an `href` or `button` property is present.
   */
  @Prop() detail?: boolean;

  /**
   * The icon to use when `detail` is set to `true`.
   */
  @Prop() detailIcon = chevronForward;

  /**
   * If `true`, the user cannot interact with the item.
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
   * How the bottom border should be displayed on the item.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * When using a router, it specifies the transition animation when navigating to
   * another page using `href`.
   */
  @Prop() routerAnimation: AnimationBuilder | undefined;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button. Only used when an `onclick` or `button` property is present.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  @Watch('button')
  buttonChanged() {
    // Update the focusable option when the button option is changed
    this.focusable = this.isFocusable();
  }

  @Listen('ionColor')
  labelColorChanged(ev: CustomEvent<string>) {
    const { color } = this;

    // There will be a conflict with item color if
    // we apply the label color to item, so we ignore
    // the label color if the user sets a color on item
    if (color === undefined) {
      this.labelColorStyles = ev.detail;
    }
  }

  @Listen('ionStyle')
  itemStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as CssClassMap;
    const childStyles = this.itemStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach((key) => {
      if (updatedStyles[key]) {
        const itemKey = `item-${key}`;
        if (!childStyles[itemKey]) {
          hasStyleChange = true;
        }
        newStyles[itemKey] = true;
      }
    });
    if (!hasStyleChange && Object.keys(newStyles).length !== Object.keys(childStyles).length) {
      hasStyleChange = true;
    }
    if (hasStyleChange) {
      this.itemStyles.set(tagName, newStyles);
      forceUpdate(this);
    }
  }

  connectedCallback() {
    this.hasStartEl();
  }

  componentWillLoad() {
    this.inheritedAriaAttributes = inheritAttributes(this.el, ['aria-label']);
  }

  componentDidLoad() {
    raf(() => {
      this.setMultipleInputs();
      this.focusable = this.isFocusable();
    });
  }

  // If the item contains multiple clickable elements and/or inputs, then the item
  // should not have a clickable input cover over the entire item to prevent
  // interfering with their individual click events
  private setMultipleInputs() {
    // The following elements have a clickable cover that is relative to the entire item
    const covers = this.el.querySelectorAll('ion-checkbox, ion-datetime, ion-select, ion-radio');

    // The following elements can accept focus alongside the previous elements
    // therefore if these elements are also a child of item, we don't want the
    // input cover on top of those interfering with their clicks
    const inputs = this.el.querySelectorAll(
      'ion-input, ion-range, ion-searchbar, ion-segment, ion-textarea, ion-toggle'
    );

    // The following elements should also stay clickable when an input with cover is present
    const clickables = this.el.querySelectorAll('ion-anchor, ion-button, a, button');

    // Check for multiple inputs to change the position of the input cover to relative
    // for all of the covered inputs above
    this.multipleInputs =
      covers.length + inputs.length > 1 ||
      covers.length + clickables.length > 1 ||
      (covers.length > 0 && this.isClickable());
  }

  // If the item contains an input including a checkbox, datetime, select, or radio
  // then the item will have a clickable input cover that covers the item
  // that should get the hover, focused and activated states UNLESS it has multiple
  // inputs, then those need to individually get each click
  private hasCover(): boolean {
    const inputs = this.el.querySelectorAll('ion-checkbox, ion-datetime, ion-select, ion-radio');
    return inputs.length === 1 && !this.multipleInputs;
  }

  // If the item has an href or button property it will render a native
  // anchor or button that is clickable
  private isClickable(): boolean {
    return this.href !== undefined || this.button;
  }

  private canActivate(): boolean {
    return this.isClickable() || this.hasCover();
  }

  private isFocusable(): boolean {
    const focusableChild = this.el.querySelector('.ion-focusable');
    return this.canActivate() || focusableChild !== null;
  }

  private hasStartEl() {
    const startEl = this.el.querySelector('[slot="start"]');
    if (startEl !== null) {
      this.el.classList.add('item-has-start-slot');
    }
  }

  private getFirstInteractive() {
    const controls = this.el.querySelectorAll<HTMLElement>(
      'ion-toggle:not([disabled]), ion-checkbox:not([disabled]), ion-radio:not([disabled]), ion-select:not([disabled]), ion-input:not([disabled]), ion-textarea:not([disabled])'
    );
    return controls[0];
  }

  render() {
    const {
      detail,
      detailIcon,
      download,
      labelColorStyles,
      lines,
      disabled,
      href,
      rel,
      target,
      routerAnimation,
      routerDirection,
      inheritedAriaAttributes,
      multipleInputs,
    } = this;
    const childStyles = {} as StyleEventDetail;
    const theme = getIonTheme(this);
    const clickable = this.isClickable();
    const canActivate = this.canActivate();
    const TagType = clickable ? (href === undefined ? 'button' : 'a') : ('div' as any);

    const attrs =
      TagType === 'button'
        ? { type: this.type }
        : {
            download,
            href,
            rel,
            target,
          };

    let clickFn = {};

    const firstInteractive = this.getFirstInteractive();

    // Only set onClick if the item is clickable to prevent screen
    // readers from reading all items as clickable
    if (clickable || (firstInteractive !== undefined && !multipleInputs)) {
      clickFn = {
        onClick: (ev: MouseEvent) => {
          if (clickable) {
            openURL(href, ev, routerDirection, routerAnimation);
          }
          if (firstInteractive !== undefined && !multipleInputs) {
            const path = ev.composedPath();
            const target = path[0] as HTMLElement;
            if (ev.isTrusted) {
              /**
               * Dispatches a click event to the first interactive element,
               * when it is the result of a user clicking on the item.
               *
               * We check if the click target is in the shadow root,
               * which means the user clicked on the .item-native or
               * .item-inner padding.
               */
              const clickedWithinShadowRoot = this.el.shadowRoot!.contains(target);
              if (clickedWithinShadowRoot) {
                /**
                 * For input/textarea clicking the padding should focus the
                 * text field (thus making it editable). For everything else,
                 * we want to click the control so it activates.
                 */
                if (firstInteractive.tagName === 'ION-INPUT' || firstInteractive.tagName === 'ION-TEXTAREA') {
                  (firstInteractive as HTMLIonInputElement | HTMLIonTextareaElement).setFocus();
                } else {
                  firstInteractive.click();
                }
              }
            }
          }
        },
      };
    }

    const showDetail = detail !== undefined ? detail : theme === 'ios' && clickable;
    this.itemStyles.forEach((value) => {
      Object.assign(childStyles, value);
    });
    const ariaDisabled = disabled || childStyles['item-interactive-disabled'] ? 'true' : null;
    const inList = hostContext('ion-list', this.el) && !hostContext('ion-radio-group', this.el);

    /**
     * Inputs and textareas do not need to show a cursor pointer.
     * However, other form controls such as checkboxes and radios do.
     */
    const firstInteractiveNeedsPointerCursor =
      firstInteractive !== undefined && !['ION-INPUT', 'ION-TEXTAREA'].includes(firstInteractive.tagName);

    return (
      <Host
        aria-disabled={ariaDisabled}
        class={{
          ...childStyles,
          ...labelColorStyles,
          ...createColorClasses(this.color, {
            item: true,
            [theme]: true,
            'item-lines-default': lines === undefined,
            [`item-lines-${lines}`]: lines !== undefined,
            'item-control-needs-pointer-cursor': firstInteractiveNeedsPointerCursor,
            'item-disabled': disabled,
            'in-list': inList,
            'item-multiple-inputs': this.multipleInputs,
            'ion-activatable': canActivate,
            'ion-focusable': this.focusable,
            'item-rtl': document.dir === 'rtl',
          }),
        }}
        role={inList ? 'listitem' : null}
      >
        <TagType
          {...attrs}
          {...inheritedAriaAttributes}
          class="item-native"
          part="native"
          disabled={disabled}
          {...clickFn}
        >
          <slot name="start"></slot>
          <div class="item-inner">
            <div class="input-wrapper">
              <slot></slot>
            </div>
            <slot name="end"></slot>
            {showDetail && (
              <ion-icon
                icon={detailIcon}
                lazy={false}
                class="item-detail-icon"
                part="detail-icon"
                aria-hidden="true"
                flip-rtl={detailIcon === chevronForward}
              ></ion-icon>
            )}
            <div class="item-inner-highlight"></div>
          </div>
          {canActivate && theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
          <div class="item-highlight"></div>
        </TagType>
      </Host>
    );
  }
}
