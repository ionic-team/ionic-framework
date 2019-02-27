```tsx
import React, { Component } from 'react'
import { IonLoading } from '@ionic/react';

type Props = {}
type State = {
  showLoading1: boolean
  showLoading2: boolean
}

export class LoadingExample extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showLoading1: false
      showLoading2: false
    };
  }

  render() {
    return (
      <IonLoading
        isOpen={this.state.showLoading1}
        onDidDismiss={() => this.setState(() => ({ showLoading1: false }))}
        message={'Hellooo'}
        duration={200}
      >
      </IonLoading>

      <IonLoading
        isOpen={this.state.showLoading2}
        onDidDismiss={() => this.setState(() => ({ showLoading2: false }))}
        spinner={null}
        duration={5000}
        message='Please wait...'}
        translucent={true}
        cssClass='custom-class custom-loading'
      >
      </IonLoading>
    );
  }
}

```
