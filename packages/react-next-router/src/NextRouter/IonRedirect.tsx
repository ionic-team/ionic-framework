import { NavContext, StackContext } from '@ionic/react';
import React from 'react';

import { matchIonRoute } from './IonRoute';

interface IonRedirectProps {
  path?: string;
  exact?: boolean;
  to: string;
  routerOptions?: unknown;
}

interface IonRouteState {

}

export class IonRedirect extends React.PureComponent<IonRedirectProps, IonRouteState> {

  context!: React.ContextType<typeof NavContext>;
  stackContext!: React.ContextType<typeof StackContext>;

  componentDidMount() {
    const { exact, routerOptions, path, to } = this.props;
    if (this.context.routeInfo) {
      const match = typeof path === 'undefined' || matchIonRoute(path, this.context.routeInfo.pathname, exact);
      if (match) {
        if (this.stackContext && this.stackContext.removeView) {
          this.stackContext.removeView(path || this.context.routeInfo.pathname);
        }
        this.context.navigate(to, 'none', 'replace', routerOptions);
      }
    }
  }

  render() {
    return (
      <StackContext.Consumer>
        {context => {
          this.stackContext = context;
          return null;
        }}
      </StackContext.Consumer>
    );
  }

  static get contextType() {
    return NavContext;
  }

}
