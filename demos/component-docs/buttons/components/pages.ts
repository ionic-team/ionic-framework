import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'buttons/components/components.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ComponentsPage {
    constructor() {

    }
}