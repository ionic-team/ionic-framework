# Inset sheet presentation

`--sheet-inset` opts an iOS sheet into a scaled, rounded presentation at partial breakpoints. It defaults to zero, so existing sheets and MD presentations keep their appearance. For example:

```css
ion-modal.ios.phone-sheet {
  --sheet-inset: 8px;
  --border-radius: 32px;
}
```

Configure the modal with `breakpoints: [0, 0.5, 0.75, 1]` and `initialBreakpoint: 0.75`. The inset is measured from the unscaled sheet's side/bottom edges. CSS lengths, including `calc()`, are resolved before creating keyframes. An inset that consumes the entire sheet width is ignored.

At partial detents the content is scaled, not reflowed into a narrower layout. The inset interpolates to zero between the last partial detent and breakpoint 1. If no breakpoint 1 exists, partial detents retain the inset. Enter, leave, drag, snap, and programmatic changes share these keyframes. The existing breakpoint-height and `expandToScroll` semantics are retained.

The wrapper is clipped at its visible bottom, so content below a partial detent cannot capture taps in the gap. With `expandToScroll=false`, footers remain in the scaled page rather than being reparented into the unscaled document body. Window resizing recomputes geometry; drag/snap completion also refreshes it without introducing a second animation loop. Changing a CSS variable alone is not a reactive API: it is sampled during presentation, resize, or a subsequent gesture/breakpoint transition.

This is an opt-in presentation mechanism, not automatic iPhone/iPad detection. Native measurements in [theme Issue #269](https://github.com/rdlabo-dev/ionic-theme-ios27/issues/269) were independently reproduced on iOS 27.0: iPhone partial sheets have about 8pt side/bottom gaps, while large sheets have none. iPad has different dimensions and retains a bottom gap at large. Do not apply a phone inset globally to iPad. The interpolation is not a claim to reproduce Apple's private spring curve or SwiftUI detent-height calculation.

Run `npx playwright test src/components/modal/test/sheet-inset/modal.e2e.ts` from `core`. The tests cover both `expandToScroll` values, CSS length resolution, partial/full detents, mid-drag scaling, backdrop hit testing, footer layout, content scroll state, dismissal/re-presentation, resize, disabling/re-enabling the inset, `canDismiss=false`, backdrop dismissal, and unchanged default/MD presentation.
