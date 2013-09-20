describe('RouteController', function() {

  beforeEach(function() {
  });

  it('Should init', function() {
    var rc = new RouteViewController({
      root: 'hacking/route.html';
    });
    rc.when('/', function() {
      console.log('Loaded');
    });
  });
});
