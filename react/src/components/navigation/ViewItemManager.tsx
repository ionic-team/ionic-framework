import React from 'react';
import { IonLifeCycleContext } from '../../lifecycle';
import { DefaultIonLifeCycleContext } from '../../lifecycle/IonLifeCycleContext';
import { NavContext } from './routing/NavContext';

interface StackItemManagerProps {
  id: string;
  mount: boolean;
}

interface StackItemManagerState {
  show: boolean;
}

export class ViewItemManager extends React.Component<StackItemManagerProps, StackItemManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();
  _isMounted = false;
  context!: React.ContextType<typeof NavContext>;

  constructor(props: StackItemManagerProps) {
    super(props)
    this.state = {
      show: true
    };

    this.ionLifeCycleContext.onComponentCanBeDestroyed(() => {
      if (!this.props.mount) {
        if (this._isMounted) {
          this.setState({
            show: false
          }, () => {
            this.context.hideView(this.props.id);
          });
        }
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { show } = this.state;
    return (
      <IonLifeCycleContext.Provider value={this.ionLifeCycleContext}>
        {show && this.props.children}
      </IonLifeCycleContext.Provider>
    )
  }
}
// TODO: treeshake
ViewItemManager.contextType = NavContext;
