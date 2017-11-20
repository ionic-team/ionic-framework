
/* it is very important to keep this interface in sync with ./nav */
import { NavOptions, ViewController } from '../../index';

export interface PublicNavController {
  push(component: any, data?: any, opts?: NavOptions): Promise<any>;
  pop(opts?: NavOptions): Promise<any>;
  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any>;
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any>;
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any>;
  popToRoot(opts?: NavOptions): Promise<any>;
  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any>;
  removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any>;
  removeView(viewController: ViewController, opts?: NavOptions): Promise<any>;
  setPages(componentDataPairs: any[], opts?: NavOptions): Promise<any>;

  getActive?(): ViewController;
  getPrevious?(view?: ViewController): ViewController;
  canGoBack?(nav: PublicNavController): boolean;
  canSwipeBack?(): boolean;
  getFirstView?(): ViewController;
}
