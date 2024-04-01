import type {
  ComponentInterface,
  EventEmitter,
} from '@stencil/core';
import {
  Component,
  Element,
  Event,
  Host,
  Listen,
  Prop,
  h,
} from '@stencil/core';
import type { AnchorInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { inheritAttributes } from '@utils/helpers';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type {
  TabBarChangedEventDetail,
  TabButtonClickEventDetail,
  TabButtonLayout,
} from '../tab-bar/tab-bar-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML anchor element that wraps all child elements.
 */
@Component({
  tag: 'ion-tab-button',
  styleUrls: {
    ios: 'tab-button.ios.scss',
    md: 'tab-button.md.scss',
  },
  shadow: true,
})
export class TabButton
  implements
    ComponentInterface,
    AnchorInterface
{
  private inheritedAttributes: Attributes =
    {};

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the tab button.
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
   * Set the layout of the text and icon in the tab bar.
   * It defaults to `"icon-top"`.
   */
  @Prop({ mutable: true })
  layout?: TabButtonLayout;

  /**
   * The selected tab component
   */
  @Prop({ mutable: true }) selected =
    false;

  /**
   * A tab id must be provided for each `ion-tab`. It's used internally to reference
   * the selected tab or by the router to switch between them.
   */
  @Prop() tab?: string;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * Emitted when the tab bar is clicked
   * @internal
   */
  @Event()
  ionTabButtonClick!: EventEmitter<TabButtonClickEventDetail>;

  @Listen('ionTabBarChanged', {
    target: 'window',
  })
  onTabBarChanged(
    ev: CustomEvent<TabBarChangedEventDetail>
  ) {
    const dispatchedFrom =
      ev.target as HTMLElement;
    const parent = this.el
      .parentElement as EventTarget;

    if (
      ev
        .composedPath()
        .includes(parent) ||
      dispatchedFrom?.contains(this.el)
    ) {
      this.selected =
        this.tab === ev.detail.tab;
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAttributes(this.el, [
        'aria-label',
      ]),
    };

    if (this.layout === undefined) {
      this.layout = config.get(
        'tabButtonLayout',
        'icon-top'
      );
    }
  }

  private selectTab(
    ev: Event | KeyboardEvent
  ) {
    if (this.tab !== undefined) {
      if (!this.disabled) {
        this.ionTabButtonClick.emit({
          tab: this.tab,
          href: this.href,
          selected: this.selected,
        });
      }
      ev.preventDefault();
    }
  }

  private get hasLabel() {
    return !!this.el.querySelector(
      'ion-label'
    );
  }

  private get hasIcon() {
    return !!this.el.querySelector(
      'ion-icon'
    );
  }

  private onKeyUp = (
    ev: KeyboardEvent
  ) => {
    if (
      ev.key === 'Enter' ||
      ev.key === ' '
    ) {
      this.selectTab(ev);
    }
  };

  private onClick = (ev: Event) => {
    this.selectTab(ev);
  };

  render() {
    const {
      disabled,
      hasIcon,
      hasLabel,
      href,
      rel,
      target,
      layout,
      selected,
      tab,
      inheritedAttributes,
    } = this;
    const mode = getIonMode(this);
    const attrs = {
      download: this.download,
      href,
      rel,
      target,
    };

    return (
      <Host
        onClick={this.onClick}
        onKeyup={this.onKeyUp}
        id={
          tab !== undefined
            ? `tab-button-${tab}`
            : null
        }
        class={{
          [mode]: true,
          'tab-selected': selected,
          'tab-disabled': disabled,
          'tab-has-label': hasLabel,
          'tab-has-icon': hasIcon,
          'tab-has-label-only':
            hasLabel && !hasIcon,
          'tab-has-icon-only':
            hasIcon && !hasLabel,
          [`tab-layout-${layout}`]:
            true,
          'ion-activatable': true,
          'ion-selectable': true,
          'ion-focusable': true,
        }}
      >
        <a
          {...attrs}
          class="button-native"
          part="native"
          role="tab"
          aria-selected={
            selected ? 'true' : null
          }
          aria-disabled={
            disabled ? 'true' : null
          }
          tabindex={
            disabled ? '-1' : undefined
          }
          {...inheritedAttributes}
        >
          <span class="button-inner">
            <slot></slot>
          </span>
          {mode === 'md' && (
            <ion-ripple-effect type="unbounded"></ion-ripple-effect>
          )}
        </a>
      </Host>
    );
  }
}
