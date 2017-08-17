import { ComponentFactoryResolver, ElementRef, ErrorHandler, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavigationContainer } from '../../navigation/navigation-container';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
/**
 * @hidden
 */
export declare class OverlayPortal extends NavControllerBase implements NavigationContainer {
    constructor(app: App, config: Config, plt: Platform, elementRef: ElementRef, zone: NgZone, renderer: Renderer, cfr: ComponentFactoryResolver, gestureCtrl: GestureController, transCtrl: TransitionController, linker: DeepLinker, viewPort: ViewContainerRef, domCtrl: DomController, errHandler: ErrorHandler);
    _overlayPortal: number;
    ngOnDestroy(): void;
    getType(): string;
    getSecondaryIdentifier(): string;
}
