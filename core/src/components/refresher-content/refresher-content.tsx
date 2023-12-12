import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { ENABLE_HTML_CONTENT_DEFAULT } from '@utils/config';
import { isPlatform } from '@utils/platform';
import { sanitizeDOMString } from '@utils/sanitization';
import { arrowDown, caretBackSharp } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { IonicSafeString } from '../../utils/sanitization';
import type { SpinnerTypes } from '../spinner/spinner-configs';
import { SPINNERS } from '../spinner/spinner-configs';

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
    if (this.pullingIcon === undefined) {
      const mode = getIonMode(this);
      const overflowRefresher = (this.el.style as any).webkitOverflowScrolling !== undefined ? 'lines' : arrowDown;
      this.pullingIcon = config.get(
        'refreshingIcon',
        mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular'
      );
    }
    if (this.refreshingSpinner === undefined) {
      const mode = getIonMode(this);
      this.refreshingSpinner = config.get(
        'refreshingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'circular')
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
    const mode = getIonMode(this);

    return (
      <Host class={mode}>
        <div class="refresher-pulling">
          {this.pullingIcon && hasSpinner && (
            <div class="refresher-pulling-icon">
              <div class="spinner-arrow-container">
                <ion-spinner name={this.pullingIcon as SpinnerTypes} aria-label="pulling icon" paused></ion-spinner>
                {mode === 'md' && this.pullingIcon === 'circular' && (
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
              <ion-spinner name={this.refreshingSpinner} aria-label="refreshing icon"></ion-spinner>
            </div>
          )}
          {this.refreshingText !== undefined && this.renderRefreshingText()}
        </div>
      </Host>
    );
  }
}
