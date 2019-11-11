```html
<template>
  <IonVuePage :title="'Alert'">
    <ion-button @click="presentAlert">Show Alert</ion-button>
    <ion-button @click="presentAlertMultipleButtons">Show Alert (multiple buttons)</ion-button>
    <ion-button @click="presentAlertConfirm">Show Alert (confirm)</ion-button>
    <ion-button @click="presentAlertPrompt">Show Alert (prompt)</ion-button>
    <ion-button @click="presentAlertRadio">Show Alert (radio)</ion-button>
    <ion-button @click="presentAlertCheckbox">Show Alert (checkbox)</ion-button>
  </IonVuePage>
</template>

<script>
export default {
  methods: {
    presentAlert() {
      return this.$ionic.alertController
        .create({
          header: 'Alert',
          subHeader: 'Subtitle',
          message: 'This is an alert message.',
          buttons: ['OK'],
        })
        .then(a => a.present())
    },

    presentAlertMultipleButtons() {
      return this.$ionic.alertController
        .create({
          header: 'Alert',
          subHeader: 'Subtitle',
          message: 'This is an alert message.',
          buttons: ['Cancel', 'Open Modal', 'Delete'],
        })
        .then(a => a.present())
    },

    presentAlertConfirm() {
      return this.$ionic.alertController
        .create({
          header: 'Confirm!',
          message: 'Message <strong>text</strong>!!!',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                console.log('Confirm Cancel:', blah)
              },
            },
            {
              text: 'Okay',
              handler: () => {
                console.log('Confirm Okay')
              },
            },
          ],
        })
        .then(a => a.present())
    },

    presentAlertPrompt() {
      return this.$ionic.alertController
        .create({
          header: 'Prompt!',
          inputs: [
            {
              placeholder: 'Placeholder 1',
            },
            {
              name: 'name2',
              id: 'name2-id',
              value: 'hello',
              placeholder: 'Placeholder 2',
            },
            {
              name: 'name3',
              value: 'http://ionicframework.com',
              type: 'url',
              placeholder: 'Favorite site ever',
            },
            // input date with min & max
            {
              name: 'name4',
              type: 'date',
              min: '2017-03-01',
              max: '2018-01-12',
            },
            // input date without min nor max
            {
              name: 'name5',
              type: 'date',
            },
            {
              name: 'name6',
              type: 'number',
              min: -5,
              max: 10,
            },
            {
              name: 'name7',
              type: 'number',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel')
              },
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok')
              },
            },
          ],
        })
        .then(a => a.present())
    },

    presentAlertRadio() {
      return this.$ionic.alertController
        .create({
          header: 'Radio',
          inputs: [
            {
              type: 'radio',
              label: 'Radio 1',
              value: 'value1',
              checked: true,
            },
            {
              type: 'radio',
              label: 'Radio 2',
              value: 'value2',
            },
            {
              type: 'radio',
              label: 'Radio 3',
              value: 'value3',
            },
            {
              type: 'radio',
              label: 'Radio 4',
              value: 'value4',
            },
            {
              type: 'radio',
              label: 'Radio 5',
              value: 'value5',
            },
            {
              type: 'radio',
              label: 'Radio 6',
              value: 'value6',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel')
              },
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok')
              },
            },
          ],
        })
        .then(a => a.present())
    },

    presentAlertCheckbox() {
      return this.$ionic.alertController
        .create({
          header: 'Checkbox',
          inputs: [
            {
              type: 'checkbox',
              label: 'Checkbox 1',
              value: 'value1',
              checked: true,
            },

            {
              type: 'checkbox',
              label: 'Checkbox 2',
              value: 'value2',
            },

            {
              type: 'checkbox',
              label: 'Checkbox 3',
              value: 'value3',
            },

            {
              type: 'checkbox',
              label: 'Checkbox 4',
              value: 'value4',
            },

            {
              type: 'checkbox',
              label: 'Checkbox 5',
              value: 'value5',
            },

            {
              type: 'checkbox',
              label: 'Checkbox 6',
              value: 'value6',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel')
              },
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok')
              },
            },
          ],
        })
        .then(a => a.present())
    },
  },
}
</script>
```
