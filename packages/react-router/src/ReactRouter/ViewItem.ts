export interface ViewItem<RouteData = any> {
  id: string;
  key: string;
  route: React.ReactElement<any>;
  ionPageElement?: HTMLIonPageElement;
  // ref?: React.RefObject<HTMLElement>;
  routeData: RouteData;
  prevId?: string;
  mount: boolean;
  show: boolean;
}
