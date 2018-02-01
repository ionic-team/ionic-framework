import { Component, Prop } from '@stencil/core';
import { Config } from '../../index';


@Component({
  tag: 'ion-infinite-scroll-content'
})
export class InfiniteScrollContent {

  @Prop({ context: 'config' }) config: Config;

  /**
   * An animated SVG spinner that shows while loading.
   */
  @Prop({ mutable: true }) loadingSpinner: string;

  /**
   * Optional text to display while loading.
   */
  @Prop() loadingText: string;


  componentDidLoad() {
    if (!this.loadingSpinner) {
      this.loadingSpinner = this.config.get('infiniteLoadingSpinner', this.config.get('spinner', 'lines'));
    }
  }

  render() {
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
