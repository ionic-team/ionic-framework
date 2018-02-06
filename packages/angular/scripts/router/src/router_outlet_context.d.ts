/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { RouterOutlet } from './directives/router_outlet';
import { ActivatedRoute } from './router_state';
/**
 * Store contextual information about a {@link RouterOutlet}
 *
 * @stable
 */
export declare class OutletContext {
    outlet: RouterOutlet | null;
    route: ActivatedRoute | null;
    resolver: ComponentFactoryResolver | null;
    children: ChildrenOutletContexts;
    attachRef: ComponentRef<any> | null;
}
/**
 * Store contextual information about the children (= nested) {@link RouterOutlet}
 *
 * @stable
 */
export declare class ChildrenOutletContexts {
    private contexts;
    /** Called when a `RouterOutlet` directive is instantiated */
    onChildOutletCreated(childName: string, outlet: RouterOutlet): void;
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     */
    onChildOutletDestroyed(childName: string): void;
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     */
    onOutletDeactivated(): Map<string, OutletContext>;
    onOutletReAttached(contexts: Map<string, OutletContext>): void;
    getOrCreateContext(childName: string): OutletContext;
    getContext(childName: string): OutletContext | null;
}
