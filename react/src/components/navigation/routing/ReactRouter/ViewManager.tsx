import React from 'react';
import { generateUniqueId } from '../../../utils/utils';
import { View } from '../../../View';
import { NavContext } from '../NavContext';
import { ViewItemManager } from '../../ViewItemManager';
import { IonRouterOutlet } from '../../../proxies';

type ViewManagerProps = {
  id?: string;
};

type ViewManagerState = {}

export class ViewManager extends React.Component<ViewManagerProps, ViewManagerState> {
  containerEl: React.RefObject<HTMLIonRouterOutletElement> = React.createRef();
  context!: React.ContextType<typeof NavContext>;
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
      <IonRouterOutlet data-id={this.id} ref={this.containerEl}>
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
      </IonRouterOutlet>
    );
  }
}
ViewManager.contextType = NavContext;
