import React from 'react';
import { withRouter, RouteComponentProps, matchPath, RouteProps, match, Switch } from 'react-router';
import { generateUniqueId } from '../utils';
import { IonRouterOutletInner } from '../proxies';
import { View } from '../View';
import { NavContext } from './NavContext';
import { ViewItemManager } from './ViewItemManager';
import { ViewItem } from './ViewItem';

type ChildProps = RouteProps & {
  computedMatch: match<any>
}

type IonRouterOutletProps = RouteComponentProps & {
  id?: string;
  children?: React.ReactElement<ChildProps>[] | React.ReactElement<ChildProps>;
};

type IonRouterOutletState = {}

class IonRouterOutletUnWrapped extends React.Component<IonRouterOutletProps, IonRouterOutletState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof NavContext>;
  id: string;

  constructor(props: IonRouterOutletProps) {
    super(props);
    this.id = this.props.id || generateUniqueId();
  }

  componentDidMount() {
    const views: ViewItem[] = [];
    let activeId: string;
    React.Children.forEach(this.props.children, (child: React.ReactElement<ChildProps>) => {
      if (child.type === Switch) {
        /**
         * If the first child is a Switch, loop through its children to build the viewStack
         */
        React.Children.forEach(child.props.children, (grandChild: React.ReactElement<ChildProps>) => {
          addView.call(this, grandChild);
        });
      } else {
        addView.call(this, child);
      }
    });
    this.context.registerViewStack(this.id, activeId, views, this.containerEl.current, this.props.location);

    function addView(child: React.ReactElement<any>) {
      const location = this.props.history.location;
      const viewId = generateUniqueId();
      const key = generateUniqueId();
      const element = child;
      const match: ViewItem['match'] = matchPath(location.pathname, child.props);
      const view: ViewItem = {
        id: viewId,
        key,
        match,
        element,
        mount: true,
        show: !!match,
        ref: React.createRef(),
        childProps: child.props
      };
      if (!!match) {
        activeId = viewId;
      };
      views.push(view);
      return activeId;
    }
  }

  componentWillUnmount() {
    this.context.removeViewStack(this.id);
  }

  renderChild(item: ViewItem) {
    const component = React.cloneElement(item.element, {
      computedMatch: item.match
    });
    return component;
  }

  render() {
    return (
      <NavContext.Consumer>
        {context => {
          this.context = context;
          const viewStack = context.viewStacks[this.id];
          const activeId = viewStack ? viewStack.activeId : '';
          const views = (viewStack || { views: [] }).views.filter(x => x.show);
          return (
            <IonRouterOutletInner data-id={this.id} ref={this.containerEl}>
              {views.map((item) => {
                let props: any = {};
                if (item.id === activeId) {
                  props = {
                    'className': ' ion-page-invisible'
                  };
                } else {
                  props = {
                    'aria-hidden': true,
                    'className': 'ion-page-hidden'
                  };
                }

                return (
                  <ViewItemManager
                    id={item.id}
                    key={item.key}
                    mount={item.mount}
                  >
                    <View
                      ref={item.ref}
                      {...props}
                    >
                      {this.renderChild(item)}
                    </View>
                  </ViewItemManager>
                );
              })}
            </IonRouterOutletInner>
          );
        }}
      </NavContext.Consumer>
    );
  }
}

export const IonRouterOutlet = /*@__PURE__*/withRouter(IonRouterOutletUnWrapped);
