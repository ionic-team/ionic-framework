import { ElementRef, Renderer } from '@angular/core';
import { ActionSheetButton, ActionSheetOptions } from './action-sheet-options';
import { BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class ActionSheetCmp {
    private _viewCtrl;
    private _elementRef;
    d: ActionSheetOptions;
    cancelButton: ActionSheetButton;
    descId: string;
    enabled: boolean;
    hdrId: string;
    id: number;
    mode: string;
    gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, config: Config, _elementRef: ElementRef, gestureCtrl: GestureController, params: NavParams, renderer: Renderer);
    ionViewDidLoad(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    ionViewDidEnter(): void;
    keyUp(ev: KeyboardEvent): void;
    click(button: ActionSheetButton): void;
    bdClick(): void;
    dismiss(role: string): Promise<any>;
    ngOnDestroy(): void;
}
