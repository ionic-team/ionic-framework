import {Parent, Ancestor, Optional, ElementRef, Attribute, Directive} from 'angular2/angular2';

import {IonInput} from './form';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {Content} from '../content/content';
import {Checkbox} from '../checkbox/checkbox';


@Directive({
  selector: 'input[type=checkbox],input[type=radio]'
})
export class TapInput extends IonInput {
  constructor(
    @Optional() @Parent() container: Checkbox, //TODO have this be either Checkbox or Radio
    @Optional() @Ancestor() scrollView: Content,
    @Attribute('type') type: string,
    elementRef: ElementRef,
    app: IonicApp,
    config: IonicConfig
  ) {
    super(elementRef, app, config, scrollView);

    if (container) {
      container.registerInput(this);
      this.container = container;
    }

    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';
  }

}
