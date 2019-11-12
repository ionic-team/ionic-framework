export interface ViewItem<RouteData = any> {
  /** The generated id of the view */
  id: string;
  /** The key used by React. A new key is generated each time the view comes into the DOM so React thinks its a completely new element. */
  key: string;
  /** The <Route /> or <Redirect /> component associated with the view */
  route: React.ReactElement<any>;
  /** The reference to the <IonPage /> element. */
  ionPageElement?: HTMLElement;
  /** The routeData for the view. */
  routeData: RouteData;
  /** Used to track which page pushed the page into view. Used for back button purposes. */
  prevId?: string;
  /**
   * Mount is used for page transitions. If mount is false, it keeps the view in the DOM long enough to finish the transition.
   */
  mount: boolean;
  /**
   *  Show determines if the view will be in the DOM or not
   */
  show: boolean;
  /**
   * An IonRoute is a Route that contains an IonPage. Only IonPages participate in transition and lifecycle events.
   */
  isIonRoute: boolean;

  /**
   * location of the view
   */
  location?: string;
}
