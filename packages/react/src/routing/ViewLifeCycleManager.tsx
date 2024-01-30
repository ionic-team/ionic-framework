import React from 'react';

import { DefaultIonLifeCycleContext, IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

interface ViewTransitionManagerProps {
  removeView: () => void;
  mount: boolean;
  // TODO: Refactor type with PropsWithChildren when moving to React v18
  children?: React.ReactNode;
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
