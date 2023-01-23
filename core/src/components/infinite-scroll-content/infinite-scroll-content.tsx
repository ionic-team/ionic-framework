import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonStylesheet, getIonPlatform } from '../../global/ionic-global';
import type { SpinnerTypes } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';
import { sanitizeDOMString } from '../../utils/sanitization';

@Component({
  tag: 'ion-infinite-scroll-content',
  styleUrls: {
    ios: 'infinite-scroll-content.ios.scss',
    md: 'infinite-scroll-content.md.scss',
  },
})
export class InfiniteScrollContent implements ComponentInterface {
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
   */
  @Prop() loadingText?: string | IonicSafeString;

  componentDidLoad() {
    if (this.loadingSpinner === undefined) {
      const platform = getIonPlatform(this);
      this.loadingSpinner = config.get(
        'infiniteLoadingSpinner',
        config.get('spinner', platform === 'ios' ? 'lines' : 'crescent')
      );
    }
  }

  render() {
    const mode = getIonStylesheet(this);
    return (
      <Host
        class={{
          [mode]: true,

          // Used internally for styling
          [`infinite-scroll-content-${mode}`]: true,
        }}
      >
        <div class="infinite-loading">
          {this.loadingSpinner && (
            <div class="infinite-loading-spinner">
              <ion-spinner name={this.loadingSpinner} />
            </div>
          )}
          {this.loadingText !== undefined && (
            <div class="infinite-loading-text" innerHTML={sanitizeDOMString(this.loadingText)} />
          )}
        </div>
      </Host>
    );
  }
}
