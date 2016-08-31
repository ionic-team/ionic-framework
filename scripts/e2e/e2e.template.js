describe('<%= relativePath %>: <%= platform %>', function() {

it('should init', function() {
  browser.get('http://localhost:<%= buildConfig.protractorPort %>/dist/e2e/components/<%= relativePath %>/index.html?ionicplatform=<%= platform %>&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

<%= contents %>

});
