import {Component, Input} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {Config} from '../../config/config';
import {InfiniteScroll} from './infinite-scroll';
import {Spinner} from '../spinner/spinner';


/**
 * @private
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
  directives: [NgIf, Spinner],
  host: {
    '[attr.state]': 'inf.state'
  }
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

  constructor(private inf: InfiniteScroll, private _config: Config) {}

  /**
   * @private
   */
  ngOnInit() {
    if (!this.loadingSpinner) {
      this.loadingSpinner = this._config.get('infiniteLoadingSpinner', this._config.get('spinner', 'ios'));
    }
  }
}
