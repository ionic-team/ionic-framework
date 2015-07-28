
it('should open alert', function() {
  element(by.css('#e2eOpenAlert')).click();
});


it('should close alert', function() {
  element(by.css('.popup-buttons button:last-of-type')).click();
});


it('should open prompt', function() {
  element(by.css('#e2eOpenPrompt')).click();
});


it('should close prompt', function() {
  var inputEle = element(by.css('.popup-body input'));
  inputEle.sendKeys('prompt text');
  element(by.css('.popup-buttons button:last-of-type')).click();
});


it('should open confirm', function() {
  element(by.css('#e2eOpenConfirm')).click();
});


it('should close confirm', function() {
  element(by.css('.popup-buttons button:last-of-type')).click();
});
