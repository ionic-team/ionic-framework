```html
<template>
  <IonVuePage :title="'Action Sheet'">
    <ion-button @click="presentActionSheet">Show Action Sheet</ion-button>
  </IonVuePage>
</template>

<script>
export default {
  methods: {
    presentActionSheet() {
      return this.$ionic.actionSheetController
        .create({
          header: 'Albums',
          cssClass: 'my-custom-class',
          buttons: [
            {
              text: 'Delete',
              role: 'destructive',
              icon: 'trash',
              handler: () => {
                console.log('Delete clicked')
              },
            },
            {
              text: 'Share',
              icon: 'share',
              handler: () => {
                console.log('Share clicked')
              },
            },
            {
              text: 'Play (open modal)',
              icon: 'caret-forward-circle',
              handler: () => {
                console.log('Play clicked')
              },
            },
            {
              text: 'Favorite',
              icon: 'heart',
              handler: () => {
                console.log('Favorite clicked')
              },
            },
            {
              text: 'Cancel',
              icon: 'close',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
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
