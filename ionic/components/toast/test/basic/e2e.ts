
it('should open toast', function() {
  element(by.css('.e2eOpenToast')).click();
});

it('should close with backdrop click', function() {
  element(by.css('.backdrop')).click();
});
