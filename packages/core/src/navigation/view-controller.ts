import { NavController } from './nav-controller';
import { FrameworkDelegate } from './framework-delegate';

export interface ViewController {
  id: string;
  component: any;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: NavController;
  frameworkDelegate: FrameworkDelegate;
  dismissProxy?: any;
  willLeave(unload: boolean): Promise<any>;
  willEnter(): Promise<any>;
  didLeave(): Promise<any>;
  didEnter(): Promise<any>;
  willUnload(): Promise<any>;
  destroy(): Promise<any>;
  getTransitionName(direction: string): string;
}
