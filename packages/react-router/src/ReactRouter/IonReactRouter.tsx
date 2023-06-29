import type { PropsWithChildren } from 'react';
import React from 'react';
import type { RouterProps } from 'react-router-dom';
import { Router } from 'react-router-dom';

import { IonRouter } from './IonRouter';

export function IonReactRouter({ children, ...props }: PropsWithChildren<RouterProps>) {
  return (
    <Router {...props}>
      <IonRouter>{children}</IonRouter>
    </Router>
  );
}
