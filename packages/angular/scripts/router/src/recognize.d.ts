/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Routes } from './config';
import { ParamsInheritanceStrategy, RouterStateSnapshot } from './router_state';
import { UrlTree } from './url_tree';
export declare function recognize(rootComponentType: Type<any> | null, config: Routes, urlTree: UrlTree, url: string, paramsInheritanceStrategy?: ParamsInheritanceStrategy): Observable<RouterStateSnapshot>;
