import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'labels/stacked/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class StackedPage {
    constructor() {

    }
}