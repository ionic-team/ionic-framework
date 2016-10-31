import { Component } from '@angular/core';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  appType = 'Paid';
  safari = 'Shared Links';
  weather = 'sunny';

  apps = {
    'Paid': [
      {
        name: 'Monopoly',
        price: '$0.99'
      },
      {
        name: 'Angry Birds',
        price: '$2.99'
      }
    ],
    'Free': [
      {
        name: 'Snapchat',
        price: 'GET'
      },
      {
        name: 'Instagram',
        price: 'OPEN'
      }
    ],
    'Top': [
      {
        name: 'Spotify',
        price: 'OPEN'
      },
      {
        name: 'Pandora',
        price: 'GET'
      }
    ]
  };

  items = {
    'Bookmarks': [
      {
        name: 'Favorites',
        icon: 'ios-star-outline'
      },
      {
        name: 'History',
        icon: 'ios-clock-outline'
      }
    ],
    'Reading List': [
      {
        name: 'Terms of Service',
        icon: 'create'
      },
      {
        name: 'User Guide',
        icon: 'book'
      }
    ],
    'Shared Links': [
      {
        name: 'Ionic Framework',
        icon: 'ionic'
      },
      {
        name: 'Learn Angular',
        icon: 'logo-angular'
      }
    ]
  };

  getItems(type) {
    return this.apps[type];
  }

  getSafariItems(type) {
    return this.items[type];
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
