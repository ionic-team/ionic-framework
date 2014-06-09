---
name: chooseOne
component: ionRadio
---

it('should check 3rd radio by clicking its label', function(){
  var ele = element.all(by.css('label.item-radio'));
  ele.get(2).click();
});

it('should check 4th radio by clicking its label', function(){
  var ele = element.all(by.css('label.item-radio'));
  ele.get(3).click();
});
