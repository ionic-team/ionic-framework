import React from 'react';
import { generateUniqueId } from '../utils';
import { View } from './View';
import { ViewItemManager } from './ViewItemManager';
import { RouteManagerContext } from './RouteManagerContext';
import { ViewItem } from './ViewItem';

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
    this.context.setupIonRouter(this.id, this.props.children, this.containerEl.current!);
  }

  componentWillUnmount() {
    this.context.removeViewStack(this.id);
  }

  renderChild(item: ViewItem) {
    const component = React.cloneElement(item.element, {
      computedMatch: item.routeData.match
    });
    return component;
  }

  render() {
    const context = this.context;
    const viewStack = context.viewStacks[this.id];
    const activeId = viewStack ? viewStack.activeId : '';
    const views = (viewStack || { views: [] }).views.filter(x => x.show);
    const ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;

    const childElements = views.map((view) => {
      let props: any = {};
      if (view.id === activeId) {
        props = {
          'className': 'ion-page-invisible'
        };
      }
      return (
        <ViewItemManager
          id={view.id}
          key={view.key}
          mount={view.mount}
        >
          <View
            ref={view.ref}
            {...props}
          >
            {this.renderChild(view)}
          </View>
        </ViewItemManager>
      );
    });

    return (
      React.cloneElement(ionRouterOutlet, {
        ref: this.containerEl,
        "data-view-id": this.id
      }, childElements)
    );


    // return (
    //   <ion-router-outlet data-id={this.id} ref={this.containerEl}>
    //     {views.map((view) => {
    //       let props: any = {};
    //       if (view.id === activeId) {
    //         props = {
    //           'className': ' ion-page-invisible'
    //         };
    //       }
    //       return (
    //         <ViewItemManager
    //           id={view.id}
    //           key={view.key}
    //           mount={view.mount}
    //         >
    //           <View
    //             ref={view.ref}
    //             {...props}
    //           >
    //             {this.renderChild(view)}
    //           </View>
    //         </ViewItemManager>
    //       );
    //     })}
    //   </ion-router-outlet>
    // );
  }

  static get contextType() {
    return RouteManagerContext;
  }
}
