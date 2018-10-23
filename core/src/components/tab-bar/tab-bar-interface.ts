export type TabbarLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';
export type TabbarPlacement = 'top' | 'bottom';

export interface TabbarChangedDetail {
  viewId?: string;
}

export interface TabbarClickDetail {
  viewId?: string;
  href?: string;
}
