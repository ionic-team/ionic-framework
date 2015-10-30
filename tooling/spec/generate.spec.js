var colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    Generate = require('../generate'),
    _ = require('lodash'),
    shell = require('shelljs');

// logging.logger = helpers.testingLogger;

// global.console.debug = function(arguments) {
//   console.log(arguments)
// }

describe('#Generate', function() {
  it('should have generate exported', function() {
    expect(Generate).toBeDefined();
    expect(Generate.page).toBeDefined();
  });

  ddescribe('#generators', function() {
    it('should have a list of generators', function() {
      expect(Generate.generators).toBeDefined();
      console.log('we got', Generate.generators)
      expect(Object.keys(Generate.generators).length).toBeGreaterThan(0);
      expect(Generate.generators.page).toBeDefined();
      expect(Generate.generators['page-tabs']).toBeDefined();
    });

    it('should be able to load generators', function() {
      spyOn(fs, 'readdirSync').andReturn(['page']);
      Generate.loadGenerators();
      expect(fs.readdirSync).toHaveBeenCalled();
    });

    it('should throw an exception if a generator does not get options passed', function() {
      expect(Generate.generate).toThrow('No options passed to generator');
    });

    it('should call the appropriate generator', function() {
      spyOn(Generate, 'createScaffoldDirectories');
      var generatorOptions = { name: 'About', generatorName: 'page' };
      var generatorSpy = {run: createSpy()};
      var realGenerator = Generate.generators['page'];
      Generate.generators['page'] = generatorSpy;

      Generate.generate(generatorOptions);

      var genOpts = {
        fileAndClassName: 'about',
        javascriptClassName: 'About',
        name: 'About', 
      }

      expect(generatorSpy.run).toHaveBeenCalledWith(genOpts);

      Generate.generators['page'] = realGenerator;
    });

    describe('#generate:page', function() {
      it('should generate all the templates for a page', function() {
        var generatorOptions = { appDirectory: '/ionic/app/dir', name: 'About', generatorName: 'page' };
        var genOpts = {
          fileAndClassName: 'about',
          javascriptClassName: 'About',
          name: 'About', 
        };

        spyOn(fs, 'writeFileSync');
        spyOn(Generate, 'createScaffoldDirectories');

        Generate.generate(generatorOptions);

        expect(fs.writeFileSync.calls.length).toBe(3);
        
      });
    });
  });

  xdescribe('#page', function() { 

    it('should generate a page at a directory', function() {
      //ionic g page about
      //what should happen:
      // create directories if not existing: /www, /www/app, /www/app/about
      // create files in dir: /www/app/about/
      // about.html, about.scss, about.js
      var appDir = '/ionic/app';
      spyOn(Generate, 'createScaffoldDirectories');
      spyOn(fs, 'writeFileSync');
      spyOn(Generate, 'generateHtmlTemplate');
      spyOn(Generate, 'generateScssTemplate');
      spyOn(Generate, 'generateJsTemplate');

      Generate.page(appDir, 'about');

      expect(Generate.createScaffoldDirectories).toHaveBeenCalledWith(appDir, 'about');
      expect(Generate.generateJsTemplate).toHaveBeenCalledWith('about');
      expect(Generate.generateHtmlTemplate).toHaveBeenCalledWith('about');
      expect(Generate.generateScssTemplate).toHaveBeenCalledWith('about');

      expect(fs.writeFileSync).toHaveBeenCalled();

    });

    it('should generate a page code template', function() {
      var scaffold = 'about';
      var compiledTemplate = Generate.generateJsTemplate(scaffold);
      expect(compiledTemplate).toContain('templateUrl: \'app/about/about.html\'');
      expect(compiledTemplate).toContain('export class About');
    });

    it('should generate a properly cased page template', function() {
      var scaffold = 'scheduleDetail';
      var compiledTemplate = Generate.generateJsTemplate(scaffold);
      expect(compiledTemplate).toContain('templateUrl: \'app/schedule-detail/schedule-detail.html\'');
      expect(compiledTemplate).not.toContain('export class scheduleDetail');
      expect(compiledTemplate).toContain('export class ScheduleDetail');
    });

    it('should generate a page html template', function() {
      var scaffold = 'sessions';
      var compiledTemplate = Generate.generateHtmlTemplate(scaffold);
      expect(compiledTemplate).toContain('<ion-content padding class="sessions">');
      expect(compiledTemplate).toContain('<ion-title>Sessions</ion-title>');

    });

    it('should generate a page sass template', function() {
      var scaffold = 'sessions';
      var compiledTemplate = Generate.generateScssTemplate(scaffold);
      expect(compiledTemplate).toContain('.sessions {');
    });

    it('should render html template from file', function() {
      spyOn(fs, 'readFileSync').andReturn('faketemplate');
      var templateSpy = createSpy();

      spyOn(_, 'template').andReturn(templateSpy);
      var options = { name: 'test', capitalizedName: 'Test', templatePath: '/path/to/template.tmpl.html'};
      var generatedContents = Generate.renderTemplateFromFile(options);
      expect(fs.readFileSync).toHaveBeenCalledWith(options.templatePath, 'utf8');
      expect(_.template).toHaveBeenCalledWith('faketemplate');
      expect(templateSpy).toHaveBeenCalledWith(options);
    });
  }); //#page

  xdescribe('#directories', function() { 
    it('should create directories for scaffolding', function() {
      // pwd = /ionic/app
      // ionic g page about
      // create folders in /ionic/app/www/app/about
      spyOn(shell, 'mkdir');
      Generate.createScaffoldDirectories('/ionic/app', 'about');
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
      // import {<%= tab.javascriptClassName %>} from '../<%= tab.filename %>/<%= tab.filename %>';
      // <% }); %>
      // @Page({
      //   templateUrl: 'app/<%= filename %>/<%= filename %>.html',
      //   providers: [DataService]
      // })
      // class ConferenceApp {
      //   constructor(nav: NavController) {
      //     // set the root pages for each tab
      //     <% _.forEach(tabs, function(tab) { %>
      //     this.{<%= tab.javascriptClassName %>} = <%= tab.javascriptClassName %>;
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

  xdescribe('#naming', function() {
    it('should capitalize names', function() {
      expect(Generate.capitalizeName('session')).toBe('Session');
    });

    it('should generate the correct file and css class name', function() {
      expect(Generate.fileAndClassName('session')).toBe('session');
      expect(Generate.fileAndClassName('Session')).toBe('session');
      expect(Generate.fileAndClassName('SESSION')).toBe('session');
      expect(Generate.fileAndClassName('sessionDetail')).toBe('session-detail');
      expect(Generate.fileAndClassName('SessionDetail')).toBe('session-detail');
      expect(Generate.fileAndClassName('SesSionDetail')).toBe('ses-sion-detail');
      expect(Generate.fileAndClassName('seSsionDeTail')).toBe('se-ssion-de-tail');
      expect(Generate.fileAndClassName('session-detail')).toBe('session-detail');
      expect(Generate.fileAndClassName('Session-Detail')).toBe('session-detail');
      expect(Generate.fileAndClassName('Session_Detail')).toBe('session-detail');
    });

    it('should generate the correct javascript class name', function() {
      expect(Generate.javascriptClassName('session')).toBe('Session');
      expect(Generate.javascriptClassName('Session')).toBe('Session');
      expect(Generate.javascriptClassName('SESSION')).toBe('Session');
      expect(Generate.javascriptClassName('sessionDetail')).toBe('SessionDetail');
      expect(Generate.javascriptClassName('SessionDetail')).toBe('SessionDetail');
      expect(Generate.javascriptClassName('SesSionDetail')).toBe('SesSionDetail');
      expect(Generate.javascriptClassName('seSsionDeTail')).toBe('SeSsionDeTail');
      expect(Generate.javascriptClassName('session-detail')).toBe('SessionDetail');
      expect(Generate.javascriptClassName('Session-Detail')).toBe('SessionDetail');
      expect(Generate.javascriptClassName('Session_Detail')).toBe('SessionDetail');
    });
  });
});
