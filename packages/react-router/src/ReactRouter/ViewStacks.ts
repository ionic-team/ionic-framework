import { Location as HistoryLocation } from 'history';
import { matchPath } from 'react-router-dom';

import { IonRouteData } from './IonRouteData';
import { ViewItem } from './ViewItem';

export interface ViewStack {
  id: string;
  views: ViewItem[];
}

/**
 * The holistic view of all the Routes configured for an application inside of an IonRouterOutlet.
 */
export class ViewStacks {
  private viewStacks: { [key: string]: ViewStack | undefined; } = {};

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

  findViewInfoByLocation(location: HistoryLocation, viewKey: string) {
    let view: ViewItem<IonRouteData> | undefined;
    let match: IonRouteData['match'] | null | undefined;
    let viewStack: ViewStack | undefined;

    viewStack = this.viewStacks[viewKey];
    if (viewStack) {
      viewStack.views.some(matchView);

      if (!view) {
        viewStack.views.some(r => {
          // try to find a route that doesn't have a path or from prop, that will be our not found route
          if (!r.routeData.childProps.path && !r.routeData.childProps.from) {
            match = {
              path: location.pathname,
              url: location.pathname,
              isExact: true,
              params: {}
            };
            view = r;
            return true;
          }
          return false;
        });
      }
    }

    return { view, viewStack, match };

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
        return true;
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
