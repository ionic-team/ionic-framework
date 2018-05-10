export interface Viewport {
  top: number;
  bottom: number;
}

export interface Range {
  offset: number;
  length: number;
}

export const enum CellType {
  Item,
  Header,
  Footer
}

export const enum NodeChange {
  NoChange,
  Position,
  Cell,
}

export interface Cell {
  i: number;
  index: number;
  value: any;
  type: CellType;
  height: number;
  reads: number;
  visible: boolean;
}

export interface VirtualNode {
  cell: Cell;
  top: number;
  change: NodeChange;
  d: boolean;
  visible: boolean;
}
const MIN_READS = 2;


export type HeaderFn = (item: any, index: number, items: any[]) => string | null;
export type ItemHeightFn = (item: any, index?: number) => number;
export type ItemRenderFn = (el: HTMLElement|null, cell: Cell, domIndex?: number) => HTMLElement;
export type DomRenderFn = (dom: VirtualNode[]) => void;

export function updateVDom(dom: VirtualNode[], heightIndex: Uint32Array, cells: Cell[], range: Range) {
  // reset dom
  for (const node of dom) {
    node.change = NodeChange.NoChange;
    node.d = true;
  }

  // try to match into exisiting dom
  const toMutate = [];
  const end = range.offset + range.length;

  for (let i = range.offset; i < end; i++) {
    const cell = cells[i];
    const node = dom.find((n) => n.d && n.cell === cell);
    if (node) {
      const top = heightIndex[i];
      if (top !== node.top) {
        node.top = top;
        node.change = NodeChange.Position;
      }
      node.d = false;
    } else {
      toMutate.push(cell);
    }
  }

  // needs to append
  const pool = dom.filter((n) => n.d);

  for (const cell of toMutate) {
    const node = pool.find(n => n.d && n.cell.type === cell.type);
    const index = cell.index;
    if (node) {
      node.d = false;
      node.change = NodeChange.Cell;
      node.cell = cell;
      node.top = heightIndex[index];
    } else {
      dom.push({
        d: false,
        cell: cell,
        visible: true,
        change: NodeChange.Cell,
        top: heightIndex[index],
      });
    }
  }
  dom
  .filter((n) => n.d && n.top !== -9999)
  .forEach((n) => {
    n.change = NodeChange.Position;
    n.top = -9999;
  });
}


export function doRender(
  el: HTMLElement,
  nodeRender: ItemRenderFn,
  dom: VirtualNode[],
  updateCellHeight: Function
) {
  const children = el.children;
  const childrenNu = children.length;
  let child: HTMLElement;
  for (let i = 0; i < dom.length; i++) {
    const node = dom[i];
    const cell = node.cell;

    // the cell change, the content must be updated
    if (node.change === NodeChange.Cell) {
      if (i < childrenNu) {
        child = children[i] as HTMLElement;
        nodeRender(child, cell, i);
      } else {
        child = nodeRender(null, cell, i);
        child.classList.add('virtual-item');
        el.appendChild(child);
      }
      (child as any)['$ionCell'] = cell;
    } else {
      child = children[i] as HTMLElement;
    }

    // only update position when it changes
    if (node.change !== NodeChange.NoChange) {
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
}

export function getViewport(scrollTop: number, vierportHeight: number, margin: number): Viewport {
  return {
    top: Math.max(scrollTop - margin, 0),
    bottom: scrollTop + vierportHeight + margin
  };
}

export function getRange(heightIndex: Uint32Array, viewport: Viewport, buffer: number): Range {
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
}

export function getShouldUpdate(dirtyIndex: number, currentRange: Range, range: Range) {
  const end = range.offset + range.length;
  return (
    dirtyIndex <= end ||
    currentRange.offset !== range.offset ||
    currentRange.length !== range.length
  );
}


export function findCellIndex(cells: Cell[], index: number): number {
  if (index === 0) {
    return 0;
  }
  return cells.findIndex(c => c.index === index);
}

export function inplaceUpdate(dst: Cell[], src: Cell[], offset: number) {
  if (offset === 0 && src.length >= dst.length) {
    return src;
  }
  for (let i = 0; i < src.length; i++) {
    dst[i + offset] = src[i];
  }
  return dst;
}

export function calcCells(
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
): Cell[] {
  const cells = [];
  const end = len + offset;
  for (let i = offset; i < end; i++) {
    const item = items[i];
    if (headerFn) {
      const value = headerFn(item, i, items);
      if (value != null) {
        cells.push({
          i: j++,
          type: CellType.Header,
          value: value,
          index: i,
          height: approxHeaderHeight,
          reads: MIN_READS,
          visible: false,
        });
      }
    }

    cells.push({
      i: j++,
      type: CellType.Item,
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
          type: CellType.Footer,
          value: value,
          index: i,
          height: approxFooterHeight,
          reads: 2,
          visible: false,
        });
      }
    }
  }
  return cells;
}


export function calcHeightIndex(buf: Uint32Array, cells: Cell[], index: number): number {
  let acum = buf[index];
  for (; index < buf.length; index++) {
    buf[index] = acum;
    acum += cells[index].height;
  }
  return acum;
}


export function resizeBuffer(buf: Uint32Array | undefined, len: number) {
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
}

export function positionForIndex(index: number, cells: Cell[], heightIndex: Uint32Array): number {
  const cell = cells.find(cell => cell.type === CellType.Item && cell.index === index);
  if (cell) {
    return heightIndex[cell.i];
  }
  return -1;
}
