import { Component, Method } from '@stencil/core';
import { EscapeHatch, NavResult } from '../../index';

@Component({
  tag: 'ion-external-router-controller'
})
export class ExternalRouterController {

  private externalNavPromise: void | Promise<any> = null;
  private externalNavOccuring = false;

  @Method()
  getExternalNavPromise(): void | Promise<any> {
    return this.externalNavPromise;
  }

  @Method()
  clearExternalNavPromise(): void {
    this.externalNavPromise = null;
  }

  @Method()
  getExternalNavOccuring(): boolean {
    return this.externalNavOccuring;
  }

  @Method()
  updateExternalNavOccuring(status: boolean) {
    this.externalNavOccuring = status;
  }

  @Method()
  reconcileNav(nav: HTMLIonNavElement, component: any, escapeHatch: EscapeHatch, isTopLevel: boolean) {
    return nav.componentOnReady().then(() => {
      // check if the nav has an `<ion-tab>` as a parent
      if (isParentTab(nav)) {
        // check if the tab is selected
        return updateTab(nav, component, escapeHatch, isTopLevel);
      } else {
        return updateNav(nav, component, escapeHatch, isTopLevel);
      }
    });
  }
}

function isParentTab(navElement: HTMLIonNavElement) {
  return navElement.parentElement.tagName.toLowerCase() === 'ion-tab';
}

function updateTab(navElement: HTMLIonNavElement, component: any, escapeHatch: EscapeHatch, isTopLevel: boolean) {

  const tab = navElement.parentElement as HTMLIonTabElement;

  // yeah yeah, I know this is kind of ugly but oh well, I know the internal structure of <ion-tabs>
  const tabs = tab.parentElement.parentElement as HTMLIonTabsElement;

  return isTabSelected(tabs, tab).then((isSelected: boolean) => {
    if (!isSelected) {
      const promise = updateNav(navElement, component, escapeHatch, isTopLevel);
      this.externalNavPromise = promise;
      // okay, the tab is not selected, so we need to do a "switch" transition
      // basically, we should update the nav, and then swap the tabs
      return promise.then(() => {
        return tabs.select(tab);
      });
    }

    // okay cool, the tab is already selected, so we want to see a transition
    return updateNav(navElement, component, escapeHatch, isTopLevel);
  });
}

function isTabSelected(tabsElement: HTMLIonTabsElement, tabElement: HTMLIonTabElement ): Promise<boolean> {
  const promises: Promise<any>[] = [];
  promises.push(tabsElement.componentOnReady());
  promises.push(tabElement.componentOnReady());
  return Promise.all(promises).then(() => {
    return tabsElement.getSelected() === tabElement;
  });
}

function updateNav(navElement: HTMLIonNavElement,
  component: any, escapeHatch: EscapeHatch, isTopLevel: boolean): Promise<NavResult> {


  // check if the component is the top view
  const activeViews = navElement.getViews();
  if (activeViews.length === 0) {
    // there isn't a view in the stack, so push one
    return navElement.setRoot(component, {}, {}, escapeHatch);
  }

  const currentView = activeViews[activeViews.length - 1];
  if (currentView.component === component) {
    // the top view is already the component being activated, so there is no change needed
    return Promise.resolve(null);
  }

  // check if the component is the previous view, if so, pop back to it
  if (activeViews.length > 1) {
    // there's at least two views in the stack
    const previousView = activeViews[activeViews.length - 2];
    if (previousView.component === component) {
      // cool, we match the previous view, so pop it
      return navElement.pop(null, escapeHatch);
    }
  }

  // check if the component is already in the stack of views, in which case we pop back to it
  for (const view of activeViews) {
    if (view.component === component) {
      // cool, we found the match, pop back to that bad boy
      return navElement.popTo(view, null, escapeHatch);
    }
  }

  // it's the top level nav, and it's not one of those other behaviors, so do a push so the user gets a chill animation
  return navElement.push(component, {}, { animate: isTopLevel }, escapeHatch);
}
