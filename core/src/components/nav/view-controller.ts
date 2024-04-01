import { attachComponent } from '@utils/framework-delegate';
import {
  assert,
  shallowEqualStringMap,
} from '@utils/helpers';

import type {
  AnimationBuilder,
  ComponentProps,
  FrameworkDelegate,
  NavComponentWithProps,
} from '../../interface';

export const VIEW_STATE_NEW = 1;
export const VIEW_STATE_ATTACHED = 2;
export const VIEW_STATE_DESTROYED = 3;

// TODO(FW-2832): types

export class ViewController {
  state = VIEW_STATE_NEW;
  nav?: any;
  element?: HTMLElement;
  delegate?: FrameworkDelegate;
  animationBuilder?: AnimationBuilder;

  constructor(
    public component: any,
    public params:
      | ComponentProps
      | undefined
  ) {}

  async init(container: HTMLElement) {
    this.state = VIEW_STATE_ATTACHED;

    if (!this.element) {
      const component = this.component;
      this.element =
        await attachComponent(
          this.delegate,
          container,
          component,
          [
            'ion-page',
            'ion-page-invisible',
          ],
          this.params
        );
    }
  }

  /**
   * DOM WRITE
   */
  _destroy() {
    assert(
      this.state !==
        VIEW_STATE_DESTROYED,
      'view state must be ATTACHED'
    );

    const element = this.element;
    if (element) {
      if (this.delegate) {
        this.delegate.removeViewFromDom(
          element.parentElement,
          element
        );
      } else {
        element.remove();
      }
    }
    this.nav = undefined;
    this.state = VIEW_STATE_DESTROYED;
  }
}

export const matches = (
  view: ViewController | undefined,
  id: string,
  params: ComponentProps | undefined
): view is ViewController => {
  if (!view) {
    return false;
  }
  if (view.component !== id) {
    return false;
  }

  return shallowEqualStringMap(
    view.params,
    params
  );
};

export const convertToView = (
  page: any,
  params: ComponentProps | undefined
): ViewController | null => {
  if (!page) {
    return null;
  }
  if (page instanceof ViewController) {
    return page;
  }
  return new ViewController(
    page,
    params
  );
};

export const convertToViews = (
  pages: NavComponentWithProps[]
): ViewController[] => {
  return pages
    .map((page) => {
      if (
        page instanceof ViewController
      ) {
        return page;
      }
      if ('component' in page) {
        return convertToView(
          page.component,
          page.componentProps === null
            ? undefined
            : page.componentProps
        );
      }
      return convertToView(
        page,
        undefined
      );
    })
    .filter(
      (v) => v !== null
    ) as ViewController[];
};
