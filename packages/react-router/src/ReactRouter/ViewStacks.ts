import { Location as HistoryLocation } from 'history';
import { matchPath } from 'react-router-dom';

import { IonRouteData } from './IonRouteData';
import { ViewItem } from './ViewItem';

export interface ViewStack {
  id: string;
  routerOutlet: HTMLIonRouterOutletElement;
  views: ViewItem[];
}

/**
 * The holistic view of all the Routes configured for an application inside of an IonRouterOutlet.
 */
export class ViewStacks {
  private viewStacks: { [key: string]: ViewStack | undefined } = {};

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

  findViewInfoByLocation(location: HistoryLocation, viewKey?: string) {
    let view: ViewItem<IonRouteData> | undefined;
    let match: IonRouteData['match'] | null | undefined;
    let viewStack: ViewStack | undefined;
    if (viewKey) {
      viewStack = this.viewStacks[viewKey];
      if (viewStack) {
        viewStack.views.some(matchView);
      }
    } else {
      const keys = this.getKeys();
      keys.some(key => {
        viewStack = this.viewStacks[key];
        return viewStack!.views.some(matchView);
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
      const myMatch: IonRouteData['match'] | null | undefined = matchPath(location.pathname, matchProps);
      if (myMatch) {
        view = v;
        match = myMatch;
        return view.location === location.pathname;
      }
      return false;
    }

  }

  findViewInfoById(id = '') {
    let view: ViewItem<IonRouteData> | undefined;
    let viewStack: ViewStack | undefined;
    const keys = this.getKeys();
    keys.some(key => {
      const vs = this.viewStacks[key];
      view = vs!.views.find(x => x.id === id);
      if (view) {
        viewStack = vs;
        return true;
      } else {
        return false;
      }
    });
    return { view, viewStack };
  }

}
