import { by, element } from 'protractor';

it('should unify buttons', function() {
  element(by.css('.e2eButtonDynamicUnify')).click();
});

it('should toggle buttons', function() {
  element(by.css('.e2eButtonToggle')).click();
});
