import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { AlertOptions } from './alert-options';
/**
 * @hidden
 */
export declare class AlertCmp {
    _viewCtrl: ViewController;
    _elementRef: ElementRef;
    private _renderer;
    private _plt;
    activeId: string;
    descId: string;
    d: AlertOptions;
    enabled: boolean;
    hdrId: string;
    id: number;
    inputType: string;
    lastClick: number;
    msgId: string;
    subHdrId: string;
    mode: string;
    keyboardResizes: boolean;
    gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, _elementRef: ElementRef, config: Config, gestureCtrl: GestureController, params: NavParams, _renderer: Renderer, _plt: Platform);
    ionViewDidLoad(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    ionViewDidEnter(): void;
    keyUp(ev: KeyboardEvent): void;
    btnClick(button: any): void;
    rbClick(checkedInput: any): void;
    cbClick(checkedInput: any): void;
    bdClick(): void;
    dismiss(role: string): Promise<any>;
    getValues(): any;
    ngOnDestroy(): void;
}
