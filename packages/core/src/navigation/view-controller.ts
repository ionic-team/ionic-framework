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

  // life cycle events
  willLeave(unload: boolean): void;
  didLeave(): void;
  willEnter(): void;
  didEnter(): void;
  willLoad(): void;
  didLoad(): void;
  willUnload():void;

  destroy(): Promise<any>;
  getTransitionName(direction: string): string;
  onDidDismiss: (data: any, role: string) => void;
  onWillDismiss: (data: any, role: string) => void;
}
