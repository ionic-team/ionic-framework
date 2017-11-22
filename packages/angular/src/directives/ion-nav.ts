import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  InjectionToken,
  NgZone,
  OnInit,
  ReflectiveInjector,
  ViewContainerRef,
  ViewChild
} from '@angular/core';

import { NavController, ViewController } from '@ionic/core';
import { App } from '../providers/app';
import { NavController as InjectableNavController } from '../providers/nav-controller';

@Component({
  selector: 'ion-nav',
  template: `
    <div #viewport class="ng-nav-viewport"></div>
  `
})
export class IonNavDelegate {

  @ViewChild('viewport', { read: ViewContainerRef}) viewport: ViewContainerRef;

  constructor(private crf: ComponentFactoryResolver, private changeDetection: ChangeDetectorRef, private zone: NgZone, private injector: Injector) {
  }

  ngOnInit() {
    const controllerElement = document.querySelector('ion-nav-controller') as any;
    controllerElement.delegate = this;
  }

  attachViewToDom(nav: NavController, enteringView: ViewController): Promise<any> {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {

        const componentProviders = ReflectiveInjector.resolve([
          {
            provide: NavControllerToken, useValue: nav.element,
          },
          {
            provide: NavController, useFactory: provideNavControllerInjectable, deps: [NavControllerToken]
          },

          {
            provide: AppToken, useValue: null,
          },
          {
            provide: App, useFactory: provideAppInjectable, deps: [AppToken]
          }
        ]);

        const componentFactory = this.crf.resolveComponentFactory(enteringView.component);

        const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this.viewport.parentInjector);
        const componentRef = componentFactory.create(childInjector, []);
        this.viewport.insert(componentRef.hostView, this.viewport.length);
        this.changeDetection.detectChanges();


        (enteringView as any).componentFactory = componentFactory;
        (enteringView as any).childInjector = childInjector;
        (enteringView as any).componentRef = componentRef;
        enteringView.instance = componentRef.instance;
        (enteringView as any).angularHostElement = componentRef.location.nativeElement;
        enteringView.element = componentRef.location.nativeElement.querySelector('ion-page');
        resolve();
      });
    });
  }

  removeViewFromDom(nav: NavController, viewController: ViewController) {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {

        (viewController as any).componentRef.destroy();
        // (nav.element as HTMLElement).removeChild(viewController.angularHostElement);

        (viewController as any).componentFactory = null;
        (viewController as any).childInjector = null;
        (viewController as any).componentRef = null;
        viewController.instance = null;
        (viewController as any).angularHostElement = null;
        viewController.element = null;
        resolve();
      });
    })
  }
}


export const NavControllerToken = new InjectionToken<any>('NavControllerToken');
export const ViewControllerToken = new InjectionToken<any>('ViewControllerToken');
export const AppToken = new InjectionToken<any>('AppToken');

export function provideNavControllerInjectable(element: any) {
  return new InjectableNavController(element);
}

export function provideAppInjectable() {
  return new App();
}
