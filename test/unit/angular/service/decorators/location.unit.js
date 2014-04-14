describe('$location decorator', function() {

  beforeEach(module('ionic'));

  describe('.hash()', function() {

    it('should find .scroll-content and set scrollTop=0', inject(function($location, $timeout, $rootScope) {
      var scroll = { scrollTop: 5 };
      spyOn(document, 'querySelector').andCallFake(function() {
        return scroll;
      });

      $location.hash('123');
      $timeout.flush();
      expect(scroll.scrollTop).toBe(0);

      scroll.scrollTop = 33;
      $location.hash('456');
      $timeout.flush();
      expect(scroll.scrollTop).toBe(0);
    }));

  });
});
