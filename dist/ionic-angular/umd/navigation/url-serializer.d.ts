import { OpaqueToken } from '@angular/core';
import { App } from '../components/app/app';
import { NavigationContainer } from './navigation-container';
import { DeepLinkConfig, DehydratedSegment, DehydratedSegmentPair, NavGroup, NavLink, NavSegment } from './nav-util';
/**
 * @hidden
 */
export declare class UrlSerializer {
    _app: App;
    links: NavLink[];
    constructor(_app: App, config: DeepLinkConfig);
    /**
     * Parse the URL into a Path, which is made up of multiple NavSegments.
     * Match which components belong to each segment.
     */
    parse(browserUrl: string): NavSegment[];
    createSegmentFromName(navContainer: NavigationContainer, nameOrComponent: any, data?: any): NavSegment;
    getLinkFromName(nameOrComponent: any): NavLink;
    /**
     * Serialize a path, which is made up of multiple NavSegments,
     * into a URL string. Turn each segment into a string and concat them to a URL.
     */
    serialize(segments: NavSegment[]): string;
    /**
     * Serializes a component and its data into a NavSegment.
     */
    serializeComponent(navContainer: NavigationContainer, component: any, data: any): NavSegment;
    /**
   * @internal
   */
    _createSegment(app: App, navContainer: NavigationContainer, configLink: NavLink, data: any): NavSegment;
}
export declare function formatUrlPart(name: string): string;
export declare const isPartMatch: (urlPart: string, configLinkPart: string) => boolean;
export declare const createMatchedData: (matchedUrlParts: string[], link: NavLink) => any;
export declare const findLinkByComponentData: (links: NavLink[], component: any, instanceData: any) => NavLink;
export declare const normalizeLinks: (links: NavLink[]) => NavLink[];
/**
 * @hidden
 */
export declare const DeepLinkConfigToken: OpaqueToken;
export declare function setupUrlSerializer(app: App, userDeepLinkConfig: any): UrlSerializer;
export declare function navGroupStringtoObjects(navGroupStrings: string[]): NavGroup[];
export declare function urlToNavGroupStrings(url: string): string[];
export declare function convertUrlToSegments(app: App, url: string, navLinks: NavLink[]): NavSegment[];
export declare function convertUrlToDehydratedSegments(url: string, navLinks: NavLink[]): DehydratedSegmentPair[];
export declare function hydrateSegmentsWithNav(app: App, dehydratedSegmentPairs: DehydratedSegmentPair[]): NavSegment[];
export declare function getNavFromNavGroup(navGroup: NavGroup, app: App): NavigationContainer[];
export declare function getSegmentsFromNavGroups(navGroups: NavGroup[], navLinks: NavLink[]): DehydratedSegmentPair[];
export declare function getSegmentsFromUrlPieces(urlSections: string[], navLink: NavLink): DehydratedSegment;
export declare function hydrateSegment(segment: DehydratedSegment, nav: NavigationContainer): NavSegment;
export declare function getNonHydratedSegmentIfLinkAndUrlMatch(urlChunks: string[], navLink: NavLink): DehydratedSegment;
