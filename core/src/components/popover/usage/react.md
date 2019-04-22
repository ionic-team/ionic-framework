```tsx
import React, { Component } from 'react'
import { IonPopover } from '@ionic/react';

type Props = {}
type State = {
  showPopover: boolean
}

export class PopoverExample extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showPopover: false
    };
  }

  render() {
    return (
      <IonPopover
        isOpen={this.state.showPopover}
        onDidDismiss={() => this.setState(() => ({ showPopover: false }))}
      >
        <p>This is popover content</p>
      </IonPopover>
    );
  }
}
```
