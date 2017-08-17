import { Animation } from '../animations/animation';
import { Transition } from './transition';
/**
 * @hidden
 */
export declare class PageTransition extends Transition {
    enteringPage: Animation;
    init(): void;
    destroy(): void;
}
