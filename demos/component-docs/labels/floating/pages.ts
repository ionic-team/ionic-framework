import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'labels/floating/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class FloatingPage {
    constructor() {

    }
}
