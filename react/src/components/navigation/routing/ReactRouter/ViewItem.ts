export type ViewItem<RouteData = any> = {
  id: string;
  key: string;
  element: React.ReactElement<any>;
  ref?: React.RefObject<HTMLElement>;
  routeData: RouteData;
  prevId?: string;
  mount: boolean;
  show: boolean;
}
