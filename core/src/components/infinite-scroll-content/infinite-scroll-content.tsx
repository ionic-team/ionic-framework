import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { SpinnerTypes } from '../../interface';
import { sanitizeDOMString } from '../../utils/sanitization';

@Component({
  tag: 'ion-infinite-scroll-content',
  styleUrls: {
    ios: 'infinite-scroll-content.ios.scss',
    md: 'infinite-scroll-content.md.scss'
  }
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
  @Prop() loadingText?: string;

  componentDidLoad() {
    if (this.loadingSpinner === undefined) {
      const mode = getIonMode(this);
      this.loadingSpinner = config.get(
        'infiniteLoadingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'crescent')
      );
    }
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [mode]: true,

        // Used internally for styling
        [`infinite-scroll-content-${mode}`]: true
      }
    };
  }

  render() {
    return (
      <div class="infinite-loading">
        {this.loadingSpinner && (
          <div class="infinite-loading-spinner">
            <ion-spinner name={this.loadingSpinner} />
          </div>
        )}
        {this.loadingText && (
          <div class="infinite-loading-text" innerHTML={sanitizeDOMString(this.loadingText)} />
        )}
      </div>
    );
  }
}
