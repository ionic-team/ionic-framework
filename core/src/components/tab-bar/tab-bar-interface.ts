export type TabButtonLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';

export interface TabBarChangedEventDetail {
  tab?: string;
}

export interface TabButtonClickEventDetail {
  tab: string;
  selected: boolean;
  href?: string;
}
