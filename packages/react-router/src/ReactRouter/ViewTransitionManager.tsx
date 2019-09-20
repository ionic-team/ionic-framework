import React from 'react';
import { IonLifeCycleContext, DefaultIonLifeCycleContext } from '@ionic/react';
import { RouteManagerContext } from './RouteManagerContext';

interface ViewTransitionManagerProps {
  id: string;
  mount: boolean;
}

interface ViewTransitionManagerState {
  show: boolean;
}

/**
 * Manages the View's DOM lifetime by keeping it around long enough to complete page transitions before removing it.
 */
export class ViewTransitionManager extends React.Component<ViewTransitionManagerProps, ViewTransitionManagerState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();
  _isMounted = false;
  context!: React.ContextType<typeof RouteManagerContext>;

  constructor(props: ViewTransitionManagerProps) {
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

  static get contextType() {
    return RouteManagerContext;
  }
}
