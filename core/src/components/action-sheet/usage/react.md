```typescript
import React, { Component } from 'react'
import { IonActionSheet } from '@ionic/react';

type Props = {}
type State = {
  showActionSheet: boolean
}

export default class ActionSheetExample extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showActionSheet: false
    };
  }

  render() {
    return (
      <IonActionSheet
        isOpen={this.state.showActionSheet}
        onDidDismiss={() => this.setState(() => ({ showActionSheet: false }))}
        buttons={[{
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Play (open modal)',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]}
      >
      </IonActionSheet>
    );
  }
}
```
