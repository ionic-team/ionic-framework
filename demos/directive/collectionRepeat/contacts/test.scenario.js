---
name: contacts
component: collectionRepeat
---
it('should scroll to the bottom', function(){
  var ele = element(by.css('.bar-header .button'));
  ele.click();
});

it('should scroll to the top', function(){
  var ele = element(by.css('.bar-header'));
  ele.click();
});

it('should filter by juan', function(){
  var ele = element(by.model('search'));
  ele.sendKeys('juan');
});

it('should clear search', function(){
  var ele = element(by.css('.bar-header .input-button'));
  ele.click();
});
