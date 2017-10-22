import { Component, Prop } from '@stencil/core';
import { Config } from '../../index';

/**
 * @hidden
 */
@Component({
  tag: 'ion-infinite-scroll-content'
})
export class InfiniteScrollContent {

  @Prop({ context: 'config' }) config: Config;

  /**
   * @input {string} An animated SVG spinner that shows while loading.
   */
  @Prop({mutable: true}) loadingSpinner: string;

  /**
   * @input {string} Optional text to display while loading.
   */
  @Prop() loadingText: string;


  protected ionViewDidLoad() {
    if (!this.loadingSpinner) {
      this.loadingSpinner = this.config.get('infiniteLoadingSpinner', this.config.get('spinner', 'lines'));
    }
  }

  protected render() {
    return (
      <div class='infinite-loading'>
        {this.loadingSpinner &&
          <div class='infinite-loading-spinner'>
            <ion-spinner name={this.loadingSpinner}></ion-spinner>
          </div>
        }
        {this.loadingText &&
          <div class='infinite-loading-text' innerHTML={this.loadingText}></div>
        }
      </div>
    );
  }
}
