/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { LocationStrategy } from '@angular/common';
import { ElementRef, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { QueryParamsHandling } from '../config';
import { Router } from '../router';
import { ActivatedRoute } from '../router_state';
import { UrlTree } from '../url_tree';
/**
 * @whatItDoes Lets you link to specific parts of your app.
 *
 * @howToUse
 *
 * Consider the following route configuration:
 * `[{ path: 'user/:name', component: UserCmp }]`
 *
 * When linking to this `user/:name` route, you can write:
 * `<a routerLink='/user/bob'>link to user component</a>`
 *
 * @description
 *
 * The RouterLink directives let you link to specific parts of your app.
 *
 * When the link is static, you can use the directive as follows:
 * `<a routerLink="/user/bob">link to user component</a>`
 *
 * If you use dynamic values to generate the link, you can pass an array of path
 * segments, followed by the params for each segment.
 *
 * For instance `['/team', teamId, 'user', userName, {details: true}]`
 * means that we want to generate a link to `/team/11/user/bob;details=true`.
 *
 * Multiple static segments can be merged into one
 * (e.g., `['/team/11/user', userName, {details: true}]`).
 *
 * The first segment name can be prepended with `/`, `./`, or `../`:
 * * If the first segment begins with `/`, the router will look up the route from the root of the
 *   app.
 * * If the first segment begins with `./`, or doesn't begin with a slash, the router will
 *   instead look in the children of the current activated route.
 * * And if the first segment begins with `../`, the router will go up one level.
 *
 * You can set query params and fragment as follows:
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *   link to user component
 * </a>
 * ```
 * RouterLink will use these to generate this link: `/user/bob#education?debug=true`.
 *
 * (Deprecated in v4.0.0 use `queryParamsHandling` instead) You can also tell the
 * directive to preserve the current query params and fragment:
 *
 * ```
 * <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
 *   link to user component
 * </a>
 * ```
 *
 * You can tell the directive to how to handle queryParams, available options are:
 *  - `'merge'`: merge the queryParams into the current queryParams
 *  - `'preserve'`: preserve the current queryParams
 *  - default/`''`: use the queryParams only
 *
 * Same options for {@link NavigationExtras#queryParamsHandling
 * NavigationExtras#queryParamsHandling}.
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *   link to user component
 * </a>
 * ```
 *
 * The router link directive always treats the provided input as a delta to the current url.
 *
 * For instance, if the current url is `/user/(box//aux:team)`.
 *
 * Then the following link `<a [routerLink]="['/user/jim']">Jim</a>` will generate the link
 * `/user/(jim//aux:team)`.
 *
 * See {@link Router#createUrlTree createUrlTree} for more information.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
export declare class RouterLink {
    private router;
    private route;
    queryParams: {
        [k: string]: any;
    };
    fragment: string;
    queryParamsHandling: QueryParamsHandling;
    preserveFragment: boolean;
    skipLocationChange: boolean;
    replaceUrl: boolean;
    private commands;
    private preserve;
    constructor(router: Router, route: ActivatedRoute, tabIndex: string, renderer: Renderer2, el: ElementRef);
    routerLink: any[] | string;
    /**
     * @deprecated 4.0.0 use `queryParamsHandling` instead.
     */
    preserveQueryParams: boolean;
    onClick(): boolean;
    readonly urlTree: UrlTree;
}
/**
 * @whatItDoes Lets you link to specific parts of your app.
 *
 * See {@link RouterLink} for more information.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
export declare class RouterLinkWithHref implements OnChanges, OnDestroy {
    private router;
    private route;
    private locationStrategy;
    target: string;
    queryParams: {
        [k: string]: any;
    };
    fragment: string;
    queryParamsHandling: QueryParamsHandling;
    preserveFragment: boolean;
    skipLocationChange: boolean;
    replaceUrl: boolean;
    private commands;
    private subscription;
    private preserve;
    href: string;
    constructor(router: Router, route: ActivatedRoute, locationStrategy: LocationStrategy);
    routerLink: any[] | string;
    preserveQueryParams: boolean;
    ngOnChanges(changes: {}): any;
    ngOnDestroy(): any;
    onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean;
    private updateTargetUrlAndHref();
    readonly urlTree: UrlTree;
}
