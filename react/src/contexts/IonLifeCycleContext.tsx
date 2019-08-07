import React from 'react';

export interface IonLifeCycleContextInterface {
  onIonViewWillEnter: (callback: () => void) => void;
  ionViewWillEnter: () => void;
  onIonViewDidEnter: (callback: () => void) => void;
  ionViewDidEnter: () => void;
  onIonViewWillLeave: (callback: () => void) => void;
  ionViewWillLeave: () => void;
  onIonViewDidLeave: (callback: () => void) => void;
  ionViewDidLeave: () => void;
}

export const IonLifeCycleContext = /*@__PURE__*/React.createContext<IonLifeCycleContextInterface>({
  onIonViewWillEnter: () => { return; },
  ionViewWillEnter: () => { return; },
  onIonViewDidEnter: () => { return; },
  ionViewDidEnter: () => { return; },
  onIonViewWillLeave: () => { return; },
  ionViewWillLeave: () => { return; },
  onIonViewDidLeave: () => { return; },
  ionViewDidLeave: () => { return; },
});

export const DefaultIonLifeCycleContext = class implements IonLifeCycleContextInterface {

  ionViewWillEnterCallback?: () => void;
  ionViewDidEnterCallback?: () => void;
  ionViewWillLeaveCallback?: () => void;
  ionViewDidLeaveCallback?: () => void;
  componentCanBeDestroyedCallback?: () => void;

  onIonViewWillEnter(callback: () => void) {
    this.ionViewWillEnterCallback = callback;
  }

  ionViewWillEnter() {
    if (this.ionViewWillEnterCallback) {
      this.ionViewWillEnterCallback();
    }
  }

  onIonViewDidEnter(callback: () => void) {
    this.ionViewDidEnterCallback = callback;
  }

  ionViewDidEnter() {
    if (this.ionViewDidEnterCallback) {
      this.ionViewDidEnterCallback();
    }
  }

  onIonViewWillLeave(callback: () => void) {
    this.ionViewWillLeaveCallback = callback;
  }

  ionViewWillLeave() {
    if (this.ionViewWillLeaveCallback) {
      this.ionViewWillLeaveCallback();
    }
  }

  onIonViewDidLeave(callback: () => void) {
    this.ionViewDidLeaveCallback = callback;
  }

  ionViewDidLeave() {
    if (this.ionViewDidLeaveCallback) {
      this.ionViewDidLeaveCallback();
    }
    this.componentCanBeDestroyed();
  }

  onComponentCanBeDestroyed(callback: () => void) {
    this.componentCanBeDestroyedCallback = callback;
  }

  componentCanBeDestroyed() {
    if (this.componentCanBeDestroyedCallback) {
      this.componentCanBeDestroyedCallback();
    }
  }
};
