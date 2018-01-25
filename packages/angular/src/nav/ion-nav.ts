import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ActivatedRoute,
  ChildrenOutletContexts,
  Router
} from '@angular/router';


import { FrameworkDelegate } from '@ionic/core';

import { AngularComponentMounter, AngularEscapeHatch } from '..';
import { OutletInjector } from './router/outlet-injector';

let id = 0;

@Directive({
  selector: 'ion-nav',
})
export class IonNav implements FrameworkDelegate, OnDestroy, OnInit {

  public name: string;
  public activationStatus = NOT_ACTIVATED;
  public componentConstructor: Type<any> = null;
  public componentInstance: any = null;
  public activatedRoute: ActivatedRoute = null;
  public activatedRouteData: any = {};
  public activeComponentRef: ComponentRef<any> = null;
  private id: number = id++;
  private parent: HTMLElement;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    public location: ViewContainerRef,
    public changeDetector: ChangeDetectorRef,
    public elementRef: ElementRef,
    protected angularComponentMounter: AngularComponentMounter,
    protected parentContexts: ChildrenOutletContexts,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    @Attribute('name') name: string) {

    this.parent = this.elementRef.nativeElement.parentElement;
    this.elementRef.nativeElement.delegate = this;
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  ngOnDestroy(): void {
    console.debug(`Nav ${this.id} ngOnDestroy`);
    this.parentContexts.onChildOutletDestroyed(this.name);
  }

  get isActivated(): boolean {
    return this.activationStatus === ACTIVATION_IN_PROGRESS
      || this.activationStatus === ACTIVATED;
  }

  ngOnInit(): void {
    if (!this.isActivated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        // the component defined in the configuration is created
        // otherwise the component defined in the configuration is created
        this.activateWith(context.route, context.resolver || null);
      }
    }
  }

  get component(): Object {
    return this.componentInstance;
  }

  deactivate(): void {
    console.debug(`outlet ${this.id} is being deactivated`);
    this.activationStatus = NOT_ACTIVATED;
    this.deactivateEvents.emit(this.componentConstructor);
  }

  activateWith(activatedRoute: ActivatedRoute, cfr: ComponentFactoryResolver): Promise<void> {
    if (this.activationStatus !== NOT_ACTIVATED) {
      return Promise.resolve();
    }

    this.activationStatus = ACTIVATION_IN_PROGRESS;
    this.activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = snapshot.routeConfig ? snapshot.routeConfig.component : null;
    cfr = cfr || this.cfr;
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);

    return activateRoute(this.elementRef.nativeElement, component, cfr, injector).then(() => {
      this.changeDetector.markForCheck();
      this.activateEvents.emit(null);
      this.activationStatus = ACTIVATED;
    });
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement,
    elementOrComponentToMount: Type<any>,
    data?: any,
    classesToAdd?: string[],
    escapeHatch: AngularEscapeHatch = {}): Promise<any> {

    // wrap whatever the user provides in an ion-page
    const cfr = escapeHatch.cfr || this.cfr;
    const injector = escapeHatch.injector || this.injector;
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo,
      null, elementOrComponentToMount, cfr, injector, data, classesToAdd);
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(parentElement, childElement);
  }

}

export function activateRoute(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector): Promise<void> {

  return (navElement as any).componentOnReady().then(() => {

    // check if the nav has an `<ion-tab>` as a parent
    if (isParentTab(navElement)) {
      // check if the tab is selected
      return updateTab(navElement, component, cfr, injector);
    } else {
      return updateNav(navElement, component, cfr, injector);
    }
  });
}



function isParentTab(navElement: HTMLIonNavElement) {
  return navElement.parentElement.tagName.toLowerCase() === 'ion-tab';
}

function isTabSelected(tabsElement: HTMLIonTabsElement, tabElement: HTMLIonTabElement ): Promise<boolean> {
  const promises: Promise<any>[] = [];
  promises.push((tabsElement as any).componentOnReady());
  promises.push((tabElement as any).componentOnReady());
  return Promise.all(promises).then(() => {
    return tabsElement.getSelected() === tabElement;
  });
}

function getSelected(tabsElement: HTMLIonTabsElement) {
  tabsElement.getSelected();
}

function updateTab(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector) {

  const tab = navElement.parentElement as HTMLIonTabElement;
  // yeah yeah, I know this is kind of ugly but oh well, I know the internal structure of <ion-tabs>
  const tabs = tab.parentElement.parentElement as HTMLIonTabsElement;
  return isTabSelected(tabs, tab).then((isSelected: boolean) => {
    if (!isSelected) {
      // okay, the tab is not selected, so we need to do a "switch" transition
      // basically, we should update the nav, and then swap the tabs
      return updateNav(navElement, component, cfr, injector).then(() => {
        return tabs.select(tab);
      });
    }

    // okay cool, the tab is already selected, so we want to see a transition
    return updateNav(navElement, component, cfr, injector);
  })
}

function updateNav(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector) {

  // check if the component is the top view
  const activeViews = navElement.getViews();
  if (activeViews.length === 0) {
    // there isn't a view in the stack, so push one
    return navElement.push(component, {}, {}, {
      cfr,
      injector
    });
  }

  const currentView = activeViews[activeViews.length - 1];
  if (currentView.component === component) {
    // the top view is already the component being activated, so there is no change needed
    return Promise.resolve();
  }

  // check if the component is the previous view, if so, pop back to it
  if (activeViews.length > 1) {
    // there's at least two views in the stack
    const previousView = activeViews[activeViews.length - 2];
    if (previousView.component === component) {
      // cool, we match the previous view, so pop it
      return navElement.pop();
    }
  }

  // check if the component is already in the stack of views, in which case we pop back to it
  for (const view of activeViews) {
    if (view.component === component) {
      // cool, we found the match, pop back to that bad boy
      return navElement.popTo(view);
    }
  }

  // since it's none of those things, we should probably just push that bad boy and call it a day
  return navElement.push(component, {}, {}, {
    cfr,
    injector
  });
}

export const NOT_ACTIVATED = 0;
export const ACTIVATION_IN_PROGRESS = 1;
export const ACTIVATED = 2;
