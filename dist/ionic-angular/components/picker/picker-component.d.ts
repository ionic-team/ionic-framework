import { ElementRef, QueryList, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { NavParams } from '../../navigation/nav-params';
import { PickerOptions } from './picker-options';
import { ViewController } from '../../navigation/view-controller';
import { PickerColumnCmp } from './picker-column';
/**
 * @hidden
 */
export declare class PickerCmp {
    private _viewCtrl;
    private _elementRef;
    _cols: QueryList<PickerColumnCmp>;
    d: PickerOptions;
    enabled: boolean;
    lastClick: number;
    id: number;
    mode: string;
    _gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, _elementRef: ElementRef, config: Config, gestureCtrl: GestureController, params: NavParams, renderer: Renderer);
    ionViewWillLoad(): void;
    ionViewDidLoad(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    refresh(): void;
    _colChange(): void;
    _keyUp(ev: KeyboardEvent): void;
    ionViewDidEnter(): void;
    btnClick(button: any): void;
    bdClick(): void;
    dismiss(role: string): Promise<any>;
    getSelected(): any;
    ngOnDestroy(): void;
}
