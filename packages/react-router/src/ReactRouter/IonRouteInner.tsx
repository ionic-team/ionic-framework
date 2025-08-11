import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

export const IonRouteInner = ({ path, element }: IonRouteProps) => {
  return <Route path={path} element={element} />;
};
