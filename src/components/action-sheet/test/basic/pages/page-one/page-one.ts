import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, ModalController, Platform } from '../../../../../..';

import { ModalPage } from '../modal-page/modal-page';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  result: string = '';

  constructor(public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public modalCtrl: ModalController, public plt: Platform) {}

  presentBasic() {
    this.result = '';

    this.actionSheetCtrl.create()
      .setTitle('Albums')
      .addButton({
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.result = 'Deleted';
        }
      })
      .addButton({
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
          this.result = 'Shared';
        }
      })
      .addButton({
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          this.result = 'Play (open modal)';
          let modal = this.modalCtrl.create(ModalPage);
          modal.present();

          // returning false does not allow the actionsheet to be closed
          return false;
        }
      })
      .addButton({
        text: 'Favorite',
        icon: !this.plt.is('ios') ? 'heart' : null,
        handler: () => {
          console.log('Favorite clicked');
          this.result = 'Favorited';
        }
      })
      .addButton({
        text: 'Cancel',
        role: 'cancel', // will always sort to be on the bottom
        icon: !this.plt.is('ios') ? 'close' : null,
        handler: () => {
          console.log('Cancel clicked');
          this.result = 'Canceled';
        }
      })
      .present();
  }

  presentNoBackdropDismiss() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
            this.result = 'Archived';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel this clicked');
            this.result = 'Canceled';
          }
        },
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.result = 'Destructive';
          }
        }
      ],
      cssClass: 'my-action-sheet another-action-sheet-class'
    });

    actionSheet.present(actionSheet);
  }

  presentAlert() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Open Alert',
          handler: () => {
            this.result = 'Opened alert';

            let alert = this.alertCtrl.create();
            alert.setTitle('Alert!');
            alert.setMessage('Alert opened from an action sheet');
            alert.addButton({
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.result = 'pressed Cancel button in alert from action sheet';
              }
            });
            alert.addButton({
              text: 'Okay',
              handler: () => {
                this.result = 'pressed Okay button in alert from action sheet';
              }
            });

            alert.present().then(() => {
              this.result = 'Alert from action sheet opened';
            });

            // do not close the action sheet yet
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.result = 'Canceled';
          }
        }
      ]
    });

    actionSheet.present();
  }

  presentScroll() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add Reaction',
          handler: () => {
            console.log('Add Reaction clicked');
          }
        }, {
          text: 'Copy Text',
          handler: () => {
            console.log('Copy Text clicked');
          }
        }, {
          text: 'Share Text',
          handler: () => {
            console.log('Share Text clicked');
          }
        }, {
          text: 'Copy Link to Message',
          handler: () => {
            console.log('Copy Link to Message clicked');
          }
        }, {
          text: 'Remind Me',
          handler: () => {
            console.log('Remind Me clicked');
          }
        }, {
          text: 'Pin File',
          handler: () => {
            console.log('Pin File clicked');
          }
        }, {
          text: 'Star File',
          handler: () => {
            console.log('Star File clicked');
          }
        }, {
          text: 'Mark Unread',
          handler: () => {
            console.log('Mark Unread clicked');
          }
        }, {
          text: 'Edit Title',
          handler: () => {
            console.log('Edit Title clicked');
          }
        }, {
          text: 'Save Image',
          handler: () => {
            console.log('Save Image clicked');
          }
        }, {
          text: 'Copy Image',
          handler: () => {
            console.log('Copy Image clicked');
          }
        }, {
          text: 'Delete File',
          role: 'destructive',
          handler: () => {
            console.log('Delete File clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  presentScrollNoCancel() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add Reaction',
          handler: () => {
            console.log('Add Reaction clicked');
          }
        }, {
          text: 'Copy Text',
          handler: () => {
            console.log('Copy Text clicked');
          }
        }, {
          text: 'Share Text',
          handler: () => {
            console.log('Share Text clicked');
          }
        }, {
          text: 'Copy Link to Message',
          handler: () => {
            console.log('Copy Link to Message clicked');
          }
        }, {
          text: 'Remind Me',
          handler: () => {
            console.log('Remind Me clicked');
          }
        }, {
          text: 'Pin File',
          handler: () => {
            console.log('Pin File clicked');
          }
        }, {
          text: 'Star File',
          handler: () => {
            console.log('Star File clicked');
          }
        }, {
          text: 'Mark Unread',
          handler: () => {
            console.log('Mark Unread clicked');
          }
        }, {
          text: 'Edit Title',
          handler: () => {
            console.log('Edit Title clicked');
          }
        }, {
          text: 'Save Image',
          handler: () => {
            console.log('Save Image clicked');
          }
        }, {
          text: 'Copy Image',
          handler: () => {
            console.log('Copy Image clicked');
          }
        }, {
          text: 'Delete File',
          role: 'destructive',
          handler: () => {
            console.log('Delete File clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  presentCancelOnly() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}
