# ion-action-sheet-controller

 An Action Sheet is a dialog that lets the user choose from a set of
 options. It appears on top of the app's content, and must be manually
 dismissed by the user before they can resume interaction with the app.
 Dangerous (destructive) options are made obvious in `ios` mode. There are easy
 ways to cancel the action sheet, such as tapping the backdrop or
 hitting the escape key on desktop.

 An action sheet is created from an array of `buttons`, with each button
 including properties for its `text`, and optionally a `handler` and `role`.
 If a handler returns `false` then the action sheet will not be dismissed. An
 action sheet can also optionally have a `title`, `subTitle` and an `icon`.

 A button's `role` property can either be `destructive` or `cancel`. Buttons
 without a role property will have the default look for the platform. Buttons
 with the `cancel` role will always load as the bottom button, no matter where
 they are in the array. All other buttons will be displayed in the order they
 have been added to the `buttons` array. Note: We recommend that `destructive`
 buttons are always the first button in the array, making them the top button.
 Additionally, if the action sheet is dismissed by tapping the backdrop, then
 it will call the handler from the button with the cancel role.

 You can pass all of the action sheet's options in the first argument of
 the create method: `ActionSheet.create(opts)`.


<!-- Auto Generated Below -->


## Methods

#### create()


#### dismiss()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
