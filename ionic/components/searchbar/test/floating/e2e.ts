
it('default should focus', function() {
  element(by.css('.e2eDefaultFloatingSearchbar input')).sendKeys("AA");
});

it('custom placeholder should focus', function() {
  element(by.css('.e2eCustomPlaceholderFloatingSearchbar input')).sendKeys("BB");
});

it('default cancel button should focus', function() {
  element(by.css('.e2eDefaultCancelButtonFloatingSearchbar input')).sendKeys("CC");
});

it('custom cancel button should focus', function() {
  element(by.css('.e2eCustomCancelButtonFloatingSearchbar input')).sendKeys("DD");
});

it('custom cancel action should focus', function() {
  element(by.css('.e2eCustomCancelActionFloatingSearchbar input')).sendKeys("FF");
});

// TODO - this test will work on iOS but fail on Android
// it('custom cancel action should alert', function() {
//   element(by.css('.e2eCustomCancelActionFloatingSearchbar .searchbar-cancel')).click();
// });
