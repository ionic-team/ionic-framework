
import { ViewController } from './view-controller';

export interface NavControllerDelegate {
  convertViewsToViewControllers(views: any[]): Promise<ViewController[]>;
  initializeComponent(viewController: ViewController): Promise<any>;
}
