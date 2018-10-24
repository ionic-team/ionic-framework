export type TabbarLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';
export type TabbarPlacement = 'top' | 'bottom';

export interface TabbarChangedDetail {
  tabId?: string;
}

export interface TabbarClickDetail {
  tabId?: string;
  href?: string;
}
