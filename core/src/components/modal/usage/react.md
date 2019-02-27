```tsx
import React, { Component } from 'react'
import { IonModal } from '@ionic/react';

type Props = {}
type State = {
  showModal: boolean
}

export class ModalExample extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  render() {
    return (
      <IonModal
        isOpen={this.state.showModal}
        onDidDismiss={() => this.setState(() => ({ showModal: false }))}
      >
        <p>This is modal content</p>
        <IonButton onClick={() => this.setState(() => ({ showModal: false }))}>
          Close Modal
        </IonButton>
      </IonModal>
    );
  }
}

```
