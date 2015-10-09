
it('default should focus', function() {
  element(by.css('.e2eDefaultFloatingSearchBar input')).sendKeys("Default");
});

it('custom placeholder should focus', function() {
  element(by.css('.e2eCustomPlaceholderFloatingSearchBar input')).sendKeys("Custom Placeholder");
});

it('default cancel button should focus', function() {
  element(by.css('.e2eDefaultCancelButtonFloatingSearchBar input')).sendKeys("Default Cancel Button");
});

it('custom cancel button should focus', function() {
  element(by.css('.e2eCustomCancelButtonFloatingSearchBar input')).sendKeys("Custom Cancel Button");
});

it('custom cancel button long text should focus', function() {
  element(by.css('.e2eCustomCancelButtonLongTextFloatingSearchBar input')).sendKeys("Custom Cancel Button Long Text");
});

it('custom cancel action should focus', function() {
  element(by.css('.e2eCustomCancelActionFloatingSearchBar input')).sendKeys("Custom Cancel Action");
});
