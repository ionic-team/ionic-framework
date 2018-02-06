/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentRef, InjectionToken } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
/**
 * @whatItDoes Creates an initializer that in addition to setting up the Angular
 * router sets up the ngRoute integration.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * @experimental
 */
export declare const RouterUpgradeInitializer: {
    provide: InjectionToken<((compRef: ComponentRef<any>) => void)[]>;
    multi: boolean;
    useFactory: (ngUpgrade: UpgradeModule) => () => void;
    deps: (typeof UpgradeModule)[];
};
/**
 * @whatItDoes Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the Angular location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * @experimental
 */
export declare function setUpLocationSync(ngUpgrade: UpgradeModule): void;
