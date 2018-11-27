export type TabButtonLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';

export interface TabBarChangedDetail {
  tab?: string;
}

export interface TabButtonClickDetail {
  tab: string;
  selected: boolean;
  href?: string;
}
