
describe('js/utils/dom', function() {

  describe('getPositionInParent', function() {
    it('should return el.{offsetLeft,offsetTop}', function() {
      var el = { offsetLeft: 3, offsetTop: 4 };
      expect(ionic.DomUtil.getPositionInParent(el)).toEqual({ left: 3, top: 4 });
    });
  });
});
