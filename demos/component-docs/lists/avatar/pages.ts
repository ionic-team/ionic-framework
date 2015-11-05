import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
    templateUrl: 'lists/avatar/template.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class AvatarPage {
    constructor() {

    }
}
