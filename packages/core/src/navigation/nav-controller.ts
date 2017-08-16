import { ViewController } from './view-controller';
import { Transition } from './transitions/transition';

export interface NavController {
  id: number;
  element: HTMLElement;
  views?: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal?: boolean;
  swipeToGoBackTransition?: Transition;
  getParent(): NavController;
  childNavs?: NavController[]; // TODO - make nav container
}
