import { NavOptions, PublicNavController, ViewController } from '@ionic/core';
import { hydrateElement } from '../util/util';

export class NavController implements PublicNavController {
  constructor(public element: HTMLIonNavElement) {
  }

  push(component: any, data?: any, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.push(component, data, opts);
    });
  }

  pop(opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.pop(opts);
    });
  }

  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.setRoot(component, data, opts);
    });
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.insert(insertIndex, page, params, opts);
    });
  }

  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.insertPages(insertIndex, insertPages, opts);
    });
  }

  popToRoot(opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.popToRoot(opts);
    });
  }

  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.popTo(indexOrViewCtrl, opts);
    });
  }

  removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.removeIndex(startIndex, removeCount, opts);
    });
  }

  removeView(viewController: ViewController, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.removeView(viewController, opts);
    });
  }

  setPages(componentDataPairs: any[], opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.setPages(componentDataPairs, opts);
    });
  }

  getActive(): ViewController {
    if (this.element.getActive) {
      return this.element.getActive();
    }
    return null;
  }

  getPrevious(view?: ViewController): ViewController {
    if (this.element.getPrevious) {
      return this.element.getPrevious(view);
    }
    return null;
  }

  canGoBack(nav: PublicNavController): boolean {
    if (this.element.canGoBack) {
      return this.element.canGoBack(nav as any);
    }
    return false;
  }

  canSwipeBack(): boolean {
    if (this.element.canSwipeBack) {
      return this.element.canSwipeBack();
    }
    return false;
  }

  getFirstView(): ViewController {
    if (this.element.getFirstView) {
      return this.element.getFirstView();
    }
    return null;
  }
}