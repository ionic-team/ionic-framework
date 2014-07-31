---
name: popover
component: $ionicPopover
---

it('should open left side ios popover', function(){
  element(by.css('#ios')).click();
  element(by.css('#icon-btn')).click();
});

it('should close ios popover when clicking backdrop', function(){
  element(by.css('.popover-backdrop.active')).click();
});

it('should open middle ios popover', function(){
  element(by.css('#mid-btn')).click();
});

it('should open right ios popover', function(){
  element(by.css('.popover-backdrop.active')).click();
  element(by.css('#right-btn')).click();
});

it('should open left side android popover', function(){
  element(by.css('.popover-backdrop.active')).click();
  element(by.css('#android')).click();
  element(by.css('#icon-btn')).click();
});

it('should close android popover when clicking backdrop', function(){
  element(by.css('.popover-backdrop.active')).click();
});

it('should open middle android popover', function(){
  element(by.css('#mid-btn')).click();
});

it('should open right android popover', function(){
  element(by.css('.popover-backdrop.active')).click();
  element(by.css('#right-btn')).click();
});
