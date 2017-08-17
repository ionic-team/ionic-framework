import { ComponentFactoryResolver, ElementRef, OnInit, OpaqueToken, Renderer, ViewContainerRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { OverlayPortal } from './overlay-portal';
import { Platform } from '../../platform/platform';
export declare const AppRootToken: OpaqueToken;
/**
 * @hidden
 */
export declare class IonicApp extends Ion implements OnInit {
    private _userCmp;
    private _cfr;
    private _plt;
    private _stopScrollPlugin;
    private _tmr;
    _viewport: ViewContainerRef;
    _modalPortal: OverlayPortal;
    _overlayPortal: OverlayPortal;
    _loadingPortal: OverlayPortal;
    _toastPortal: OverlayPortal;
    constructor(_userCmp: any, _cfr: ComponentFactoryResolver, elementRef: ElementRef, renderer: Renderer, config: Config, _plt: Platform, app: App);
    ngOnInit(): void;
    /**
     * @hidden
     */
    _getPortal(portal?: number): OverlayPortal;
    _getActivePortal(): OverlayPortal;
    _disableScroll(shouldDisableScroll: boolean): void;
    stopScroll(): Promise<boolean>;
}
