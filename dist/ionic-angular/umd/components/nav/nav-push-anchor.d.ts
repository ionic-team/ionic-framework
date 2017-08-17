import { AfterContentInit } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { NavPush } from './nav-push';
/**
 * @hidden
 */
export declare class NavPushAnchor implements AfterContentInit {
    host: NavPush;
    linker: DeepLinker;
    _href: string;
    constructor(host: NavPush, linker: DeepLinker);
    updateHref(): void;
    ngAfterContentInit(): void;
}
