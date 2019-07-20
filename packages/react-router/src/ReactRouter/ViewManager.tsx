import React from 'react';
import { generateUniqueId } from '../utils';
import { View } from '@ionic/react-core';
import { ViewItemManager } from './ViewItemManager';
import { RouteManagerContext } from './RouteManagerContext';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-router-outlet': any;
    }
  }
}

type ViewManagerProps = {
  id?: string;
};

type ViewManagerState = {}

export class ViewManager extends React.Component<ViewManagerProps, ViewManagerState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof RouteManagerContext>;
  id: string;

  constructor(props: ViewManagerProps) {
    super(props);
    this.id = this.props.id || generateUniqueId();
  }

  componentDidMount() {
    this.context.setupIonRouter(this.id, this.props.children, this.containerEl.current);
  }

  componentWillUnmount() {
    this.context.removeViewStack(this.id);
  }

  render() {
    const context = this.context;
    const viewStack = context.viewStacks[this.id];
    const activeId = viewStack ? viewStack.activeId : '';
    const views = (viewStack || { views: [] }).views.filter(x => x.show);
    return (
      <ion-router-outlet data-id={this.id} ref={this.containerEl}>
        {views.map((item) => {
          let props: any = {};
          if (item.id === activeId) {
            props = {
              'className': ' ion-page-invisible'
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
                {this.context.renderChild(item)}
              </View>
            </ViewItemManager>
          );
        })}
      </ion-router-outlet>
    );
  }
}
ViewManager.contextType = RouteManagerContext;
