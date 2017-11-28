
/* it is very important to keep this interface in sync with ./nav */
import { NavOptions, PublicViewController } from '../../index';

export interface PublicNav {
  push(component: any, data?: any, opts?: NavOptions): Promise<any>;
  pop(opts?: NavOptions): Promise<any>;
  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any>;
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any>;
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any>;
  popToRoot(opts?: NavOptions): Promise<any>;
  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any>;
  removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any>;
  removeView(viewController: PublicViewController, opts?: NavOptions): Promise<any>;
  setPages(componentDataPairs: any[], opts?: NavOptions): Promise<any>;

  getActive?(): PublicViewController;
  getPrevious?(view?: PublicViewController): PublicViewController;
  canGoBack?(): boolean;
  canSwipeBack?(): boolean;
  getFirstView?(): PublicViewController;

  element?: HTMLElement;
}
