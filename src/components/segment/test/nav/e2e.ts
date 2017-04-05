import { by, element } from 'protractor';

it('existing should be selected', function() {
  element(by.css('.e2eSegmentExistingSegment')).click();
});

it('test should be selected', function() {
  element(by.css('.e2eSegmentTestButton')).click();
});
