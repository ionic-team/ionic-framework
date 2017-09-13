import { NavController } from './nav-controller';

/**
 * @hidden
 */
export interface NavigationContainer {
  id: string;
  name: string;
  parent: NavController;
  getActiveChildNavs(): NavigationContainer[];
  getAllChildNavs?(): NavigationContainer[];
  getType(): string;
  getSecondaryIdentifier(): string;
}
