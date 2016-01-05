import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'buttons/clear/clear.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ClearPage {
    constructor() {

    }
}