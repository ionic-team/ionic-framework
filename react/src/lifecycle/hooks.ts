import { useContext } from 'react';
import { IonLifeCycleContext } from '@ionic/react-core';

export const useIonViewWillEnter = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillEnter(callback);
}

export const useIonViewDidEnter = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidEnter(callback);
}

export const useIonViewWillLeave = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillLeave(callback);
}

export const useIonViewDidLeave = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidLeave(callback);
}
