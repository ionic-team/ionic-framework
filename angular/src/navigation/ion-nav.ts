import { ComponentFactoryResolver, Directive, ElementRef, Injector, Input} from '@angular/core';

import { AngularDelegate } from '../providers/angular-delegate';
import { ComponentProps, NavOptions, TransitionDoneFn, ViewController } from '@ionic/core';
import { proxyEl } from '../util/util';
import { inputs } from '../directives/proxies';


@Directive({
  selector: 'ion-nav',
})
export class Nav {

  @Input() root: any;
  @Input() rootParams: any;

  constructor(
    private ref: ElementRef,
    cfr: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
  ) {
    this.ref.nativeElement.delegate = angularDelegate.create(cfr, injector);
    inputs(this, ref, ['root', 'rootParams']);
  }

  push(page: any, params?: ComponentProps, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'push', page, params, opts, done);
  }

  insert(insertIndex: number, page: any, params?: ComponentProps, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'insert', insertIndex, page, params, opts, done);
  }

  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'insertPages', insertIndex, insertPages, opts, done);
  }

  pop(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'pop', opts, done);
  }

  popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'popTo', indexOrViewCtrl, opts, done);
  }

  popToRoot(opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'popToRoot', opts, done);
  }

  popAll(): Promise<boolean[]> {
    return proxyEl(this.ref, 'popAll');
  }

  removeIndex(startIndex: number, removeCount = 1, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'removeIndex', startIndex, removeCount, opts, done);
  }

  removeView(viewController: ViewController, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'removeView', viewController, opts, done);
  }

  setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'setRoot', pageOrViewCtrl, params, opts, done);
  }

  setPages(pages: any[], opts?: NavOptions, done?: TransitionDoneFn): Promise<boolean> {
    return proxyEl(this.ref, 'setPages', pages, opts, done);
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
}
