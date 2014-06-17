---
name: appIntro
component: ionSlideBox
---
it('should go to slide 2', function(){
  var ele = element(by.css('.right-buttons .button'));
  ele.click();
});

it('should go to slide 1', function(){
  var ele = element(by.css('.left-buttons .button'));
  ele.click();
});

it('should go to slide 2', function(){
  var ele = element(by.css('.right-buttons .button'));
  ele.click();
});

it('should go to slide 3', function(){
  var ele = element(by.css('.right-buttons .button'));
  ele.click();
});

it('should go to main app', function(){
  var ele = element(by.css('.right-buttons .button'));
  ele.click();
});

it('should start over', function(){
  var ele = element(by.css('ion-nav-view .button'));
  ele.click();
});
