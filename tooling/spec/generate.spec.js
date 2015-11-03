var fs = require('fs'),
    path = require('path'),
    Generate = require('../generate'),
    _ = require('lodash'),
    shell = require('shelljs');

// logging.logger = helpers.testingLogger;

// global.console.debug = function(arguments) {
//   console.log(arguments)
// }

describe('#Generate', function() {
  beforeEach(function() {
    spyOn(console, 'log');
  });
  
  it('should have generate exported', function() {
    expect(Generate).toBeDefined();
    expect(Generate.generate).toBeDefined();
    expect(Generate.generate).toBeDefined();
    expect(Generate.defaultTemplates).toBeDefined();
    expect(Generate.loadGeneratorTemplates).toBeDefined();
    expect(Generate.loadGeneratorTemplates).toBeDefined();
    expect(Generate.loadGenerator).toBeDefined();
    expect(Generate.loadGenerators).toBeDefined();

  });

  describe('#generators', function() {
    it('should have a list of generators', function() {
      expect(Generate.generators).toBeDefined();
      expect(Object.keys(Generate.generators).length).toBeGreaterThan(0);
      expect(Generate.generators.page).toBeDefined();
      expect(Generate.generators['tabs']).toBeDefined();
    });

    it('should be able to load generators', function() {
      spyOn(fs, 'readdirSync').andReturn(['page']);
      Generate.loadGenerators();
      expect(fs.readdirSync).toHaveBeenCalled();
    });

    it('should throw an exception if a generator does not get options passed', function() {
      expect(Generate.generate).toThrow('No options passed to generator');
    });

    it('should throw an error trying to use a generator that does not exist', function() {
      var generatorOptions = { appDirectory: '/fake/ionic/path', name: 'About', generator: 'tabz' };
      expect(function() {
        Generate.generate(generatorOptions);
      }).toThrow('There is no generator available with that name: tabz.');
    });

    it('should call the appropriate generator', function() {
      spyOn(Generate, 'createScaffoldDirectories');
      var generatorOptions = { appDirectory: '/fake/ionic/path', name: 'About', generator: 'page' };
      var generatorSpy = {run: createSpy()};
      var realGenerator = Generate.generators['page'];
      Generate.generators['page'] = generatorSpy;

      Generate.generate(generatorOptions);

      var genOpts = {
        appDirectory: '/fake/ionic/path',
        cssClassName: 'about',
        fileName: 'about',
        jsClassName: 'About',
        name: 'About', 
        template: 'page'
      }

      expect(generatorSpy.run).toHaveBeenCalledWith(genOpts);

      Generate.generators['page'] = realGenerator;
    });

    describe('#generate:page', function() {
      it('should generate all the templates for a page', function() {
        var generatorOptions = { appDirectory: '/ionic/app/dir', name: 'About', generator: 'page' };
        var genOpts = {
          appDirectory: '/ionic/app/dir',
          fileName: 'about',
          cssClassName: 'about',
          jsClassName: 'About',
          name: 'About', 
          template: 'page'
        };

        spyOn(fs, 'writeFileSync');
        spyOn(Generate, 'createScaffoldDirectories');

        Generate.generate(generatorOptions);

        expect(fs.writeFileSync.calls.length).toBe(3);

      });
    });
  });

  describe('#page', function() {
    it('should generate a page at a directory', function() {
      //ionic g page about
      //what should happen:
      // create directories if not existing: /www, /www/app, /www/app/about
      // create files in dir: /www/app/about/
      // about.html, about.scss, about.js
      var appDir = '/ionic/app';
      spyOn(Generate, 'createScaffoldDirectories');
      spyOn(fs, 'writeFileSync');

      var options = {
        appDirectory: appDir,
        generator: 'page',
        name: 'MyPage',
      }

      Generate.generate(options);
      // console.log(fs.writeFileSync.calls);
      expect(fs.writeFileSync.calls.length).toBe(3);
      var htmlSaveCall = fs.writeFileSync.calls[0];
      expect(fs.writeFileSync.calls[0].args[0]).toBe('/ionic/app/www/app/my-page/my-page.html');
      expect(fs.writeFileSync.calls[0].args[1]).toContain('<ion-title>MyPage</ion-title>');
      expect(fs.writeFileSync.calls[0].args[1]).toContain('<ion-content padding class="my-page">');

      expect(fs.writeFileSync.calls[1].args[0]).toBe('/ionic/app/www/app/my-page/my-page.js');
      expect(fs.writeFileSync.calls[1].args[1]).toContain('templateUrl: \'app/my-page/my-page.html\'');
      expect(fs.writeFileSync.calls[1].args[1]).toContain('export class MyPage {');

      expect(fs.writeFileSync.calls[2].args[0]).toBe('/ionic/app/www/app/my-page/my-page.scss');
      expect(fs.writeFileSync.calls[2].args[1]).toContain('.my-page {');
    });
  }); //#page

  describe('#directories', function() {
    it('should create directories for scaffolding', function() {
      // pwd = /ionic/app
      // ionic g page about
      // create folders in /ionic/app/www/app/about
      spyOn(shell, 'mkdir');
      Generate.createScaffoldDirectories({appDirectory: '/ionic/app', fileName: 'about'});
      expect(shell.mkdir).toHaveBeenCalledWith('-p', '/ionic/app/www/app/about');
    });
  }); //#directories

  xdescribe('#tabs', function() {
    it('should create a tab template with tab pages', function() {
      /*
      ionic g tabs MyTabPage
      > How many tabs?
        $ 3
      > What do you want to call tab 1?
        $ About
      > What do you want to call tab 2?
        $ Schedule
      > What do you want to call tab 3?
        $ Sessions

      generates:
        www/app/my-tab-page/my-tab-page.html
        www/app/my-tab-page/my-tab-page.js
        www/app/my-tab-page/my-tab-page.scss

        www/app/about/about.js
        www/app/about/about.html
        www/app/about/about.scss

        www/app/schedule/schedule.js
        www/app/schedule/schedule.html
        www/app/schedule/schedule.scss

        www/app/sessions/sessions.js
        www/app/sessions/sessions.html
        www/app/sessions/sessions.scss
      */

      var tabPage = 'TabPage';
      var tabs = ['About', 'Schedule', 'Sessions'];
      var appDirectory = '/ionic/project';

      spyOn(Generate, 'createScaffoldDirectories');

      //Generate the tabs - that contains links/tab entries for the
      //other tabs
      spyOn(Generate, 'generateTabsHtmlTemplate');
      spyOn(Generate, 'generateTabsJsTemplate');
      spyOn(Generate, 'generateTabsScssTemplate');

      //Generate the individual tab pages - 4 in total
      spyOn(Generate, 'generateTabHtmlTemplate');
      spyOn(Generate, 'generateTabJsTemplate');
      spyOn(Generate, 'generateTabScssTemplate');

      Generate.tabPages(appDirectory, tabPage, tabs);

      expect(Generate.createScaffoldDirectories.calls).toBe(4);

      //tabs
      expect(Generate.generateTabsHtmlTemplate.calls).toBe(1);
      expect(Generate.generateTabsJsTemplate.calls).toBe(1);
      expect(Generate.generateTabsScssTemplate.calls).toBe(1);

      //tab
      expect(Generate.generateTabHtmlTemplate.calls).toBe(3);
      expect(Generate.generateTabJsTemplate.calls).toBe(3);
      expect(Generate.generateTabScssTemplate.calls).toBe(3);
    });

    it('should generate a page with tabs', function() {
      // This is what we want for a page with 2 tabs (about, map):
      // <ion-tabs>
      //   <ion-tab tab-title="About" tab-icon="information-circle" [root]="tab4"></ion-tab>
      //   <ion-tab tab-title="Map" tab-icon="map" [root]="tab3"></ion-tab>
      // </ion-tabs>

      // Setup:
      // spyOn(Generate, 'createScaffoldDirectories');

      // Execute:
      var tabsHtml = Generate.generateTabsHtmlTemplate('/ionic/app/path', 'TabsPage', ['About', 'Map']);

      // Assert:
      expect(tabsHtml).toContain('<ion-tabs>');
      expect(tabsHtml).toContain('<ion-tab tab-title="About" tab-icon="globe" [root]="About">');
      expect(tabsHtml).toContain('<ion-tab tab-title="Map" tab-icon="globe" [root]="Map">');
      expect(tabsHtml).toContain('</ion-tabs>');
    });

    it('should generate a tabs page javascript template', function() {
      // import {NavController, Page} from 'ionic/ionic';
      // <% _.forEach(tabs, function(tab) { %>
      // import {<%= tab.jsClassName %>} from '../<%= tab.filename %>/<%= tab.filename %>';
      // <% }); %>
      // @Page({
      //   templateUrl: 'app/<%= filename %>/<%= filename %>.html',
      //   providers: [DataService]
      // })
      // class ConferenceApp {
      //   constructor(nav: NavController) {
      //     // set the root pages for each tab
      //     <% _.forEach(tabs, function(tab) { %>
      //     this.{<%= tab.jsClassName %>} = <%= tab.jsClassName %>;
      //     <% }); %>
      //   }
      // }

      var tabsJs = Generate.generateTabsJsTemplate('/ionic/app/path', 'TabsPage', ['About', 'Map']);

      expect(tabsJs).toContain('import {About} from \'../about/about\';')
      expect(tabsJs).toContain('import {Map} from \'../map/map\';')
      expect(tabsJs).toContain('templateUrl: \'app/tabs-page/tabs-page.html');
      expect(tabsJs).toContain('export class TabsPage {');
      expect(tabsJs).toContain('this.About = About;');
      expect(tabsJs).toContain('this.Map = Map;');
    });
  });//#tabs

  describe('#naming', function() {
    it('should generate the correct file and css class name', function() {
      expect(Generate.fileName('session')).toBe('session');
      expect(Generate.fileName('Session')).toBe('session');
      expect(Generate.fileName('SESSION')).toBe('session');
      expect(Generate.fileName('sessionDetail')).toBe('session-detail');
      expect(Generate.fileName('SessionDetail')).toBe('session-detail');
      expect(Generate.fileName('SesSionDetail')).toBe('ses-sion-detail');
      expect(Generate.fileName('seSsionDeTail')).toBe('se-ssion-de-tail');
      expect(Generate.fileName('session-detail')).toBe('session-detail');
      expect(Generate.fileName('Session-Detail')).toBe('session-detail');
      expect(Generate.fileName('Session_Detail')).toBe('session-detail');
    });

    it('should generate the correct javascript class name', function() {
      expect(Generate.jsClassName('session')).toBe('Session');
      expect(Generate.jsClassName('Session')).toBe('Session');
      expect(Generate.jsClassName('SESSION')).toBe('Session');
      expect(Generate.jsClassName('sessionDetail')).toBe('SessionDetail');
      expect(Generate.jsClassName('SessionDetail')).toBe('SessionDetail');
      expect(Generate.jsClassName('SesSionDetail')).toBe('SesSionDetail');
      expect(Generate.jsClassName('seSsionDeTail')).toBe('SeSsionDeTail');
      expect(Generate.jsClassName('session-detail')).toBe('SessionDetail');
      expect(Generate.jsClassName('Session-Detail')).toBe('SessionDetail');
      expect(Generate.jsClassName('Session_Detail')).toBe('SessionDetail');
    });
  });
});
