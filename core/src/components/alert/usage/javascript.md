```javascript
function presentAlert() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Alert';
  alert.subHeader = 'Subtitle';
  alert.message = 'This is an alert message.';
  alert.buttons = ['OK'];

  document.body.appendChild(alert);
  return alert.present();
}

function presentAlertMultipleButtons() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Alert';
  alert.subHeader = 'Subtitle';
  alert.message = 'This is an alert message.';
  alert.buttons = ['Cancel', 'Open Modal', 'Delete'];

  document.body.appendChild(alert);
  return alert.present();
}

function presentAlertConfirm() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Confirm!';
  alert.message = 'Message <strong>text</strong>!!!';
  alert.buttons = [
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
        console.log('Confirm Okay')
      }
    }
  ];

  document.body.appendChild(alert);
  return alert.present();
}

function presentAlertPrompt() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Prompt!';
  alert.inputs = [
    {
      placeholder: 'Placeholder 1'
    },
    {
      name: 'name2',
      id: 'name2-id',
      value: 'hello',
      placeholder: 'Placeholder 2'
    },
    // multiline input.
    {
      name: 'paragraph',
      id: 'paragraph',
      type: 'textarea',
      placeholder: 'Placeholder 3'
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
  ];
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel')
      }
    }, {
      text: 'Ok',
      handler: () => {
        console.log('Confirm Ok')
      }
    }
  ];

  document.body.appendChild(alert);
  return alert.present();
}

function presentAlertRadio() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Radio';
  alert.inputs = [
    {
      type: 'radio',
      label: 'Radio 1',
      value: 'value1',
      checked: true
    },
    {
      type: 'radio',
      label: 'Radio 2',
      value: 'value2'
    },
    {
      type: 'radio',
      label: 'Radio 3',
      value: 'value3'
    },
    {
      type: 'radio',
      label: 'Radio 4',
      value: 'value4'
    },
    {
      type: 'radio',
      label: 'Radio 5',
      value: 'value5'
    },
    {
      type: 'radio',
      label: 'Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 ',
      value: 'value6'
    }
  ];
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel')
      }
    }, {
      text: 'Ok',
      handler: () => {
        console.log('Confirm Ok')
      }
    }
  ];
  document.body.appendChild(alert);
  return alert.present();
}

function presentAlertCheckbox() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Checkbox';
  alert.inputs = [
    {
      type: 'checkbox',
      label: 'Checkbox 1',
      value: 'value1',
      checked: true
    },

    {
      type: 'checkbox',
      label: 'Checkbox 2',
      value: 'value2'
    },

    {
      type: 'checkbox',
      label: 'Checkbox 3',
      value: 'value3'
    },

    {
      type: 'checkbox',
      label: 'Checkbox 4',
      value: 'value4'
    },

    {
      type: 'checkbox',
      label: 'Checkbox 5',
      value: 'value5'
    },

    {
      type: 'checkbox',
      label: 'Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6',
      value: 'value6'
    }
  ];
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel')
      }
    }, {
      text: 'Ok',
      handler: () => {
        console.log('Confirm Ok')
      }
    }
  ];

  document.body.appendChild(alert);
  return alert.present();
}
```
