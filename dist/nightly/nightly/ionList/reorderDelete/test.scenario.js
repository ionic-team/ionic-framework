describe('ionList-reorderDelete', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionList/reorderDelete/');
});



it('should show reorder icons', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(1).click();
});

it('should hide reorder icons', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(1).click();
});

it('should show delete icons', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(0).click();
});

it('should hide delete icons', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(0).click();
});

});
