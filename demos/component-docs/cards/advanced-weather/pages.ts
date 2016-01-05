import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/advanced-weather/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedWeatherPage {
    constructor() {

    }
}
