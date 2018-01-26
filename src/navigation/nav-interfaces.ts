import { NavOptions, NavSegment } from './nav-util';
import { ViewController } from './view-controller';

export interface Nav {
  goToRoot(opts: NavOptions): Promise<any>;
}

export interface Tabs {
  viewCtrl: ViewController;
  _tabs: Tab[];
  select(tabOrIndex: number | Tab, opts: NavOptions, fromUrl: boolean): void;
  _top: number;
  setTabbarPosition(top: number, bottom: number): void;
  _getSelectedTabIndex(secondaryId: string, fallbackIndex?: number): number;
  getByIndex(index: number): Tab;
}

export interface Tab {
  tabUrlPath: string;
  tabTitle: string;
  index: number;
  _segment: NavSegment;
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
