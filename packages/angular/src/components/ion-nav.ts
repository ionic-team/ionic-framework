import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ReflectiveInjector,
  ViewContainerRef,
  ViewChild
} from '@angular/core';

import { PublicNav } from '@ionic/core';

import { getProviders } from '../di/di';
import { AngularFrameworkDelegate } from '../providers/angular-framework-delegate';
import { AngularViewController } from '../types/angular-view-controller';

@Component({
  selector: 'ion-nav',
  template: `
    <div #viewport class="ng-nav-viewport"></div>
  `
})
export class IonNavDelegate implements OnInit {

  @ViewChild('viewport', { read: ViewContainerRef}) viewport: ViewContainerRef;

  constructor(private changeDetection: ChangeDetectorRef, private angularFrameworkDelegate: AngularFrameworkDelegate) {
  }

  ngOnInit() {
    const controllerElement = document.querySelector('ion-nav-controller') as any;
    controllerElement.delegate = this;
  }

  attachViewToDom(nav: PublicNav, enteringView: AngularViewController): Promise<any> {

    const componentProviders = ReflectiveInjector.resolve(getProviders(nav.element as HTMLIonNavElement));
    return this.angularFrameworkDelegate.attachViewToDom(enteringView.component, this.viewport, componentProviders, this.changeDetection).then((angularMountingData) => {

      enteringView.componentFactory = angularMountingData.componentFactory;
      enteringView.injector = angularMountingData.childInjector;
      enteringView.componentRef = angularMountingData.componentRef;
      enteringView.instance = angularMountingData.componentRef.instance;
      enteringView.angularHostElement = angularMountingData.componentRef.location.nativeElement;
      enteringView.element = angularMountingData.componentRef.location.nativeElement.querySelector('ion-page');
    });
  }

  removeViewFromDom(_nav: PublicNav, viewController: AngularViewController) {
    return this.angularFrameworkDelegate.removeViewFromDom((viewController as any).componentRef).then(() => {
      viewController.componentFactory = null;
      viewController.injector = null;
      viewController.componentRef = null;
      viewController.instance = null;
      viewController.angularHostElement = null;
      viewController.element = null;
    });
  }
}


