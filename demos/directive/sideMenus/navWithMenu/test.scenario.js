---
name: navWithMenu
component: ionSideMenus
---

it('should nav to Search from left menu', function(){
  var ele = element.all(by.css('button[menu-toggle="left"]'));
  ele.get(0).click();

  browser.sleep(500).then(function(){
    var itemEle = element.all(by.css('ion-side-menu[side="left"] a'));
    itemEle.get(0).click();
  });
});

it('should nav to Browse from left menu', function(){
  var ele = element.all(by.css('button[menu-toggle="left"]'));
  ele.get(0).click();

  browser.sleep(500).then(function(){
    var itemEle = element.all(by.css('ion-side-menu[side="left"] a'));
    itemEle.get(1).click();
  });
});
