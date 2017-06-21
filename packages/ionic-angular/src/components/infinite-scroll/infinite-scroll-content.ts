import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { InfiniteScroll } from './infinite-scroll';


/**
 * @hidden
 */
@Component({
  selector: 'ion-infinite-scroll-content',
  template:
    '<div class="infinite-loading">' +
      '<div class="infinite-loading-spinner" *ngIf="loadingSpinner">' +
        '<ion-spinner [name]="loadingSpinner"></ion-spinner>' +
      '</div>' +
      '<div class="infinite-loading-text" [innerHTML]="loadingText" *ngIf="loadingText"></div>' +
    '</div>',
  host: {
    '[attr.state]': 'inf.state'
  },
  encapsulation: ViewEncapsulation.None,
})
export class InfiniteScrollContent {

  /**
   * @input {string} An animated SVG spinner that shows while loading.
   */
  @Input() loadingSpinner: string;

  /**
   * @input {string} Optional text to display while loading.
   */
  @Input() loadingText: string;

  constructor(public inf: InfiniteScroll, private _config: Config) {}

  /**
   * @hidden
   */
  ngOnInit() {
    if (!this.loadingSpinner) {
      this.loadingSpinner = this._config.get('infiniteLoadingSpinner', this._config.get('spinner', 'ios'));
    }
  }
}
