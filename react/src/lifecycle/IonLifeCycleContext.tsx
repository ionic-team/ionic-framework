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
  onIonViewWillEnter: () => { },
  ionViewWillEnter: () => { },
  onIonViewDidEnter: () => { },
  ionViewDidEnter: () => { },
  onIonViewWillLeave: () => { },
  ionViewWillLeave: () => { },
  onIonViewDidLeave: () => { },
  ionViewDidLeave: () => { }
});

export class DefaultIonLifeCycleContext implements IonLifeCycleContextInterface {

  ionViewWillEnterCallbacks: Function[] = [];
  ionViewDidEnterCallbacks: Function[] = [];
  ionViewWillLeaveCallbacks: Function[] = [];
  ionViewDidLeaveCallbacks: Function[] = [];


  onIonViewWillEnter(callback: Function) {
    this.ionViewWillEnterCallbacks.push(callback);
  }

  ionViewWillEnter() {
    this.ionViewWillEnterCallbacks.forEach(x => x());
  }

  onIonViewDidEnter(callback: Function) {
    this.ionViewDidEnterCallbacks.push(callback);
  }

  ionViewDidEnter() {
    this.ionViewDidEnterCallbacks.forEach(x => x());
  }

  onIonViewWillLeave(callback: Function) {
    this.ionViewWillLeaveCallbacks.push(callback);
  }

  ionViewWillLeave() {
    this.ionViewWillLeaveCallbacks.forEach(x => x());
  }

  onIonViewDidLeave(callback: Function) {
    this.ionViewDidLeaveCallbacks.push(callback);
  }

  ionViewDidLeave() {
    this.ionViewDidLeaveCallbacks.forEach(x => x());
  }
}
