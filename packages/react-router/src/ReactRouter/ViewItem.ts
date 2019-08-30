export interface ViewItem<RouteData = any> {
  id: string;
  key: string;
  route: React.ReactElement<any>;
  ionPageRef?: React.RefObject<HTMLDivElement>;
  ionPageElement?: HTMLElement;
  routeData: RouteData;
  prevId?: string;
  mount: boolean;
  show: boolean;
}
