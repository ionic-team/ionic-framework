import { NavController } from './nav-controller';

export interface ViewController {
  id: string;
  component: any;
  element: HTMLElement;
  getNav(): NavController;
  setNav(nav: NavController): void;
  getState(): number;
  setState(state: number): void;
  getInstance(): any;
  willLeave(unload: boolean): Promise<any>;
  didLeave(): Promise<any>;
  willUnload(): Promise<any>;
  destroy(): Promise<any>;
  getTransitionName(direction: string): string;
}
