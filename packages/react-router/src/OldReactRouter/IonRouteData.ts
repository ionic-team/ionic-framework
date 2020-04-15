import { RouteProps, match } from 'react-router-dom';

export interface IonRouteData {
  match: match | null;
  childProps: RouteProps;
}
