# Router


### App Views extend View

```
class MyView1 extends View {
  constructor(navView) {}
}

@Template({
  inline: '<div>blah blah</div>'
})
class MyView2 extends View {
  constructor(navView) {}
}

@Route({
  url: '/myview4'
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
  url: '/whateves',
  inline: '<div>crazy dynamic template</div>'
})
```


### Markup Nav

```
<a nav-link="MyView2"></a>

<a [nav-link]="{ controller: MyView3, template: 'view3.html', animation: horizontal }"></a>
```

### Animations

platform: Whatever the platform would have naturally done (Default)
horizontal: Right to center when going forward. Center to right when going back
vertial: Bottom to center when going forward. Bottom to center when going back
right-to-center: Always right to center
left-to-center: Always left to center
top-to-center: Always top to center
bottom-to-center: Always bottom to center

