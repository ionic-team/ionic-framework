import { App } from '../app/app';
import { Config } from '../../config/config';
import { PopoverOptions } from './popover-options';
import { DeepLinker } from '../../navigation/deep-linker';
import { Overlay } from '../../navigation/overlay';
import { OverlayProxy } from '../../navigation/overlay-proxy';
/**
 * @hidden
 */
export declare class Popover extends OverlayProxy {
    private data;
    private opts;
    isOverlay: boolean;
    constructor(app: App, component: any, data: any, opts: PopoverOptions, config: Config, deepLinker: DeepLinker);
    getImplementation(): Overlay;
}
