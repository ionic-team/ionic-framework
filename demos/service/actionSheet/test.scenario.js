---
name: takeAction
component: $ionicActionSheet
---

it('should open up actionsheet', function(){
  var ele = element(by.css('.button'));
  ele.click();
});

it('should close when clicking backdrop', function(){
  var ele = element(by.css('.action-sheet-backdrop'));
  ele.click();
});

it('should open up actionsheet again', function(){
  var ele = element(by.css('.button'));
  ele.click();
});

it('should click the share button', function(){
  var ele = element.all(by.css('.action-sheet-group .button'));
  ele.get(0).click();
});
