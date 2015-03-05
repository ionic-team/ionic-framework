describe('ionFooterBar-simple', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionFooterBar/simple/');
});



it('should show subfooter', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(0).click();
});

it('should hide subfooter', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(0).click();
});

it('should hide footer', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(1).click();
});

it('should show footer', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(1).click();
});

});
