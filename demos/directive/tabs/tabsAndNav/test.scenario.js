---
name: tabsAndNav
component: ionTabs
---
it('should go to page 2 in Home tab', function(){
  var ele = element.all(by.css('ion-nav-view[name="home-tab"] .button'));
  ele.get(0).click();
});

it('should go to page 3 in Home tab', function(){
  var ele = element.all(by.css('ion-nav-view[name="home-tab"] .button'));
  ele.get(1).click();
});

it('should go to About tab', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(1).click();
});

it('should go to page 2 in About tab', function(){
  var ele = element.all(by.css('ion-nav-view[name="about-tab"] .button'));
  ele.get(0).click();
});

it('should go to Contact tab', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(2).click();
});

it('should go to About tab and still be at page 2', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(1).click();
});

it('should go to Home tab and still be at page 3', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(0).click();
});

it('should go back to page 2 in Home tab', function(){
  var ele = element(by.css('ion-nav-back-button'));
  ele.click();
});

it('should go back to page 1 in Home tab', function(){
  var ele = element(by.css('ion-nav-back-button'));
  ele.click();
});

it('should go to About tab and still be at page 2', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(1).click();
});

it('should go back to page 1 in About tab', function(){
  var ele = element(by.css('ion-nav-back-button'));
  ele.click();
});

it('should go to Home tab and still be at page 1', function(){
  var ele = element.all(by.css('.tabs a'));
  ele.get(0).click();
});
