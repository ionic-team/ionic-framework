describe('ionList-animated', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionList/animated/');
});



it('should add item below Item 0', function(){
  var ele = element.all(by.css('.list .button'));
  ele.get(0).click();
});

it('should remove Item 0', function(){
  var ele = element.all(by.css('.list .button'));
  ele.get(1).click();
});

});
