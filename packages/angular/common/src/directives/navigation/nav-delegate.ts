import { ElementRef, Injector, Directive, EnvironmentInjector, NgZone } from '@angular/core';

import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../../utils/proxy';

export const NAV_DELEGATE_SELECTOR = 'ion-nav';
export const NAV_DELEGATE_TEMPLATE = '<ng-content></ng-content>';

const NAV_DELEGATE_INPUTS = ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'];

const NAV_DELEGATE_METHODS = [
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
];

@ProxyCmp({
  inputs: NAV_DELEGATE_INPUTS,
  methods: NAV_DELEGATE_METHODS,
})
@Directive({
  selector: NAV_DELEGATE_SELECTOR,
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: NAV_DELEGATE_INPUTS,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate {
  protected el: HTMLElement;
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    // TODO FW-4766: Remove AngularDelegate
    angularDelegate: AngularDelegate,
    protected z: NgZone
  ) {
    this.el = ref.nativeElement;
    ref.nativeElement.delegate = angularDelegate.create(environmentInjector, injector);
    proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
  }
}
