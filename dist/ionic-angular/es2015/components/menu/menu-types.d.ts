import { Animation } from '../../animations/animation';
import { MenuType as IMenuType } from '../app/menu-interface';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export declare class MenuType implements IMenuType {
    ani: Animation;
    isOpening: boolean;
    constructor(plt: Platform);
    setOpen(shouldOpen: boolean, animated: boolean, done: Function): void;
    setProgressStart(isOpen: boolean): void;
    setProgessStep(stepValue: number): void;
    setProgressEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function): void;
    destroy(): void;
}
