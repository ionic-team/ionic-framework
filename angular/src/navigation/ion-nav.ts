import { ComponentFactoryResolver, Directive, ElementRef, Injector} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { FrameworkDelegate, NavOptions, NavParams, TransitionDoneFn, ViewController } from '@ionic/core';
import { proxyEl } from '../util/util';
import { AngularDelegate } from '..';


@Directive({
  selector: 'ion-nav',
})
export class IonNav {

  private delegate: FrameworkDelegate;

  constructor(
    private ref: ElementRef,
    router: Router,
    cfr: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
  ) {
    this.delegate = angularDelegate.create(cfr, injector);
    console.log('ion-nav');

    router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        console.log('NavigationStart', ev.url);

      } else if (ev instanceof NavigationEnd) {
        console.log('NavigationEnd', ev.url);
      }
    });
  }

  push(page: any, params?: NavParams, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'push', page, params, this.wrap(opts), done);
  }

  insert(insertIndex: number, page: any, params?: NavParams, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'insert', insertIndex, page, params, this.wrap(opts), done);
  }

  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'insertPages', insertIndex, insertPages, this.wrap(opts), done);
  }

  pop(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'pop', this.wrap(opts), done);
  }

  popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'popTo', indexOrViewCtrl, this.wrap(opts), done);
  }

  popToRoot(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'popToRoot', this.wrap(opts), done);
  }

  popAll(): Promise<boolean[]> {
    return proxyEl(this.ref, 'popAll');
  }

  removeIndex(startIndex: number, removeCount = 1, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'removeIndex', startIndex, removeCount, this.wrap(opts), done);
  }

  removeView(viewController: ViewController, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'removeView', viewController, this.wrap(opts), done);
  }

  setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'setRoot', pageOrViewCtrl, params, this.wrap(opts), done);
  }

  setPages(pages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'setPages', pages, this.wrap(opts), done);
  }

  getAllChildNavs(): any[] {
    return proxyEl(this.ref, 'getAllChildNavs');
  }

  canGoBack(view?: ViewController): boolean {
    return proxyEl(this.ref, 'canGoBack', view);
  }

  getActive(): ViewController {
    return proxyEl(this.ref, 'getActive');
  }

  getByIndex(index: number): ViewController {
    return proxyEl(this.ref, 'getByIndex', index);
  }

  getPrevious(view?: ViewController): ViewController|undefined {
    return proxyEl(this.ref, 'getPrevious', view);
  }

  getViews(): Array<ViewController> {
    return proxyEl(this.ref, 'getViews');
  }
  /**
   * Return a view controller
   */
  getViewById(id: string): ViewController|undefined {
    return proxyEl(this.ref, 'getViewById', id);
  }

  indexOf(viewController: ViewController) {
    return proxyEl(this.ref, 'indexOf', viewController);
  }

  length() {
    return proxyEl(this.ref, 'length');
  }

  private wrap(opts?: NavOptions): NavOptions {
    return {
      ...this.wrap(opts),
      delegate: this.delegate
    };
  }

}
