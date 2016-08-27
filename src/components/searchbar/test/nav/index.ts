import { Component } from '@angular/core';
import { ionicBootstrap, NavController, NavParams } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class MainPage {
  constructor(public navCtrl: NavController) { }

  goToSecond() {
    this.navCtrl.push(SearchPage);
  }
}

@Component({
  templateUrl: 'search.html'
})
class SearchPage {
  items: string[];

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  showDetail(item: any) {
    this.navCtrl.push(DetailPage, {city: item});
  }

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'Buenos Aires',
      'Cairo',
      'Dhaka',
      'Edinburgh',
      'Geneva',
      'Genoa',
      'Glasglow',
      'Hanoi',
      'Hong Kong',
      'Islamabad',
      'Istanbul',
      'Jakarta',
      'Kiel',
      'Kyoto',
      'Le Havre',
      'Lebanon',
      'Lhasa',
      'Lima',
      'London',
      'Los Angeles',
      'Madrid',
      'Manila',
      'New York',
      'Olympia',
      'Oslo',
      'Panama City',
      'Peking',
      'Philadelphia',
      'San Francisco',
      'Seoul',
      'Taipeh',
      'Tel Aviv',
      'Tokio',
      'Uelzen',
      'Washington'
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = ev.target.value;

    // if the value is an empty string don't filter the items
    if (!q || q.trim() === '') {
      return;
    }

    this.items = this.items.filter((v) => {
      if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }
}

@Component({
  templateUrl: 'detail.html'
})
class DetailPage {
  city: string;

  constructor(private _navParams: NavParams) {
    this.city = _navParams.get('city');
  }
}

@Component({
  templateUrl: 'tabs.html'
})
class TabsPage {
  mainPage = MainPage;
  searchPage = SearchPage;
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = TabsPage;
}

ionicBootstrap(E2EApp);
