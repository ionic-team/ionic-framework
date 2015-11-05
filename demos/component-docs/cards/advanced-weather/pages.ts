import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/advanced-weather/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedWeatherPage {
    constructor() {

    }
}
