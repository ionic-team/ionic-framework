import React from 'react';

import { NavContext } from '../contexts/NavContext';

interface IonRouteProps {
  path: string;
  exact?: boolean;
}

interface IonRouteState {

}

export class IonRoute extends React.PureComponent<IonRouteProps, IonRouteState> {

  context!: React.ContextType<typeof NavContext>;

  render() {
    const { path } = this.props;
    return (
      this.context.routeInfo && matchIonRoute(path, this.context.routeInfo.pathname) ?
        this.props.children :
        null
    );
  }

  static get contextType() {
    return NavContext;
  }

}

export function matchIonRoute(path: string, currentPath: string, exact?: boolean) {
  if (exact) {
    return path.toLowerCase() === currentPath.toLowerCase();
  } else {
    return currentPath.startsWith(path);
  }
}
