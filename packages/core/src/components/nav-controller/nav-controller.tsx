import { Component, Element, Method, Prop } from '@stencil/core';
import { Animation, AnimationController } from '../..';
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
  @Prop() delegate: FrameworkDelegate;
  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;


  constructor() {
  }

  @Method()
  push(nav: Nav, component: any, data?: any, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return pushImpl(nav, delegate, animation, component, data, opts);
    });
  }

  @Method()
  pop(nav: Nav, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return popImpl(nav, delegate, animation, opts);
    });
  }

  @Method()
  setRoot(nav: Nav, component: any, data?: any, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return setRootImpl(nav, delegate, animation, component, data, opts);
    });
  }

  @Method()
  insert(nav: Nav, insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return insertImpl(nav, delegate, animation, insertIndex, page, params, opts);
    });
  }

  @Method()
  insertPages(nav: Nav, insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return insertPagesImpl(nav, delegate, animation, insertIndex, insertPages, opts);
    });
  }

  @Method()
  popToRoot(nav: Nav, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return popToRootImpl(nav, delegate, animation, opts);
    });
  }

  @Method()
  popTo(nav: Nav, indexOrViewCtrl: any, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return popToImpl(nav, delegate, animation, indexOrViewCtrl, opts);
    });
  }

  @Method()
  removeIndex(nav: Nav, startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return removeImpl(nav, delegate, animation, startIndex, removeCount, opts);
    });
  }

  @Method()
  removeView(nav: Nav, viewController: ViewController, opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return removeViewImpl(nav, delegate, animation, viewController, opts);
    });
  }

  @Method()
  setPages(nav: Nav, componentDataPairs: ComponentDataPair[], opts?: NavOptions): Promise<any> {
    return hydrateDelegateAndAnimation(this).then(([delegate, animation]) => {
      return setPagesImpl(nav, delegate, animation, componentDataPairs, opts);
    });
  }

  protected render() {
    return <slot></slot>;
  }
}

export function hydrateDelegateAndAnimation(navController: NavController): Promise<any> {
  return Promise.all([hydrateDelegate(navController), hydrateAnimationController(navController.animationCtrl)]);
}

export function hydrateDelegate(navController: NavController): Promise<FrameworkDelegate> {
  if (navController.delegate) {
    return Promise.resolve(navController.delegate);
  }
  // no delegate is set, so fall back to inserting the stencil-ion-nav-delegate
  const element = document.createElement('stencil-ion-nav-delegate');
  document.body.appendChild(element);
  return isReady(element).then(() => {
    defaultDelegate = element as any as FrameworkDelegate;
    return defaultDelegate;
  });
}

export function hydrateAnimationController(animationController: AnimationController): Promise<Animation> {
  return animationController.create();
}
