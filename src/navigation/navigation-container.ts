import { NavController } from './nav-controller';

export interface NavigationContainer {
  id: string;
  name: string;
  parent: NavController;
  getActiveChildNav(): NavigationContainer;
  getType(): string;
  getSecondaryIdentifier(): string;
}
