import { ComponentFactoryResolver, ComponentRef, ElementRef, ErrorHandler, EventEmitter, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { NavOptions, NavResult, TransitionInstruction } from './nav-util';
import { DeepLinker } from './deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { ViewController } from './view-controller';
import { Ion } from '../components/ion';
import { NavigationContainer } from './navigation-container';
import { NavController } from './nav-controller';
import { Platform } from '../platform/platform';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';
/**
 * @hidden
 * This class is for internal use only. It is not exported publicly.
 */
export declare class NavControllerBase extends Ion implements NavController {
    parent: any;
    _app: App;
    config: Config;
    plt: Platform;
    _zone: NgZone;
    _cfr: ComponentFactoryResolver;
    _gestureCtrl: GestureController;
    _trnsCtrl: TransitionController;
    _linker: DeepLinker;
    private _domCtrl;
    private _errHandler;
    _children: NavigationContainer[];
    _ids: number;
    _init: boolean;
    _isPortal: boolean;
    _queue: TransitionInstruction[];
    _sbEnabled: boolean;
    _sbGesture: SwipeBackGesture;
    _sbTrns: Transition;
    _trnsId: number;
    _trnsTm: boolean;
    _viewport: ViewContainerRef;
    _views: ViewController[];
    _zIndexOffset: number;
    _destroyed: boolean;
    viewDidLoad: EventEmitter<any>;
    viewWillEnter: EventEmitter<any>;
    viewDidEnter: EventEmitter<any>;
    viewWillLeave: EventEmitter<any>;
    viewDidLeave: EventEmitter<any>;
    viewWillUnload: EventEmitter<any>;
    id: string;
    name: string;
    swipeBackEnabled: boolean;
    constructor(parent: any, _app: App, config: Config, plt: Platform, elementRef: ElementRef, _zone: NgZone, renderer: Renderer, _cfr: ComponentFactoryResolver, _gestureCtrl: GestureController, _trnsCtrl: TransitionController, _linker: DeepLinker, _domCtrl: DomController, _errHandler: ErrorHandler);
    push(page: any, params?: any, opts?: NavOptions, done?: () => void): Promise<any>;
    insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: () => void): Promise<any>;
    insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: () => void): Promise<any>;
    pop(opts?: NavOptions, done?: () => void): Promise<any>;
    popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: () => void): Promise<any>;
    popToRoot(opts?: NavOptions, done?: () => void): Promise<any>;
    popAll(): Promise<any[]>;
    remove(startIndex: number, removeCount?: number, opts?: NavOptions, done?: () => void): Promise<any>;
    removeView(viewController: ViewController, opts?: NavOptions, done?: () => void): Promise<any>;
    setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: () => void): Promise<any>;
    setPages(viewControllers: any[], opts?: NavOptions, done?: () => void): Promise<any>;
    _queueTrns(ti: TransitionInstruction, done: () => void): Promise<boolean>;
    _success(result: NavResult, ti: TransitionInstruction): void;
    _failed(rejectReason: any, ti: TransitionInstruction): void;
    _fireError(rejectReason: any, ti: TransitionInstruction): void;
    _nextTrns(): boolean;
    _startTI(ti: TransitionInstruction): Promise<void>;
    _loadLazyLoading(ti: TransitionInstruction): Promise<void>;
    _getEnteringView(ti: TransitionInstruction, leavingView: ViewController): ViewController;
    _postViewInit(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): void;
    /**
     * DOM WRITE
     */
    _viewInit(enteringView: ViewController): void;
    _viewAttachToDOM(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef): void;
    _viewTest(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): Promise<void>;
    _transition(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): Promise<NavResult>;
    _transitionStart(transition: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions): Promise<NavResult>;
    _transitionFinish(transition: Transition, opts: NavOptions): NavResult;
    _viewsWillLifecycles(enteringView: ViewController, leavingView: ViewController): void;
    _insertViewAt(view: ViewController, index: number): void;
    _removeView(view: ViewController): void;
    _destroyView(view: ViewController): void;
    /**
     * DOM WRITE
     */
    _cleanup(activeView: ViewController): void;
    _preLoad(view: ViewController): void;
    _willLoad(view: ViewController): void;
    _didLoad(view: ViewController): void;
    _willEnter(view: ViewController): void;
    _didEnter(view: ViewController): void;
    _willLeave(view: ViewController, willUnload: boolean): void;
    _didLeave(view: ViewController): void;
    _willUnload(view: ViewController): void;
    hasChildren(): boolean;
    getActiveChildNavs(): any[];
    getAllChildNavs(): any[];
    registerChildNav(container: NavigationContainer): void;
    unregisterChildNav(nav: any): void;
    destroy(): void;
    swipeBackStart(): void;
    swipeBackProgress(stepValue: number): void;
    swipeBackEnd(shouldComplete: boolean, currentStepValue: number, velocity: number): void;
    _swipeBackCheck(): void;
    canSwipeBack(): boolean;
    canGoBack(): boolean;
    isTransitioning(): boolean;
    setTransitioning(isTransitioning: boolean): void;
    getActive(): ViewController;
    isActive(view: ViewController): boolean;
    getByIndex(index: number): ViewController;
    getPrevious(view?: ViewController): ViewController;
    first(): ViewController;
    last(): ViewController;
    indexOf(view: ViewController): number;
    length(): number;
    /**
     * Return the stack of views in this NavController.
     */
    getViews(): Array<ViewController>;
    /**
     * Return a view controller
     */
    getViewById(id: string): ViewController;
    isSwipeBackEnabled(): boolean;
    dismissPageChangeViews(): void;
    setViewport(val: ViewContainerRef): void;
    resize(): void;
    goToRoot(_opts: NavOptions): Promise<any>;
    getType(): string;
    getSecondaryIdentifier(): string;
    /**
     * Returns the active child navigation.
     */
    getActiveChildNav(): any;
}
