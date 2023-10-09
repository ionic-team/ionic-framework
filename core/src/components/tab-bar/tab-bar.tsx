import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';
import { Keyboard, KeyboardResize } from '@utils/native/keyboard';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { TabBarChangedEventDetail } from './tab-bar-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-tab-bar',
  styleUrls: {
    ios: 'tab-bar.ios.scss',
    md: 'tab-bar.md.scss',
  },
  shadow: true,
})
export class TabBar implements ComponentInterface {
  private keyboardCtrl: KeyboardController | null = null;

  @Element() el!: HTMLElement;

  @State() keyboardVisible = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The selected tab component
   */
  @Prop() selectedTab?: string;
  @Watch('selectedTab')
  selectedTabChanged() {
    if (this.selectedTab !== undefined) {
      this.ionTabBarChanged.emit({
        tab: this.selectedTab,
      });
    }
  }

  /**
   * If `true`, the tab bar will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /** @internal */
  @Event() ionTabBarChanged!: EventEmitter<TabBarChangedEventDetail>;

  /**
   * @internal
   * This event is used in IonContent to correctly
   * calculate the fullscreen content offsets
   * when IonTabBar is used.
   */
  @Event() ionTabBarLoaded!: EventEmitter<void>;

  componentWillLoad() {
    this.selectedTabChanged();
  }

  async connectedCallback() {
    const resizeMode = await Keyboard.getResizeMode();

    /**
     * If the resize mode is set to None then we don't want to
     * hide the tab bar here since it will never sit on top
     * of the keyboard. Hiding the tab bar will cause a layout shift
     * in apps that have resize set to None.
     */
    if (resizeMode === undefined || resizeMode.mode !== KeyboardResize.None) {
      this.keyboardCtrl = await createKeyboardController(async (keyboardOpen, waitForResize) => {
        /**
         * If the keyboard is hiding, then we need to wait
         * for the webview to resize. Otherwise, the tab bar
         * will flicker before the webview resizes.
         */
        if (keyboardOpen === false && waitForResize !== undefined) {
          await waitForResize;
        }

        this.keyboardVisible = keyboardOpen; // trigger re-render by updating state
      });
    }
  }

  disconnectedCallback() {
    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
    }
  }

  componentDidLoad() {
    this.ionTabBarLoaded.emit();
  }

  render() {
    const { color, translucent, keyboardVisible } = this;
    const mode = getIonMode(this);
    const shouldHide = keyboardVisible && this.el.getAttribute('slot') !== 'top';

    return (
      <Host
        role="tablist"
        aria-hidden={shouldHide ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
          'tab-bar-translucent': translucent,
          'tab-bar-hidden': shouldHide,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
