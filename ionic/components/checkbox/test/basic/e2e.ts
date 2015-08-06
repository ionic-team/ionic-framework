
it('should check apple via checkbox element click', function() {
  element(by.css('#e2eAppleCheckbox')).click();
});


it('should enable/check grape via buttons', function() {
  element(by.css('#e2eGrapeDisabled')).click();
  element(by.css('#e2eGrapeChecked')).click();
});
