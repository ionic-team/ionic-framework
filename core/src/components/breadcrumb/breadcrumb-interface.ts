export interface BreadcrumbCollapsedClickEventDetail {
  ionShadowTarget?: HTMLElement;
  collapsedBreadcrumbs?: HTMLIonBreadcrumbElement[];
}

/**
 * @deprecated
 * Use `IonBreadcrumbCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface BreadcrumbCustomEvent extends CustomEvent {
  detail: BreadcrumbCollapsedClickEventDetail;
  target: HTMLIonBreadcrumbElement;
}
