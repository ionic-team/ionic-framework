
export const enum CellType {
  Item,
  Header,
  Footer
}

export interface Cell {
  type: CellType;
  value: any;
  i: number;
  index: number;
  height: number;
  reads: number;
  visible: boolean;
}

export interface VirtualNode {
  cell: Cell;
  top: number;
  change: number;
  _d: boolean;
}

export type NodeHeightFn = (node: VirtualNode, index: number) => number;
export type HeaderFn = (item: any, index: number, items: any[]) => string | null;
export type ItemHeightFn = (item: any, index?: number) => number;
export type ItemRenderFn = (el: HTMLElement|null, cell: Cell, domIndex?: number) => HTMLElement;
export type DomRenderFn = (dom: VirtualNode[], height: number) => void;

export function updateVDom(dom: VirtualNode[], heightIndex: Uint32Array, cells: Cell[], top: number, bottom: number) {
  // reset dom
  for (const node of dom) {
    node.top = -9999;
    node.change = 0;
    node._d = true;
  }

  // try to match into exisiting dom
  const toMutate = [];
  const end = bottom + 1;

  for (let i = top; i < end; i++) {
    const cell = cells[i];
    const node = dom.find((n) => n._d && n.cell === cell);
    if (node) {
      node._d = false;
      node.change = 1;
      node.top = heightIndex[i];
    } else {
      toMutate.push(cell);
    }
  }

  // needs to append
  const pool = dom.filter((n) => n._d);

  // console.log('toMutate', toMutate.length);
  for (const cell of toMutate) {
    const node = pool.find(n => n._d && n.cell.type === cell.type);
    const index = cell.index;
    if (node) {
      node._d = false;
      node.change = 2;
      node.cell = cell;
      node.top = heightIndex[index];
    } else {
      dom.push({
        _d: false,
        change: 2,
        cell: cell,
        top: heightIndex[index],
      });
    }
  }
}

export function doRender(el: HTMLElement, itemRender: ItemRenderFn, dom: VirtualNode[], updateCellHeight: Function, total: number) {
  const children = el.children;
  let child: HTMLElement;
  for (let i = 0; i < dom.length; i++) {
    const node = dom[i];
    const cell = node.cell;
    if (node.change === 2) {
      if (i < children.length) {
        child = children[i] as HTMLElement;
        itemRender(child, cell, i);
      } else {
        child = itemRender(null, cell, i);
        child.classList.add('virtual-item');
        el.appendChild(child);
      }
    } else {
      child = children[i] as HTMLElement;
    }
    (child as any)['$ionCell'] = cell;
    if (node.change !== 0) {
      child.style.transform = `translate3d(0,${node.top}px,0)`;
    }
    if (cell.visible) {
      child.classList.remove('virtual-loading');
    } else {
      child.classList.add('virtual-loading');
    }
    if (cell.reads > 0) {
      updateCellHeight(cell, child);
    }
  }
  el.style.height = total + 'px';
}

export function doHeight(el: HTMLElement, index: number) {
  const e = (el.children[index] as HTMLElement);
  // const style = window.getComputedStyle(e);
  return e.offsetHeight;
}

export function getTotalHeight(heightIndex: Uint32Array) {
  return heightIndex[heightIndex.length - 1];
}

export interface Viewport {
  top: number;
  bottom: number;
}

export function getViewport(scrollTop: number, vierportHeight: number, margin: number): Viewport {
  return {
    top: scrollTop - margin,
    bottom: scrollTop + vierportHeight + margin
  };
}

export function getBounds(heightIndex: Uint32Array, viewport: Viewport, buffer: number) {
  const topPos = viewport.top;
  const bottomPos = viewport.bottom;

  // find top index
  let i = 0;
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] > topPos) {
      break;
    }
  }
  const top = Math.max(i - buffer, 0);

  // find bottom index
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] > bottomPos) {
      break;
    }
  }
  const bottom = Math.min(i + buffer, heightIndex.length - 1);
  return { top, bottom };
}

export function getShouldUpdate(dirtyIndex: number, currentTop: number, currentBottom: number, top: number, bottom: number) {
  return (
    dirtyIndex < bottom ||
    currentTop !== top ||
    currentBottom !== bottom
  );
}


export function calcHeightIndex(buf: Uint32Array, cells: Cell[], index: number, bottom: number) {
  if (!cells) {
    return buf;
  }
  buf = resizeBuffer(buf, cells.length);

  let acum = buf[index];
  for (; index < buf.length; index++) {
    buf[index] = acum;
    acum += cells[index].height;
    // if (acum > bottom) {
    //   break;
    // }
  }
  return buf;
}


export function resizeBuffer(buf: Uint32Array, len: number) {
  if (!buf) {
    return new Uint32Array(len);
  }
  if (buf.length === len) {
    return buf;
  }
  return buf;
}

