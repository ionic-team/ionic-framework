import { NavOptions, PublicNav, PublicViewController } from '@ionic/core';
import { hydrateElement } from '../util/util';

export class NavController implements PublicNav {
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

  removeView(viewController: PublicViewController, opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.removeView(viewController, opts);
    });
  }

  setPages(componentDataPairs: any[], opts?: NavOptions): Promise<any> {
    return hydrateElement(this.element).then((navElement: HTMLIonNavElement) => {
      return navElement.setPages(componentDataPairs, opts);
    });
  }

  getActive(): PublicViewController {
    if (this.element.getActive) {
      return this.element.getActive();
    }
    return null;
  }

  getPrevious(view?: PublicViewController): PublicViewController {
    if (this.element.getPrevious) {
      return this.element.getPrevious(view);
    }
    return null;
  }

  canGoBack(): boolean {
    if (this.element.canGoBack) {
      return this.element.canGoBack();
    }
    return false;
  }

  canSwipeBack(): boolean {
    if (this.element.canSwipeBack) {
      return this.element.canSwipeBack();
    }
    return false;
  }

  first(): PublicViewController {
    if (this.element.first) {
      return this.element.first();
    }
    return null;
  }

  last(): PublicViewController {
    if (this.element.last) {
      return this.element.last();
    }
    return null;
  }

  getViews(): PublicViewController[] {
    if (this.element.getViews) {
      return this.element.getViews();
    }
    return [];
  }

  getChildNavs(): PublicNav[] {
    if (this.element.getChildNavs) {
      return this.element.getChildNavs();
    }
    return [];
  }
}
