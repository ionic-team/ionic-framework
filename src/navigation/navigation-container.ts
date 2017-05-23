import { NavController } from './nav-controller';

export interface NavigationContainer {
  id: string;
  getActiveChildNav(): NavController;
  getType(): string;
  getSecondaryIdentifier(): string;
}
