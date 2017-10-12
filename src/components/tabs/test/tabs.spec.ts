import { Component } from '@angular/core';
import { mockTab, mockTabs } from '../../../util/mock-providers';


describe('Tabs', () => {

  describe('initTabs', () => {

    it('should not select a hidden or disabled tab', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tab1.enabled = false;
      tab1.show = false;

      tabs.selectedIndex = 1;
      tabs.initTabs().then(() => {
        expect(tab0.isSelected).toEqual(true);
        expect(tab1.isSelected).toEqual(false);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should select the second tab from selectedIndex input', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.selectedIndex = 1;

      tabs.initTabs().then(() => {
        expect(tab0.isSelected).toEqual(false);
        expect(tab1.isSelected).toEqual(true);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should select the first tab by default', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.initTabs().then(() => {
        expect(tab0.isSelected).toEqual(true);
        expect(tab1.isSelected).toEqual(false);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

  });

  describe('previousTab', () => {

    it('should find the previous tab when there has been 3 selections', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      var tab2 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;
      tab2.root = SomePage;

      tabs.select(tab0).then(() => {
        return tabs.select(tab1);
      }).then(() => {
        return tabs.select(tab2);
      }).then(() => {
        expect(tabs._selectHistory).toEqual([tab0.id, tab1.id, tab2.id]);

        expect(tabs.previousTab(true)).toEqual(tab1);
        expect(tabs._selectHistory).toEqual([tab0.id, tab1.id]);

        expect(tabs.previousTab(true)).toEqual(tab0);
        expect(tabs._selectHistory).toEqual([tab0.id]);
        done();
      }).catch((err: Error) => {
        done(err);
      });
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
      expect(tabs._selectHistory.length).toEqual(0);
      expect(tabs.previousTab(true)).toEqual(null);
    });

    it('should track tab selections', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);
      tab0.root = SomePage;
      tab1.root = SomePage;

      expect(tabs._selectHistory.length).toEqual(0);

      tabs.select(tab0).then(() => {
        expect(tabs._selectHistory[0]).toEqual(tab0.id);
        expect(tabs._selectHistory.length).toEqual(1);
        return tabs.select(tab1);
      }).then(() => {
        expect(tabs._selectHistory[0]).toEqual(tab0.id);
        expect(tabs._selectHistory[1]).toEqual(tab1.id);
        expect(tabs._selectHistory.length).toEqual(2);
        return tabs.select(tab0);
      }).then(() => {
        expect(tabs._selectHistory[0]).toEqual(tab0.id);
        expect(tabs._selectHistory[1]).toEqual(tab1.id);
        expect(tabs._selectHistory[2]).toEqual(tab0.id);
        expect(tabs._selectHistory.length).toEqual(3);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

  });

  describe('select', () => {

    it('should select tab by tab instance', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);

      tab0.root = SomePage;
      tab1.root = SomePage;

      tabs.select(tab1).then(() => {
        expect(tab0.isSelected).toEqual(false);
        expect(tab1.isSelected).toEqual(true);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should select tab by index', (done: Function) => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);

      tab0.root = SomePage;
      tab1.root = SomePage;

      expect(tabs.length()).toEqual(2);
      expect(tab0.isSelected).toBeUndefined();
      expect(tab1.isSelected).toBeUndefined();

      tabs.select(0).then(() => {
        expect(tab0.isSelected).toEqual(true);
        expect(tab1.isSelected).toEqual(false);
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

  });

  describe('getByIndex', () => {

    it('should get the tab', () => {
      var tabs = mockTabs();
      var tab0 = mockTab(tabs);
      var tab1 = mockTab(tabs);

      expect(tabs.getIndex(tab0)).toEqual(0);
      expect(tabs.getIndex(tab1)).toEqual(1);
    });

  });

  describe('getSelectedTabIndex', () => {

    it('should select index from tab title', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);

      tab1.tabTitle = 'My Account';
      tab2.tabTitle = 'My Contact';
      tab3.tabTitle = 'My Settings!!';

      let selectedIndex = tabs._getSelectedTabIndex('my-settings');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index from tab url path', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);

      tab1.tabUrlPath = 'account';
      tab2.tabUrlPath = 'contact';
      tab3.tabUrlPath = 'settings';

      let selectedIndex = tabs._getSelectedTabIndex('settings');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index 2 from tab-2 format', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);
      mockTab(tabs);

      let selectedIndex = tabs._getSelectedTabIndex('tab-2');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index 0 when not found', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);
      mockTab(tabs);

      let selectedIndex = tabs._getSelectedTabIndex('notfound');
      expect(selectedIndex).toEqual(0);
    });

  });

  describe('getSelected', () => {

    it('should get the selected tab', () => {
      var tabs = mockTabs();
      mockTab(tabs);
      var tab1 = mockTab(tabs);

      tab1.setSelected(true);

      expect(tabs.getSelected()).toEqual(tab1);
    });

    it('should get null if no selected tab', () => {
      var tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);

      expect(tabs.getSelected()).toEqual(null);
    });

  });

  @Component({})
  class SomePage {}

});
