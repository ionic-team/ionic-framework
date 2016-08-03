import { Component } from '@angular/core';
import { App, Config, Nav, NavOptions, Platform, Tab, Tabs, ViewController } from '../../../../src';
import { mockTab, mockTabs } from '../../../../src/util/mock-providers';

export function run() {

describe('Tabs', () => {

  describe('initTabs', () => {

    it('should preload all tabs', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tab0.preload = () => {};
      tab1.preload = () => {};

      spyOn(tab0, 'preload');
      spyOn(tab1, 'preload');

      tabs.preloadTabs = true;

      tabs.initTabs();

      expect(tab0.isSelected).toEqual(true);
      expect(tab1.isSelected).toEqual(false);

      expect(tab0.preload).not.toHaveBeenCalled();
      expect(tab1.preload).toHaveBeenCalled();
    });

    it('should not select a hidden or disabled tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tab1.enabled = false;
      tab1.show = false;

      tabs.selectedIndex = '1';
      tabs.initTabs();

      expect(tab0.isSelected).toEqual(true);
      expect(tab1.isSelected).toEqual(false);
    });

    it('should select the second tab from selectedIndex input', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.selectedIndex = '1';
      tabs.initTabs();

      expect(tab0.isSelected).toEqual(false);
      expect(tab1.isSelected).toEqual(true);
    });

    it('should select the first tab by default', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      spyOn(tab0, 'preload');
      spyOn(tab1, 'preload');

      tabs.initTabs();

      expect(tab0.isSelected).toEqual(true);
      expect(tab1.isSelected).toEqual(false);

      expect(tab0.preload).not.toHaveBeenCalled();
      expect(tab1.preload).not.toHaveBeenCalled();
    });

  });

  describe('previousTab', () => {

    it('should find the previous tab when there has been 3 selections', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      var tab2 = mockTab(tabs);
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

      tab0.root = SomePage;
      tab1.root = SomePage;

      expect(tabs.length()).toEqual(2);
      expect(tab0.isSelected).toBeUndefined();
      expect(tab1.isSelected).toBeUndefined();

      tabs.select(0);

      expect(tab0.isSelected).toEqual(true);
      expect(tab1.isSelected).toEqual(false);
    });

  });

  describe('getByIndex', () => {

    it('should get the tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      tab0.setRoot(<any>{});
      var tab1 = mockTab(tabs);

      expect(tabs.getIndex(tab0)).toEqual(0);
      expect(tabs.getIndex(tab1)).toEqual(1);
    });

  });

  describe('getSelected', () => {

    it('should get the selected tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);

      tab1.setSelected(true);

      expect(tabs.getSelected()).toEqual(tab1);
    });

    it('should get null if no selected tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);

      expect(tabs.getSelected()).toEqual(null);
    });

  });

  @Component({})
  class SomePage {}

});


}
