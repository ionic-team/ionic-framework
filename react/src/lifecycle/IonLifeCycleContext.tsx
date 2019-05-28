import React from 'react';

export interface IonLifeCycleContextInterface {
  onIonViewWillEnter: (callback?: Function) => void;
  ionViewWillEnter: () => void;
  onIonViewDidEnter: (callback?: Function) => void;
  ionViewDidEnter: () => void;
  onIonViewWillLeave: (callback?: Function) => void;
  ionViewWillLeave: () => void;
  onIonViewDidLeave: (callback?: Function) => void;
  ionViewDidLeave: () => void;
}

export const IonLifeCycleContext = React.createContext<IonLifeCycleContextInterface>({
  onIonViewWillEnter: () => {},
  ionViewWillEnter: () => {},
  onIonViewDidEnter: () => {},
  ionViewDidEnter: () => {},
  onIonViewWillLeave: () => {},
  ionViewWillLeave: () => {},
  onIonViewDidLeave: () => {},
  ionViewDidLeave: () => {}
});

export class DefaultIonLifeCycleContext implements IonLifeCycleContextInterface {

  ionViewWillEnterCallback: Function;
  ionViewDidEnterCallback: Function;
  ionViewWillLeaveCallback: Function;
  ionViewDidLeaveCallback: Function;

  queueIonViewWillEnter = false;
  queueIonViewDidEnter = false;

  onIonViewWillEnter(callback: Function) {
    this.ionViewWillEnterCallback = callback;
    if(this.queueIonViewWillEnter) {
      callback();
      this.queueIonViewWillEnter = false;
    }
  }

  ionViewWillEnter() {
    if (this.ionViewWillEnterCallback) {
      this.ionViewWillEnterCallback();
    } else {
      this.queueIonViewWillEnter = true;
    }
  }

  onIonViewDidEnter(callback: Function) {
    this.ionViewDidEnterCallback = callback;
    if(this.queueIonViewDidEnter) {
      callback();
      this.queueIonViewDidEnter = false;
    }
  }

  ionViewDidEnter() {
    if (this.ionViewDidEnterCallback) {
      this.ionViewDidEnterCallback();
    } else {
      this.queueIonViewDidEnter = true;
    }
  }

  onIonViewWillLeave(callback: Function) {
    this.ionViewWillLeaveCallback = callback;
  }

  ionViewWillLeave() {
    if (this.ionViewWillLeaveCallback) {
      this.ionViewWillLeaveCallback();
    }
  }

  onIonViewDidLeave(callback: Function) {
    this.ionViewDidLeaveCallback = callback;
  }

  ionViewDidLeave() {
    if (this.ionViewDidLeaveCallback) {
      this.ionViewDidLeaveCallback();
    }
  }
}
