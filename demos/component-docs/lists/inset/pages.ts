import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
    templateUrl: 'lists/inset/template.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class InsetPage {
    constructor() {

    }
}