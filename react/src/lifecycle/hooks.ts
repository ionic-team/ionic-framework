import { useContext } from 'react';

import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

export const useIonViewWillEnter = (callback: () => void) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillEnter(callback);
};

export const useIonViewDidEnter = (callback: () => void) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidEnter(callback);
};

export const useIonViewWillLeave = (callback: () => void) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillLeave(callback);
};

export const useIonViewDidLeave = (callback: () => void) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidLeave(callback);
};
