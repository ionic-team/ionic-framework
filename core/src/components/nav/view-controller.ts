import { ComponentProps, FrameworkDelegate, Nav } from '../../interface';
import { attachComponent } from '../../utils/framework-delegate';
import { assert } from '../../utils/helpers';


export const enum ViewState {
  New = 1,
  Attached,
  Destroyed
}

export class ViewController {

  state: ViewState = ViewState.New;
  nav?: Nav;
  element?: HTMLElement;
  delegate?: FrameworkDelegate;

  constructor(
    public component: any,
    public params: any
  ) {}

  /**
   * @hidden
   */
  async init(container: HTMLElement) {
    this.state = ViewState.Attached;

    if (!this.element) {
      const component = this.component;
      this.element = await attachComponent(this.delegate, container, component, ['ion-page', 'hide-page'], this.params);
    }
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _destroy() {
    assert(this.state !== ViewState.Destroyed, 'view state must be ATTACHED');

    const element = this.element;
    if (element) {
      if (this.delegate) {
        this.delegate.removeViewFromDom(element.parentElement, element);
      } else {
        element.remove();
      }
    }
    this.nav = undefined;
    this.state = ViewState.Destroyed;
  }
}

export function matches(view: ViewController|undefined, id: string, params: ComponentProps): view is ViewController {
  if (!view) {
    return false;
  }
  if (view.component !== id) {
    return false;
  }
  const currentParams = view.params;
  const null1 = (currentParams == null);
  const null2 = (params == null);
  if (null1 !== null2) {
    return false;
  }
  if (null1 && null2) {
    return true;
  }

  const keysA = Object.keys(currentParams);
  const keysB = Object.keys(params);
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (currentParams[key] !== params[key]) {
      return false;
    }
  }
  return true;
}

export function convertToView(page: any, params: any): ViewController|null {
  if (!page) {
    return null;
  }
  if (page instanceof ViewController) {
    return page;
  }
  return new ViewController(page, params);
}

export function convertToViews(pages: any[]): ViewController[] {
  return pages.map(page => {
    if (page instanceof ViewController) {
      return page;
    }
    if ('page' in page) {
      return convertToView(page.page, page.params);
    }
    return convertToView(page, undefined);
  }).filter(v => v !== null) as ViewController[];
}
