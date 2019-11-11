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

type LifeCycleCallback = () => void;

export const DefaultIonLifeCycleContext = class implements IonLifeCycleContextInterface {

  ionViewWillEnterCallbacks: LifeCycleCallback[] = [];
  ionViewDidEnterCallbacks: LifeCycleCallback[] = [];
  ionViewWillLeaveCallbacks: LifeCycleCallback[] = [];
  ionViewDidLeaveCallbacks: LifeCycleCallback[] = [];
  componentCanBeDestroyedCallback?: () => void;

  onIonViewWillEnter(callback: LifeCycleCallback) {
    this.ionViewWillEnterCallbacks.push(callback);
  }

  ionViewWillEnter() {
    this.ionViewWillEnterCallbacks.forEach(cb => cb());
  }

  onIonViewDidEnter(callback: LifeCycleCallback) {
    this.ionViewDidEnterCallbacks.push(callback);
  }

  ionViewDidEnter() {
    this.ionViewDidEnterCallbacks.forEach(cb => cb());
  }

  onIonViewWillLeave(callback: LifeCycleCallback) {
    this.ionViewWillLeaveCallbacks.push(callback);
  }

  ionViewWillLeave() {
    this.ionViewWillLeaveCallbacks.forEach(cb => cb());
  }

  onIonViewDidLeave(callback: LifeCycleCallback) {
    this.ionViewDidLeaveCallbacks.push(callback);
  }

  ionViewDidLeave() {
    this.ionViewDidLeaveCallbacks.forEach(cb => cb());
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
