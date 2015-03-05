describe('ionSideMenus-simple', function() {

it('should init', function() {
  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionSideMenus/simple/');
});


it('should show left menu', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(0).click();
});

it('should hide left menu by clicking header button', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(0).click();
});

it('should show left menu', function(){
  var ele = element.all(by.css('.bar-header .button'));
  ele.get(0).click();
});

it('should hide left menu by close menu item', function(){
  var ele = element.all(by.css('ion-side-menu[side="left"] a'));
  ele.get(0).click();
});

});
