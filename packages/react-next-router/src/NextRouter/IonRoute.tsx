import { NavContext } from '@ionic/react';
import { pathToRegexp } from 'path-to-regexp';
import React from 'react';

interface IonRouteProps {
  path?: string;
  exact?: boolean;
  show?: boolean;
  render: () => JSX.Element;
}

interface IonRouteState {

}

export class IonRoute extends React.PureComponent<IonRouteProps, IonRouteState> {

  context!: React.ContextType<typeof NavContext>;

  render() {
    const { exact, path, show, render } = this.props;
    if (!this.context.routeInfo) {
      return null;
    }
    const match = show || typeof path === 'undefined' || matchIonRoute(path, this.context.routeInfo.pathname, exact);
    return (
      match ? render() : null
    );
  }

  static get contextType() {
    return NavContext;
  }

}

export function matchIonRoute(route: string, pathToMatch: string, exact?: boolean) {
  if (!route) { return; }
  const convertedRoute = convertRoute(route);
  const regexp = pathToRegexp(convertedRoute, [], {
    sensitive: false,
    end: !!exact
  });
  const match = regexp.exec(pathToMatch);
  return !!match;
}

function convertRoute(route: string) {
  const regex = /\[(\w+)\]/g;

  const newRoute = route.replace(regex, (_all, ...p) => {
    return `:${p[0]}`;
  });

  return newRoute;
}
