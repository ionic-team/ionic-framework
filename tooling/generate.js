var _ = require('lodash'),
    fs = require('fs'),
    inquirer = require('inquirer'),
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

// options: appDirectory, generator, name
Generate.generate = function generate(options) {
  Generate.inquirer = inquirer;
  // Generate.log('Generate options', options);
  if (!options) {
    throw new Error('No options passed to generator');
  }

  //add optional logger for CLI or other tools
  if (options.log) {
    Generate.log = options.log;
  }

  if (options.generator && !Generate.generators[options.generator]) {
    throw new Error('There is no generator available with that name: ' +   options.generator + '.');
  }

  if (!options.generator) {
    options.generator = 'page';
  }

  var generateOptions = {
    appDirectory: options.appDirectory,
    cssClassName: Generate.cssClassName(options.name),
    fileName: Generate.fileName(options.name),
    jsClassName: Generate.jsClassName(options.name),
    name: options.name,
    template: options.generator
  };

  Generate.createScaffoldDirectories({appDirectory: options.appDirectory, fileName: generateOptions.fileName});

  try {
    //Try to run the generator if it supplies a run method.
    var generator = Generate.generators[options.generator];
    if (generator && generator.run) {
      return Generate.generators[options.generator].run(generateOptions);
    } else {
      return Generate.defaultTemplates(generateOptions);
    }
  } catch (ex) {
    console.log('Error with generation:', ex);
    console.log(ex.stack);
  }
};

Generate.defaultTemplates = function defaultTemplates(options) {
  var template = options.template ? options.template : 'page';

  options.rootDirectory = options.rootDirectory || path.join('www', 'app');
  var savePath = path.join(options.appDirectory, options.rootDirectory, options.fileName);

  var templates = Generate.loadGeneratorTemplates(path.join(__dirname, 'generators', options.template));

  templates.forEach(function(template) {
    var templatePath = template.file;
    options.templatePath = templatePath;
    var renderedTemplate = Generate.renderTemplateFromFile(options);
    var saveFilePath = path.join(savePath, [options.fileName, template.type].join(''));
    // console.log('renderedTemplate', renderedTemplate, 'saving to', saveFilePath);
    console.log('√ Create'.blue, path.relative(options.appDirectory, saveFilePath));
    fs.writeFileSync(saveFilePath, renderedTemplate);
  });
}

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

    templates.push({file: path.join(generatorPath, template), type: path.extname(template)});
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
    var generator = Generate.loadGenerator(generatorName);
    generators[generatorName] = generator;
  });
  return generators;
};

/*
  Will take options to render an html, js, or scss template.
  options:
    they differ based on what is needed in template
    For JavaScript file: filename, jsClassName
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
  var tabsfileName = Generate.fileName(name);

  var tabsHtml = Generate.generateTabsHtmlTemplate(appDirectory, name, tabs);
  var tabsJs = Generate.generateTabsJsTemplate(appDirectory, name, tabs);
  // var tabsScss = Generate.generateTabsScssTemplate(appDirectory, name, tabs);
  var pagePath = path.join(appDirectory, 'www', 'app', tabsfileName),
      jsPath = path.join(pagePath, [tabsfileName, '.js'].join('')),
      htmlPath = path.join(pagePath, [tabsfileName, '.html'].join(''));
      // scssPath = path.join(pagePath, [tabsfileName, '.scss'].join(''));

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
  // import {<%= tab.jsClassName %>} from '../<%= tab.filename %>/<%= tab.filename %>';
  // <% }); %>
  // @Page({
  //   templateUrl: 'app/<%= filename %>/<%= filename %>.html',
  //   providers: [DataService]
  // })
  // class <%= jsClassName %> {
  //   constructor(nav: NavController) {
  //     // set the root pages for each tab
  //     <% _.forEach(tabs, function(tab) { %>
  //     this.{<%= tab.jsClassName %>} = <%= tab.jsClassName %>;
  //     <% }); %>
  //   }
  // }
  var fileName = Generate.fileName(name);
  var jsClassName = Generate.jsClassName(name);

  var tabsData = [];
  tabs.forEach(function(tab) {
    var tabObj = { name: tab, filename: Generate.fileName(tab), jsClassName: Generate.jsClassName(tab)};
    tabsData.push(tabObj);
  });

  var tabsHtmlTemplatePath = path.join(__dirname, 'tabs.tmpl.js');
  return Generate.renderTemplateFromFile({tabs: tabsData, templatePath: tabsHtmlTemplatePath, filename: fileName, jsClassName: jsClassName });
};

Generate.createScaffoldDirectories = function createScaffoldDirectories(options) {
  // Generate.log('Create', options.appDirectory, options.fileName);
  var componentPath = path.join(options.appDirectory, 'www', 'app', options.fileName);
  shell.mkdir('-p', componentPath);
};

Generate.fileName = function fileName(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').replace('_', '-').toLowerCase();
};

Generate.cssClassName = function cssClassName(name) {
  return Generate.fileName(name);
}

Generate.capitalizeName = function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

Generate.jsClassName = function jsClassName(name) {
  return _.capitalize(_.camelCase(name));
};
