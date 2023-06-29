import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export function IonRouteInner(props: IonRouteProps) {
  return <Route path={props.path} children={props.render} />;
}
