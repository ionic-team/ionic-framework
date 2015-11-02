var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    Generate = module.exports;

Generate._generators;

Generate.__defineGetter__('generators', function() {
  if (!Generate._generators) {
    Generate._generators = Generate.loadGenerators();
  }
  
  return Generate._generators;
});

Generate.log = function log() {
  console.log('DEBUG'.red, arguments);
};

// options: appDirectory, generatorName, name
Generate.generate = function generate(options) {
  // Generate.log('Generate options', options);
  if (!options) {
    throw new Error('No options passed to generator');
  }
  
  //add optional logger for CLI or other tools
  if (options.log) {
    Generate.log = options.log;
  }

  if (options.q) {
    Generate.q = options.q;
  }

  if (!options.generatorName) {
    options.generatorName = 'page';
  }

  var generateOptions = { 
    appDirectory: options.appDirectory,
    fileAndClassName: Generate.fileAndClassName(options.name),
    javascriptClassName: Generate.javascriptClassName(options.name),
    name: options.name
  };

  Generate.createScaffoldDirectories({appDirectory: options.appDirectory, fileAndClassName: generateOptions.fileAndClassName});

  return Generate.generators[options.generatorName].run(generateOptions);
};

Generate.loadGeneratorTemplates = function loadGeneratorTemplates(generatorPath) {
  var templates = [];
  fs.readdirSync(generatorPath)
  .forEach(function(template) {
    var type;
    // Go through all the files in the folder, grab the templates, read in the file contents
    // return as template type, contents
    if (template.indexOf('.tmpl') == -1) {
      return;
    }

    templates.push({file: template, type: path.extname(template)});
  });

  return templates;
};

Generate.loadGenerator = function loadGenerator(file) {
  var generatorPath = path.join(__dirname, 'generators', file);
  var generateModule;
  try {
    generateModule = require(generatorPath);
  } catch (ex) {
    Generate.log('Error loading generator module', ex);
    Generate.log(ex.stack);
  }
  return generateModule;
};
  
Generate.loadGenerators = function loadGenerators() {
  var generators = {};
  fs.readdirSync(path.join(__dirname, 'generators'))
  .forEach(function (file) {
    if (file.indexOf('.') !== -1) {
      return;
    }
    var generatorName = file.replace('.js', '');
    generators[generatorName] = Generate.loadGenerator(generatorName);
  });
  return generators;
};

/* 
  Will take options to render an html, js, or scss template.
  options:
    they differ based on what is needed in template
    For JavaScript file: filename, javascriptClassName
    For HTML file: name, nameUppercased
    templatePath: the path of the template to render (html/js/scss), ex: '/path/to/page.tmpl.html'
*/
Generate.renderTemplateFromFile = function renderTemplateFromFile(options) {
  var templateContents = fs.readFileSync(options.templatePath, 'utf8');
  var templateCompiler = _.template(templateContents);
  var result = templateCompiler(options);
  return result;
};

// Tabs - name = name of the page with the tabs,
// tabs = array of the tabs to create.
Generate.tabPages = function tabPages(appDirectory, name, tabs) {
  Generate.createScaffoldDirectories(appDirectory, name);

  // Generate page with tabs:
  var tabsFileAndClassName = Generate.fileAndClassName(name);

  var tabsHtml = Generate.generateTabsHtmlTemplate(appDirectory, name, tabs);
  var tabsJs = Generate.generateTabsJsTemplate(appDirectory, name, tabs);
  // var tabsScss = Generate.generateTabsScssTemplate(appDirectory, name, tabs);
  var pagePath = path.join(appDirectory, 'www', 'app', tabsFileAndClassName),
      jsPath = path.join(pagePath, [tabsFileAndClassName, '.js'].join('')),
      htmlPath = path.join(pagePath, [tabsFileAndClassName, '.html'].join(''));
      // scssPath = path.join(pagePath, [tabsFileAndClassName, '.scss'].join(''));

  tabs.forEach(function(tab) {
    Generate.createScaffoldDirectories(appDirectory, tab);
    var tabJs = Generate.generateJsTemplate(appDirectory, tab);
    var tabHtml = Generate.generateHtmlTemplate(appDirectory, tab);

  })
};

Generate.generateTabJsTemplate = function generateTabJsTemplate(appDirectory, name) {
  throw new Error('not implemented');
};

Generate.generateTabsJsTemplate = function generateTabsJsTemplate(appDirectory, name, tabs) {
  // import {NavController, Page} from 'ionic/ionic';
  // <% _.forEach(tabs, function(tab) { %>
  // import {<%= tab.javascriptClassName %>} from '../<%= tab.filename %>/<%= tab.filename %>';
  // <% }); %>
  // @Page({
  //   templateUrl: 'app/<%= filename %>/<%= filename %>.html',
  //   providers: [DataService]
  // })
  // class <%= javascriptClassName %> {
  //   constructor(nav: NavController) {
  //     // set the root pages for each tab
  //     <% _.forEach(tabs, function(tab) { %>
  //     this.{<%= tab.javascriptClassName %>} = <%= tab.javascriptClassName %>;
  //     <% }); %>
  //   }
  // }
  var fileAndClassName = Generate.fileAndClassName(name);
  var javascriptClassName = Generate.javascriptClassName(name);

  var tabsData = [];
  tabs.forEach(function(tab) {
    var tabObj = { name: tab, filename: Generate.fileAndClassName(tab), javascriptClassName: Generate.javascriptClassName(tab)};
    tabsData.push(tabObj);
  });

  var tabsHtmlTemplatePath = path.join(__dirname, 'tabs.tmpl.js');
  return Generate.renderTemplateFromFile({tabs: tabsData, templatePath: tabsHtmlTemplatePath, filename: fileAndClassName, javascriptClassName: javascriptClassName });
};

Generate.createScaffoldDirectories = function createScaffoldDirectories(options) {
  // Generate.log('Create', options.appDirectory, options.fileAndClassName);
  var componentPath = path.join(options.appDirectory, 'www', 'app', options.fileAndClassName);
  shell.mkdir('-p', componentPath);
};

Generate.fileAndClassName = function fileAndClassName(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').replace('_', '-').toLowerCase();
};

Generate.capitalizeName = function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

Generate.javascriptClassName = function javascriptClassName(name) {
  return _.capitalize(_.camelCase(name));
};
