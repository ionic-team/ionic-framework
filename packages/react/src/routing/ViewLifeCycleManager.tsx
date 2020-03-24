
import React from 'react';

import { DefaultIonLifeCycleContext, IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

interface ViewTransitionManagerProps { }

interface ViewTransitionManagerState { }

export class ViewLifeCycleManager extends React.Component<ViewTransitionManagerProps, ViewTransitionManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();

  constructor(props: ViewTransitionManagerProps) {
    super(props);
  }

  render() {
    return (
      <IonLifeCycleContext.Provider value={this.ionLifeCycleContext}>
        {this.props.children}
      </IonLifeCycleContext.Provider>
    );
  }
}
