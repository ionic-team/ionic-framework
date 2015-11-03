
it('default should focus', function() {
  element(by.css('.e2eDefaultFloatingSearchBar input')).sendKeys("AA");
});

it('custom placeholder should focus', function() {
  element(by.css('.e2eCustomPlaceholderFloatingSearchBar input')).sendKeys("BB");
});

it('default cancel button should focus', function() {
  element(by.css('.e2eDefaultCancelButtonFloatingSearchBar input')).sendKeys("CC");
});

it('custom cancel button should focus', function() {
  element(by.css('.e2eCustomCancelButtonFloatingSearchBar input')).sendKeys("DD");
});

it('custom cancel action should focus', function() {
  element(by.css('.e2eCustomCancelActionFloatingSearchBar input')).sendKeys("FF");
});

// TODO - this test will work on iOS but fail on Android
// it('custom cancel action should alert', function() {
//   element(by.css('.e2eCustomCancelActionFloatingSearchBar .searchbar-cancel')).click();
// });
