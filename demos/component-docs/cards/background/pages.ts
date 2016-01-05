import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/background/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BackgroundPage {
    constructor() {

    }
}