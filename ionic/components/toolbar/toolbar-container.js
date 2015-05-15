import {ElementRef} from 'angular2/angular2'
import {Directive} from 'angular2/src/core/annotations_impl/annotations';

import {IonicComponent} from 'ionic/config/component'


@Directive({
  selector: '.toolbar-container'
})
export class ToolbarContainer {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
    this.config = ToolbarContainer.config.invoke(this);
  }
}


new IonicComponent(ToolbarContainer, {})
