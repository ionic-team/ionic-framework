import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { ENABLE_HTML_CONTENT_DEFAULT } from '@utils/config';
import { sanitizeDOMString } from '@utils/sanitization';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { IonicSafeString } from '../../utils/sanitization';
import type { SpinnerTypes } from '../spinner/spinner-configs';

@Component({
  tag: 'ion-infinite-scroll-content',
  styleUrls: {
    ios: 'infinite-scroll-content.ios.scss',
    md: 'infinite-scroll-content.md.scss',
    ionic: 'infinite-scroll-content.md.scss',
  },
})
export class InfiniteScrollContent implements ComponentInterface {
  private customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);

  /**
   * An animated SVG spinner that shows while loading.
   */
  @Prop({ mutable: true }) loadingSpinner?: SpinnerTypes | null;

  /**
   * Optional text to display while loading.
   * `loadingText` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   *
   * This property accepts custom HTML as a string.
   * Content is parsed as plaintext by default.
   * `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config
   * before custom HTML can be used.
   */
  @Prop() loadingText?: string | IonicSafeString;

  componentDidLoad() {
    if (this.loadingSpinner === undefined) {
      const theme = getIonTheme(this);
      this.loadingSpinner = config.get(
        'infiniteLoadingSpinner',
        config.get('spinner', theme === 'ios' ? 'lines' : 'crescent')
      );
    }
  }

  private renderLoadingText() {
    const { customHTMLEnabled, loadingText } = this;
    if (customHTMLEnabled) {
      return <div class="infinite-loading-text" innerHTML={sanitizeDOMString(loadingText)}></div>;
    }

    return <div class="infinite-loading-text">{this.loadingText}</div>;
  }

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,

          // Used internally for styling
          [`infinite-scroll-content-${theme}`]: true,
        }}
      >
        <div class="infinite-loading">
          {this.loadingSpinner && (
            <div class="infinite-loading-spinner">
              <ion-spinner name={this.loadingSpinner} />
            </div>
          )}
          {this.loadingText !== undefined && this.renderLoadingText()}
        </div>
      </Host>
    );
  }
}
