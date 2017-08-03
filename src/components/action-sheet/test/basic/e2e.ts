import { by, element } from 'protractor';

it('should open action sheet', function() {
  element(by.css('.e2eOpenActionSheet')).click();
});

it('should close with backdrop click', function() {
  element(by.css('ion-backdrop')).click();
});

it('should open a custom action sheet', function() {
  element(by.css('.e2eCustomActionSheet')).click().then(() => {
    const el = element(by.css('.action-sheet-custom-text'));
    expect(el).toBeDefined();
  });
});
