import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export const IonRouteInner = ({ path, render }: IonRouteProps) => {
  return (
    <Route path={path} children={render} />
  )
}