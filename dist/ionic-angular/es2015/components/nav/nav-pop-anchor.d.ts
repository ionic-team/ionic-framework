import { AfterContentInit } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { ViewController } from '../../navigation/view-controller';
import { NavPop } from './nav-pop';
/**
 * @hidden
 */
export declare class NavPopAnchor implements AfterContentInit {
    host: NavPop;
    linker: DeepLinker;
    viewCtrl: ViewController;
    _href: string;
    constructor(host: NavPop, linker: DeepLinker, viewCtrl: ViewController);
    updateHref(): void;
    ngAfterContentInit(): void;
}
