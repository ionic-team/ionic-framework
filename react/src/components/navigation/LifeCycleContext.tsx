import React from 'react';

export interface LifeCycleContextInterface {
  parent: any;
  // onIonViewWillEnter: (callback?: Function) => void;
  // ionViewWillEnter: () => void;
}

export const LifeCycleContext = React.createContext<LifeCycleContextInterface>({
  parent: null,
  // onIonViewWillEnter: () => {},
  // ionViewWillEnter: () => {}
});
