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
  componentCanBeDestroyedCallback: Function;

  onIonViewWillEnter(callback: Function) {
    this.ionViewWillEnterCallback = callback;
  }

  ionViewWillEnter() {
    if (this.ionViewWillEnterCallback) {
      this.ionViewWillEnterCallback();
    }
  }

  onIonViewDidEnter(callback: Function) {
    this.ionViewDidEnterCallback = callback;
  }

  ionViewDidEnter() {
    if (this.ionViewDidEnterCallback) {
      this.ionViewDidEnterCallback();
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
    this.componentCanBeDestroyed();
  }

  onComponentCanBeDestroyed(callback: Function) {
    this.componentCanBeDestroyedCallback = callback;
  }

  componentCanBeDestroyed() {
    if (this.componentCanBeDestroyedCallback) {
      this.componentCanBeDestroyedCallback();
    }
  }
}
