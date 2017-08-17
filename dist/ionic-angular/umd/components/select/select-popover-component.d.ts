import { OnInit } from '@angular/core';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/** @hidden */
export interface SelectPopoverOption {
    text: string;
    value: string;
    disabled: boolean;
    checked: boolean;
    handler?: Function;
}
/** @hidden */
export declare class SelectPopover implements OnInit {
    private navParams;
    private viewController;
    value: any;
    options: SelectPopoverOption[];
    constructor(navParams: NavParams, viewController: ViewController);
    ngOnInit(): void;
}
