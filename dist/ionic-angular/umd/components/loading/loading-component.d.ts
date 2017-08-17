import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { LoadingOptions } from './loading-options';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
* @hidden
*/
export declare class LoadingCmp {
    private _viewCtrl;
    private _config;
    d: LoadingOptions;
    id: number;
    showSpinner: boolean;
    durationTimeout: any;
    gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, _config: Config, _elementRef: ElementRef, gestureCtrl: GestureController, params: NavParams, renderer: Renderer);
    ngOnInit(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    ionViewDidEnter(): void;
    keyUp(ev: KeyboardEvent): void;
    bdClick(): void;
    dismiss(role: string): Promise<any>;
    ngOnDestroy(): void;
}
