import * as React from 'react';

interface ViewManagerProps { }

interface ViewManagerState { }

export class ViewManager extends React.Component<ViewManagerProps, ViewManagerState> {

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      console.warn('As of @ionic/react RC2, ViewManager is no longer needed and can be removed. This component is now deprecated will be removed from @ionic/react final.')
    }
  }

  render() {
    return this.props.children;
  }
}
