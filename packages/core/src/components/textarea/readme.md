# ion-textarea

`ion-textarea` is used for multi-line text inputs. Ionic still
uses an actual `<textarea>` HTML element within the component;
however, with Ionic wrapping the native HTML text area element, Ionic
is able to better handle the user experience and interactivity.

Note that `<ion-textarea>` must load its value from the `value` or
`[(ngModel)]` attribute. Unlike the native `<textarea>` element,
`<ion-textarea>` does not support loading its value from the
textarea's inner content.

When requiring only a single-line text input, we recommend using
`<ion-input>` instead.

```html
 <ion-item>
   <ion-label>Comments</ion-label>
   <ion-textarea></ion-textarea>
 </ion-item>

 <ion-item>
   <ion-label stacked>Message</ion-label>
   <ion-textarea [(ngModel)]="msg"></ion-textarea>
 </ion-item>

 <ion-item>
   <ion-label floating>Description</ion-label>
   <ion-textarea></ion-textarea>
 </ion-item>

<ion-item>
   <ion-label>Long Description</ion-label>
   <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
 </ion-item>
```


<!-- Auto Generated Below -->


## Properties

#### autocapitalize

string


#### autocomplete

string


#### autofocus

boolean


#### clearOnEdit

boolean


#### cols

number


#### debounce

number


#### disabled

boolean


#### maxlength

number


#### minlength

number


#### name

string


#### placeholder

string


#### readonly

boolean


#### required

boolean


#### rows

number


#### spellcheck

boolean


#### value

string


#### wrap

string


## Attributes

#### autocapitalize

string


#### autocomplete

string


#### autofocus

boolean


#### clearOnEdit

boolean


#### cols

number


#### debounce

number


#### disabled

boolean


#### maxlength

number


#### minlength

number


#### name

string


#### placeholder

string


#### readonly

boolean


#### required

boolean


#### rows

number


#### spellcheck

boolean


#### value

string


#### wrap

string


## Events

#### ionBlur


#### ionFocus


#### ionInput


#### ionStyle



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
