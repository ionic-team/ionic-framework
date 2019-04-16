```tsx
import React, { Component } from 'react'
import { IonToast } from '@ionic/react';

type Props = {}
type State = {
  showToast1: boolean
  showToast2: boolean
}

export class Toast extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showToast1: false
      showToast2: false
    };
  }

  render() {
    return (
      <IonToast
        isOpen={this.state.showToast1}
        onDidDismiss={() => this.setState(() => ({ showToast1: false }))}
        message='Your settings have been saved.'
        duration={200}
      >
      </IonToast>

      <IonToast
        isOpen={this.state.showToast2}
        onDidDismiss={() => this.setState(() => ({ showToast2: false }))}
        message='Click to Close'
        position='top'
        buttons={[{
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]}
      >
      </IonToast>
    );
  }
}

```
