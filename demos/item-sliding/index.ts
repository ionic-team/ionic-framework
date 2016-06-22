import { Component } from '@angular/core';

import { ionicBootstrap, ItemSliding, NavController, Toast } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  chats: any[];
  logins: any[];

  constructor(private nav: NavController) {
    this.chats = [
    {
      img: './avatar-cher.png',
      name: 'Cher',
      message: 'Ugh. As if.',
      time: '9:38 pm'
    }, {
      img: './avatar-dionne.png',
      name: 'Dionne',
      message: 'Mr. Hall was way harsh.',
      time: '8:59 pm'
    }, {
      img: './avatar-murray.png',
      name: 'Murray',
      message: 'Excuse me, "Ms. Dione."',
      time: 'Wed'
    }];

    this.logins = [
    {
        icon: 'logo-twitter',
        name: 'Twitter',
        username: 'admin',
    }, {
        icon: 'logo-github',
        name: 'GitHub',
        username: 'admin37',
    }, {
        icon: 'logo-instagram',
        name: 'Instagram',
        username: 'imanadmin',
    }, {
        icon: 'logo-codepen',
        name: 'Codepen',
        username: 'administrator',
    }];
  }

  more(item: ItemSliding) {
    console.log('More');
    item.close();
  }

  delete(item: ItemSliding) {
    console.log('Delete');
    item.close();
  }

  mute(item: ItemSliding) {
    console.log('Mute');
    item.close();
  }

  archive(item: ItemSliding) {
    console.log('Archive');
    item.close();
  }

  download(item: ItemSliding) {
    item.setClass('downloading', true);
    setTimeout(() => {
      const toast = Toast.create({
        message: 'Item was downloaded!'
      });
      this.nav.present(toast);
      item.setClass('downloading', false);
      item.close();

      // Wait 2s to close toast
      setTimeout(() => toast.dismiss(), 2000);
    }, 1500);
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
