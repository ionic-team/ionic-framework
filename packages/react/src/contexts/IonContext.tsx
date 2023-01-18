import React from 'react';

import type { ReactComponentOrElement } from '../models';

export interface IonContextInterface {
  addOverlay: (id: string, overlay: ReactComponentOrElement, containerElement: HTMLDivElement) => void;
  removeOverlay: (id: string) => void;
}

export const IonContext = React.createContext<IonContextInterface>({
  addOverlay: () => {
    return;
  },
  removeOverlay: () => {
    return;
  },
});
