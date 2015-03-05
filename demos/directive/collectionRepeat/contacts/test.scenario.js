---
name: contacts
component: collectionRepeat
---

it('should filter by juan', function(){
  var ele = element(by.model('search'));
  ele.sendKeys('juan');
});

it('should clear search', function(){
  var ele = element(by.css('.bar-header .button.clear'));
  ele.click();
});
