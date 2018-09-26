# ion-menu-controller

The MenuController makes it easy to control a Menu. Its methods can be used to display the menu, enable the menu, toggle the menu, and more. The controller will grab a reference to the menu by the side, id, or, if neither of these are passed to it, it will grab the first menu it finds.


<!-- Auto Generated Below -->


## Methods

| Method              | Description                                                                                                                                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close`             | Close the menu. If no menu is specified, then it will close any menu that is open. If a menu is specified, it will close that menu.                                                                                                                                                                                        |
| `enable`            | Used to enable or disable a menu. For example, there could be multiple left menus, but only one of them should be able to be opened at the same time. If there are multiple menus on the same side, then enabling one menu will also automatically disable all the others that are on the same side.                       |
| `get`               | Used to get a menu instance. If a menu is not provided then it will return the first menu found. If the specified menu is `left` or `right`, then it will return the enabled menu on that side. Otherwise, it will try to find the menu using the menu's `id` property. If a menu is not found then it will return `null`. |
| `getMenus`          | Returns an array of all menu instances.                                                                                                                                                                                                                                                                                    |
| `getOpen`           | Returns the instance of the menu already opened, otherwise `null`.                                                                                                                                                                                                                                                         |
| `isAnimating`       | Returns true if any menu is currently animating.                                                                                                                                                                                                                                                                           |
| `isEnabled`         | Returns true if the specified menu is enabled.                                                                                                                                                                                                                                                                             |
| `isOpen`            | Returns true if the specified menu is open. If the menu is not specified, it will return true if any menu is currently open.                                                                                                                                                                                               |
| `open`              | Open the menu.                                                                                                                                                                                                                                                                                                             |
| `registerAnimation` |                                                                                                                                                                                                                                                                                                                            |
| `swipeGesture`      | Used to enable or disable the ability to swipe open the menu.                                                                                                                                                                                                                                                              |
| `toggle`            | Toggle the menu. If it's closed, it will open, and if opened, it will close.                                                                                                                                                                                                                                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
