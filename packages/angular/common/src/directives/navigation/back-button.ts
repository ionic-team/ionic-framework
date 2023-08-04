import { Directive, HostListener, Input, Optional, ElementRef, NgZone } from '@angular/core';
import type { AnimationBuilder } from '@ionic/core/components';

import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { ProxyCmp } from '../../utils/proxy';

import { IonRouterOutlet } from './router-outlet';

const BACK_BUTTON_INPUTS = ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type'];

@ProxyCmp({
  inputs: BACK_BUTTON_INPUTS,
})
@Directive({
  selector: 'ion-back-button',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: BACK_BUTTON_INPUTS,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonBackButtonDelegate {
  @Input()
  defaultHref: string | undefined | null;

  @Input()
  routerAnimation?: AnimationBuilder;

  protected el: HTMLElement;

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController,
    private config: Config,
    private r: ElementRef,
    protected z: NgZone
  ) {
    this.el = this.r.nativeElement;
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
