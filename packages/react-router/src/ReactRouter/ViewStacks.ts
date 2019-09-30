import { Location as HistoryLocation } from 'history';
import { ViewItem } from './ViewItem';
import { IonRouteData } from './IonRouteData';
import { matchPath } from 'react-router-dom';

export interface ViewStack {
  id: string;
  routerOutlet: HTMLIonRouterOutletElement;
  views: ViewItem[]
}

/**
 * The holistic view of all the Routes configured for an application inside of an IonRouterOutlet.
 */
export class ViewStacks {
  private viewStacks: { [key: string]: ViewStack } = {};

  get(key: string) {
    return this.viewStacks[key];
  }

  set(key: string, viewStack: ViewStack) {
    this.viewStacks[key] = viewStack;
  }

  getKeys() {
    return Object.keys(this.viewStacks);
  }

  delete(key: string) {
    delete this.viewStacks[key];
  }

  findViewInfoByLocation(location: HistoryLocation, key?: string) {
    let view: ViewItem<IonRouteData> | undefined;
    let match: IonRouteData["match"] | null | undefined;
    let viewStack: ViewStack | undefined;
    if (key) {
      viewStack = this.viewStacks[key];
      if (viewStack) {
        viewStack.views.some(matchView);
      }
    } else {
      const keys = this.getKeys();
      keys.some(key => {
        viewStack = this.viewStacks[key];
        return viewStack.views.some(matchView);
      });
    }

    const result = { view, viewStack, match };
    return result;

    function matchView(v: ViewItem) {
      const matchProps = {
        exact: v.routeData.childProps.exact,
        path: v.routeData.childProps.path || v.routeData.childProps.from,
        component: v.routeData.childProps.component
      };
      match = matchPath(location.pathname, matchProps)
      if (match) {
        view = v;
        return true;
      }
      return false;
    }

  }

  findViewInfoById(id: string = '') {
    let view: ViewItem<IonRouteData> | undefined;
    let viewStack: ViewStack | undefined;
    const keys = this.getKeys();
    keys.some(key => {
      const vs = this.viewStacks[key];
      view = vs.views.find(x => x.id === id);
      if (view) {
        viewStack = vs;
        return true;
      } else {
        return false;
      }
    });
    return { view, viewStack };
  }

  setHiddenViews() {
    const keys = this.getKeys();
    keys.forEach(key => {
      const viewStack = this.viewStacks[key];
      viewStack.views.forEach(view => {
        if(!view.routeData.match && !view.isIonRoute) {
          view.show = false;
          view.mount = false;
        }
      })
    })
  }
}

