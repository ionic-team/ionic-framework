describe('<%= relativePath %>: <%= platform %>', function() {

it('should init', function() {
  browser.get('http://localhost:<%= buildConfig.protractorPort %>/e2e/<%= relativePath %>?ionic-platform=<%= platform %>');
});

<%= contents %>

});
