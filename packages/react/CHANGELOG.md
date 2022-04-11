# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.16](https://github.com/ionic-team/ionic/compare/v6.0.15...v6.0.16) (2022-04-08)

**Note:** Version bump only for package @ionic/react





## [6.0.15](https://github.com/ionic-team/ionic/compare/v6.0.14...v6.0.15) (2022-04-06)

**Note:** Version bump only for package @ionic/react





## [6.0.14](https://github.com/ionic-team/ionic/compare/v6.0.13...v6.0.14) (2022-03-30)


### Bug Fixes

* **react:** treeshake ionic/core bundle ([#24989](https://github.com/ionic-team/ionic/issues/24989)) ([a296ca8](https://github.com/ionic-team/ionic/commit/a296ca875c18ec01bfc57972571e95a6d79f5678)), closes [#24497](https://github.com/ionic-team/ionic/issues/24497)





## [6.0.13](https://github.com/ionic-team/ionic/compare/v6.0.12...v6.0.13) (2022-03-23)

**Note:** Version bump only for package @ionic/react





## [6.0.12](https://github.com/ionic-team/ionic/compare/v6.0.11...v6.0.12) (2022-03-16)

**Note:** Version bump only for package @ionic/react





## [6.0.11](https://github.com/ionic-team/ionic/compare/v6.0.10...v6.0.11) (2022-03-09)

**Note:** Version bump only for package @ionic/react





## [6.0.10](https://github.com/ionic-team/ionic/compare/v6.0.9...v6.0.10) (2022-03-02)

**Note:** Version bump only for package @ionic/react





## [6.0.9](https://github.com/ionic-team/ionic/compare/v6.0.8...v6.0.9) (2022-02-23)

**Note:** Version bump only for package @ionic/react





## [6.0.8](https://github.com/ionic-team/ionic/compare/v6.0.7...v6.0.8) (2022-02-15)

**Note:** Version bump only for package @ionic/react





## [6.0.7](https://github.com/ionic-team/ionic/compare/v6.0.6...v6.0.7) (2022-02-09)

**Note:** Version bump only for package @ionic/react





## [6.0.6](https://github.com/ionic-team/ionic/compare/v6.0.5...v6.0.6) (2022-02-09)


### Bug Fixes

* **angular, react,  vue:** overlays no longer throw errors when used inside tests ([#24681](https://github.com/ionic-team/ionic/issues/24681)) ([897ae4a](https://github.com/ionic-team/ionic/commit/897ae4a4546ac0dd811125d5513ef23d133a1589)), closes [#24549](https://github.com/ionic-team/ionic/issues/24549) [#24590](https://github.com/ionic-team/ionic/issues/24590)





## [6.0.5](https://github.com/ionic-team/ionic/compare/v6.0.4...v6.0.5) (2022-02-02)


### Bug Fixes

* **react-router:** remove page transition flicker on outlet mounting ([#24667](https://github.com/ionic-team/ionic/issues/24667)) ([bdb5c42](https://github.com/ionic-team/ionic/commit/bdb5c421d2d1f72c123c254e50c6d31b3c1a8f42)), closes [#24666](https://github.com/ionic-team/ionic/issues/24666)
* **react:** nested router outlets will not reanimate entered views ([#24672](https://github.com/ionic-team/ionic/issues/24672)) ([43aa6c1](https://github.com/ionic-team/ionic/commit/43aa6c11f42fd5cf455c50419d5f5fbb327b2901)), closes [#24107](https://github.com/ionic-team/ionic/issues/24107)


### Performance Improvements

* **various:** don't use lazy-loaded icon names in components ([#24671](https://github.com/ionic-team/ionic/issues/24671)) ([484de50](https://github.com/ionic-team/ionic/commit/484de5074de212dffb4bf4f73bade7acec103fe8))





## [6.0.4](https://github.com/ionic-team/ionic/compare/v6.0.3...v6.0.4) (2022-01-26)


### Bug Fixes

* **react:** setupIonicReact no longer crashes in SSR environment ([#24604](https://github.com/ionic-team/ionic/issues/24604)) ([360643d](https://github.com/ionic-team/ionic/commit/360643d96a03b345c83b88c9ff06e9aa254dee81))





## [6.0.3](https://github.com/ionic-team/ionic/compare/v6.0.2...v6.0.3) (2022-01-19)


### Bug Fixes

* **react:** add useRef wrapper to useIonOverlay state to avoid stale references ([#24553](https://github.com/ionic-team/ionic/issues/24553)) ([bce849c](https://github.com/ionic-team/ionic/commit/bce849c5f324522002eff7f8a5e5023150e9201c))
* **react:** prevent errors when dismissing inline popover after containing element is removed ([#24569](https://github.com/ionic-team/ionic/issues/24569)) ([c8a392a](https://github.com/ionic-team/ionic/commit/c8a392aef5fbf25f59a573897d970c41abac04d2))





## [6.0.2](https://github.com/ionic-team/ionic/compare/v6.0.1...v6.0.2) (2022-01-11)


### Bug Fixes

* **breadcrumb:** support routerLink on breadcrumb ([#24509](https://github.com/ionic-team/ionic/issues/24509)) ([5bb1414](https://github.com/ionic-team/ionic/commit/5bb1414f7fa04ea07954cb3f68883ee2f162586a)), closes [#24493](https://github.com/ionic-team/ionic/issues/24493)
* **react,vue:** backdrop for inline modal/popover overlay ([#24453](https://github.com/ionic-team/ionic/issues/24453)) ([77f8412](https://github.com/ionic-team/ionic/commit/77f8412b746222793cd9d17f12f50d512ab5e886)), closes [#24449](https://github.com/ionic-team/ionic/issues/24449)
* **react:** building app for production now works correctly with vite ([#24515](https://github.com/ionic-team/ionic/issues/24515)) ([32fad3d](https://github.com/ionic-team/ionic/commit/32fad3d02cb6b012a772de03eafe3e3a6b1300e0)), closes [#24229](https://github.com/ionic-team/ionic/issues/24229)
* **react:** scrolling to bottom of modal contents ([#24510](https://github.com/ionic-team/ionic/issues/24510)) ([1462cef](https://github.com/ionic-team/ionic/commit/1462cef69225e20582e2f9a0b8fd655ca2066b79)), closes [#24478](https://github.com/ionic-team/ionic/issues/24478)
