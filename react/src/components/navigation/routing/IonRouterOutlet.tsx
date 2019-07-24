import React from 'react';
import { generateUniqueId } from '../../utils/utils';
import { IonRouterOutletInner } from '../../inner-proxies';
import { View } from '../../View';
import { NavContext } from './NavContext';
import { ViewItemManager } from '../ViewItemManager';

type IonRouterOutletProps = {
  id?: string;
};

type IonRouterOutletState = {}

export class IonRouterOutlet extends React.Component<IonRouterOutletProps, IonRouterOutletState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof NavContext>;
  id: string;

  constructor(props: IonRouterOutletProps) {
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
            </IonRouterOutletInner>
          );
        }}
      </NavContext.Consumer>
    );
  }
}
