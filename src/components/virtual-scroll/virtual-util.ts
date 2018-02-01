import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { assert } from '../../util/util';

import { Platform } from '../../platform/platform';

const PREVIOUS_CELL = {
  row: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  tmpl: -1
};
/**
 * NO DOM
 */
export function processRecords(stopAtHeight: number,
  records: any[], cells: VirtualCell[],
  headerFn: Function, footerFn: Function,
  data: VirtualData) {
  let record: any;
  let startRecordIndex: number;
  let previousCell: VirtualCell;
  let tmpData: any;
  let lastRecordIndex = records ? (records.length - 1) : -1;

  if (cells.length) {
    // we already have cells
    previousCell = cells[cells.length - 1];
    if (previousCell.top + previousCell.height > stopAtHeight) {
      return;
    }
    startRecordIndex = (previousCell.record + 1);

  } else {
    // no cells have been created yet
    previousCell = PREVIOUS_CELL;
    startRecordIndex = 0;
  }

  let processedTotal = 0;

  for (var recordIndex = startRecordIndex; recordIndex <= lastRecordIndex; recordIndex++) {
    record = records[recordIndex];

    if (headerFn) {
      tmpData = headerFn(record, recordIndex, records);

      if (tmpData !== null) {
        // add header data
        previousCell = addCell(previousCell, recordIndex, TemplateType.Header, tmpData,
          data.hdrWidth, data.hdrHeight, data.viewWidth);
        cells.push(previousCell);
      }
    }

    // add item data
    previousCell = addCell(previousCell, recordIndex, TemplateType.Item, null,
      data.itmWidth, data.itmHeight, data.viewWidth);
    cells.push(previousCell);

    if (footerFn) {
      tmpData = footerFn(record, recordIndex, records);

      if (tmpData !== null) {
        // add footer data
        previousCell = addCell(previousCell, recordIndex, TemplateType.Footer, tmpData,
          data.ftrWidth, data.ftrHeight, data.viewWidth);
        cells.push(previousCell);
      }
    }

    if (previousCell.record === lastRecordIndex) {
      previousCell.isLast = true;
    }

    // should always process at least 3 records
    processedTotal++;

    if (previousCell.top + previousCell.height + data.itmHeight > stopAtHeight && processedTotal > 3) {
      return;
    }
  }
}


function addCell(previousCell: VirtualCell, recordIndex: number, tmpl: number, tmplData: any,
  cellWidth: number, cellHeight: number, viewportWidth: number) {
  const newCell: VirtualCell = {
    record: recordIndex,
    tmpl: tmpl,
    width: cellWidth,
    height: cellHeight,
    reads: 0
  };
  if (previousCell.left + previousCell.width + cellWidth > viewportWidth) {
    // add a new cell in a new row
    newCell.row = (previousCell.row + 1);
    newCell.top = (previousCell.top + previousCell.height);
    newCell.left = 0;
  } else {
    // add a new cell in the same row
    newCell.row = previousCell.row;
    newCell.top = previousCell.top;
    newCell.left = (previousCell.left + previousCell.width);
  }

  if (tmplData) {
    newCell.data = tmplData;
  }

  return newCell;
}


/**
 * NO DOM
 */
export function populateNodeData(startCellIndex: number, endCellIndex: number, scrollingDown: boolean,
  cells: VirtualCell[], records: any[], nodes: VirtualNode[], viewContainer: ViewContainerRef,
  itmTmp: TemplateRef<VirtualContext>, hdrTmp: TemplateRef<VirtualContext>, ftrTmp: TemplateRef<VirtualContext>): boolean {
  if (!records || records.length === 0) {
    nodes.length = 0;
    viewContainer.clear();
    return true;
  }
  const recordsLength = records.length;

  let hasChanges = false;
  // let node: VirtualNode;
  let availableNode: VirtualNode;
  let cell: VirtualCell;
  let viewInsertIndex: number = null;
  let totalNodes = nodes.length;
  let templateRef: TemplateRef<VirtualContext>;
  startCellIndex = Math.max(startCellIndex, 0);
  endCellIndex = Math.min(endCellIndex, cells.length - 1);

  const usedNodes: VirtualNode[] = [];
  for (var cellIndex = startCellIndex; cellIndex <= endCellIndex; cellIndex++) {
    cell = cells[cellIndex];
    availableNode = null;

    // find the first one that's available
    const existingNode = nodes.find(n => n.cell === cellIndex && n.tmpl === cell.tmpl);
    if (existingNode) {
      if (existingNode.view.context.$implicit === records[cell.record]) {
        usedNodes.push(existingNode);
        continue; // optimization: node data is the same no need to update
      }
      console.debug('virtual-util', 'data is not the same, will need to update node. Setting as available node');
      availableNode = existingNode; // update existing node
    } else {
      console.debug('virtual-util', 'cell was not rendered in current nodes, will now look for an available node');
      for (var i = 0; i < totalNodes; i++) {
        const node = nodes[i];

        if (cell.tmpl !== node.tmpl || i === 0 && cellIndex !== 0) {
          // the cell must use the correct template
          // first node can only be used by the first cell (css :first-child reasons)
          // this node is never available to be reused
          continue;
        }

        if (node.cell < startCellIndex || node.cell > endCellIndex) {

          if (!availableNode) {
            // havent gotten an available node yet
            availableNode = node;
            console.debug('virtual-util', 'found node to reuse', availableNode);
          } else if (scrollingDown) {
            // scrolling down
            if (node.cell < availableNode.cell) {
              availableNode = node;
              console.debug('virtual-util', 'scrolling-down found better node to reuse', availableNode);
            }
          } else {
            // scrolling up
            if (node.cell > availableNode.cell) {
              availableNode = node;
              console.debug('virtual-util', 'scrolling-up found better node to reuse', availableNode);
            }
          }
        }
      }
    }

    if (!availableNode) {
      // did not find an available node to put the cell data into
      // insert a new node after existing ones
      if (viewInsertIndex === null) {
        viewInsertIndex = -1;
        for (var j = totalNodes - 1; j >= 0; j--) {
          const node = nodes[j];
          if (node) {
            viewInsertIndex = viewContainer.indexOf(node.view);
            break;
          }
        }
      }

      // select which templateRef should be used for this cell
      templateRef = cell.tmpl === TemplateType.Header ? hdrTmp : cell.tmpl === TemplateType.Footer ? ftrTmp : itmTmp;
      if (!templateRef) {
        console.error(`virtual${cell.tmpl === TemplateType.Header ? 'Header' : cell.tmpl === TemplateType.Footer ? 'Footer' : 'Item'} template required`);
        continue;
      }

      availableNode = {
        tmpl: cell.tmpl,
        view: viewContainer.createEmbeddedView(
          templateRef,
          new VirtualContext(null, null, null),
          viewInsertIndex
        )
      };

      totalNodes = nodes.push(availableNode);
    }

    // assign who's the new cell index for this node
    availableNode.cell = cellIndex;

    // apply the cell's data to this node
    var context = availableNode.view.context;
    context.$implicit = cell.data || records[cell.record];
    context.index = cellIndex;
    context.count = recordsLength;
    availableNode.hasChanges = true;
    availableNode.lastTransform = null;
    hasChanges = true;
    usedNodes.push(availableNode);
  }

  const unusedNodes = nodes.filter(n => usedNodes.indexOf(n) < 0);
  unusedNodes.forEach(node => {
    const index = viewContainer.indexOf(node.view);
    viewContainer.remove(index);
    const removeIndex = nodes.findIndex(n => n === node);
    nodes.splice(removeIndex, 1);
  });
  usedNodes.length = 0;
  unusedNodes.length = 0;

  return hasChanges;
}


/**
 * DOM READ
 */
export function initReadNodes(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData) {
  if (nodes.length && cells.length) {
    // first node
    // ******** DOM READ ****************
    var ele = getElement(nodes[0]);
    var firstCell = cells[0];
    firstCell.top = ele.clientTop;
    firstCell.left = ele.clientLeft;
    firstCell.row = 0;

    // ******** DOM READ ****************
    updateDimensions(plt, nodes, cells, data, true);
  }
}


/**
 * DOM READ
 */
export function updateDimensions(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData, initialUpdate: boolean) {
  let node: VirtualNode;
  let element: VirtualHtmlElement;
  let cell: VirtualCell;
  let previousCell: VirtualCell;
  const totalCells = cells.length;

  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    cell = cells[node.cell];

    // read element dimensions if they haven't been checked enough times
    if (cell && cell.reads < REQUIRED_DOM_READS) {
      element = getElement(node);

      // ******** DOM READ ****************
      readElements(plt, cell, element);

      if (initialUpdate) {
        // update estimated dimensions with more accurate dimensions
        if (cell.tmpl === TemplateType.Header) {
          data.hdrHeight = cell.height;
          if (cell.left === 0) {
            data.hdrWidth = cell.width;
          }

        } else if (cell.tmpl === TemplateType.Footer) {
          data.ftrHeight = cell.height;
          if (cell.left === 0) {
            data.ftrWidth = cell.width;
          }

        } else {
          data.itmHeight = cell.height;
          if (cell.left === 0) {
            data.itmWidth = cell.width;
          }
        }
      }

      cell.reads++;
    }

  }

  // figure out which cells are currently viewable within the viewport
  const viewableBottom = (data.scrollTop + data.viewHeight);
  data.topViewCell = totalCells;
  data.bottomViewCell = 0;

  if (totalCells > 0) {
    // completely realign position to ensure they're all accurately placed
    cell = cells[0];
    previousCell = {
      row: 0,
      width: 0,
      height: 0,
      top: cell.top,
      left: 0,
      tmpl: -1
    };

    for (let i = 0; i < totalCells; i++) {
      cell = cells[i];

      if (previousCell.left + previousCell.width + cell.width > data.viewWidth) {
        // new row
        cell.row++;
        cell.top = (previousCell.top + previousCell.height);
        cell.left = 0;
      } else {
        // same row
        cell.row = previousCell.row;
        cell.top = previousCell.top;
        cell.left = (previousCell.left + previousCell.width);
      }

      // figure out which cells are viewable within the viewport
      if (cell.top + cell.height > data.scrollTop && i < data.topViewCell) {
        data.topViewCell = i;

      } else if (cell.top < viewableBottom && i > data.bottomViewCell) {
        data.bottomViewCell = i;
      }
      previousCell = cell;
    }
  }
}


export function updateNodeContext(nodes: VirtualNode[], cells: VirtualCell[], data: VirtualData) {
  // ensure each node has the correct bounds in its context
  let node: VirtualNode;
  let cell: VirtualCell;
  let bounds: VirtualBounds;

  for (var i = 0, ilen = nodes.length; i < ilen; i++) {
    node = nodes[i];
    cell = cells[node.cell];

    if (node && cell) {
      bounds = node.view.context.bounds;

      bounds.top = cell.top + data.viewTop;
      bounds.bottom = bounds.top + cell.height;

      bounds.left = cell.left + data.viewLeft;
      bounds.right = bounds.left + cell.width;

      bounds.width = cell.width;
      bounds.height = cell.height;
    }
  }
}


/**
 * DOM READ
 */
function readElements(plt: Platform, cell: VirtualCell, element: VirtualHtmlElement) {
  // ******** DOM READ ****************
  const styles = plt.getElementComputedStyle(<any>element);

  // ******** DOM READ ****************
  cell.left = (element.clientLeft - parseFloat(styles.marginLeft));

  // ******** DOM READ ****************
  cell.width = (element.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight));

  // ******** DOM READ ****************
  cell.height = (element.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom));
}


/**
 * DOM WRITE
 */
export function writeToNodes(plt: Platform, nodes: VirtualNode[], cells: VirtualCell[], totalRecords: number) {
  let node: VirtualNode;
  let element: VirtualHtmlElement;
  let cell: VirtualCell;
  let transform: string;
  const totalCells = Math.max(totalRecords, cells.length);

  for (var i = 0, ilen = nodes.length; i < ilen; i++) {
    node = nodes[i];
    cell = cells[node.cell];

    transform = `translate3d(${cell.left}px,${cell.top}px,0px)`;

    if (node.lastTransform !== transform) {
      element = getElement(node);

      if (element) {
        // ******** DOM WRITE ****************
        element.style[plt.Css.transform] = node.lastTransform = transform;

        // ******** DOM WRITE ****************
        element.classList.add('virtual-position');

        // https://www.w3.org/TR/wai-aria/states_and_properties#aria-posinset
        // ******** DOM WRITE ****************
        element.setAttribute('aria-posinset', node.cell + 1);

        // https://www.w3.org/TR/wai-aria/states_and_properties#aria-setsize
        // ******** DOM WRITE ****************
        element.setAttribute('aria-setsize', totalCells);
      }
    }
  }
}

/**
 * NO DOM
 */
export function adjustRendered(cells: VirtualCell[], data: VirtualData) {

  const maxRenderHeight = (data.renderHeight - data.itmHeight);
  const totalCells = cells.length;
  const viewableRenderedPadding = (data.itmHeight < 90 ? VIEWABLE_RENDERED_PADDING : 0);

  if (data.scrollDiff > 0) {
    // scrolling down
    data.topCell = Math.max(data.topViewCell - viewableRenderedPadding, 0);
    data.bottomCell = data.topCell;

    let cellsRenderHeight = 0;
    for (let i = data.topCell; i < totalCells; i++) {
      cellsRenderHeight += cells[i].height;
      if (i > data.bottomCell) data.bottomCell = i;
      if (cellsRenderHeight >= maxRenderHeight) break;
    }

    if (cellsRenderHeight < maxRenderHeight) {
      // there are no more cells at the bottom, so move topCell to a smaller index
      for (let i = data.topCell - 1; i >= 0; i--) {
        cellsRenderHeight += cells[i].height;
        data.topCell = i;
        if (cellsRenderHeight >= maxRenderHeight) break;
      }
    }
  } else {
    // scroll up
    data.bottomCell = Math.min(data.bottomViewCell + viewableRenderedPadding, totalCells - 1);
    data.topCell = data.bottomCell;

    let cellsRenderHeight = 0;
    assert(data.bottomCell > 0, 'bottomCell should be greater than 0');
    for (let i = data.bottomCell; i >= 0; i--) {
      cellsRenderHeight += cells[i].height;
      if (i < data.topCell) data.topCell = i;
      if (cellsRenderHeight >= maxRenderHeight) break;
    }

    if (cellsRenderHeight < maxRenderHeight) {
      // there are no more cells at the top, so move bottomCell to a higher index
      for (let i = data.bottomCell; i < totalCells; i++) {
        cellsRenderHeight += cells[i].height;
        data.bottomCell = i;
        if (cellsRenderHeight >= maxRenderHeight) break;
      }
    }
  }
}


/**
 * NO DOM
 */
export function getVirtualHeight(totalRecords: number, lastCell: VirtualCell): number {
  if (lastCell.record >= totalRecords - 1) {
    return (lastCell.top + lastCell.height);
  }

  let unknownRecords = (totalRecords - lastCell.record - 1);
  let knownHeight = (lastCell.top + lastCell.height);

  return Math.ceil(knownHeight + ((knownHeight / (totalRecords - unknownRecords)) * unknownRecords));
}


/**
 * NO DOM
 */
export function estimateHeight(totalRecords: number, lastCell: VirtualCell, existingHeight: number, difference: number): number {
  if (!totalRecords || !lastCell) {
    return 0;
  }

  const newHeight = getVirtualHeight(totalRecords, lastCell);

  const percentToBottom = (lastCell.record / (totalRecords - 1));
  const diff = Math.abs(existingHeight - newHeight);

  if ((diff > (newHeight * difference)) ||
    (percentToBottom > .995)) {
    return newHeight;
  }

  return existingHeight;
}


/**
 * DOM READ
 */
export function calcDimensions(data: VirtualData,
  virtualScrollElement: HTMLElement,
  approxItemWidth: string, approxItemHeight: string,
  appoxHeaderWidth: string, approxHeaderHeight: string,
  approxFooterWidth: string, approxFooterHeight: string,
  bufferRatio: number) {

  // get the parent container's viewport bounds
  const viewportElement = virtualScrollElement.parentElement;

  // ******** DOM READ ****************
  data.viewWidth = viewportElement.offsetWidth;

  // ******** DOM READ ****************
  data.viewHeight = viewportElement.offsetHeight;


  // get the virtual scroll element's offset data
  // ******** DOM READ ****************
  data.viewTop = virtualScrollElement.offsetTop;

  // ******** DOM READ ****************
  data.viewLeft = virtualScrollElement.offsetLeft;


  // the height we'd like to render, which is larger than viewable
  data.renderHeight = (data.viewHeight * bufferRatio);

  if (data.viewWidth > 0 && data.viewHeight > 0) {
    data.itmWidth = calcWidth(data.viewWidth, approxItemWidth);
    data.itmHeight = calcHeight(data.viewHeight, approxItemHeight);
    data.hdrWidth = calcWidth(data.viewWidth, appoxHeaderWidth);
    data.hdrHeight = calcHeight(data.viewHeight, approxHeaderHeight);
    data.ftrWidth = calcWidth(data.viewWidth, approxFooterWidth);
    data.ftrHeight = calcHeight(data.viewHeight, approxFooterHeight);

    data.valid = true;
  }
}


/**
 * NO DOM
 */
function calcWidth(viewportWidth: number, approxWidth: string): number {
  if (approxWidth.indexOf('%') > 0) {
    return (viewportWidth * (parseFloat(approxWidth) / 100));

  } else if (approxWidth.indexOf('px') > 0) {
    return parseFloat(approxWidth);
  }

  throw new Error('virtual scroll width can only use "%" or "px" units');
}


/**
 * NO DOM
 */
function calcHeight(_viewportHeight: number, approxHeight: string): number {
  if (approxHeight.indexOf('px') > 0) {
    return parseFloat(approxHeight);
  }

  throw new Error('virtual scroll height must use "px" units');
}


/**
 * NO DOM
 */
function getElement(node: VirtualNode): VirtualHtmlElement {
  const rootNodes = node.view.rootNodes;
  for (var i = 0; i < rootNodes.length; i++) {
    if (rootNodes[i].nodeType === 1) {
      return rootNodes[i];
    }
  }
  return null;
}


export interface VirtualHtmlElement {
  clientTop: number;
  clientLeft: number;
  offsetTop: number;
  offsetLeft: number;
  offsetWidth: number;
  offsetHeight: number;
  style: any;
  classList: {
    add: { (name: string): void };
    remove: { (name: string): void };
  };
  setAttribute: { (name: string, value: any): void };
  parentElement: VirtualHtmlElement;
}


// could be either record data or divider data
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

// one of the rendered nodes
export interface VirtualNode {
  cell?: number;
  tmpl: number;
  view: EmbeddedViewRef<VirtualContext>;
  hasChanges?: boolean;
  lastTransform?: string;
}

export class VirtualContext {
  bounds: VirtualBounds = {};

  constructor(public $implicit: any, public index: number, public count: number) { }

  get first(): boolean { return this.index === 0; }

  get last(): boolean { return this.index === this.count - 1; }

  get even(): boolean { return this.index % 2 === 0; }

  get odd(): boolean { return !this.even; }

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

const enum TemplateType {
  Item = 0,
  Header = 1,
  Footer = 2
}

const VIEWABLE_RENDERED_PADDING = 3;
const REQUIRED_DOM_READS = 2;
