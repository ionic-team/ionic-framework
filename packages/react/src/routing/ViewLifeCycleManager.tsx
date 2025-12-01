import React from 'react';

import { DefaultIonLifeCycleContext, IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

interface ViewTransitionManagerProps {
  removeView: () => void;
  mount: boolean;
}

interface ViewTransitionManagerState {
  show: boolean;
}

export class ViewLifeCycleManager extends React.Component<ViewTransitionManagerProps, ViewTransitionManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();
  private _isMounted = false;

  constructor(props: ViewTransitionManagerProps) {
    super(props);

    this.ionLifeCycleContext.onComponentCanBeDestroyed(() => {
      if (!this.props.mount) {
        if (this._isMounted) {
          this.setState(
            {
              show: false,
            },
            () => this.props.removeView()
          );
        }
      }
    });

    this.state = {
      show: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate(_prevProps: ViewTransitionManagerProps) {
    // View lifecycle is managed through ionViewDidLeave events.
    // Components with IonPage will receive these events and be destroyed accordingly.
    // The StackManager handles cleanup of views that no longer match routes.
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
    );
  }
}
