import {IonicView} from 'ionic/ionic';

import {Contacts} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <icon menu></icon>
    </button>
    <ion-title>Contacts</ion-title>
  </ion-navbar>
  <ion-content padding>
    <h2>Contacts</h2>
    <div>
    </div>
  </ion-content>
  `
})
export class ContactsPage {

}
