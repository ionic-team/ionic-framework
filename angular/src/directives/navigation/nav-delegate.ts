import { ElementRef, Injector, Directive, EnvironmentInjector } from '@angular/core';

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
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    angularDelegate: AngularDelegate
  ) {
    this.el = ref.nativeElement;
    ref.nativeElement.delegate = angularDelegate.create(environmentInjector, injector);
    proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
  }
}
