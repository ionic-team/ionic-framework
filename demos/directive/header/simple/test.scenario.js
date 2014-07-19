---
name: simple
component: ionHeaderBar
---

it('should show subheader', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(0).click();
});

it('should hide subheader', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(0).click();
});

it('should hide header', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(1).click();
});

it('should show header', function(){
  var ele = element.all(by.css('.toggle'));
  ele.get(1).click();
});
