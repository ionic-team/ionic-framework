import {
  Component,
  Optional,
  ChangeDetectionStrategy,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  HostListener,
  Input,
} from '@angular/core';
import { NavController, Config, ProxyCmp } from '@ionic/angular/common';
import type { AnimationBuilder } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';

import { IonRouterOutlet } from './router-outlet';

const BACK_BUTTON_INPUTS = ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type'];

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: BACK_BUTTON_INPUTS,
})
@Component({
  selector: 'ion-back-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: BACK_BUTTON_INPUTS,
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButton {
  @Input()
  defaultHref: string | undefined;

  @Input()
  routerAnimation: AnimationBuilder | undefined;

  protected el: HTMLElement;

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController,
    private config: Config,
    r: ElementRef,
    protected z: NgZone,
    c: ChangeDetectorRef
  ) {
    c.detach();
    this.el = r.nativeElement;
  }

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  onClick(ev: Event): void {
    const defaultHref = this.defaultHref || this.config.get('backButtonDefaultHref');

    if (this.routerOutlet?.canGoBack()) {
      this.navCtrl.setDirection('back', undefined, undefined, this.routerAnimation);
      this.routerOutlet.pop();
      ev.preventDefault();
    } else if (defaultHref != null) {
      this.navCtrl.navigateBack(defaultHref, { animation: this.routerAnimation });
      ev.preventDefault();
    }
  }
}
