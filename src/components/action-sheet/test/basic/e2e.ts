
it('should open action sheet', function() {
  element(by.css('.e2eOpenActionSheet')).click();
});

it('should close with backdrop click', function() {
  element(by.css('.backdrop')).click();
});
