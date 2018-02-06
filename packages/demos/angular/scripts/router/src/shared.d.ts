/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Route, UrlMatchResult } from './config';
import { UrlSegment, UrlSegmentGroup } from './url_tree';
/**
 * @whatItDoes Name of the primary outlet.
 *
 * @stable
 */
export declare const PRIMARY_OUTLET = "primary";
/**
 * A collection of parameters.
 *
 * @stable
 */
export declare type Params = {
    [key: string]: any;
};
/**
 * Matrix and Query parameters.
 *
 * `ParamMap` makes it easier to work with parameters as they could have either a single value or
 * multiple value. Because this should be known by the user, calling `get` or `getAll` returns the
 * correct type (either `string` or `string[]`).
 *
 * The API is inspired by the URLSearchParams interface.
 * see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 *
 * @stable
 */
export interface ParamMap {
    has(name: string): boolean;
    /**
     * Return a single value for the given parameter name:
     * - the value when the parameter has a single value,
     * - the first value if the parameter has multiple values,
     * - `null` when there is no such parameter.
     */
    get(name: string): string | null;
    /**
     * Return an array of values for the given parameter name.
     *
     * If there is no such parameter, an empty array is returned.
     */
    getAll(name: string): string[];
    /** Name of the parameters */
    readonly keys: string[];
}
/**
 * Convert a {@link Params} instance to a {@link ParamMap}.
 *
 * @stable
 */
export declare function convertToParamMap(params: Params): ParamMap;
export declare function navigationCancelingError(message: string): Error;
export declare function isNavigationCancelingError(error: Error): any;
export declare function defaultUrlMatcher(segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route): UrlMatchResult | null;
