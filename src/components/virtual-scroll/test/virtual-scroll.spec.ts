import { VirtualCell, VirtualData, VirtualNode } from '../virtual-util';
import { adjustRendered, estimateHeight, getVirtualHeight, initReadNodes, populateNodeData, processRecords } from '../virtual-util';
import { mockPlatform } from '../../../util/mock-providers';


describe('VirtualScroll', () => {

  beforeEach(() => {
    records = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    cells = [];
    nodes = [];
    headerFn = null;
    footerFn = null;
    var viewportWidth = 300;
    data = {
      viewWidth: viewportWidth,
      viewHeight: 600,
      itmWidth: viewportWidth,
      itmHeight: HEIGHT_ITEM,
      hdrWidth: viewportWidth,
      hdrHeight: HEIGHT_HEADER,
      ftrWidth: viewportWidth,
      ftrHeight: HEIGHT_FOOTER
    };
    window.getComputedStyle = function () {
      var styles: any = {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px'
      };
      return styles;
    };
  });

  describe('estimateHeight', () => {

    it('should return zero when no records', () => {
      const h = estimateHeight(0, undefined, 100, .25);
      expect(h).toEqual(0);
    });

  });

  describe('processRecords', () => {

    it('should load data for 100% width items', () => {
      records = [0, 1, 2, 3, 4];
      let stopAtHeight = 200;

      processRecords(stopAtHeight, records, cells,
        headerFn, footerFn, data);

      expect(cells.length).toBe(4);

      expect(cells[0].record).toBe(0);
      expect(cells[0].row).toBe(0);
      expect(cells[0].top).toBe(HEIGHT_ITEM * 0);
      expect(cells[0].height).toBe(HEIGHT_ITEM);
      expect(cells[0].data).toBeUndefined();
      expect(cells[0].tmpl).toBe(TEMPLATE_ITEM);

      expect(cells[1].row).toBe(1);
      expect(cells[1].top).toBe(HEIGHT_ITEM * 1);
      expect(cells[1].height).toBe(HEIGHT_ITEM);

      expect(cells[2].row).toBe(2);
      expect(cells[2].top).toBe(HEIGHT_ITEM * 2);
      expect(cells[2].height).toBe(HEIGHT_ITEM);

      expect(cells[3].row).toBe(3);
      expect(cells[3].top).toBe(HEIGHT_ITEM * 3);
      expect(cells[3].height).toBe(HEIGHT_ITEM);
    });

    it('should load data for 30% width items', () => {
      records = [0, 1, 2, 3, 4];
      let stopAtHeight = 1000;
      data.viewWidth = 300;
      data.itmWidth = 90; // 30%, 3 per row
      data.hdrWidth = data.viewWidth; // 100%, 1 per row
      data.ftrWidth = data.viewWidth; // 100%, 1 per row

      headerFn = function (record: any) {
        return (record === 0) ? 'Header' : null;
      };

      footerFn = function (record: any) {
        return (record === 4) ? 'Footer' : null;
      };

      processRecords(stopAtHeight, records, cells,
        headerFn, footerFn, data);

      expect(cells.length).toBe(7);

      expect(cells[0].row).toBe(0);
      expect(cells[0].width).toBe(data.viewWidth);
      expect(cells[0].height).toBe(HEIGHT_HEADER);
      expect(cells[0].top).toBe(0);
      expect(cells[0].left).toBe(0);
      expect(cells[0].tmpl).toBe(TEMPLATE_HEADER);
      expect(cells[0].data).toBe('Header');
      expect(cells[0].record).toBe(0);

      expect(cells[1].row).toBe(1);
      expect(cells[1].width).toBe(data.itmWidth);
      expect(cells[1].height).toBe(HEIGHT_ITEM);
      expect(cells[1].top).toBe(HEIGHT_HEADER);
      expect(cells[1].left).toBe(data.itmWidth * 0);
      expect(cells[1].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[1].data).toBeUndefined();
      expect(cells[1].record).toBe(0);

      expect(cells[2].row).toBe(1);
      expect(cells[2].width).toBe(data.itmWidth);
      expect(cells[2].height).toBe(HEIGHT_ITEM);
      expect(cells[2].top).toBe(HEIGHT_HEADER);
      expect(cells[2].left).toBe(data.itmWidth * 1);
      expect(cells[2].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[2].data).toBeUndefined();
      expect(cells[2].record).toBe(1);

      expect(cells[3].row).toBe(1);
      expect(cells[3].width).toBe(data.itmWidth);
      expect(cells[3].height).toBe(HEIGHT_ITEM);
      expect(cells[3].top).toBe(HEIGHT_HEADER);
      expect(cells[3].left).toBe(data.itmWidth * 2);
      expect(cells[3].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[3].data).toBeUndefined();
      expect(cells[3].record).toBe(2);

      expect(cells[4].row).toBe(2);
      expect(cells[4].width).toBe(data.itmWidth);
      expect(cells[4].height).toBe(HEIGHT_ITEM);
      expect(cells[4].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM);
      expect(cells[4].left).toBe(data.itmWidth * 0);
      expect(cells[4].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[4].data).toBeUndefined();
      expect(cells[4].record).toBe(3);

      expect(cells[5].row).toBe(2);
      expect(cells[5].width).toBe(data.itmWidth);
      expect(cells[5].height).toBe(HEIGHT_ITEM);
      expect(cells[5].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM);
      expect(cells[5].left).toBe(data.itmWidth * 1);
      expect(cells[5].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[5].data).toBeUndefined();
      expect(cells[5].record).toBe(4);

      expect(cells[6].row).toBe(3);
      expect(cells[6].width).toBe(data.ftrWidth);
      expect(cells[6].height).toBe(HEIGHT_FOOTER);
      expect(cells[6].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM);
      expect(cells[6].left).toBe(0);
      expect(cells[6].tmpl).toBe(TEMPLATE_FOOTER);
      expect(cells[6].data).toBe('Footer');
      expect(cells[6].record).toBe(4);
    });

    it('should process more data', () => {
      records = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let stopAtHeight = 100;
      data.viewWidth = 200;
      data.itmWidth = 90; // 2 per row
      data.hdrWidth = data.viewWidth; // 100%, 1 per row

      headerFn = function (record: any) {
        return (record === 0) ? 'Header' : null;
      };

      processRecords(stopAtHeight, records, cells,
        headerFn, footerFn, data);

      expect(cells.length).toBe(5);

      expect(cells[0].row).toBe(0);
      expect(cells[0].top).toBe(0);
      expect(cells[0].left).toBe(0);
      expect(cells[0].tmpl).toBe(TEMPLATE_HEADER);
      expect(cells[0].record).toBe(0);

      expect(cells[1].row).toBe(1);
      expect(cells[1].top).toBe(HEIGHT_HEADER);
      expect(cells[1].left).toBe(data.itmWidth * 0);
      expect(cells[1].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[1].record).toBe(0);

      stopAtHeight = 150;
      processRecords(stopAtHeight, records, cells,
        headerFn, footerFn, data);

      expect(cells[2].row).toBe(1);
      expect(cells[2].top).toBe(HEIGHT_HEADER);
      expect(cells[2].left).toBe(data.itmWidth * 1);
      expect(cells[2].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[2].record).toBe(1);

      expect(cells.length).toBe(9);

      expect(cells[3].row).toBe(2);
      expect(cells[3].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM);
      expect(cells[3].left).toBe(data.itmWidth * 0);
      expect(cells[3].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[3].record).toBe(2);

      stopAtHeight = 20000;
      processRecords(stopAtHeight, records, cells,
        headerFn, footerFn, data);

      expect(cells.length).toBe(11);

      expect(cells[5].row).toBe(3);
      expect(cells[5].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM);
      expect(cells[5].left).toBe(data.itmWidth * 0);
      expect(cells[5].tmpl).toBe(TEMPLATE_ITEM);
      expect(cells[5].record).toBe(4);

    });

  });

  describe('populateNodeData', () => {

    it('should set no nodes when no records', () => {
      nodes = [];
      records = [];

      let startCellIndex = 0;
      let endCellIndex = 0;

      populateNodeData(startCellIndex, endCellIndex, true,
        cells, records, nodes, viewContainer,
        itmTmp, hdrTmp, ftrTmp);

      expect(nodes.length).toBe(0);
    });

    // it('should skip already rendered, and create nodes', () => {
    //   cells = [
    //     { row: 0, tmpl: TEMPLATE_ITEM },
    //     { row: 1, tmpl: TEMPLATE_ITEM },
    //     { row: 2, tmpl: TEMPLATE_HEADER },
    //     { row: 3, tmpl: TEMPLATE_ITEM },
    //     { row: 4, tmpl: TEMPLATE_FOOTER },
    //     { row: 5, tmpl: TEMPLATE_ITEM },
    //     { row: 6, tmpl: TEMPLATE_ITEM, reads: 0 }
    //   ];

    //   nodes = [
    //     { cell: 0, tmpl: TEMPLATE_ITEM, view: getView() },
    //     { cell: 1, tmpl: TEMPLATE_ITEM, view: getView() },
    //     { cell: 2, tmpl: TEMPLATE_HEADER, view: getView() },
    //     { cell: 3, tmpl: TEMPLATE_ITEM, view: getView() },
    //   ];

    //   let startCellIndex = 2;
    //   let endCellIndex = 5;

    //   populateNodeData(startCellIndex, endCellIndex, true,
    //     cells, records, nodes, viewContainer,
    //     itmTmp, hdrTmp, ftrTmp);

    //   expect(nodes.length).toBe(5);

    //   // first stays unchanged
    //   expect(nodes[0].cell).toBe(0);

    //   expect(nodes[1].cell).toBe(5);
    //   expect(nodes[2].cell).toBe(2);
    //   expect(nodes[3].cell).toBe(3);
    //   expect(nodes[4].cell).toBe(4);
    // });

    it('should create nodes', () => {
      cells = [
        { row: 0, tmpl: TEMPLATE_ITEM },
        { row: 1, tmpl: TEMPLATE_ITEM },
        { row: 2, tmpl: TEMPLATE_HEADER },
        { row: 3, tmpl: TEMPLATE_ITEM },
        { row: 4, tmpl: TEMPLATE_FOOTER },
        { row: 5, tmpl: TEMPLATE_ITEM },
        { row: 6, tmpl: TEMPLATE_ITEM }
      ];

      let startCellIndex = 2;
      let endCellIndex = 4;

      populateNodeData(startCellIndex, endCellIndex, true,
        cells, records, nodes, viewContainer,
        itmTmp, hdrTmp, ftrTmp);

      expect(nodes.length).toBe(3);

      expect(nodes[0].cell).toBe(2);
      expect(nodes[1].cell).toBe(3);
      expect(nodes[2].cell).toBe(4);

      expect(nodes[0].tmpl).toBe(TEMPLATE_HEADER);
      expect(nodes[1].tmpl).toBe(TEMPLATE_ITEM);
      expect(nodes[2].tmpl).toBe(TEMPLATE_FOOTER);
    });

  });

  describe('initReadNodes', () => {

    it('should get all the row heights w/ 30% width rows', () => {
      let firstTop = 13;
      nodes = [
        { cell: 0, tmpl: TEMPLATE_HEADER, view: getView(data.viewWidth, HEIGHT_HEADER, firstTop, 0) },
        { cell: 1, tmpl: TEMPLATE_ITEM, view: getView(90, HEIGHT_ITEM, HEIGHT_HEADER + firstTop, 0) },
        { cell: 2, tmpl: TEMPLATE_ITEM, view: getView(90, HEIGHT_ITEM, HEIGHT_HEADER + firstTop, 90) },
        { cell: 3, tmpl: TEMPLATE_ITEM, view: getView(90, HEIGHT_ITEM, HEIGHT_HEADER + firstTop, 180) },
        { cell: 4, tmpl: TEMPLATE_ITEM, view: getView(90, HEIGHT_ITEM, HEIGHT_HEADER + HEIGHT_ITEM + firstTop, 0) },
        { cell: 5, tmpl: TEMPLATE_FOOTER, view: getView(data.viewWidth, HEIGHT_FOOTER, HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM + firstTop, 0) },
      ];

      cells = [
        { row: 0, tmpl: TEMPLATE_HEADER, reads: 0 },
        { row: 0, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 0, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 0, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 0, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 0, tmpl: TEMPLATE_FOOTER, reads: 0 },
      ];

      initReadNodes(mockPlatform(), nodes, cells, data);

      expect(cells[0].top).toBe(firstTop);
      expect(cells[0].left).toBe(0);
      expect(cells[0].width).toBe(data.viewWidth);
      expect(cells[0].height).toBe(HEIGHT_HEADER);

      expect(cells[1].top).toBe(firstTop + HEIGHT_HEADER);
      expect(cells[1].left).toBe(0);
      expect(cells[1].width).toBe(90);
      expect(cells[1].height).toBe(HEIGHT_ITEM);

      expect(cells[2].top).toBe(firstTop + HEIGHT_HEADER);
      expect(cells[2].left).toBe(data.itmWidth);
      expect(cells[2].width).toBe(90);
      expect(cells[2].height).toBe(HEIGHT_ITEM);

      expect(cells[3].top).toBe(firstTop + HEIGHT_HEADER);
      expect(cells[3].left).toBe(data.itmWidth * 2);
      expect(cells[3].width).toBe(90);
      expect(cells[3].height).toBe(HEIGHT_ITEM);

      expect(cells[4].top).toBe(firstTop + HEIGHT_HEADER + HEIGHT_ITEM);
      expect(cells[4].left).toBe(0);
      expect(cells[4].width).toBe(90);
      expect(cells[4].height).toBe(HEIGHT_ITEM);

      expect(cells[5].top).toBe(firstTop + HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM);
      expect(cells[5].left).toBe(0);
      expect(cells[5].width).toBe(data.viewWidth);
      expect(cells[5].height).toBe(HEIGHT_FOOTER);
    });

    it('should get all the row heights w/ all 100% width rows', () => {
      nodes = [
        { cell: 0, tmpl: TEMPLATE_HEADER, view: getView(data.viewWidth, HEIGHT_HEADER, 0, 0) },
        { cell: 1, tmpl: TEMPLATE_ITEM, view: getView(data.viewWidth, HEIGHT_ITEM, HEIGHT_HEADER, 0) },
        { cell: 2, tmpl: TEMPLATE_ITEM, view: getView(data.viewWidth, HEIGHT_ITEM, HEIGHT_HEADER + HEIGHT_ITEM, 0) },
        { cell: 3, tmpl: TEMPLATE_ITEM, view: getView(data.viewWidth, HEIGHT_ITEM, HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM, 0) },
        { cell: 4, tmpl: TEMPLATE_FOOTER, view: getView(data.viewWidth, HEIGHT_FOOTER, HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM + HEIGHT_ITEM, 0) },
      ];

      cells = [
        { row: 0, tmpl: TEMPLATE_HEADER, reads: 0 },
        { row: 1, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 2, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 3, tmpl: TEMPLATE_ITEM, reads: 0 },
        { row: 4, tmpl: TEMPLATE_FOOTER, reads: 0 },
      ];

      initReadNodes(mockPlatform(), nodes, cells, data);

      expect(cells[0].top).toBe(0);
      expect(cells[0].height).toBe(HEIGHT_HEADER);
      expect(cells[0].reads).toBe(1);

      expect(cells[1].top).toBe(HEIGHT_HEADER);
      expect(cells[1].height).toBe(HEIGHT_ITEM);

      expect(cells[2].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM);
      expect(cells[2].height).toBe(HEIGHT_ITEM);

      expect(cells[3].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM);
      expect(cells[3].height).toBe(HEIGHT_ITEM);

      expect(cells[4].top).toBe(HEIGHT_HEADER + HEIGHT_ITEM + HEIGHT_ITEM + HEIGHT_ITEM);
      expect(cells[4].height).toBe(HEIGHT_FOOTER);
    });

  });

  describe('adjustRendered', () => {

    it('should adjust when all the way to the top, scrolling down', () => {
      for (var i = 0; i < 100; i++) {
        cells.push({ top: i, height: 1, row: i });
      }
      data.scrollDiff = 1;
      data.viewHeight = 20;
      data.itmHeight = 1;
      data.renderHeight = 40;

      data.topViewCell = 0;
      data.bottomViewCell = 19;

      adjustRendered(cells, data);

      expect(data.topCell).toBe(0);
      expect(data.bottomCell).toBe(38);
    });

    it('should adjust when in the middle, scrolling down', () => {
      for (var i = 0; i < 100; i++) {
        cells.push({ top: i, height: 1, row: i });
      }
      data.scrollDiff = 1;
      data.viewHeight = 20;
      data.itmHeight = 1;
      data.renderHeight = 40;

      data.topViewCell = 30;
      data.bottomViewCell = 49;

      adjustRendered(cells, data);

      expect(data.topCell).toBe(27);
      expect(data.bottomCell).toBe(65);
    });

    it('should adjust when all the way to the bottom, scrolling down', () => {
      for (var i = 0; i < 100; i++) {
        cells.push({ top: i, height: 1, row: i });
      }
      data.scrollDiff = 1;
      data.viewHeight = 20;
      data.itmHeight = 1;
      data.renderHeight = 40;

      data.topViewCell = 80;
      data.bottomViewCell = 99;

      adjustRendered(cells, data);

      expect(data.topCell).toBe(61);
      expect(data.bottomCell).toBe(99);
    });

    it('should adjust when all the way to the bottom, scrolling up', () => {
      for (var i = 0; i < 100; i++) {
        cells.push({ top: i, height: 1, row: i });
      }
      data.scrollDiff = -1;
      data.viewHeight = 20;
      data.itmHeight = 1;
      data.renderHeight = 40;

      data.topViewCell = 80;
      data.bottomViewCell = 99;

      adjustRendered(cells, data);

      expect(data.topCell).toBe(61);
      expect(data.bottomCell).toBe(99);
    });

  });

  describe('getVirtualHeight', () => {

    it('should return known height from last cell/record', () => {
      let totalRecords = 1000;
      let lastCell: VirtualCell = {
        record: 999,
        tmpl: TEMPLATE_ITEM,
        row: 800,
        top: 900,
        height: 45
      };

      let virtualHeight = getVirtualHeight(totalRecords, lastCell);

      expect(virtualHeight).toBe(945);
    });

    it('should guess the height from 1 known cell', () => {
      let totalRecords = 100;
      let lastCell: VirtualCell = {
        record: 0,
        tmpl: TEMPLATE_ITEM,
        row: 0,
        top: 0,
        height: 50
      };

      let virtualHeight = getVirtualHeight(totalRecords, lastCell);

      expect(virtualHeight).toBe(5000);
    });

    it('should guess the height from 1/2 known cells', () => {
      let totalRecords = 100;
      let lastCell: VirtualCell = {
        record: 49,
        tmpl: TEMPLATE_ITEM,
        row: 0,
        top: 2450,
        height: 50
      };

      let virtualHeight = getVirtualHeight(totalRecords, lastCell);

      expect(virtualHeight).toBe(5000);
    });

    it('should guess the height from 99/100 known cells', () => {
      let totalRecords = 100;
      let lastCell: VirtualCell = {
        record: 98,
        tmpl: TEMPLATE_ITEM,
        row: 0,
        top: 4900,
        height: 50
      };

      let virtualHeight = getVirtualHeight(totalRecords, lastCell);

      expect(virtualHeight).toBe(5000);
    });

  });

  let records: any[];
  let cells: VirtualCell[];
  let nodes: VirtualNode[];
  let headerFn: Function;
  let footerFn: Function;
  let data: VirtualData;
  let itmTmp: any = {};
  let hdrTmp: any = {};
  let ftrTmp: any = {};
  let viewContainer: any = {
    createEmbeddedView: function () {
      return getView();
    },
    indexOf: function () {
      return 0;
    },
    clear: function () { },
    remove: function () { },
  };

  function getView(width?: number, height?: number, top?: number, left?: number): any {
    return {
      context: {},
      rootNodes: [{
        nodeType: 1,
        offsetWidth: width,
        offsetHeight: height,
        offsetTop: top,
        offsetLeft: left,
        clientTop: top,
        clientLeft: left,
        style: {
          top: '',
          left: ''
        },
        classList: {
          add: function () { },
          remove: function () { }
        },
        setAttribute: function () { },
        innerHTML: '',
      }]
    };
  }

});

const TEMPLATE_ITEM = 0;
const TEMPLATE_HEADER = 1;
const TEMPLATE_FOOTER = 2;

const HEIGHT_HEADER = 50;
const HEIGHT_ITEM = 45;
const HEIGHT_FOOTER = 32;
