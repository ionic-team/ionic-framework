import { ViewController } from './view-controller';

export interface NavController {
  id: string;
  getViews(): ViewController[];
  getParent(): NavController;
  setParent(nav: NavController): void;
}
