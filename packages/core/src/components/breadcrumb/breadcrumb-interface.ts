export interface BreadcrumbCollapsedClickEventDetail {
  ionShadowTarget?: HTMLElement;
  collapsedBreadcrumbs?: HTMLIonBreadcrumbElement[];
}

export interface BreadcrumbCustomEvent extends CustomEvent {
  detail: BreadcrumbCollapsedClickEventDetail;
  target: HTMLIonBreadcrumbElement;
}
