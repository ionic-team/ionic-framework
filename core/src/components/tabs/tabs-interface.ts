/**
 * @deprecated
 * Use `IonTabsCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface TabsCustomEvent extends CustomEvent {
  detail: { tab: string };
  target: HTMLIonTabsElement;
}
