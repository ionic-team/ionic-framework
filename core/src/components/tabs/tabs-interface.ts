export interface TabsEventDetail {
  tab: string;
}

export interface TabsCustomEvent extends CustomEvent {
  detail: TabsEventDetail;
  target: HTMLIonTabsElement;
}
