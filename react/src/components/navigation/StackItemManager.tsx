import * as React from 'react';
import { IonLifeCycleContext } from '../../lifecycle';
import { DefaultIonLifeCycleContext } from '../../lifecycle/IonLifeCycleContext';

interface StackItemManagerProps {
  mount: boolean;
}

interface StackItemManagerState {
  show: boolean;
}

export default class StackItemManager extends React.Component<StackItemManagerProps, StackItemManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();

  constructor(props: StackItemManagerProps) {
    super(props)
    this.state = {
      show: true
    };

    this.ionLifeCycleContext.onIonViewDidLeave(() => {
      if (!this.props.mount) {
        /**
         * Give child component 1 sec to finish calling its
         * own onViewDidLeave before destroying it
         */
        setTimeout(() => {
          this.setState({
            show: false
          });
        }, 1000);

      }
    });
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
StackItemManager.contextType = IonLifeCycleContext;
