
it('default should focus', function() {
  element(by.css('.e2eDefaultToolbarSearchbar input')).sendKeys("AA");
});

it('primary should focus', function() {
  element(by.css('.e2ePrimaryToolbarSearchbar input')).sendKeys("BB");
});

it('danger should focus', function() {
  element(by.css('.e2eDangerToolbarSearchbar input')).sendKeys("CC");
});
