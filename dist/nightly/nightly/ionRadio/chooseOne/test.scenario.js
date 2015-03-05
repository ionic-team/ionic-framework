describe('ionRadio-chooseOne', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionRadio/chooseOne/');
});



it('should check 3rd radio by clicking its label', function(){
  var ele = element.all(by.css('label.item-radio'));
  ele.get(2).click();
});

it('should check 4th radio by clicking its label', function(){
  var ele = element.all(by.css('label.item-radio'));
  ele.get(3).click();
});

});
