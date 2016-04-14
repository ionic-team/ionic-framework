
it('should clear input', function() {
  element(by.css('.e2eClearInput')).click();
  expect(by.css('.e2eClearInput').getText()).toEqual('');
});
