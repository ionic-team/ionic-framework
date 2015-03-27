describe('<%= relativePath %>', function() {

it('should init', function() {
  browser.get('http://localhost:<%= buildConfig.protractorPort %>/<%= relativePath %>');
});

<%= contents %>

});
