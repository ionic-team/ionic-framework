---
name: simple
component: ionCheckbox
---

it('should uncheck 1st and check 2nd checkbox by clicking its label', function(){
  var ele = element.all(by.css('label.item-checkbox'));
  ele.get(0).click();
  ele.get(1).click();
});

it('should check 1st and uncheck 2nd checkbox by clicking its label', function(){
  var ele = element.all(by.css('label.item-checkbox'));
  ele.get(0).click();
  ele.get(1).click();
});
