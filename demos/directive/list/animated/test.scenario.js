---
name: animated
component: ionList
---

it('should add item below Item 0', function(){
  var ele = element.all(by.css('.list .button'));
  ele.get(0).click();
});

it('should remove Item 0', function(){
  var ele = element.all(by.css('.list .button'));
  ele.get(1).click();
});
