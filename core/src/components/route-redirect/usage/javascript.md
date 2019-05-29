```html
<!-- Redirects when the user navigates to `/admin` but
will NOT redirect if the user navigates to `/admin/posts` -->
<ion-route-redirect from="/admin" to="/login"></ion-route-redirect>

<!-- By adding the wilcard character (*), the redirect will match
any subpath of admin -->
<ion-route-redirect from="/admin/*" to="/login"></ion-route-redirect>
```

### Route Redirects as Guards

Redirection routes can work as guards to prevent users from navigating to certain areas of an application based on a given condition, such as if the user is authenticated or not.

A route redirect can be added and removed dynamically to redirect (or guard) some routes from being accessed. In the following example, all urls `*` will be redirected to the `/login` url if `isLoggedIn` is `false`.

```tsx
const isLoggedIn = false;

const router = document.querySelector('ion-router');
const routeRedirect = document.createElement('ion-route-redirect');
routeRedirect.setAttribute('from', '*');
routeRedirect.setAttribute('to', '/login');

if (!isLoggedIn) {
  router.appendChild(routeRedirect);
}
```

Alternatively, the value of `to` can be modified based on a condition. In the following example, the route redirect will check if the user is logged in and redirect to the `/login` url if not.

```html
<ion-route-redirect id="tutorialRedirect" from="*"></ion-route-redirect>
```

```javascript
const isLoggedIn = false;
const routeRedirect = document.querySelector('#tutorialRedirect');

routeRedirect.setAttribute('to', isLoggedIn ? undefined : '/login');
```