# ion-menu-controller



<!-- Auto Generated Below -->


## Methods

#### _register()


#### _setActiveMenu()


#### _setOpen()


#### _unregister()


#### close()

Programatically close the Menu. If no `menuId` is given as the first
argument then it'll close any menu which is open. If a `menuId`
is given then it'll close that exact menu.


#### createAnimation()


#### enable()

Used to enable or disable a menu. For example, there could be multiple
left menus, but only one of them should be able to be opened at the same
time. If there are multiple menus on the same side, then enabling one menu
will also automatically disable all the others that are on the same side.


#### get()

Used to get a menu instance. If a `menuId` is not provided then it'll
return the first menu found. If a `menuId` is `left` or `right`, then
it'll return the enabled menu on that side. Otherwise, if a `menuId` is
provided, then it'll try to find the menu using the menu's `id`
property. If a menu is not found then it'll return `null`.


#### getMenus()


#### getOpen()


#### isAnimating()


#### isEnabled()


#### isOpen()


#### open()

Programatically open the Menu.


#### registerAnimation()


#### swipeEnable()

Used to enable or disable the ability to swipe open the menu.


#### toggle()

Toggle the menu. If it's closed, it will open, and if opened, it
will close.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
