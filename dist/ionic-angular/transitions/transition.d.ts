import { Animation, AnimationOptions } from '../animations/animation';
import { Platform } from '../platform/platform';
import { ViewController } from '../navigation/view-controller';
/**
 * @hidden
 *
 * - play
 * - Add before classes - DOM WRITE
 * - Remove before classes - DOM WRITE
 * - Add before inline styles - DOM WRITE
 * - set inline FROM styles - DOM WRITE
 * - RAF
 * - read toolbar dimensions - DOM READ
 * - write content top/bottom padding - DOM WRITE
 * - set css transition duration/easing - DOM WRITE
 * - RAF
 * - set inline TO styles - DOM WRITE
 */
export declare class Transition extends Animation {
    enteringView: ViewController;
    leavingView: ViewController;
    _trnsStart: Function;
    parent: Transition;
    trnsId: number;
    constructor(plt: Platform, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions);
    init(): void;
    registerStart(trnsStart: Function): void;
    start(): void;
    destroy(): void;
}
