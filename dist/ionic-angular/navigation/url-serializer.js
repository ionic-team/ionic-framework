import { OpaqueToken } from '@angular/core';
import { isArray, isBlank, isPresent } from '../util/util';
/**
 * @hidden
 */
var UrlSerializer = (function () {
    /**
     * @param {?} _app
     * @param {?} config
     */
    function UrlSerializer(_app, config) {
        this._app = _app;
        if (config && isArray(config.links)) {
            this.links = normalizeLinks(config.links);
        }
        else {
            this.links = [];
        }
    }
    /**
     * Parse the URL into a Path, which is made up of multiple NavSegments.
     * Match which components belong to each segment.
     * @param {?} browserUrl
     * @return {?}
     */
    UrlSerializer.prototype.parse = function (browserUrl) {
        if (browserUrl.charAt(0) === '/') {
            browserUrl = browserUrl.substr(1);
        }
        // trim off data after ? and #
        browserUrl = browserUrl.split('?')[0].split('#')[0];
        return convertUrlToSegments(this._app, browserUrl, this.links);
    };
    /**
     * @param {?} navContainer
     * @param {?} nameOrComponent
     * @param {?=} data
     * @return {?}
     */
    UrlSerializer.prototype.createSegmentFromName = function (navContainer, nameOrComponent, data) {
        if (data === void 0) { data = null; }
        var /** @type {?} */ configLink = this.getLinkFromName(nameOrComponent);
        if (configLink) {
            return this._createSegment(this._app, navContainer, configLink, data);
        }
        return null;
    };
    /**
     * @param {?} nameOrComponent
     * @return {?}
     */
    UrlSerializer.prototype.getLinkFromName = function (nameOrComponent) {
        return this.links.find(function (link) {
            return (link.component === nameOrComponent) ||
                (link.name === nameOrComponent);
        });
    };
    /**
     * Serialize a path, which is made up of multiple NavSegments,
     * into a URL string. Turn each segment into a string and concat them to a URL.
     * @param {?} segments
     * @return {?}
     */
    UrlSerializer.prototype.serialize = function (segments) {
        if (!segments || !segments.length) {
            return '/';
        }
        var /** @type {?} */ sections = segments.map(function (segment) {
            if (segment.type === 'tabs') {
                if (segment.requiresExplicitNavPrefix) {
                    return "/" + segment.type + "/" + segment.navId + "/" + segment.secondaryId + "/" + segment.id;
                }
                return "/" + segment.secondaryId + "/" + segment.id;
            }
            // it's a nav
            if (segment.requiresExplicitNavPrefix) {
                return "/" + segment.type + "/" + segment.navId + "/" + segment.id;
            }
            return "/" + segment.id;
        });
        return sections.join('');
    };
    /**
     * Serializes a component and its data into a NavSegment.
     * @param {?} navContainer
     * @param {?} component
     * @param {?} data
     * @return {?}
     */
    UrlSerializer.prototype.serializeComponent = function (navContainer, component, data) {
        if (component) {
            var /** @type {?} */ link = findLinkByComponentData(this.links, component, data);
            if (link) {
                return this._createSegment(this._app, navContainer, link, data);
            }
        }
        return null;
    };
    /**
     * \@internal
     * @param {?} app
     * @param {?} navContainer
     * @param {?} configLink
     * @param {?} data
     * @return {?}
     */
    UrlSerializer.prototype._createSegment = function (app, navContainer, configLink, data) {
        var /** @type {?} */ urlParts = configLink.segmentParts;
        if (isPresent(data)) {
            // create a copy of the original parts in the link config
            urlParts = urlParts.slice();
            // loop through all the data and convert it to a string
            var /** @type {?} */ keys = Object.keys(data);
            var /** @type {?} */ keysLength = keys.length;
            if (keysLength) {
                for (var /** @type {?} */ i = 0; i < urlParts.length; i++) {
                    if (urlParts[i].charAt(0) === ':') {
                        for (var /** @type {?} */ j = 0; j < keysLength; j++) {
                            if (urlParts[i] === ":" + keys[j]) {
                                // this data goes into the URL part (between slashes)
                                urlParts[i] = encodeURIComponent(data[keys[j]]);
                                break;
                            }
                        }
                    }
                }
            }
        }
        var /** @type {?} */ requiresExplicitPrefix = true;
        if (navContainer.parent) {
            requiresExplicitPrefix = navContainer.parent && navContainer.parent.getAllChildNavs().length > 1;
        }
        else {
            // if it's a root nav, and there are multiple root navs, we need an explicit prefix
            requiresExplicitPrefix = app.getRootNavById(navContainer.id) && app.getRootNavs().length > 1;
        }
        return {
            id: urlParts.join('/'),
            name: configLink.name,
            component: configLink.component,
            loadChildren: configLink.loadChildren,
            data: data,
            defaultHistory: configLink.defaultHistory,
            navId: navContainer.name || navContainer.id,
            type: navContainer.getType(),
            secondaryId: navContainer.getSecondaryIdentifier(),
            requiresExplicitNavPrefix: requiresExplicitPrefix
        };
    };
    return UrlSerializer;
}());
export { UrlSerializer };
function UrlSerializer_tsickle_Closure_declarations() {
    /** @type {?} */
    UrlSerializer.prototype.links;
    /** @type {?} */
    UrlSerializer.prototype._app;
}
/**
 * @param {?} name
 * @return {?}
 */
export function formatUrlPart(name) {
    name = name.replace(URL_REPLACE_REG, '-');
    name = name.charAt(0).toLowerCase() + name.substring(1).replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    });
    while (name.indexOf('--') > -1) {
        name = name.replace('--', '-');
    }
    if (name.charAt(0) === '-') {
        name = name.substring(1);
    }
    if (name.substring(name.length - 1) === '-') {
        name = name.substring(0, name.length - 1);
    }
    return encodeURIComponent(name);
}
export var /** @type {?} */ isPartMatch = function (urlPart, configLinkPart) {
    if (isPresent(urlPart) && isPresent(configLinkPart)) {
        if (configLinkPart.charAt(0) === ':') {
            return true;
        }
        return (urlPart === configLinkPart);
    }
    return false;
};
export var /** @type {?} */ createMatchedData = function (matchedUrlParts, link) {
    var /** @type {?} */ data = null;
    for (var /** @type {?} */ i = 0; i < link.segmentPartsLen; i++) {
        if (link.segmentParts[i].charAt(0) === ':') {
            data = data || {};
            data[link.segmentParts[i].substring(1)] = decodeURIComponent(matchedUrlParts[i]);
        }
    }
    return data;
};
export var /** @type {?} */ findLinkByComponentData = function (links, component, instanceData) {
    var /** @type {?} */ foundLink = null;
    var /** @type {?} */ foundLinkDataMatches = -1;
    for (var /** @type {?} */ i = 0; i < links.length; i++) {
        var /** @type {?} */ link = links[i];
        if (link.component === component) {
            // ok, so the component matched, but multiple links can point
            // to the same component, so let's make sure this is the right link
            var /** @type {?} */ dataMatches = 0;
            if (instanceData) {
                var /** @type {?} */ instanceDataKeys = Object.keys(instanceData);
                // this link has data
                for (var /** @type {?} */ j = 0; j < instanceDataKeys.length; j++) {
                    if (isPresent(link.dataKeys[instanceDataKeys[j]])) {
                        dataMatches++;
                    }
                }
            }
            else if (link.dataLen) {
                // this component does not have data but the link does
                continue;
            }
            if (dataMatches >= foundLinkDataMatches) {
                foundLink = link;
                foundLinkDataMatches = dataMatches;
            }
        }
    }
    return foundLink;
};
export var /** @type {?} */ normalizeLinks = function (links) {
    for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = links.length; i < ilen; i++) {
        var /** @type {?} */ link = links[i];
        if (isBlank(link.segment)) {
            link.segment = link.name;
        }
        link.dataKeys = {};
        link.segmentParts = link.segment.split('/');
        link.segmentPartsLen = link.segmentParts.length;
        // used for sorting
        link.staticLen = link.dataLen = 0;
        var /** @type {?} */ stillCountingStatic = true;
        for (var /** @type {?} */ j = 0; j < link.segmentPartsLen; j++) {
            if (link.segmentParts[j].charAt(0) === ':') {
                link.dataLen++;
                stillCountingStatic = false;
                link.dataKeys[link.segmentParts[j].substring(1)] = true;
            }
            else if (stillCountingStatic) {
                link.staticLen++;
            }
        }
    }
    // sort by the number of parts, with the links
    // with the most parts first
    return links.sort(sortConfigLinks);
};
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function sortConfigLinks(a, b) {
    // sort by the number of parts
    if (a.segmentPartsLen > b.segmentPartsLen) {
        return -1;
    }
    if (a.segmentPartsLen < b.segmentPartsLen) {
        return 1;
    }
    // sort by the number of static parts in a row
    if (a.staticLen > b.staticLen) {
        return -1;
    }
    if (a.staticLen < b.staticLen) {
        return 1;
    }
    // sort by the number of total data parts
    if (a.dataLen < b.dataLen) {
        return -1;
    }
    if (a.dataLen > b.dataLen) {
        return 1;
    }
    return 0;
}
var /** @type {?} */ URL_REPLACE_REG = /\s+|\?|\!|\$|\,|\.|\+|\"|\'|\*|\^|\||\/|\\|\[|\]|#|%|`|>|<|;|:|@|&|=/g;
/**
 * @hidden
 */
export var DeepLinkConfigToken = new OpaqueToken('USERLINKS');
/**
 * @param {?} app
 * @param {?} userDeepLinkConfig
 * @return {?}
 */
export function setupUrlSerializer(app, userDeepLinkConfig) {
    return new UrlSerializer(app, userDeepLinkConfig);
}
/**
 * @param {?} navGroupStrings
 * @return {?}
 */
export function navGroupStringtoObjects(navGroupStrings) {
    // each string has a known format-ish, convert it to it
    return navGroupStrings.map(function (navGroupString) {
        var /** @type {?} */ sections = navGroupString.split('/');
        if (sections[0] === 'nav') {
            return {
                type: 'nav',
                navId: sections[1],
                niceId: sections[1],
                secondaryId: null,
                segmentPieces: sections.splice(2)
            };
        }
        else if (sections[0] === 'tabs') {
            return {
                type: 'tabs',
                navId: sections[1],
                niceId: sections[1],
                secondaryId: sections[2],
                segmentPieces: sections.splice(3)
            };
        }
        return {
            type: null,
            navId: null,
            niceId: null,
            secondaryId: null,
            segmentPieces: sections
        };
    });
}
/**
 * @param {?} url
 * @return {?}
 */
export function urlToNavGroupStrings(url) {
    var /** @type {?} */ tokens = url.split('/');
    var /** @type {?} */ keywordIndexes = [];
    for (var /** @type {?} */ i = 0; i < tokens.length; i++) {
        if (i !== 0 && (tokens[i] === 'nav' || tokens[i] === 'tabs')) {
            keywordIndexes.push(i);
        }
    }
    // append the last index + 1 to the list no matter what
    keywordIndexes.push(tokens.length);
    var /** @type {?} */ groupings = [];
    var /** @type {?} */ activeKeywordIndex = 0;
    var /** @type {?} */ tmpArray = [];
    for (var /** @type {?} */ i = 0; i < tokens.length; i++) {
        if (i >= keywordIndexes[activeKeywordIndex]) {
            groupings.push(tmpArray.join('/'));
            tmpArray = [];
            activeKeywordIndex++;
        }
        tmpArray.push(tokens[i]);
    }
    // okay, after the loop we've gotta push one more time just to be safe
    groupings.push(tmpArray.join('/'));
    return groupings;
}
/**
 * @param {?} app
 * @param {?} url
 * @param {?} navLinks
 * @return {?}
 */
export function convertUrlToSegments(app, url, navLinks) {
    var /** @type {?} */ pairs = convertUrlToDehydratedSegments(url, navLinks);
    return hydrateSegmentsWithNav(app, pairs);
}
/**
 * @param {?} url
 * @param {?} navLinks
 * @return {?}
 */
export function convertUrlToDehydratedSegments(url, navLinks) {
    var /** @type {?} */ navGroupStrings = urlToNavGroupStrings(url);
    var /** @type {?} */ navGroups = navGroupStringtoObjects(navGroupStrings);
    return getSegmentsFromNavGroups(navGroups, navLinks);
}
/**
 * @param {?} app
 * @param {?} dehydratedSegmentPairs
 * @return {?}
 */
export function hydrateSegmentsWithNav(app, dehydratedSegmentPairs) {
    var /** @type {?} */ segments = [];
    for (var /** @type {?} */ i = 0; i < dehydratedSegmentPairs.length; i++) {
        var /** @type {?} */ navs = getNavFromNavGroup(dehydratedSegmentPairs[i].navGroup, app);
        // okay, cool, let's walk through the segments and hydrate them
        for (var _i = 0, _a = dehydratedSegmentPairs[i].segments; _i < _a.length; _i++) {
            var dehydratedSegment = _a[_i];
            if (navs.length === 1) {
                segments.push(hydrateSegment(dehydratedSegment, navs[0]));
                navs = navs[0].getActiveChildNavs();
            }
            else if (navs.length > 1) {
                // this is almost certainly an async race condition bug in userland
                // if you're in this state, it would be nice to just bail here
                // but alas we must perservere and handle the issue
                // the simple solution is to just use the last child
                // because that is probably what the user wants anyway
                // remember, do not harm, even if it makes our shizzle ugly
                segments.push(hydrateSegment(dehydratedSegment, navs[navs.length - 1]));
                navs = navs[navs.length - 1].getActiveChildNavs();
            }
            else {
                break;
            }
        }
    }
    return segments;
}
/**
 * @param {?} navGroup
 * @param {?} app
 * @return {?}
 */
export function getNavFromNavGroup(navGroup, app) {
    if (navGroup.navId) {
        var /** @type {?} */ rootNav = app.getNavByIdOrName(navGroup.navId);
        if (rootNav) {
            return [rootNav];
        }
        return [];
    }
    // we don't know what nav to use, so just use the root nav.
    // if there is more than one root nav, throw an error
    return app.getRootNavs();
}
/**
 * @param {?} navGroups
 * @param {?} navLinks
 * @return {?}
 */
export function getSegmentsFromNavGroups(navGroups, navLinks) {
    var /** @type {?} */ pairs = [];
    var /** @type {?} */ usedNavLinks = new Set();
    for (var _i = 0, navGroups_1 = navGroups; _i < navGroups_1.length; _i++) {
        var navGroup = navGroups_1[_i];
        var /** @type {?} */ segments = [];
        var /** @type {?} */ segmentPieces = navGroup.segmentPieces.concat([]);
        for (var /** @type {?} */ i = segmentPieces.length; i >= 0; i--) {
            var /** @type {?} */ created = false;
            for (var /** @type {?} */ j = 0; j < i; j++) {
                var /** @type {?} */ startIndex = i - j - 1;
                var /** @type {?} */ endIndex = i;
                var /** @type {?} */ subsetOfUrl = segmentPieces.slice(startIndex, endIndex);
                for (var _a = 0, navLinks_1 = navLinks; _a < navLinks_1.length; _a++) {
                    var navLink = navLinks_1[_a];
                    if (!usedNavLinks.has(navLink.name)) {
                        var /** @type {?} */ segment = getSegmentsFromUrlPieces(subsetOfUrl, navLink);
                        if (segment) {
                            i = startIndex + 1;
                            usedNavLinks.add(navLink.name);
                            created = true;
                            // sweet, we found a segment
                            segments.push(segment);
                            // now we want to null out the url subsection in the segmentPieces
                            for (var /** @type {?} */ k = startIndex; k < endIndex; k++) {
                                segmentPieces[k] = null;
                            }
                            break;
                        }
                    }
                }
                if (created) {
                    break;
                }
            }
            if (!created && segmentPieces[i - 1]) {
                // this is very likely a tab's secondary identifier
                segments.push({
                    id: null,
                    name: null,
                    secondaryId: segmentPieces[i - 1],
                    component: null,
                    loadChildren: null,
                    data: null,
                    defaultHistory: null
                });
            }
        }
        // since we're getting segments in from right-to-left in the url, reverse them
        // so they're in the correct order. Also filter out and bogus segments
        var /** @type {?} */ orderedSegments = segments.reverse();
        // okay, this is the lazy persons approach here.
        // so here's the deal! Right now if section of the url is not a part of a segment
        // it is almost certainly the secondaryId for a tabs component
        // basically, knowing the segment for the `tab` itself is good, but we also need to know
        // which tab is selected, so we have an identifer in the url that is associated with the tabs component
        // telling us which tab is selected. With that in mind, we are going to go through and find the segments with only secondary identifiers,
        // and simply add the secondaryId to the next segment, and then remove the empty segment from the list
        for (var /** @type {?} */ i = 0; i < orderedSegments.length; i++) {
            if (orderedSegments[i].secondaryId && !orderedSegments[i].id && ((i + 1) <= orderedSegments.length - 1)) {
                orderedSegments[i + 1].secondaryId = orderedSegments[i].secondaryId;
                orderedSegments[i] = null;
            }
        }
        var /** @type {?} */ cleanedSegments = segments.filter(function (segment) { return !!segment; });
        // if the nav group has a secondary id, make sure the first segment also has it set
        if (navGroup.secondaryId && segments.length) {
            cleanedSegments[0].secondaryId = navGroup.secondaryId;
        }
        pairs.push({
            navGroup: navGroup,
            segments: cleanedSegments
        });
    }
    return pairs;
}
/**
 * @param {?} urlSections
 * @param {?} navLink
 * @return {?}
 */
export function getSegmentsFromUrlPieces(urlSections, navLink) {
    if (navLink.segmentPartsLen !== urlSections.length) {
        return null;
    }
    for (var /** @type {?} */ i = 0; i < urlSections.length; i++) {
        if (!isPartMatch(urlSections[i], navLink.segmentParts[i])) {
            // just return an empty array if the part doesn't match
            return null;
        }
    }
    return {
        id: urlSections.join('/'),
        name: navLink.name,
        component: navLink.component,
        loadChildren: navLink.loadChildren,
        data: createMatchedData(urlSections, navLink),
        defaultHistory: navLink.defaultHistory
    };
}
/**
 * @param {?} segment
 * @param {?} nav
 * @return {?}
 */
export function hydrateSegment(segment, nav) {
    var /** @type {?} */ hydratedSegment = (Object.assign({}, segment));
    hydratedSegment.type = nav.getType();
    hydratedSegment.navId = nav.name || nav.id;
    // secondaryId is set on an empty dehydrated segment in the case of tabs to identify which tab is selected
    hydratedSegment.secondaryId = segment.secondaryId;
    return hydratedSegment;
}
/**
 * @param {?} urlChunks
 * @param {?} navLink
 * @return {?}
 */
export function getNonHydratedSegmentIfLinkAndUrlMatch(urlChunks, navLink) {
    var /** @type {?} */ allSegmentsMatch = true;
    for (var /** @type {?} */ i = 0; i < urlChunks.length; i++) {
        if (!isPartMatch(urlChunks[i], navLink.segmentParts[i])) {
            allSegmentsMatch = false;
            break;
        }
    }
    if (allSegmentsMatch) {
        return {
            id: navLink.segmentParts.join('/'),
            name: navLink.name,
            component: navLink.component,
            loadChildren: navLink.loadChildren,
            data: createMatchedData(urlChunks, navLink),
            defaultHistory: navLink.defaultHistory
        };
    }
    return null;
}
//# sourceMappingURL=url-serializer.js.map