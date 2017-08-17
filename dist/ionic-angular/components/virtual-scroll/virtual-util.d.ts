import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { Platform } from '../../platform/platform';
/**
 * NO DOM
 */
export declare function processRecords(stopAtHeight: number, records: any[], cells: VirtualCell[], headerFn: Function, footerFn: Function, data: VirtualData): void;
/**
 * NO DOM
 */
export declare function populateNodeData(startCellIndex: number, endCellIndex: number, scrollingDown: boolean, cells: VirtualCell[], records: any[], nodes: VirtualNode[], viewContainer: ViewContainerRef, itmTmp: TemplateRef<VirtualContext>, hdrTmp: TemplateRef<VirtualContext>, ftrTmp: TemplateRef<VirtualContext>, initialLoad: boolean): boolean;
/**
 * DOM READ
 */
export declare function initReadNodes(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData): void;
/**
 * DOM READ
 */
export declare function updateDimensions(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData, initialUpdate: boolean): void;
export declare function updateNodeContext(nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData): void;
/**
 * DOM WRITE
 */
export declare function writeToNodes(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], totalRecords: number): void;
/**
 * NO DOM
 */
export declare function adjustRendered(cells: VirtualCell[], data: VirtualData): void;
/**
 * NO DOM
 */
export declare function getVirtualHeight(totalRecords: number, lastCell: VirtualCell): number;
/**
 * NO DOM
 */
export declare function estimateHeight(totalRecords: number, lastCell: VirtualCell, existingHeight: number, difference: number): number;
/**
 * DOM READ
 */
export declare function calcDimensions(data: VirtualData, virtualScrollElement: HTMLElement, approxItemWidth: string, approxItemHeight: string, appoxHeaderWidth: string, approxHeaderHeight: string, approxFooterWidth: string, approxFooterHeight: string, bufferRatio: number): void;
export interface VirtualHtmlElement {
    clientTop: number;
    clientLeft: number;
    offsetTop: number;
    offsetLeft: number;
    offsetWidth: number;
    offsetHeight: number;
    style: any;
    classList: {
        add: {
            (name: string): void;
        };
        remove: {
            (name: string): void;
        };
    };
    setAttribute: {
        (name: string, value: any): void;
    };
    parentElement: VirtualHtmlElement;
}
export interface VirtualCell {
    record?: number;
    tmpl?: number;
    data?: any;
    row?: number;
    left?: number;
    width?: number;
    top?: number;
    height?: number;
    reads?: number;
    isLast?: boolean;
}
export interface VirtualNode {
    cell?: number;
    tmpl: number;
    view: EmbeddedViewRef<VirtualContext>;
    hasChanges?: boolean;
    lastTransform?: string;
}
export declare class VirtualContext {
    $implicit: any;
    index: number;
    count: number;
    bounds: VirtualBounds;
    constructor($implicit: any, index: number, count: number);
    readonly first: boolean;
    readonly last: boolean;
    readonly even: boolean;
    readonly odd: boolean;
}
export interface VirtualBounds {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
}
export interface VirtualData {
    scrollTop?: number;
    scrollDiff?: number;
    viewTop?: number;
    viewLeft?: number;
    viewWidth?: number;
    viewHeight?: number;
    renderHeight?: number;
    topCell?: number;
    bottomCell?: number;
    topViewCell?: number;
    bottomViewCell?: number;
    valid?: boolean;
    itmWidth?: number;
    itmHeight?: number;
    hdrWidth?: number;
    hdrHeight?: number;
    ftrWidth?: number;
    ftrHeight?: number;
}
