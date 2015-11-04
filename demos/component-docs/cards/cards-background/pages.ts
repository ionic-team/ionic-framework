import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/cards-background/main.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BackgroundPage {
    constructor() {

    }
}