```tsx
import React, { Component } from 'react'
import { IonAlert } from '@ionic/react';

type Props = {}
type State = {
  showAlert1: boolean
  showAlert2: boolean
  showAlert3: boolean
  showAlert4: boolean
  showAlert5: boolean
  showAlert6: boolean
}

export default class AlertExample extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showAlert1: false
      showAlert2: false
      showAlert3: false
      showAlert4: false
      showAlert5: false
      showAlert6: false
    };
  }

  render() {
    return (
      <IonAlert
        isOpen={this.state.showAlert1}
        onDidDismiss={() => this.setState(() => ({ showAlert1: false }))}
        header={'Alert'}
        subHeader={'Subtitle'}
        message={'This is an alert message.'}
        buttons={['OK']}
      >
      </IonAlert>


      <IonAlert
        isOpen={this.state.showAlert2}
        onDidDismiss={() => this.setState(() => ({ showAlert2: false }))}
        header={'Alert'}
        subHeader={'Subtitle'}
        message={'This is an alert message.'}
        buttons={['Cancel', 'Open Modal', 'Delete']}
      >
      </IonAlert>


      <IonAlert
        isOpen={this.state.showAlert3}
        onDidDismiss={() => this.setState(() => ({ showAlert3: false }))}
        header={'Confirm!'}
        message={'Message <strong>text</strong>!!!'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]}
      >
      </IonAlert>


      <IonAlert
        isOpen={this.state.showAlert4}
        onDidDismiss={() => this.setState(() => ({ showAlert4: false }))}
        header={'Prompt!'}
        inputs={[
          {
            name: 'name1',
            type: 'text',
            placeholder: 'Placeholder 1'
          },
          {
            name: 'name2',
            type: 'text',
            id: 'name2-id',
            value: 'hello',
            placeholder: 'Placeholder 2'
          },
          {
            name: 'name3',
            value: 'http://ionicframework.com',
            type: 'url',
            placeholder: 'Favorite site ever'
          },
          // input date with min & max
          {
            name: 'name4',
            type: 'date',
            min: '2017-03-01',
            max: '2018-01-12'
          },
          // input date without min nor max
          {
            name: 'name5',
            type: 'date'
          },
          {
            name: 'name6',
            type: 'number',
            min: -5,
            max: 10
          },
          {
            name: 'name7',
            type: 'number'
          }
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]}
      >
      </IonAlert>




      <IonAlert
        isOpen={this.state.showAlert5}
        onDidDismiss={() => this.setState(() => ({ showAlert5: false }))}
        header={'Radio'}
        inputs={[
          {
            name: 'radio1',
            type: 'radio',
            label: 'Radio 1',
            value: 'value1',
            checked: true
          },
          {
            name: 'radio2',
            type: 'radio',
            label: 'Radio 2',
            value: 'value2'
          },
          {
            name: 'radio3',
            type: 'radio',
            label: 'Radio 3',
            value: 'value3'
          },
          {
            name: 'radio4',
            type: 'radio',
            label: 'Radio 4',
            value: 'value4'
          },
          {
            name: 'radio5',
            type: 'radio',
            label: 'Radio 5',
            value: 'value5'
          },
          {
            name: 'radio6',
            type: 'radio',
            label: 'Radio 6',
            value: 'value6'
          }
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]}
      >
      </IonAlert>



      <IonAlert
        isOpen={this.state.showAlert6}
        onDidDismiss={() => this.setState(() => ({ showAlert6: false }))}
        header={'Checkbox'}
        inputs={[
          {
            name: 'checkbox1',
            type: 'checkbox',
            label: 'Checkbox 1',
            value: 'value1',
            checked: true
          },
          {
            name: 'checkbox2',
            type: 'checkbox',
            label: 'Checkbox 2',
            value: 'value2'
          },
          {
            name: 'checkbox3',
            type: 'checkbox',
            label: 'Checkbox 3',
            value: 'value3'
          },
          {
            name: 'checkbox4',
            type: 'checkbox',
            label: 'Checkbox 4',
            value: 'value4'
          },
          {
            name: 'checkbox5',
            type: 'checkbox',
            label: 'Checkbox 5',
            value: 'value5'
          },
          {
            name: 'checkbox6',
            type: 'checkbox',
            label: 'Checkbox 6',
            value: 'value6'
          }
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]}
      >
      </IonAlert>
    );
  }
}
```
