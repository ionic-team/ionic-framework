
describe('js/utils/dom', function() {

  describe('getPositionInParent', function() {
    it('should return 0,0 if el===parentEl', function() {
      var el = {};
      expect(ionic.DomUtil.getPositionInParent(el, el)).toEqual({
        left: 0,
        top: 0
      });
    });
    it('should return 0,0 if el is null', function() {
      expect(ionic.DomUtil.getPositionInParent(null, null)).toEqual({
        left: 0,
        top: 0
      });
    });
    it('should return element offset{Top,Left} of el if el is parent\'s child', function() {
      var parent = {};
      var el = {parentNode: parent, offsetLeft: 3, offsetTop: 2};
      expect(ionic.DomUtil.getPositionInParent(el, parent)).toEqual({
        left: 3,
        top: 2
      });
    });
    it('should return added element offset{Top,Left} of all children up to parent', function() {
      var parent = {};
      var child1 = {parentNode: parent, offsetLeft: 5, offsetTop: 6};
      var child2 = {parentNode: child1, offsetLeft: 10, offsetTop: 11};
      expect(ionic.DomUtil.getPositionInParent(child1, parent)).toEqual({
        left: 5,
        top: 6
      });
      expect(ionic.DomUtil.getPositionInParent(child2, parent)).toEqual({
        left: 15,
        top: 17
      });
    });
  });
});
