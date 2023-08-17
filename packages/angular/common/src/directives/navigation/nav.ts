import { ElementRef, Injector, EnvironmentInjector, NgZone, ChangeDetectorRef, Directive } from '@angular/core';
import type { Components } from '@ionic/core';

import { AngularDelegate } from '../../providers/angular-delegate';
import { ProxyCmp, proxyOutputs } from '../../utils/proxy';

const NAV_INPUTS = ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'];

const NAV_METHODS = [
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface IonNav extends Components.IonNav {}

@ProxyCmp({
  inputs: NAV_INPUTS,
  methods: NAV_METHODS,
})
@Directive({
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: NAV_INPUTS,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonNav {
  protected el: HTMLElement;
  constructor(
    ref: ElementRef,
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    angularDelegate: AngularDelegate,
    protected z: NgZone,
    c: ChangeDetectorRef
  ) {
    c.detach();
    this.el = ref.nativeElement;
    ref.nativeElement.delegate = angularDelegate.create(environmentInjector, injector);
    proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
  }
}
