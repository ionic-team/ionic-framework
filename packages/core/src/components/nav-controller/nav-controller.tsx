import { Component, Element, Method, Prop } from '@stencil/core';
import { AnimationController, Config } from '../..';
import { ComponentDataPair, FrameworkDelegate, Nav, NavController, NavOptions, ViewController } from '../../navigation/nav-interfaces';

import { isReady } from '../../utils/helpers';

import {
  insert as insertImpl,
  insertPages as insertPagesImpl,
  pop as popImpl,
  popTo as popToImpl,
  popToRoot as popToRootImpl,
  push as pushImpl,
  remove as removeImpl,
  removeView as removeViewImpl,
  setPages as setPagesImpl,
  setRoot as setRootImpl,
} from '../../navigation/nav-controller-functions';

let defaultDelegate: FrameworkDelegate = null;

@Component({
  tag: 'ion-nav-controller',
})
export class NavControllerImpl implements NavController {

  @Element() element: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop() delegate: FrameworkDelegate;

  constructor() {
  }

  @Method()
  push(nav: Nav, component: any, data?: any, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return pushImpl(nav, delegate, component, data, opts);
    });
  }

  @Method()
  pop(nav: Nav, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return popImpl(nav, delegate, opts);
    });

  }

  @Method()
  setRoot(nav: Nav, component: any, data?: any, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return setRootImpl(nav, delegate, component, data, opts);
    });
  }

  @Method()
  insert(nav: Nav, insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return insertImpl(nav, delegate, insertIndex, page, params, opts);
    });
  }

  @Method()
  insertPages(nav: Nav, insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return insertPagesImpl(nav, delegate, insertIndex, insertPages, opts);
    });
  }

  @Method()
  popToRoot(nav: Nav, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return popToRootImpl(nav, delegate, opts);
    });
  }

  @Method()
  popTo(nav: Nav, indexOrViewCtrl: any, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return popToImpl(nav, delegate, indexOrViewCtrl, opts);
    });
  }

  @Method()
  remove(nav: Nav, startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return removeImpl(nav, delegate, startIndex, removeCount, opts);
    });
  }

  @Method()
  removeView(nav: Nav, viewController: ViewController, opts?: NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return removeViewImpl(nav, delegate, viewController, opts);
    });
  }

  @Method()
  setPages(nav: Nav, componentDataPairs: ComponentDataPair[], opts? : NavOptions): Promise<any> {
    return getDelegate(this).then((delegate) => {
      return setPagesImpl(nav, delegate, componentDataPairs, opts);
    });
  }

  render() {
    return <slot></slot>;
  }
}

export function getDelegate(navController: NavController): Promise<FrameworkDelegate> {
  if (navController.delegate) {
    return Promise.resolve(navController.delegate);
  }
  // no delegate is set, so fall back to inserting the stencil-ion-nav-delegate
  const element = document.createElement('stencil-ion-nav-delegate');
  document.body.appendChild(element);
  return isReady(element).then(() => {
    defaultDelegate = element as any as FrameworkDelegate;
    return defaultDelegate;
  })
}