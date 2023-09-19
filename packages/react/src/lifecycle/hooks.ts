import { useContext, useEffect, useRef } from 'react';

import type { LifeCycleCallback } from '../contexts/IonLifeCycleContext';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

export const useIonViewWillEnter = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    return context.onIonViewWillEnter(callback);
  }, deps);
};

export const useIonViewDidEnter = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    return context.onIonViewDidEnter(callback);
  }, deps);
};

export const useIonViewWillLeave = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    return context.onIonViewWillLeave(callback);
  }, deps);
};

export const useIonViewDidLeave = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    return context.onIonViewDidLeave(callback);
  }, deps);
};
