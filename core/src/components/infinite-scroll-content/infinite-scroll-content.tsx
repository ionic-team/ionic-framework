import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Config, Mode, SpinnerTypes } from '../../interface';

@Component({
  tag: 'ion-infinite-scroll-content',
  styleUrls: {
    ios: 'infinite-scroll-content.ios.scss',
    md: 'infinite-scroll-content.md.scss'
  }
})
export class InfiniteScrollContent implements ComponentInterface {

  mode!: Mode;

  @Prop({ context: 'config' }) config!: Config;

  /**
   * An animated SVG spinner that shows while loading.
   */
  @Prop({ mutable: true }) loadingSpinner?: SpinnerTypes | null;

  /**
   * Optional text to display while loading.
   */
  @Prop() loadingText?: string;

  componentDidLoad() {
    if (this.loadingSpinner === undefined) {
      this.loadingSpinner = this.config.get(
        'infiniteLoadingSpinner',
        this.config.get('spinner', this.mode === 'ios' ? 'lines' : 'crescent')
      );
    }
  }

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,

        // Used internally for styling
        [`infinite-scroll-content-${this.mode}`]: true
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
          <div class="infinite-loading-text" innerHTML={this.loadingText} />
        )}
      </div>
    );
  }
}
