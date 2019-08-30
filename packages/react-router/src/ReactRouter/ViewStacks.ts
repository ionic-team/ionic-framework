import { Location as HistoryLocation } from 'history';
import { ViewItem } from './ViewItem';
import { IonRouteData } from './IonRouteData';
import { matchPath } from 'react-router-dom';

export interface ViewStack {
  id: string;
  routerOutlet: HTMLIonRouterOutletElement;
  activeId?: string,
  views: ViewItem[]
}

export class ViewStacks {
  private viewStacks: {[key: string]: ViewStack} = {};

  get(key: string) {
    return this.viewStacks[key];
  }
  set(key: string, viewStack: ViewStack) {
    this.viewStacks[key] = viewStack;
  }

  delete(key: string) {
    delete this.viewStacks[key];
  }

  findViewInfoByLocation(location: HistoryLocation) {
    let view: ViewItem<IonRouteData> | undefined;
    let match: IonRouteData["match"] | null | undefined;
    let viewStack: ViewStack | undefined;
    const keys = Object.keys(this.viewStacks);
    keys.some(key => {
      const vs = this.viewStacks[key];
      return vs.views.some(x => {
        const matchProps = {
          exact: x.routeData.childProps.exact,
          path: x.routeData.childProps.path || x.routeData.childProps.from,
          component: x.routeData.childProps.component
        };
        match = matchPath(location.pathname, matchProps)
        if (match) {
          view = x;
          viewStack = vs;
          return true;
        }
        return false;
      });
    })

    const result = { view, viewStack, match };
    return result;
  }

  findViewInfoById(id: string) {
    let view: ViewItem<IonRouteData> | undefined;
    let viewStack: ViewStack | undefined;
    const keys = Object.keys(this.viewStacks);
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
}

