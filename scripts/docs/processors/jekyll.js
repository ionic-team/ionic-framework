module.exports = function jekyll(renderDocsProcessor) {
  return {
    name: 'jekyll',
    description: 'Create jekyll includes',
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      var currentVersion = renderDocsProcessor.extraData.version.current.name;

      // pretty up and sort the docs object for menu generation
      docs = docs.filter(function(doc) {
        return (!!doc.name && !!doc.outputPath) || doc.docType === 'index-page';
      });
      docs.sort(function(a, b) {
        textA = a.name ? a.name.toUpperCase() : '';
        textB = b.name ? b.name.toUpperCase() : '';
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      docs.forEach(function(doc, i) {
        docs[i].URL = doc.outputPath.replace('docs//', 'docs/')
                                    .replace('/index.md', '')
                                    .replace('//home/ubuntu/ionic/src', '')
                                    .replace('//', '/')
                                    .replace('content/', '');
        if (docs[i].relativePath) {
          docs[i].relativePath = doc.relativePath
                                    .replace('/home/ubuntu/ionic', '');
        }
        if (docs[i].href) {
          docs[i].href = doc.href.replace('content/', '');
        }
        if (docs[i].description) {
          docs[i].description = docs[i].description.replace(/(\#\#\#).+/g, (section) => {
            const title = section.replace(/^(\#+\s?)/, '');
            const segment = title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

            return `\n<h3><a class="anchor" name="${segment}" href="#${segment}">${title}</a></h3>\n`;
          });
        }
      });

      docs.push({
        docType: 'api-menu',
        id: 'api-menu',
        template: 'api_menu.template.html',
        outputPath: 'content/_includes/fluid/api_menu.html'
      });
      docs.push({
        docType: 'api-menu-flat-version',
        id: 'api-menu-flat-version',
        template: 'api_menu_flat_version.template.html',
        outputPath: 'content/_includes/fluid/api_menu_flat_' + currentVersion +
                    '.html'
      });
      docs.push({
        docType: 'api-version-select',
        id: 'api-version-select',
        template: 'api_version_select.template.html',
        outputPath: 'content/_includes/fluid/api_version_select.html'
      });

      // returning docs will replace docs object in the next process
      return docs;
    }
  };
};
