import { ComponentFactoryResolver, ElementRef, Injector, ViewContainerRef, Directive } from '@angular/core';

import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../angular-component-lib/utils';

@ProxyCmp({
  inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'],
  methods: [
    'push',
    'insert',
    'insertPages',
    'pop',
    'popTo',
    'popToRoot',
    'removeIndex',
    'setRoot',
    'setPages',
    'getActive',
    'getByIndex',
    'canGoBack',
    'getPrevious',
  ],
})
@Directive({
  selector: 'ion-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate {
  protected el: HTMLElement;
  constructor(
    ref: ElementRef,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
    location: ViewContainerRef
  ) {
    this.el = ref.nativeElement;
    ref.nativeElement.delegate = angularDelegate.create(resolver, injector, location);
    proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
  }
}
