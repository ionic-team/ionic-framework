import { NavOptions } from './nav-util';

export interface Nav {
  goToRoot(opts: NavOptions): Promise<any>;
}

export interface Tabs {
  _tabs: Tab[];
  select(tabOrIndex: number | Tab, opts: NavOptions): void;
  _top: number;
  setTabbarPosition(top: number, bottom: number): void;
}

export interface Tab {
  tabUrlPath: string;
  tabTitle: string;
  index: number;
}

export interface Content {
  resize(): void;
}

export interface Footer {
}

export interface Header {
}

export interface Navbar {
  setBackButtonText(backButtonText: string): void;
  hideBackButton: boolean;
  didEnter(): void;
}
