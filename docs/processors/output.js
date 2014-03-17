var _ = require('lodash');
var path = require('canonical-path');
var fs = require('fs');

module.exports = {
  name: 'output',
  description: 'log all doc urls after everything is done',
  runAfter: ['files-written'],
  process: function(docs, config) {
    var links = docs
      .filter(function(doc) {
        return doc.match(/\/api\/.*?\/index.md$/) && doc.indexOf('/module/ionic') == -1;
      })
      .map(function(doc) {
        return doc.replace(/^.*?\/docs/,'/docs').replace(/\/index.md$/, '');
      });

    var outputFolder = path.join(config.get('basePath'), config.get('rendering.outputFolder'));
    var menuInclude = path.join(outputFolder, '_includes/api_menu_' + config.versionData.current.name + '.html');

    if (!fs.existsSync(menuInclude)) {
      fs.writeFileSync(menuInclude, links.map(function(link) {
        return '<li class="menu-item{% if page.path == "' + link.replace(/^.*?\/api/, 'api') + '" %} active{% endif %}">\n' +
          '  <a href="' + link + '">' + link.replace(/^.*?\/api\//, '') + '</a>\n' +
          '</li>';
      }).join('\n'));
    }
  }
};
