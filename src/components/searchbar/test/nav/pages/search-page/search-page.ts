import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'search-page.html'
})
export class SearchPage {
  items: string[];
  value = '';

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.initializeItems();
  }

  showDetail(item: any) {
    this.navCtrl.push('DetailPage', {city: item});
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

  getItems(q: string) {
    // Reset items back to all of the items
    this.initializeItems();

    // if the value is an empty string don't filter the items
    if (!q || q.trim() === '') {
      return;
    }

    this.items = this.items.filter((v) => v.toLowerCase().indexOf(q.toLowerCase()) > -1);
  }

  openModal() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }
}
