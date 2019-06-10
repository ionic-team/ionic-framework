import React from 'react';
import { IonLifeCycleContext } from './IonLifeCycleContext';

export const useIonViewWillEnter = (callback: Function) => {
  const value = React.useContext(IonLifeCycleContext);
  value.onIonViewWillEnter(callback);
}

export const useIonViewDidEnter = (callback: Function) => {
  const value = React.useContext(IonLifeCycleContext);
  value.onIonViewDidEnter(callback);
}

export const useIonViewWillLeave = (callback: Function) => {
  const value = React.useContext(IonLifeCycleContext);
  value.onIonViewWillLeave(callback);
}

export const useIonViewDidLeave = (callback: Function) => {
  const value = React.useContext(IonLifeCycleContext);
  value.onIonViewDidLeave(callback);
}
