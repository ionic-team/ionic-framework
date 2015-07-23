
it('should go from 1 to 2', function() {
  element(by.css('#from1To2')).click();
});

it('should go from 2 to 3', function() {
  element(by.css('#from2To3')).click();
});

it('should go from 3 to 2', function() {
  element(by.css('#from3To2')).click();
});

it('should go from 2 to 1', function() {
  element(by.css('#from2To1')).click();
});
