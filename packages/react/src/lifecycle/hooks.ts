import { useContext, useEffect, useRef } from 'react';

import { IonLifeCycleContext, LifeCycleCallback } from '../contexts/IonLifeCycleContext';

export const useIonViewWillEnter = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    context.onIonViewWillEnter(callback);
  }, deps);
};

export const useIonViewDidEnter = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    context.onIonViewDidEnter(callback);
  }, deps);
};

export const useIonViewWillLeave = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    context.onIonViewWillLeave(callback);
  }, deps);
};

export const useIonViewDidLeave = (callback: LifeCycleCallback, deps: any[] = []) => {
  const context = useContext(IonLifeCycleContext);
  const id = useRef<number | undefined>();
  id.current = id.current || Math.floor(Math.random() * 1000000);
  useEffect(() => {
    callback.id = id.current!;
    context.onIonViewDidLeave(callback);
  }, deps);
};
