import { ComponentFactoryResolver, Directive, ElementRef, Injector, ViewContainerRef } from '@angular/core';

import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../proxies-utils';

@ProxyCmp({
  inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'],
  methods: ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']
})
@Directive({
  selector: 'ion-nav'
})
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
    proxyOutputs(this, this.el, ['ionNavDidChange' , 'ionNavWillChange' ]);
  }
}
