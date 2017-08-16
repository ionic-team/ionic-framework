import { NavController } from './nav-controller';
import { ViewController } from './view-controller';

export interface FrameworkDelegate {
  attachViewToDom(navController: NavController, enteringView: ViewController): Promise<any>;
  removeViewFromDom(navController: NavController, leavingView: ViewController): Promise<any>;
  destroy(viewController: ViewController): Promise<any>;
}