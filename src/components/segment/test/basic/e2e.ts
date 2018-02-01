import { by, element } from 'protractor';

it('friends and standard should be selected', function() {
  element(by.css('.e2eSegmentFriends')).click();
    element(by.css('.e2eSegmentStandard')).click();
});

it('model c and top grossing should be selected', function() {
  element(by.css('.e2eSegmentModelC')).click();
    element(by.css('.e2eSegmentTopGrossing')).click();
});
