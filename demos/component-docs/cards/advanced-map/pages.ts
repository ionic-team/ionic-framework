import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/advanced-map/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedMapPage {
    constructor() {

    }
}
