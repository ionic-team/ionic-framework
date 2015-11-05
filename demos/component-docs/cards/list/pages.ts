import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/list/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ListPage {
    constructor() {

    }
}