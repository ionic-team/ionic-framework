import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { DefaultIonLifeCycleContext, IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

interface ViewTransitionManagerProps {
  removeView: () => void;
  mount: boolean;
}

export const ViewLifeCycleManager = ({ children, ...props }: PropsWithChildren<ViewTransitionManagerProps>) => {
  const ionLifeCycleContext = useRef(new DefaultIonLifeCycleContext());

  const [isMounted, setIsMounted] = useState(false);
  const [show, setShow] = useState(true);

  const { mount, removeView } = props;

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    ionLifeCycleContext.current.onComponentCanBeDestroyed(() => {
      if (!mount && isMounted) {
        setShow(false);
        removeView();
      }
    });
  }, [mount, isMounted, removeView]);

  return (
    <IonLifeCycleContext.Provider value={ionLifeCycleContext.current}>{show && children}</IonLifeCycleContext.Provider>
  );
};
