import { useContext, useEffect } from 'react';

import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

export const useIonViewWillEnter = (callback: () => void) => {
  const context = useContext(IonLifeCycleContext);
  useEffect(() => {
    context.onIonViewWillEnter(callback);
  }, []);
};

export const useIonViewDidEnter = (callback: () => void) => {
  const context = useContext(IonLifeCycleContext);
  useEffect(() => {
    context.onIonViewDidEnter(callback);
  }, []);
};

export const useIonViewWillLeave = (callback: () => void) => {
  const context = useContext(IonLifeCycleContext);
  useEffect(() => {
    context.onIonViewWillLeave(callback);
  }, []);
};

export const useIonViewDidLeave = (callback: () => void) => {
  const context = useContext(IonLifeCycleContext);
  useEffect(() => {
    context.onIonViewDidLeave(callback);
  }, []);
};
