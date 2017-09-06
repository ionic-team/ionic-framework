import { EventEmitter } from '@angular/core';
/**
 * @hidden
 */
export declare class RangeKnob {
    _x: string;
    ratio: number;
    pressed: boolean;
    pin: boolean;
    min: number;
    max: number;
    val: number;
    disabled: boolean;
    labelId: string;
    ionIncrease: EventEmitter<{}>;
    ionDecrease: EventEmitter<{}>;
    _keyup(ev: KeyboardEvent): void;
}
