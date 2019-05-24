import React from 'react';

export interface LifeCycleContextInterface {
  stackItemRef: any;
  onIonViewWillEnter: (callback?: Function) => void;
  ionViewWillEnter: () => void;
  onIonViewDidEnter: (callback?: Function) => void;
  ionViewDidEnter: () => void;
  onIonViewWillLeave: (callback?: Function) => void;
  ionViewWillLeave: () => void;
  onIonViewDidLeave: (callback?: Function) => void;
  ionViewDidLeave: () => void;
}

export const LifeCycleContext = React.createContext<LifeCycleContextInterface>({
  stackItemRef: null,
  onIonViewWillEnter: () => {},
  ionViewWillEnter: () => {},
  onIonViewDidEnter: () => {},
  ionViewDidEnter: () => {},
  onIonViewWillLeave: () => {},
  ionViewWillLeave: () => {},
  onIonViewDidLeave: () => {},
  ionViewDidLeave: () => {}
});
