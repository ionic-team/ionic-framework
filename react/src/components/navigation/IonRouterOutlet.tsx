import React from 'react';
import { withRouter, RouteComponentProps, matchPath, RouteProps, match } from 'react-router';
import { generateUniqueId } from '../utils';
import { IonRouterOutletInner } from '../proxies';
import { StackView } from '../StackView';
import { NavContext } from './NavContext';
import { StackItemManager } from './StackItemManager';
import { StackItem } from './StackItem';

type ChildProps = RouteProps & {
  computedMatch: match<any>
}

type IonRouterOutletProps = RouteComponentProps & {
  id?: string;
  children?: React.ReactElement<ChildProps>[] | React.ReactElement<ChildProps>;
};

type IonRouterOutletState = { }

class RouterOutlet extends React.Component<IonRouterOutletProps, IonRouterOutletState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof NavContext>;
  id: string;

  constructor(props: IonRouterOutletProps) {
    super(props);
    this.id = this.props.id || generateUniqueId();
  }

  componentDidMount() {
    const views: StackItem[] = [];
    let activeId: string;
    React.Children.forEach(this.props.children, (child: React.ReactElement<ChildProps>) => {
      const location = this.props.history.location;
      const viewId = generateUniqueId();
      const key = generateUniqueId();
      const element = child;
      const match: StackItem['match'] = matchPath(location.pathname, child.props);
      const view: StackItem = {
        id: viewId,
        key,
        // location,
        match,
        element,
        mount: true,
        show: !!match,
        ref: React.createRef(),
        childProps: child.props
      }
      if(!!match) {
        activeId = viewId
      };
      views.push(view);
    });
    this.context.registerViewStack(this.id, activeId, views, this.containerEl.current, this.props.location);
  }

  renderChild(item: StackItem) {
    const component = React.cloneElement(item.element, {
      // location: item.location,
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
          const views = (viewStack || {views: []}).views.filter(x => x.show);
          return (
            <IonRouterOutletInner ref={this.containerEl}>

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
                  <StackItemManager
                    id={item.id}
                    key={item.key}
                    mount={item.mount}
                  >
                    <StackView
                      ref={item.ref}
                      {...props}
                    >
                      {this.renderChild(item)}
                    </StackView>
                  </StackItemManager>
                );
              })}

            </IonRouterOutletInner>
          );
        }}
      </NavContext.Consumer>
    );
  }
}

export const IonRouterOutlet = /*@__PURE__*/withRouter(RouterOutlet);
