
it('should open basic datetime picker', function() {
  element(by.css('.e2eOpenMMDDYYYY')).click();
});

it('should close with Done button click', function() {
  element(by.css('.picker-button:last-child')).click();
});
