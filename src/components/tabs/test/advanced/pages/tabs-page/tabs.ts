import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, Tab, Tabs } from '../../../../../..';

@IonicPage({
  name: 'tabs-page'
})
@Component({
  templateUrl: './tabs.html'
})
export class TabsPage {
  showTab: boolean = false;
  rootPage1 = 'tab1-page1';
  rootPage2 = 'tab2-page1';
  rootPage3 = 'tab3-page1';

  @ViewChild(Tabs) tabs: Tabs;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public params: NavParams,
    public alertCtrl: AlertController
  ) { }

  ngAfterViewInit() {
    this.tabs.ionChange.subscribe((tab: Tab) => {
      console.log('tabs.ionChange.subscribe', tab.index);
    });
  }

  onTabChange(tab: Tab) {
    this.showTab = tab.index !== 1;

    // wired up through the template
    // <ion-tabs (ionChange)="onTabChange()">
    console.log('onTabChange');
  }

  logout() {
    this.navCtrl.pop();
  }

  ionViewCanLeave() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Log out',
        subTitle: 'Are you sure you want to log out?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              reject();
            }
          },
          {
            text: 'Yes',
            handler: () => {
              alert.dismiss().then(() => {
                resolve();
              });
              return false;
            }
          }
        ]
      });
      alert.present();
    });
  }

  chat() {
    console.log('Chat clicked!');
    this.modalCtrl.create('modal-chat-page').present();
  }

  ionViewWillEnter() {
    console.log('TabsPage, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('TabsPage, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('TabsPage, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('TabsPage, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('TabsPage, ionViewWillUnload');
  }
}
