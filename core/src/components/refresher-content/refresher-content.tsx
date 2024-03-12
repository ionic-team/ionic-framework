import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { ENABLE_HTML_CONTENT_DEFAULT } from '@utils/config';
import { sanitizeDOMString } from '@utils/sanitization';
import { arrowDown, caretBackSharp } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { IonicSafeString } from '../../utils/sanitization';
import { supportsRubberBandScrolling } from '../refresher/refresher.utils';
import type { SpinnerTypes } from '../spinner/spinner-configs';
import { SPINNERS } from '../spinner/spinner-configs';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-refresher-content',
})
export class RefresherContent implements ComponentInterface {
  private customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);

  @Element() el!: HTMLIonRefresherContentElement;

  /**
   * A static icon or a spinner to display when you begin to pull down.
   * A spinner name can be provided to gradually show tick marks
   * when pulling down on iOS devices.
   */
  @Prop({ mutable: true }) pullingIcon?: SpinnerTypes | string | null;

  /**
   * The text you want to display when you begin to pull down.
   * `pullingText` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   *
   * Content is parsed as plaintext by default.
   * `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config
   * before custom HTML can be used.
   */
  @Prop() pullingText?: string | IonicSafeString;

  /**
   * An animated SVG spinner that shows when refreshing begins
   */
  @Prop({ mutable: true }) refreshingSpinner?: SpinnerTypes | null;

  /**
   * The text you want to display when performing a refresh.
   * `refreshingText` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   *
   * Content is parsed as plaintext by default.
   * `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config
   * before custom HTML can be used.
   */
  @Prop() refreshingText?: string | IonicSafeString;

  componentWillLoad() {
    const theme = getIonTheme(this);

    if (this.pullingIcon === undefined) {
      /**
       * The native iOS refresher uses a spinner instead of
       * an icon, so we need to see if this device supports
       * the native iOS refresher.
       */
      const hasRubberBandScrolling = supportsRubberBandScrolling();
      const overflowRefresher = hasRubberBandScrolling ? 'lines' : arrowDown;
      this.pullingIcon = config.get(
        'refreshingIcon',
        theme === 'ios' && hasRubberBandScrolling ? config.get('spinner', overflowRefresher) : 'circular'
      );
    }
    if (this.refreshingSpinner === undefined) {
      this.refreshingSpinner = config.get(
        'refreshingSpinner',
        config.get('spinner', theme === 'ios' ? 'lines' : 'circular')
      );
    }
  }

  private renderPullingText() {
    const { customHTMLEnabled, pullingText } = this;
    if (customHTMLEnabled) {
      return <div class="refresher-pulling-text" innerHTML={sanitizeDOMString(pullingText)}></div>;
    }

    return <div class="refresher-pulling-text">{pullingText}</div>;
  }

  private renderRefreshingText() {
    const { customHTMLEnabled, refreshingText } = this;
    if (customHTMLEnabled) {
      return <div class="refresher-refreshing-text" innerHTML={sanitizeDOMString(refreshingText)}></div>;
    }

    return <div class="refresher-refreshing-text">{refreshingText}</div>;
  }

  render() {
    const pullingIcon = this.pullingIcon;
    const hasSpinner = pullingIcon != null && (SPINNERS[pullingIcon] as any) !== undefined;
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        <div class="refresher-pulling">
          {this.pullingIcon && hasSpinner && (
            <div class="refresher-pulling-icon">
              <div class="spinner-arrow-container">
                <ion-spinner name={this.pullingIcon as SpinnerTypes} paused></ion-spinner>
                {theme === 'md' && this.pullingIcon === 'circular' && (
                  <div class="arrow-container">
                    <ion-icon icon={caretBackSharp} aria-hidden="true"></ion-icon>
                  </div>
                )}
              </div>
            </div>
          )}
          {this.pullingIcon && !hasSpinner && (
            <div class="refresher-pulling-icon">
              <ion-icon icon={this.pullingIcon} lazy={false} aria-hidden="true"></ion-icon>
            </div>
          )}
          {this.pullingText !== undefined && this.renderPullingText()}
        </div>
        <div class="refresher-refreshing">
          {this.refreshingSpinner && (
            <div class="refresher-refreshing-icon">
              <ion-spinner name={this.refreshingSpinner}></ion-spinner>
            </div>
          )}
          {this.refreshingText !== undefined && this.renderRefreshingText()}
        </div>
      </Host>
    );
  }
}
