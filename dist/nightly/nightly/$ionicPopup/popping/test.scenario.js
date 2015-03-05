describe('$ionicPopup-popping', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/$ionicPopup/popping/');
});



it('should open confirm popup', function(){
  var ele = element.all(by.css('[ng-click="showConfirm()"]'));
  ele.get(0).click();
});

it('should cancel confirm popup', function(){
  var ele = element.all(by.css('.popup-buttons .button'));
  ele.get(0).click();
});

it('should open prompt popup and enter input', function(){
  var ele = element.all(by.css('[ng-click="showPrompt()"]'));
  ele.get(0).click();
  ele = element(by.model('data.response'));
  ele.sendKeys('Waffles');
});

it('should close prompt popup by clicking OK', function(){
  var ele = element.all(by.css('.popup-buttons .button'));
  ele.get(1).click();
});

it('should open alert popup', function(){
  var ele = element.all(by.css('[ng-click="showAlert()"]'));
  ele.get(0).click();
});

it('should close alert popup', function(){
  var ele = element.all(by.css('.popup-buttons .button'));
  ele.get(0).click();
});

});
