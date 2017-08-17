import { NgZone } from '@angular/core';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
export declare class DisplayWhen {
    _plt: Platform;
    zone: NgZone;
    isMatch: boolean;
    conditions: string[];
    resizeObs: any;
    constructor(conditions: string, _plt: Platform, zone: NgZone);
    orientation(): boolean;
    ngOnDestroy(): void;
}
