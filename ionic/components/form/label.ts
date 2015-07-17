import {Directive, Parent, Optional} from 'angular2/angular2';

import {Input} from './text-input';
import {IonicConfig} from '../../config/config';


@Directive({
  selector: 'label',
  host: {
    '[attr.id]': 'id',
    '[class.input-label]': 'inputLabel'
  }
})
export class Label {
  constructor(@Optional() @Parent() container: Input, config: IonicConfig) {
    if (container) {
      container.registerLabel(this);
      this.inputLabel = true;
    }
  }
}
