---
name: floatingLabel
component: itemFloatingLabel
---

it('should enter text into floating label inputs', function(){
  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));
  ele.get(0).sendKeys('Dr. Pumpernickel');
  ele.get(1).sendKeys('Round House Kicks');
});

it('should add and remove text from floating label inputs', function(){
  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));

  for(var x=0; x<'Dr. Pumpernickel'.length; x++) {
    ele.get(0).sendKeys(protractor.Key.BACK_SPACE);
  }

  ele.get(1).sendKeys(" To The Face");

  for(var x=0; x<'Tubthumping'.length; x++) {
    ele.get(2).sendKeys(protractor.Key.BACK_SPACE);
  }

});
