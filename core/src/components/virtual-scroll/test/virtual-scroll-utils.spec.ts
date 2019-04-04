import { HeaderFn, ItemHeightFn, VirtualNode } from '../../../interface';
import { Range, calcCells, calcHeightIndex, getRange, getShouldUpdate, getViewport, positionForIndex, resizeBuffer, updateVDom } from '../virtual-scroll-utils';
import { CELL_TYPE_ITEM, CELL_TYPE_HEADER, CELL_TYPE_FOOTER } from '../constants';

describe('getViewport', () => {
  it('should return viewport without margin', () => {
    expect(getViewport(0, 100, 0)).toEqual({
      top: 0,
      bottom: 100,
    });
  });

  it('should return viewport with margin', () => {
    expect(getViewport(0, 100, 150)).toEqual({
      top: 0,
      bottom: 250,
    });
  });

  it('should return viewport with margin and scrollTop', () => {
    expect(getViewport(150, 100, 150)).toEqual({
      top: 0,
      bottom: 400,
    });
  });

  it('should return viewport with margin and scrollTop 2', () => {
    expect(getViewport(100, 100, 10)).toEqual({
      top: 90,
      bottom: 210,
    });
  });
});

describe('getRange', () => {
  it('should return initial bounds without buffer', () => {
    const heightBuffer = mockHeightBuffer(20, () => 10);
    const bounds = getRange(heightBuffer, { top: 0, bottom: 100 }, 0);

    expect(bounds).toEqual({
      offset: 0,
      length: 10,
    });
  });

  it('should return initial bounds with buffer', () => {
    const heightBuffer = mockHeightBuffer(20, () => 10);
    const bounds = getRange(heightBuffer, { top: 0, bottom: 100 }, 4);

    expect(bounds).toEqual({
      offset: 0,
      length: 14,
    });
  });

  it('should return initial bounds truncked', () => {
    const heightBuffer = mockHeightBuffer(5, () => 10);
    const bounds = getRange(heightBuffer, { top: 0, bottom: 100 }, 4);

    expect(bounds).toEqual({
      offset: 0,
      length: 5,
    });
  });

  it('should return just first component', () => {
    const heightBuffer = mockHeightBuffer(5, () => 100);
    expect(getRange(heightBuffer, { top: 0, bottom: 100 }, 0)).toEqual({
      offset: 0,
      length: 1,
    });

    expect(getRange(heightBuffer, { top: 50, bottom: 100 }, 0)).toEqual({
      offset: 0,
      length: 1,
    });

    expect(getRange(heightBuffer, { top: 100, bottom: 200 }, 0)).toEqual({
      offset: 1,
      length: 1,
    });
  });

  it('should return just two components', () => {
    const heightBuffer = mockHeightBuffer(5, () => 100);
    expect(getRange(heightBuffer, { top: 1, bottom: 101 }, 0)).toEqual({
      offset: 0,
      length: 2,
    });

    expect(getRange(heightBuffer, { top: 99, bottom: 200 }, 0)).toEqual({
      offset: 0,
      length: 2,
    });

    expect(getRange(heightBuffer, { top: 100, bottom: 201 }, 0)).toEqual({
      offset: 1,
      length: 2,
    });
  });

  it('should return three components', () => {
    const heightBuffer = mockHeightBuffer(5, () => 100);
    expect(getRange(heightBuffer, { top: 99, bottom: 201 }, 0)).toEqual({
      offset: 0,
      length: 3,
    });
  });
});

describe('resizeBuffer', () => {
  it('should allocate a buffer', () => {
    const buf = resizeBuffer(undefined, 10);
    expect(buf.length).toEqual(10);
  });

  it('should not allocate a buffer', () => {
    const buf = new Uint32Array(10);
    const buf2 = resizeBuffer(buf, 10);
    expect(buf).toBe(buf2);
    expect(buf.length).toEqual(10);
  });

  it('should grow a buffer', () => {
    const buf = new Uint32Array(10);
    buf[0] = 100;
    buf[9] = 123;

    const buf2 = resizeBuffer(buf, 12);
    expect(buf2.length).toEqual(12);
    expect(buf2[0]).toEqual(100);
    expect(buf2[9]).toEqual(123);
  });

  it('should shrink a buffer', () => {
    const buf = new Uint32Array(10);
    buf[0] = 100;
    buf[9] = 123;

    const buf2 = resizeBuffer(buf, 5);
    expect(buf2.length).toEqual(5);
    expect(buf2[0]).toEqual(100);
  });
});

describe('calcCells', () => {
  it('should calculate cells without headers and itemHeight', () => {
    const items = ['0', 2, 'hola', { data: 'hello' }];
    const cells = calcCells(items, undefined, undefined, undefined, 10, 20, 30, 0, 0, items.length);
    expect(cells).toEqual([
      {
        type: CELL_TYPE_ITEM,
        value: '0',
        i: 0,
        index: 0,
        height: 30,
        reads: 2,
        visible: false,
      },
      {
        type: CELL_TYPE_ITEM,
        value: 2,
        i: 1,
        index: 1,
        height: 30,
        reads: 2,
        visible: false,
      },
      {
        type: CELL_TYPE_ITEM,
        value: 'hola',
        i: 2,
        index: 2,
        height: 30,
        reads: 2,
        visible: false,
      },
      {
        type: CELL_TYPE_ITEM,
        value: { data: 'hello' },
        i: 3,
        index: 3,
        height: 30,
        reads: 2,
        visible: false,
      }
    ]);
  });

  it('should calculate cells with itemHeight', () => {
    const items = [10, 9, 8];
    let called = 0;
    const itemHeight: ItemHeightFn = (item: any, index: number) => {
      expect(item).toEqual(items[index]);
      called++;
      return index * 20 + 20;
    };
    const cells = calcCells(items, itemHeight, undefined, undefined, 10, 20, 30, 0, 0, items.length);

    expect(called).toEqual(3);
    expect(cells).toEqual([
      {
        type: CELL_TYPE_ITEM,
        value: 10,
        i: 0,
        index: 0,
        height: 20,
        reads: 0,
        visible: true,
      },
      {
        type: CELL_TYPE_ITEM,
        value: 9,
        i: 1,
        index: 1,
        height: 40,
        reads: 0,
        visible: true,
      },
      {
        type: CELL_TYPE_ITEM,
        value: 8,
        i: 2,
        index: 2,
        height: 60,
        reads: 0,
        visible: true,
      }
    ]);
  });

  it('should calculate cells with header and footer', () => {
    let headerCalled = 0;
    let footerCalled = 0;
    let called = 0;
    const items = ['10', '9', '8'];
    const headerFn: HeaderFn = (item, index, allItems) => {
      expect(item).toEqual(items[index]);
      expect(items).toBe(allItems);
      headerCalled++;
      return (index === 0) ? 'my header' : null;
    };
    const footerFn: HeaderFn = (item, index, allItems) => {
      expect(item).toEqual(items[index]);
      expect(items).toBe(allItems);
      footerCalled++;
      return (index === 2) ? 'my footer' : null;
    };
    const itemHeight: ItemHeightFn = (item: any, index: number) => {
      expect(item).toEqual(items[index]);
      called++;
      return index * 20 + 20;
    };
    const cells = calcCells(items, itemHeight, headerFn, footerFn, 10, 20, 30, 0, 0, items.length);
    expect(cells).toHaveLength(5);
    expect(called).toEqual(3);
    expect(headerCalled).toEqual(3);
    expect(footerCalled).toEqual(3);
    expect(cells).toEqual([
      {
        type: CELL_TYPE_HEADER,
        value: 'my header',
        i: 0,
        index: 0,
        height: 10,
        reads: 2,
        visible: false,
      },
      {
        type: CELL_TYPE_ITEM,
        value: '10',
        i: 1,
        index: 0,
        height: 20,
        reads: 0,
        visible: true,
      },
      {
        type: CELL_TYPE_ITEM,
        value: '9',
        i: 2,
        index: 1,
        height: 40,
        reads: 0,
        visible: true,
      },
      {
        type: CELL_TYPE_ITEM,
        value: '8',
        i: 3,
        index: 2,
        height: 60,
        reads: 0,
        visible: true,
      },
      {
        type: CELL_TYPE_FOOTER,
        value: 'my footer',
        i: 4,
        index: 2,
        height: 20,
        reads: 2,
        visible: false,
      }
    ]);
  });
});

describe('calcHeightIndex', () => {
  it('should generate height index', () => {
    const items = [1, 2, 3, 4, 5];
    const headerFn: HeaderFn = (_, index) => {
      return (index === 0) ? 'my header' : null;
    };
    const footerFn: HeaderFn = (_, index) => {
      return (index === 2) ? 'my footer' : null;
    };
    const cells = calcCells(items, undefined, headerFn, footerFn, 10, 20, 50, 0, 0, items.length);
    const buf = resizeBuffer(undefined, cells.length);
    const totalHeight = calcHeightIndex(buf, cells, 0);
    expect(buf.length).toEqual(7);
    expect(buf[0]).toEqual(0);
    expect(buf[1]).toEqual(10);
    expect(buf[2]).toEqual(60);
    expect(buf[3]).toEqual(110);
    expect(buf[4]).toEqual(160);
    expect(buf[5]).toEqual(180);
    expect(buf[6]).toEqual(230);
    expect(totalHeight).toEqual(280);
  });
});

describe('getShouldUpdate', () => {
  it('should return true if the range does not match', () => {
    expect(getShouldUpdate(Infinity, { offset: 1, length: 2 }, { offset: 1, length: 3 })).toBeTruthy();
    expect(getShouldUpdate(Infinity, { offset: 1, length: 2 }, { offset: 0, length: 2 })).toBeTruthy();
  });

  it('should return true if the dirty index <= bottom', () => {
    expect(getShouldUpdate(9, { offset: 1, length: 8 }, { offset: 1, length: 8 })).toBeTruthy();
  });

  it('should return false if the dirty index > bottom', () => {
    expect(getShouldUpdate(10, { offset: 1, length: 8 }, { offset: 1, length: 8 })).toBeFalsy();
  });

  it('should return false if the range matches', () => {
    expect(getShouldUpdate(Infinity, { offset: 1, length: 2 }, { offset: 1, length: 2 })).toBeFalsy();
  });
});

describe('positionForIndex', () => {
  it('should return the correct position', () => {
    const items = [1, 2, 3, 4];
    const { cells, heightIndex } = mockVirtualScroll(items,
      () => 40,
      (_, i) => i === 1 ? 'hola' : null,
      (_, i) => i === 2 ? 'hola' : null
    );
    expect(positionForIndex(0, cells, heightIndex)).toEqual(0);
    expect(positionForIndex(1, cells, heightIndex)).toEqual(50);
    expect(positionForIndex(2, cells, heightIndex)).toEqual(90);
    expect(positionForIndex(3, cells, heightIndex)).toEqual(140);
  });
});

describe('updateVDom', () => {
  it('should initialize empty VDOM', () => {
    const vdom: VirtualNode[] = [];
    const items = [1, 2, 3, 4, 5];
    const { heightIndex, cells } = mockVirtualScroll(items, () => 20,
      (_, i) => i === 1 ? 'hola' : null,
      (_, i) => i === 2 ? 'hola' : null
    );
    const range: Range = { offset: 1, length: 6 };

    updateVDom(vdom, heightIndex, cells, range);
    expect(vdom).toEqual([
      { cell: cells[1], change: 2, d: false, top: 20, visible: true },
      { cell: cells[2], change: 2, d: false, top: 30, visible: true },
      { cell: cells[3], change: 2, d: false, top: 50, visible: true },
      { cell: cells[4], change: 2, d: false, top: 70, visible: true },
      { cell: cells[5], change: 2, d: false, top: 80, visible: true },
      { cell: cells[6], change: 2, d: false, top: 100, visible: true }
    ]);
  });

  it('should simulate real scrolling', () => {
    const vdom: VirtualNode[] = [];
    const items = Array.from({ length: 100 }, (_, i) => i + '');
    const { heightIndex, cells } = mockVirtualScroll(items, () => 20);
    updateVDom(vdom, heightIndex, cells, { offset: 0, length: 4 });
    updateVDom(vdom, heightIndex, cells, { offset: 0, length: 4 });
    expect(vdom).toEqual([
      { cell: cells[0], change: 0, d: false, top: 0, visible: true },
      { cell: cells[1], change: 0, d: false, top: 20, visible: true },
      { cell: cells[2], change: 0, d: false, top: 40, visible: true },
      { cell: cells[3], change: 0, d: false, top: 60, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 0, length: 5 });
    expect(vdom).toEqual([
      { cell: cells[0], change: 0, d: false, top: 0, visible: true },
      { cell: cells[1], change: 0, d: false, top: 20, visible: true },
      { cell: cells[2], change: 0, d: false, top: 40, visible: true },
      { cell: cells[3], change: 0, d: false, top: 60, visible: true },
      { cell: cells[4], change: 2, d: false, top: 80, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 1, length: 4 });
    expect(vdom).toEqual([
      { cell: cells[0], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[1], change: 0, d: false, top: 20, visible: true },
      { cell: cells[2], change: 0, d: false, top: 40, visible: true },
      { cell: cells[3], change: 0, d: false, top: 60, visible: true },
      { cell: cells[4], change: 0, d: false, top: 80, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 1, length: 5 });
    expect(vdom).toEqual([
      { cell: cells[5], change: 2, d: false, top: 100, visible: true },
      { cell: cells[1], change: 0, d: false, top: 20, visible: true },
      { cell: cells[2], change: 0, d: false, top: 40, visible: true },
      { cell: cells[3], change: 0, d: false, top: 60, visible: true },
      { cell: cells[4], change: 0, d: false, top: 80, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 2, length: 5 });
    expect(vdom).toEqual([
      { cell: cells[5], change: 0, d: false, top: 100, visible: true },
      { cell: cells[6], change: 2, d: false, top: 120, visible: true },
      { cell: cells[2], change: 0, d: false, top: 40, visible: true },
      { cell: cells[3], change: 0, d: false, top: 60, visible: true },
      { cell: cells[4], change: 0, d: false, top: 80, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 10, length: 6 });
    expect(vdom).toEqual([
      { cell: cells[10], change: 2, d: false, top: 200, visible: true },
      { cell: cells[11], change: 2, d: false, top: 220, visible: true },
      { cell: cells[12], change: 2, d: false, top: 240, visible: true },
      { cell: cells[13], change: 2, d: false, top: 260, visible: true },
      { cell: cells[14], change: 2, d: false, top: 280, visible: true },
      { cell: cells[15], change: 2, d: false, top: 300, visible: true }
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 13, length: 10 });
    expect(vdom).toEqual([
      { cell: cells[16], change: 2, d: false, top: 320, visible: true },
      { cell: cells[17], change: 2, d: false, top: 340, visible: true },
      { cell: cells[18], change: 2, d: false, top: 360, visible: true },
      { cell: cells[13], change: 0, d: false, top: 260, visible: true },
      { cell: cells[14], change: 0, d: false, top: 280, visible: true },
      { cell: cells[15], change: 0, d: false, top: 300, visible: true },
      { cell: cells[19], change: 2, d: false, top: 380, visible: true },
      { cell: cells[20], change: 2, d: false, top: 400, visible: true },
      { cell: cells[21], change: 2, d: false, top: 420, visible: true },
      { cell: cells[22], change: 2, d: false, top: 440, visible: true },
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 13, length: 1 });
    expect(vdom).toEqual([
      { cell: cells[16], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[17], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[18], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[13], change: 0, d: false, top: 260, visible: true },
      { cell: cells[14], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[15], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[19], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[20], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[21], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[22], change: 1, d: true, top: -9999, visible: true },
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 13, length: 1 });
    expect(vdom).toEqual([
      { cell: cells[16], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[17], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[18], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[13], change: 0, d: false, top: 260, visible: true },
      { cell: cells[14], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[15], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[19], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[20], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[21], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[22], change: 0, d: true, top: -9999, visible: true },
    ]);

    updateVDom(vdom, heightIndex, cells, { offset: 0, length: 1 });
    expect(vdom).toEqual([
      { cell: cells[0], change: 2, d: false, top: 0, visible: true },
      { cell: cells[17], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[18], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[13], change: 1, d: true, top: -9999, visible: true },
      { cell: cells[14], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[15], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[19], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[20], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[21], change: 0, d: true, top: -9999, visible: true },
      { cell: cells[22], change: 0, d: true, top: -9999, visible: true },
    ]);
  });
});

function mockVirtualScroll(
  items: any[],
  itemHeight?: ItemHeightFn,
  headerFn?: HeaderFn,
  footerFn?: HeaderFn
) {
  const cells = calcCells(items, itemHeight, headerFn, footerFn, 10, 10, 30, 0, 0, items.length);
  const heightIndex = resizeBuffer(undefined, cells.length);
  calcHeightIndex(heightIndex, cells, 0);
  return { items, heightIndex, cells };
}

function mockHeightBuffer(size: number, step: (index: number) => number) {
  const buf = new Uint32Array(size);
  let acum = 0;
  for (let i = 0; i < size; i++) {
    buf[i] = acum;
    acum += step(i);
  }
  return buf;
}
