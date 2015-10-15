import {Component, Control, ControlGroup} from 'angular2/angular2';

import {IonicApp, App} from 'ionic/ionic';

import {Camera, Geolocation, Vibration, Battery, Device, Events} from 'ionic/ionic';

import {CameraPage} from 'pages/camera';
import {BatteryPage} from 'pages/battery';
import {ContactsPage} from 'pages/contacts';
import {DevicePage} from 'pages/device';
import {DeviceMotionPage} from 'pages/device-motion';
import {DeviceOrientationPage} from 'pages/device-orientation';
import {DialogsPage} from 'pages/dialogs';
import {GeolocationPage} from 'pages/geolocation';
import {StatusBarPage} from 'pages/statusbar';
import {VibrationPage} from 'pages/vibration';

@App({
  templateUrl: 'main.html'
})
class MyApp {
  constructor(app: IonicApp, events: Events) {
    this.app = app;

    console.log('Events', events);

    let handler = (user) => {
      console.log('User created', user);
      return {
        what: 'what'
      }
    }
    let handler2 = (user) => {
      console.log('2User created', user);
      return {
        things: 'yes'
      }
    }

    events.subscribe('user:created', handler);
    events.subscribe('user:created', handler2);

    setInterval(() => {
      var results = events.publish('user:created', {
        name: 'Max Lynch',
        id: 1
      })
      console.log('Got results', results);
    }, 2000);

    setTimeout(() => {
      events.unsubscribe('user:created');
      console.log(events.channels);
    }, 6000);

    this.firstPage = CameraPage;

    this.plugins = [
      {title: 'Camera', page: CameraPage},
      {title: 'Device', page: DevicePage},
      {title: 'Device Motion', page: DeviceMotionPage},
      {title: 'Device Orientation', page: DeviceOrientationPage},
      {title: 'Dialogs', page: DialogsPage},
      {title: 'Geolocation', page: GeolocationPage},
      {title: 'Contacts', page: ContactsPage},
      {title: 'Battery', page: BatteryPage},
      {title: 'StatusBar', page: StatusBarPage},
      {title: 'Vibration', page: VibrationPage},
    ]
  }

  openPage(menu, page) {
   menu.close();

   let nav = this.app.getComponent('myNav');
   nav.setRoot(page.page);
 }
}
