# Ionic

Ionic makes it easy for web developers to best-in-class build mobile apps across major platforms, like iOS
and Android.

Since the initial release of Ionic in November 2013, 700,000 apps have been created with the Ionic SDK,
and many have been featured as top apps in the Apple App Store, Google Play Store, and Amazon App Store.

Ionic is a collection of CSS and Javascript components based on Angular 2. The core philosophy behind
Ionic is that a web developer can use the standard HTML5/CSS/Javascript stack they already know and love,
but get real mobile components underneath that adapt automatically to the device and platform they
run on.

## New to Ionic?

If Ionic 2 is your first exposure to Ionic, jump right in with the [Getting Started]() guide. Otherwise,
read below for some design philosophy changes from v1.

## New Concepts in Ionic 2

Ionic 2 brings even more parity to native SDKs like iOS and Android for the web stack.

With that in mind, some core components (like routing) work differently in v2 than v1.

### Navigation

In Ionic 1, we used UI Router with URL routing heavily to define navigation in your app.

The overwhelming feedback from Ionic 1 developers is that the routing and navigation
system was too difficult to use in practice. It was challenging to correctly map
URLs to views, and the navigation system didn't give the developer enough fine-grained control.

With v2, we've taken a more native-friendly navigation approach with a simpler `push/pop` system.

For example, in v1 we'd create a `ContactDetail` page like this:

```javascript
$stateProvider
  .state('contact', {
    url: "/contact/:contactId",
    templateUrl: "templates/contact.html",
    controller: 'ContactCtrl'
  });
```

Then, to navigate to this, you'd do `<a ui-sref="contact({contact: contact})">{{contact.name}}</a>`

In v2, this works a bit differently. Instead of navigating through URLs and routing (which is still
  possible as we will see a bit later), we push and pop views onto the stack:

`<ion-item (^click)="showContact(contact)">{{contact.name}}</ion-item>``

```javascript
class ContactsPage {
  showContact(contact) {
    this.nav.push(ContactDetail, {
      contact: contact
    });
  }
}
```
