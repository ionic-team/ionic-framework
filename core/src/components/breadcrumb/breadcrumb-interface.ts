export interface BreadcrumbCollapsedClickEventDetail {
  ionShadowTarget?: HTMLElement;
  collapsedBreadcrumbs?: HTMLIonBreadcrumbElement[];
}

export interface BreadcrumbEvent extends CustomEvent {
  detail: BreadcrumbCollapsedClickEventDetail;
  target: HTMLIonBreadcrumbElement;
}
