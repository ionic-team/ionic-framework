import { NavController } from './nav-controller';

export interface NavigationContainer {
  id: string;
  parent: NavController;
  getActiveChildNav(): NavController;
  getType(): string;
  getSecondaryIdentifier(): string;
}
