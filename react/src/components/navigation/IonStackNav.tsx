import React, { Component } from 'react';
import { withRouter, RouteComponentProps, matchPath, match } from 'react-router';

interface NavView {
  name: string;
  title: string;
  path: string;
  component: new() => React.Component<any>;
}

type Props = RouteComponentProps & {
  navViews: NavView[];
  basePath: string;
}

interface State {
  stack: React.Component<any>[];
}

class IonStackNav extends Component<Props, State> {
  state: State = {
    stack: []
  }

  getMatch(path: string) {
    return matchPath<{ tabName: string }>(this.props.location.pathname, {
      path: `${this.props.match.url}${this.props.basePath}${path}`,
      exact: true
    });
  }

  render() {
    let matched: match<{ tabName: string }> | null = null;
    const Page = (this.props.navViews.find(view => {
      matched = this.getMatch(view.path);
      return matched !== null;
    }) || this.props.navViews[0]).component;


    return (
      <div className="ion-page">
        <Page
          match={matched}
          history={history}>
        </Page>
      </div>
    );
  }
}

export default withRouter(IonStackNav);
