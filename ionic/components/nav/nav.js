import {Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {ViewController} from '../view/view-controller';


@Directive({
  selector: 'ion-nav',
  properties: [
    'initial'
  ],
  lifecycle: [onInit]
})
export class Nav extends ViewController {

  constructor(
    @Optional() viewCtrl: ViewController,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(viewCtrl, compiler, elementRef, loader, injector);
    this.panes.setAnchor(elementRef);
  }

  onInit() {
    this.push(this.initial);
  }

}
