/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Routes } from './config';
import { RouterConfigLoader } from './router_config_loader';
import { UrlSerializer, UrlTree } from './url_tree';
/**
 * Returns the `UrlTree` with the redirection applied.
 *
 * Lazy modules are loaded along the way.
 */
export declare function applyRedirects(moduleInjector: Injector, configLoader: RouterConfigLoader, urlSerializer: UrlSerializer, urlTree: UrlTree, config: Routes): Observable<UrlTree>;
