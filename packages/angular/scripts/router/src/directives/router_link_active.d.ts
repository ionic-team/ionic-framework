/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges } from '@angular/core';
import { Router } from '../router';
import { RouterLink, RouterLinkWithHref } from './router_link';
/**
 * @whatItDoes Lets you add a CSS class to an element when the link's route becomes active.
 *
 * @howToUse
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * @description
 *
 * The RouterLinkActive directive lets you add a CSS class to an element when the link's route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * When the url is either '/user' or '/user/bob', the active-link class will
 * be added to the `a` tag. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
 * <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
 * ```
 *
 * You can configure RouterLinkActive by passing `exact: true`. This will add the classes
 * only when the url matches the link exactly.
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
 * true}">Bob</a>
 * ```
 *
 * You can assign the RouterLinkActive instance to a template variable and directly check
 * the `isActive` status.
 * ```
 * <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
 *   Bob {{ rla.isActive ? '(already open)' : ''}}
 * </a>
 * ```
 *
 * Finally, you can apply the RouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
 *   <a routerLink="/user/jim">Jim</a>
 *   <a routerLink="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either '/user/jim' or
 * '/user/bob'.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
export declare class RouterLinkActive implements OnChanges, OnDestroy, AfterContentInit {
    private router;
    private element;
    private renderer;
    private cdr;
    links: QueryList<RouterLink>;
    linksWithHrefs: QueryList<RouterLinkWithHref>;
    private classes;
    private subscription;
    readonly isActive: boolean;
    routerLinkActiveOptions: {
        exact: boolean;
    };
    constructor(router: Router, element: ElementRef, renderer: Renderer2, cdr: ChangeDetectorRef);
    ngAfterContentInit(): void;
    routerLinkActive: string[] | string;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private update();
    private isLinkActive(router);
    private hasActiveLinks();
}
