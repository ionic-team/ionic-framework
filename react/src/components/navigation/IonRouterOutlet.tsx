import React, { Component } from 'react';
import { withRouter, RouteComponentProps, matchPath, match, RouteProps } from 'react-router';


type Props = RouteComponentProps & {
  children?: React.ReactElement<RouteProps>[] | React.ReactElement<RouteProps>;
};

interface StackItem {
  pathname?: string;
  element: React.ReactNode;
}

interface State {
  stack: StackItem[];
}

class IonRouterOutlet extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      stack: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const location = props.location.pathname
    let match: match<{ tabName: string }> | null = null;
    let element:  React.ReactElement<RouteProps>;

    const currentActiveNavView = state.stack[state.stack.length - 1];
    if (currentActiveNavView && currentActiveNavView.pathname === location) {
      return null;
    }

    React.Children.forEach(props.children, (child: React.ReactElement<RouteProps>) => {
      if (match == null) {
        element = child;

        const path = child.props ? child.props.path : null;
        match = matchPath(location, { ...child.props, path })
      }
    });

    if (!element) {
      return null;
    }

    const component = React.cloneElement(element, {
    });

    return {
      ...state,
      stack: state.stack.concat({
        pathname: location,
        element: component
      })
    };
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <>
        {this.state.stack.map((item) => {
          return item.element;
        })}
      </>
    );
  }
}

export default withRouter(IonRouterOutlet);
