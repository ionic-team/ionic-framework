import { match, RouteProps } from 'react-router-dom';

export interface IonRouteData {
  match: match<{ tab: string }> | null;
  childProps: RouteProps;
}
