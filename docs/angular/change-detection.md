# Angular Change Detection

Every `@Component` in `packages/angular/src` must declare `changeDetection` explicitly. What the Angular partial linker fills in for an undeclared strategy depends on two versions: the one stamped into our own emitted declaration, and the linker the consumer runs. An Angular 22 linker fills in `OnPush` when our declaration says 22 or later, while Angular 18-21 linkers always fill in `Default`. So bumping *our* toolchain to Angular 22 is enough to flip every Angular 22 consumer, which is how `ion-router-outlet` and `ion-tabs` stopped letting change detection reach routed pages in [#31406](https://github.com/ionic-team/ionic-framework/issues/31406).

Use `OnPush` unless the pages a component hosts are only reached by a tick descending through its own view. Only `ion-router-outlet` and `ion-tabs` qualify today. The `ion-nav` component stays `OnPush` because `IonNavBase` detaches its view and the delegate attaches its pages as root views instead.

A component that needs `Default` also needs two things the compiler won't warn about:

- an `// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection` above it, with a comment saying why. That rule is an error here. It only fires on an explicit non-OnPush value, never on a missing one, so it can't enforce the rule above on its own.
- an entry in `EAGER_COMPONENTS` in `packages/angular/scripts/verify-change-detection.js`, keyed by class name and listing every dist file it is emitted into (one for lazy, one for standalone).

`IonRouterOutlet` carries both. In `packages/angular/src/standalone/navigation/router-outlet.ts`:

```ts
@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-router-outlet',
  standalone: true,
  // Routed pages are created inside this component's own view, so an OnPush
  // outlet would leave them unreachable from a tick under Zone.js.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  template: '<ng-container #outletContent><ng-content></ng-content></ng-container>',
})
export class IonRouterOutlet extends IonRouterOutletBase {
  // ...
}
```

The lazy build declares the same component at `packages/angular/src/lazy/directives/navigation/ion-router-outlet.ts`, with the same comment, eslint-disable and `changeDetection` line. It sets `standalone: false` and has no `@ProxyCmp`.

And in `packages/angular/scripts/verify-change-detection.js`:

```js
const EAGER_COMPONENTS = {
  IonRouterOutlet: ['lazy/directives/navigation/ion-router-outlet.js', 'standalone/navigation/router-outlet.js'],
  IonTabs: ['lazy/directives/navigation/ion-tabs.js', 'standalone/navigation/tabs.js'],
};
```

Everything else takes the plain form: `changeDetection: ChangeDetectionStrategy.OnPush`, no eslint-disable, no script entry. See `packages/angular/src/standalone/navigation/nav.ts`, where the comment records why `ion-nav` stays `OnPush` despite hosting pages, and `packages/angular/src/lazy/directives/navigation/ion-nav.ts`, with the same comment.

The `npm run build` script enforces this in two steps:

- The `build.change-detection` step (`packages/angular/scripts/normalize-change-detection.js`) rewrites Angular 22's emitted `ChangeDetectionStrategy.Eager` back to `Default`, since `Eager` only exists from Angular 21.2 onward and earlier linkers in the peer range reject it outright.
- The `validate.change-detection` step (`packages/angular/scripts/verify-change-detection.js`) fails the build on a component with no strategy, a strategy name that won't link across the whole peer range, or a component going eager without being listed in `EAGER_COMPONENTS`.

If that check names a component from `packages/angular/src/lazy/directives/proxies.ts` or `packages/angular/src/standalone/directives/ion-*.ts`, don't edit those files. They are emitted by `@stencil/angular-output-target`, which hardcodes the strategy, so a failure there means the generator changed. Fix or pin that dependency in `core/package.json` instead. Those generated files are 158 of the 182 components and `packages/angular/eslint.config.js` ignores all of them, so lint can never see them, which is why this check exists.

## Other version-gated linker behavior

The change detection default is one of two linker gates that the Angular 22 bump flipped. The other is `legacyOptionalChaining`: on a declaration stamped 22 or later, `a?.b` on a nullish receiver evaluates to `undefined` per the JS spec, while an Angular 18-21 linker keeps the legacy `null`. No template or host binding in `packages/angular/src` uses `?.` today, so nothing is affected, but the first one added becomes version-dependent with no test that notices.

Both gates key off the same `version:` string the compiler stamps into our emitted declarations, so a future toolchain bump can change emitted output the same silent way.
