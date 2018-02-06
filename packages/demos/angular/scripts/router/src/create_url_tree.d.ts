/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActivatedRoute } from './router_state';
import { Params } from './shared';
import { UrlTree } from './url_tree';
export declare function createUrlTree(route: ActivatedRoute, urlTree: UrlTree, commands: any[], queryParams: Params, fragment: string): UrlTree;
