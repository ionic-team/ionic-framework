import { match, RouteProps } from 'react-router-dom';
// import { Location } from 'history';

export type StackItem = {
  id: string;
  key: string;
  // location: Location;
  match: match<{ tab: string }>;
  element: React.ReactElement<any>;
  ref?: React.RefObject<HTMLElement>;
  // prevId: string;
  mount: boolean;
  show: boolean;
  childProps?: RouteProps;
}
