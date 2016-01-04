import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
    templateUrl: 'lists/multiline/template.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class MultilinePage {
    constructor() {

    }
}
