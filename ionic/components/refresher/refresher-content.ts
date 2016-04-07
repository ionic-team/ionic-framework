import {Component, Input} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {Refresher} from './refresher';
import {Spinner} from '../spinner/spinner';


/**
 * @private
 */
@Component({
  selector: 'ion-refresher-content',
  template:
    '<div class="refresher-pulling">' +
      '<div class="refresher-pulling-icon" *ngIf="pullingIcon">' +
        '<ion-icon [name]="pullingIcon"></ion-icon>' +
      '</div>' +
      '<div class="refresher-pulling-text" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
    '</div>' +
    '<div class="refresher-refreshing">' +
      '<div class="refresher-refreshing-icon">' +
        '<ion-spinner [name]="refreshingSpinner"></ion-spinner>' +
      '</div>' +
      '<div class="refresher-refreshing-text" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
    '</div>',
  directives: [NgIf, Icon, Spinner],
  host: {
    '[attr.state]': 'r.state'
  }
})
export class RefresherContent {

  /**
   * @input {string} a static icon to display when you begin to pull down
   */
  @Input() pullingIcon: string;

  /**
   * @input {string} the text you want to display when you begin to pull down
   */
  @Input() pullingText: string;

  /**
   * @input {string} An animated SVG spinner that shows when refreshing begins
   */
  @Input() refreshingSpinner: string;

  /**
   * @input {string} the text you want to display when performing a refresh
   */
  @Input() refreshingText: string;


  constructor(private r: Refresher, private _config: Config) {}

  /**
   * @private
   */
  ngOnInit() {
    if (!this.pullingIcon) {
      this.pullingIcon = this._config.get('refresherPullingIcon', 'arrow-down');
    }
    if (!this.refreshingSpinner) {
      this.refreshingSpinner = this._config.get('refresherRefreshingSpinner', this._config.get('spinner', 'ios'));
    }
  }
}
