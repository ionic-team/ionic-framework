import { match, RouteProps } from 'react-router-dom';

export type ViewItem = {
  id: string;
  key: string;
  match: match<{ tab: string }>;
  element: React.ReactElement<any>;
  ref?: React.RefObject<HTMLElement>;
  prevId?: string;
  mount: boolean;
  show: boolean;
  childProps?: RouteProps;
}
