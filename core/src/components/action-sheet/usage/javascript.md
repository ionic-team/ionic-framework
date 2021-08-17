```javascript
async function presentActionSheet() {
  const actionSheet = document.createElement('ion-action-sheet');

  actionSheet.header = 'Albums';
  actionSheet.cssClass = 'my-custom-class';
  actionSheet.buttons = [{
    text: 'Delete',
    role: 'destructive',
    icon: 'trash',
    id: 'delete-button',
    data: {
      type: 'delete'
    },
    handler: () => {
      console.log('Delete clicked');
    }
  }, {
    text: 'Share',
    icon: 'share',
    data: 10,
    handler: () => {
      console.log('Share clicked');
    }
  }, {
    text: 'Play (open modal)',
    icon: 'caret-forward-circle',
    data: 'Data value',
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
  }];
  document.body.appendChild(actionSheet);
  await actionSheet.present();

  const { role, data } = await actionSheet.onDidDismiss();
  console.log('onDidDismiss resolved with role and data', role, data);
}
```
