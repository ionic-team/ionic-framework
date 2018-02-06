/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, EventEmitter, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ChildrenOutletContexts } from '../router_outlet_context';
import { ActivatedRoute } from '../router_state';
/**
 * @whatItDoes Acts as a placeholder that Angular dynamically fills based on the current router
 * state.
 *
 * @howToUse
 *
 * ```
 * <router-outlet></router-outlet>
 * <router-outlet name='left'></router-outlet>
 * <router-outlet name='right'></router-outlet>
 * ```
 *
 * A router outlet will emit an activate event any time a new component is being instantiated,
 * and a deactivate event when it is being destroyed.
 *
 * ```
 * <router-outlet
 *   (activate)='onActivate($event)'
 *   (deactivate)='onDeactivate($event)'></router-outlet>
 * ```
 * @ngModule RouterModule
 *
 * @stable
 */
export declare class RouterOutlet implements OnDestroy, OnInit {
    private parentContexts;
    private location;
    private resolver;
    private changeDetector;
    private activated;
    private _activatedRoute;
    private name;
    activateEvents: EventEmitter<any>;
    deactivateEvents: EventEmitter<any>;
    constructor(parentContexts: ChildrenOutletContexts, location: ViewContainerRef, resolver: ComponentFactoryResolver, name: string, changeDetector: ChangeDetectorRef);
    ngOnDestroy(): void;
    ngOnInit(): void;
    readonly isActivated: boolean;
    readonly component: Object;
    readonly activatedRoute: ActivatedRoute;
    readonly activatedRouteData: {
        [name: string]: any;
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach(): ComponentRef<any>;
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void;
    deactivate(): void;
    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null): void;
}
