# ion-alert-controller

An Alert is a dialog that presents users with information or collects
information from the user using inputs. An alert appears on top
of the app's content, and must be manually dismissed by the user before
they can resume interaction with the app. It can also optionally have a
`title`, `subTitle` and `message`.

You can pass all of the alert's options in the first argument of
the create method: `create(opts)`. Otherwise the alert's instance
has methods to add options, such as `setTitle()` or `addButton()`.


### Alert Buttons

In the array of `buttons`, each button includes properties for its `text`,
and optionally a `handler`. If a handler returns `false` then the alert
will not automatically be dismissed when the button is clicked. All
buttons will show up in the order they have been added to the `buttons`
array, from left to right. Note: The right most button (the last one in
the array) is the main button.

Optionally, a `role` property can be added to a button, such as `cancel`.
If a `cancel` role is on one of the buttons, then if the alert is
dismissed by tapping the backdrop, then it will call the handler from
the button with a cancel role.


### Alert Inputs

Alerts can also include several different inputs whose data can be passed
back to the app. Inputs can be used as a simple way to prompt users for
information. Radios, checkboxes and text inputs are all accepted, but they
cannot be mixed. For example, an alert could have all radio button inputs,
or all checkbox inputs, but the same alert cannot mix radio and checkbox
inputs. Do note however, different types of "text" inputs can be mixed,
such as `url`, `email`, `text`, etc. If you require a complex form UI
which doesn't fit within the guidelines of an alert then we recommend
building the form within a modal instead.


<!-- Auto Generated Below -->


## Methods

#### create()


#### dismiss()


#### getTop()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
