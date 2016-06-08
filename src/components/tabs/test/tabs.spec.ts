import {Component} from '@angular/core';
import {App, Nav, Tabs, Tab, NavOptions, Config, ViewController, Platform} from '../../../../src';

export function run() {

describe('Tabs', () => {

  describe('previousTab', () => {

    it('should find the previous tab when there has been 3 selections', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      var tab2 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);
      tabs.add(tab2);
      tab0.root = SomePage;
      tab1.root = SomePage;
      tab2.root = SomePage;

      tabs.select(tab0);
      tabs.select(tab1);
      tabs.select(tab2);

      expect(tabs.selectHistory).toEqual([tab0.id, tab1.id, tab2.id]);

      expect(tabs.previousTab(true)).toEqual(tab1);
      expect(tabs.selectHistory).toEqual([tab0.id, tab1.id]);

      expect(tabs.previousTab(true)).toEqual(tab0);
      expect(tabs.selectHistory).toEqual([tab0.id]);
    });

    it('should not find a previous tab when there has only been one selection', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.select(tab0);

      expect(tabs.previousTab(true)).toEqual(null);
    });

    it('should not find a previous tab when theres no history', () => {
      var tabs = mockTabs();
      expect(tabs.selectHistory.length).toEqual(0);
      expect(tabs.previousTab(true)).toEqual(null);
    });

    it('should track tab selections', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);
      tab0.root = SomePage;
      tab1.root = SomePage;

      expect(tabs.selectHistory.length).toEqual(0);

      tabs.select(tab0);
      expect(tabs.selectHistory[0]).toEqual(tab0.id);
      expect(tabs.selectHistory.length).toEqual(1);

      tabs.select(tab1);
      expect(tabs.selectHistory[0]).toEqual(tab0.id);
      expect(tabs.selectHistory[1]).toEqual(tab1.id);
      expect(tabs.selectHistory.length).toEqual(2);

      tabs.select(tab0);
      expect(tabs.selectHistory[0]).toEqual(tab0.id);
      expect(tabs.selectHistory[1]).toEqual(tab1.id);
      expect(tabs.selectHistory[2]).toEqual(tab0.id);
      expect(tabs.selectHistory.length).toEqual(3);
    });

  });

  describe('select', () => {

    it('should select tab by tab instance', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.select(tab1);

      expect(tab0.isSelected).toEqual(false);
      expect(tab1.isSelected).toEqual(true);
    });

    it('should select tab by index', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      tab0.root = SomePage;
      tab1.root = SomePage;

      expect(tab0.isSelected).toBeUndefined();
      expect(tab1.isSelected).toBeUndefined();

      tabs.select(0);

      expect(tab0.isSelected).toEqual(true);
      expect(tab1.isSelected).toEqual(false);
    });

    it('should not select an invalid tab index', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      expect(tabs.select(22)).toBeUndefined();
    });

  });

  describe('getByIndex', () => {

    it('should get the tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      tab0.setRoot()
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      expect(tabs.getIndex(tab0)).toEqual(0);
      expect(tabs.getIndex(tab1)).toEqual(1);
    });

  });

  describe('getSelected', () => {

    it('should get the selected tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      tab1.setSelected(true);

      expect(tabs.getSelected()).toEqual(tab1);
    });

    it('should get null if no selected tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tabs.add(tab0);
      tabs.add(tab1);

      expect(tabs.getSelected()).toEqual(null);
    });

  });

  var app: App;
  var config: Config;
  var platform: Platform;
  var _cd: any;

  function mockNav(): Nav {
    return new Nav(null, null, null, config, null, null, null, null, null);
  }

  function mockTabs(): Tabs {
    return new Tabs(null, null, null, config, null, null, null);
  }

  function mockTab(parentTabs: Tabs): Tab {
    var tab = new Tab(parentTabs, app, config, null, null, null, null, null, _cd);
    tab.load = function(opts: any, cb: Function) {
      cb();
    };
    return tab;
  }

  @Component({})
  class SomePage {}

  beforeEach(() => {
    config = new Config();
    platform = new Platform();
    app = new App(config, null, platform);
    _cd = {
      reattach: function(){},
      detach: function(){}
    };
  });

});


}
