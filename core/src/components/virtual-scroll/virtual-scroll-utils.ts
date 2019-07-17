import { Cell, HeaderFn, ItemHeightFn, ItemRenderFn, VirtualNode } from '../../interface';

import { CELL_TYPE_FOOTER, CELL_TYPE_HEADER, CELL_TYPE_ITEM, NODE_CHANGE_CELL, NODE_CHANGE_NONE, NODE_CHANGE_POSITION } from './constants';
import { CellType } from './virtual-scroll-interface';

export interface Viewport {
  top: number;
  bottom: number;
}

export interface Range {
  offset: number;
  length: number;
}

const MIN_READS = 2;

export const updateVDom = (dom: VirtualNode[], heightIndex: Uint32Array, cells: Cell[], range: Range) => {
  // reset dom
  for (const node of dom) {
    node.change = NODE_CHANGE_NONE;
    node.d = true;
  }

  // try to match into exisiting dom
  const toMutate = [];
  const end = range.offset + range.length;

  for (let i = range.offset; i < end; i++) {
    const cell = cells[i];
    const node = dom.find(n => n.d && n.cell === cell);
    if (node) {
      const top = heightIndex[i];
      if (top !== node.top) {
        node.top = top;
        node.change = NODE_CHANGE_POSITION;
      }
      node.d = false;
    } else {
      toMutate.push(cell);
    }
  }

  // needs to append
  const pool = dom.filter(n => n.d);

  for (const cell of toMutate) {
    const node = pool.find(n => n.d && n.cell.type === cell.type);
    const index = cell.i;
    if (node) {
      node.d = false;
      node.change = NODE_CHANGE_CELL;
      node.cell = cell;
      node.top = heightIndex[index];
    } else {
      dom.push({
        d: false,
        cell,
        visible: true,
        change: NODE_CHANGE_CELL,
        top: heightIndex[index],
      });
    }
  }
  dom
    .filter(n => n.d && n.top !== -9999)
    .forEach(n => {
      n.change = NODE_CHANGE_POSITION;
      n.top = -9999;
    });
};

export const doRender = (
  el: HTMLElement,
  nodeRender: ItemRenderFn,
  dom: VirtualNode[],
  updateCellHeight: (cell: Cell, node: HTMLElement) => void
) => {
  const children = Array.from(el.children).filter(n => n.tagName !== 'TEMPLATE');
  const childrenNu = children.length;
  let child: HTMLElement;
  for (let i = 0; i < dom.length; i++) {
    const node = dom[i];
    const cell = node.cell;

    // the cell change, the content must be updated
    if (node.change === NODE_CHANGE_CELL) {
      if (i < childrenNu) {
        child = children[i] as HTMLElement;
        nodeRender(child, cell, i);
      } else {
        const newChild = createNode(el, cell.type);
        child = nodeRender(newChild, cell, i) || newChild;
        child.classList.add('virtual-item');
        el.appendChild(child!);
      }
      (child as any)['$ionCell'] = cell;
    } else {
      child = children[i] as HTMLElement;
    }

    // only update position when it changes
    if (node.change !== NODE_CHANGE_NONE) {
      child.style.transform = `translate3d(0,${node.top}px,0)`;
    }

    // update visibility
    const visible = cell.visible;
    if (node.visible !== visible) {
      if (visible) {
        child.classList.remove('virtual-loading');
      } else {
        child.classList.add('virtual-loading');
      }
      node.visible = visible;
    }

    // dynamic height
    if (cell.reads > 0) {
      updateCellHeight(cell, child);
      cell.reads--;
    }
  }
};

const createNode = (el: HTMLElement, type: CellType): HTMLElement | null => {
  const template = getTemplate(el, type);
  if (template && el.ownerDocument) {
    return el.ownerDocument.importNode(template.content, true).children[0] as HTMLElement;
  }
  return null;
};

const getTemplate = (el: HTMLElement, type: CellType): HTMLTemplateElement | null => {
  switch (type) {
    case CELL_TYPE_ITEM: return el.querySelector('template:not([name])');
    case CELL_TYPE_HEADER: return el.querySelector('template[name=header]');
    case CELL_TYPE_FOOTER: return el.querySelector('template[name=footer]');
  }
};

export const getViewport = (scrollTop: number, vierportHeight: number, margin: number): Viewport => {
  return {
    top: Math.max(scrollTop - margin, 0),
    bottom: scrollTop + vierportHeight + margin
  };
};

export const getRange = (heightIndex: Uint32Array, viewport: Viewport, buffer: number): Range => {
  const topPos = viewport.top;
  const bottomPos = viewport.bottom;

  // find top index
  let i = 0;
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] > topPos) {
      break;
    }
  }
  const offset = Math.max(i - buffer - 1, 0);

  // find bottom index
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] >= bottomPos) {
      break;
    }
  }

  const end = Math.min(i + buffer, heightIndex.length);
  const length = end - offset;
  return { offset, length };
};

export const getShouldUpdate = (dirtyIndex: number, currentRange: Range, range: Range) => {
  const end = range.offset + range.length;
  return (
    dirtyIndex <= end ||
    currentRange.offset !== range.offset ||
    currentRange.length !== range.length
  );
};

export const findCellIndex = (cells: Cell[], index: number): number => {
  const max = cells.length > 0 ? cells[cells.length - 1].index : 0;
  if (index === 0) {
    return 0;
  } else if (index === max + 1) {
    return cells.length;
  } else {
    return cells.findIndex(c => c.index === index);
  }
};

export const inplaceUpdate = (dst: Cell[], src: Cell[], offset: number) => {
  if (offset === 0 && src.length >= dst.length) {
    return src;
  }
  for (let i = 0; i < src.length; i++) {
    dst[i + offset] = src[i];
  }
  return dst;
};

export const calcCells = (
  items: any[],

  itemHeight: ItemHeightFn | undefined,
  headerFn: HeaderFn | undefined,
  footerFn: HeaderFn | undefined,

  approxHeaderHeight: number,
  approxFooterHeight: number,
  approxItemHeight: number,

  j: number,
  offset: number,
  len: number
): Cell[] => {
  const cells: Cell[] = [];
  const end = len + offset;
  for (let i = offset; i < end; i++) {
    const item = items[i];
    if (headerFn) {
      const value = headerFn(item, i, items);
      if (value != null) {
        cells.push({
          i: j++,
          type: CELL_TYPE_HEADER,
          value,
          index: i,
          height: approxHeaderHeight,
          reads: MIN_READS,
          visible: false,
        });
      }
    }

    cells.push({
      i: j++,
      type: CELL_TYPE_ITEM,
      value: item,
      index: i,
      height: itemHeight ? itemHeight(item, i) : approxItemHeight,
      reads: itemHeight ? 0 : MIN_READS,
      visible: !!itemHeight,
    });

    if (footerFn) {
      const value = footerFn(item, i, items);
      if (value != null) {
        cells.push({
          i: j++,
          type: CELL_TYPE_FOOTER,
          value,
          index: i,
          height: approxFooterHeight,
          reads: 2,
          visible: false,
        });
      }
    }
  }
  return cells;
};

export const calcHeightIndex = (buf: Uint32Array, cells: Cell[], index: number): number => {
  let acum = buf[index];
  for (let i = index; i < buf.length; i++) {
    buf[i] = acum;
    acum += cells[i].height;
  }
  return acum;
};

export const resizeBuffer = (buf: Uint32Array | undefined, len: number) => {
  if (!buf) {
    return new Uint32Array(len);
  }
  if (buf.length === len) {
    return buf;
  } else if (len > buf.length) {
    const newBuf = new Uint32Array(len);
    newBuf.set(buf);
    return newBuf;
  } else {
    return buf.subarray(0, len);
  }
};

export const positionForIndex = (index: number, cells: Cell[], heightIndex: Uint32Array): number => {
  const cell = cells.find(c => c.type === CELL_TYPE_ITEM && c.index === index);
  if (cell) {
    return heightIndex[cell.i];
  }
  return -1;
};
