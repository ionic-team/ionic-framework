import { HostListener, Input, Optional, ElementRef, NgZone, ChangeDetectorRef, Directive } from '@angular/core';
import type { Components } from '@ionic/core';
import type { AnimationBuilder } from '@ionic/core/components';

import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { ProxyCmp } from '../../utils/proxy';

import { IonRouterOutlet } from './router-outlet';

const BACK_BUTTON_INPUTS = ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface IonBackButton extends Components.IonBackButton {}

@ProxyCmp({
  inputs: BACK_BUTTON_INPUTS,
})
@Directive({
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: BACK_BUTTON_INPUTS,
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
    private r: ElementRef,
    protected z: NgZone,
    c: ChangeDetectorRef
  ) {
    c.detach();
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
