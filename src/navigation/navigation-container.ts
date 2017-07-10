import { NavController } from './nav-controller';

export interface NavigationContainer {
  id: string;
  name: string;
  parent: NavController;
  getActiveChildNavs(): NavigationContainer[];
  getType(): string;
  getSecondaryIdentifier(): string;
}
