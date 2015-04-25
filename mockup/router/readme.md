# Router


### App Views extend View

```
class MyView1 extends View {
  constructor(navView) {}
}

@Template({
  template: '<div>blah blah</div>'
})
class MyView2 extends View {
  constructor(navView) {}
}

@Route({
  templateUrl: '/myview4'
})
class MyView4 extends View {
  constructor(navView) {}
}

```


### JS Nav

```
navView.push(MyView2)

navView.push({
  controller: MyView3,
  template: 'view3.html'
})

navView.push({
  animation: 'horizontal',
  controller: MyView3,
  template: 'view3.html'
})

navView.push({
  templateUrl: '/whateves',
  template: '<div>crazy dynamic template</div>'
})
```


### Markup Nav

```
<a nav-link="MyView2"></a>

<a [nav-link]="{ controller: MyView3, template: 'view3.html', animation: horizontal }"></a>
```

### Animations

```
platform: Whatever the platform would have naturally done (Default)
horizontal: Right to center when going forward. Center to right when going back
vertial: Bottom to center when going forward. Bottom to center when going back
right-to-center: Always right to center
left-to-center: Always left to center
top-to-center: Always top to center
bottom-to-center: Always bottom to center
```


### Simple webdev:

1. Give markup a templateUrl: Saving the file, CMS url, or creating an endpoint serversize (django, RoR, etc)
2. In the markup, add a link all the linked pages using `href=url`

Pros: Simple. Its how the web works.

Cons: Not ideal for web applications


### Ionic v1

1. Create the stateProvider
2. Create state name
3. Give the state a url
4. Set the state name of where the state should live (name the div)
5. Wire up this state to the controller
6. Wire up this state to the template
7. In the template, add a link to all the linked pages using `href=url` or `ui-sref=stateName`

Pros: Centralizes all routes and URLs for easy management. Can update numerous sections of the webapp, rather than just one div. Deep linking: click to any view of the entire webapp from anywhere. Good for webapps.

Cons: Many repetitive steps. Confusing what each of the variables actually do. Web devs aren't familiar with JS routing.


### Ionic v2 (without a markup shorthand)

1. Create custom view component by extending base ionic view
2. Add template to component
3. Add DI of nav-view to the view's constructor's arguments
4. Add a click handler for every link
5. In each click handler, use `navView.push()` (would each view we link to require an import on that page?)
6. In the template, add the click handler to each of the linked views

Pros: Decentralized routing. More like native apps and OO languages/frameworks. Only concerned about informing it's parent navView, rather than a global configuration.

Cons: Decentralized routing. Creating click methods in JS and wiring them up in HTML. No/Difficult deep linking: Only can go forward and back. Only updates one div.
