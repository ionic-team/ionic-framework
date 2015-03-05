describe('collectionRepeat-contacts', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/collectionRepeat/contacts/');
});



it('should filter by juan', function(){
  var ele = element(by.model('search'));
  ele.sendKeys('juan');
});

it('should clear search', function(){
  var ele = element(by.css('.bar-header .input-button'));
  ele.click();
});

});
