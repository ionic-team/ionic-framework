import { AnimationOptions } from '../animations/animation';
import { Config } from '../config/config';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { Platform } from '../platform/platform';
import { Transition } from './transition';
import { ViewController } from '../navigation/view-controller';
/**
 * @hidden
 */
export declare class TransitionController {
    plt: Platform;
    private _config;
    private _ids;
    private _trns;
    constructor(plt: Platform, _config: Config);
    getRootTrnsId(nav: NavControllerBase): number;
    nextId(): number;
    get(trnsId: number, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Transition;
    destroy(trnsId: number): void;
}
