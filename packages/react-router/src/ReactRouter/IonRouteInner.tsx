import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

export const IonRouteInner = ({ path, index, caseSensitive, element }: IonRouteProps) => {
  return <Route path={path} index={index} caseSensitive={caseSensitive} element={element} />;
};
