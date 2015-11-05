import {App, IonicApp, Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../../helpers';

@Page({
    templateUrl: 'inputs/radio/template.html',
    directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class RadioPage {
    constructor() {
    }
}
