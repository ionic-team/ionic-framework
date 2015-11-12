import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'inputs/segment/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class SegmentPage{
  constructor() {
    this.pet = "puppies";
  }

}
