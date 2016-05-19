
it('default should focus', function() {
  element(by.css('.e2eDefaultFloatingSearchbar input')).sendKeys("AA");
});

it('hide cancel button should focus', function() {
  element(by.css('.e2eDefaultCancelButtonFloatingSearchbar input')).sendKeys("CC");
});

it('custom cancel button should focus', function() {
  element(by.css('.e2eCustomCancelButtonFloatingSearchbar input')).sendKeys("DD");
});

// TODO - this test will work on iOS but fail on Android
// it('custom cancel action should alert', function() {
//   element(by.css('.e2eCustomCancelActionFloatingSearchbar .searchbar-ios-cancel')).click();
// });
