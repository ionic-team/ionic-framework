# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.5.1-nightly.20230123](https://github.com/ionic-team/ionic/compare/v6.5.0...v6.5.1-nightly.20230123) (2023-01-23)


### Bug Fixes

* **action-sheet:** button icons are not announced by screen readers ([#26640](https://github.com/ionic-team/ionic/issues/26640)) ([22e9ff8](https://github.com/ionic-team/ionic/commit/22e9ff866f8bd7e2e4ca82eae70969ea4f2658df))
* **fab-button:** icon is not announced by screen readers ([#26619](https://github.com/ionic-team/ionic/issues/26619)) ([dd7cd8c](https://github.com/ionic-team/ionic/commit/dd7cd8c0bfe652d293dc2c2b1bd2a36fd9cf0a0b)), closes [#22296](https://github.com/ionic-team/ionic/issues/22296)
* **modal, popover:** warn if trigger element was not found ([#26650](https://github.com/ionic-team/ionic/issues/26650)) ([1115203](https://github.com/ionic-team/ionic/commit/11152031202a513121861486e50ea7942b9118d3))
* **toggle:** on-off icon is not announced by screen readers ([#26641](https://github.com/ionic-team/ionic/issues/26641)) ([77ccac0](https://github.com/ionic-team/ionic/commit/77ccac059091d5d9f7daf9c7fb01a9e855b86ce3))





# [6.5.0](https://github.com/ionic-team/ionic/compare/v6.4.3...v6.5.0) (2023-01-18)


### Features

* **deps:** update ionicons to 6.1.0 ([#26617](https://github.com/ionic-team/ionic/issues/26617)) ([ccd2a92](https://github.com/ionic-team/ionic/commit/ccd2a9224e018ad0d67903d44ec312934c3b35ec))
* **deps:** update ionicons to 6.1.1 ([#26626](https://github.com/ionic-team/ionic/issues/26626)) ([90405eb](https://github.com/ionic-team/ionic/commit/90405eb0af69ce04faf5855189449d0b7518288c))
* **router:** export hook interfaces ([#26551](https://github.com/ionic-team/ionic/issues/26551)) ([2752702](https://github.com/ionic-team/ionic/commit/27527025e4588f43f9f79640f0929e7c7d0618ee))





## [6.4.3](https://github.com/ionic-team/ionic/compare/v6.4.2...v6.4.3) (2023-01-18)


### Bug Fixes

* **datetime:** allow header to render in all wheel picker presentations ([#26616](https://github.com/ionic-team/ionic/issues/26616)) ([7b947b5](https://github.com/ionic-team/ionic/commit/7b947b5d58ff51a3a6ac360fef6d4df073e1bfec))
* **input:** clear button uses contrast when setting color on item ([#26592](https://github.com/ionic-team/ionic/issues/26592)) ([a31e1e5](https://github.com/ionic-team/ionic/commit/a31e1e594d4ed7bbcf690b27eee143da232f2bdc)), closes [#26337](https://github.com/ionic-team/ionic/issues/26337)
* **list:** inset lists render correctly ([#26586](https://github.com/ionic-team/ionic/issues/26586)) ([911b1d4](https://github.com/ionic-team/ionic/commit/911b1d496efe595ddbf8e980f052e505ce9716c2)), closes [#20819](https://github.com/ionic-team/ionic/issues/20819)





## [6.4.2](https://github.com/ionic-team/ionic/compare/v6.4.1...v6.4.2) (2023-01-11)


### Bug Fixes

* **datetime:** time wheel input mode is dismissed on user scroll ([#26567](https://github.com/ionic-team/ionic/issues/26567)) ([d13a146](https://github.com/ionic-team/ionic/commit/d13a14658df2723aff908a94181cb563cb1f5b43))
* **loading:** support custom aria-label ([#26581](https://github.com/ionic-team/ionic/issues/26581)) ([2450a1e](https://github.com/ionic-team/ionic/commit/2450a1e821d3901c8efb57ec256a10a951d22c8f)), closes [#24486](https://github.com/ionic-team/ionic/issues/24486)
* **modal:** canDismiss type with data and role ([#26547](https://github.com/ionic-team/ionic/issues/26547)) ([32c2622](https://github.com/ionic-team/ionic/commit/32c2622ab04a70d00684e9a813d9bcef698d7551)), closes [#26544](https://github.com/ionic-team/ionic/issues/26544)
* **picker-column-internal:** blurring picker does not throw error ([#26560](https://github.com/ionic-team/ionic/issues/26560)) ([3e671b9](https://github.com/ionic-team/ionic/commit/3e671b9c8ff62945a12eff431839ddae37d9d1a7)), closes [#26559](https://github.com/ionic-team/ionic/issues/26559)
* **segment:** nested interactive is not rendered ([#26575](https://github.com/ionic-team/ionic/issues/26575)) ([77ce9e0](https://github.com/ionic-team/ionic/commit/77ce9e066e1ee71438ceac35479ea04e8df021f5))
* **tab-button:** nested interactives are not rendered ([#26576](https://github.com/ionic-team/ionic/issues/26576)) ([df4882d](https://github.com/ionic-team/ionic/commit/df4882d4d1c516038badfa647db484e070fbd099)), closes [#23332](https://github.com/ionic-team/ionic/issues/23332)





## [6.4.1](https://github.com/ionic-team/ionic/compare/v6.4.0...v6.4.1) (2022-12-14)


### Bug Fixes

* **breadcrumbs:** breadcrumbs are reactive ([#26427](https://github.com/ionic-team/ionic/issues/26427)) ([0d8625b](https://github.com/ionic-team/ionic/commit/0d8625b95537208c188b32a1707fa66050953281)), closes [#24041](https://github.com/ionic-team/ionic/issues/24041)
* **datetime:** keyboard can select hour 00 ([#26423](https://github.com/ionic-team/ionic/issues/26423)) ([2fc96b7](https://github.com/ionic-team/ionic/commit/2fc96b771412d2deac6d19883bfc5abc74d0bdbd)), closes [#26409](https://github.com/ionic-team/ionic/issues/26409)
* **modal:** compatibility with stencil libraries/apps ([#26448](https://github.com/ionic-team/ionic/issues/26448)) ([1aa1068](https://github.com/ionic-team/ionic/commit/1aa1068df7867a8b8a203052635da018014f5f1c))
* **normalize:** remove normalize styles for outdated browsers ([#26465](https://github.com/ionic-team/ionic/issues/26465)) ([82d1d94](https://github.com/ionic-team/ionic/commit/82d1d948ecd7725772eb1ffee495e7a5dcadb30b)), closes [#26464](https://github.com/ionic-team/ionic/issues/26464)





# [6.4.0](https://github.com/ionic-team/ionic/compare/v6.3.10...v6.4.0) (2022-12-07)


### Features

* **modal:** data and role are passed to canDismiss ([#26384](https://github.com/ionic-team/ionic/issues/26384)) ([1b30fc9](https://github.com/ionic-team/ionic/commit/1b30fc97d33e761866b4bcf7518efcdeb753032d)), closes [#26292](https://github.com/ionic-team/ionic/issues/26292)
* **toast:** add global config toastDuration ([#26425](https://github.com/ionic-team/ionic/issues/26425)) ([a67a827](https://github.com/ionic-team/ionic/commit/a67a827fedc8adf44a35c786f615871facca60fc))
* **toggle:** add toggleOnOffLabels global config option ([#26087](https://github.com/ionic-team/ionic/issues/26087)) ([43e2b39](https://github.com/ionic-team/ionic/commit/43e2b3975d003e29b8060e5f5484bfb3daf457a2))





## [6.3.10](https://github.com/ionic-team/ionic/compare/v6.3.9...v6.3.10) (2022-12-07)


### Bug Fixes

* **datetime:** add flipRTL to monthAndYear dropdown icon ([#26378](https://github.com/ionic-team/ionic/issues/26378)) ([13fe669](https://github.com/ionic-team/ionic/commit/13fe669dc14eb4c9feda8ee956fec42b994b0f96))
* **datetime:** md highlight does not clip at start or end of month ([#26366](https://github.com/ionic-team/ionic/issues/26366)) ([fcfbcdb](https://github.com/ionic-team/ionic/commit/fcfbcdbc200b1354b9128a691fbd9b68d50d8668)), closes [#24891](https://github.com/ionic-team/ionic/issues/24891)
* **segment:** scrolling button into view is more consistent ([#26369](https://github.com/ionic-team/ionic/issues/26369)) ([a2d570b](https://github.com/ionic-team/ionic/commit/a2d570b7ad8b799b072ba6eb79d8fe4c6dd77cf0)), closes [#26368](https://github.com/ionic-team/ionic/issues/26368)


### Features

* **toast:** add global config toastDuration ([#26401](https://github.com/ionic-team/ionic/issues/26401)) ([e375e9a](https://github.com/ionic-team/ionic/commit/e375e9a1e7d30c481772e84c0ae34f39a019aad3))


### Reverts

* Revert "feat(toast): add global config toastDuration (#26401)" (#26424) ([b6c0019](https://github.com/ionic-team/ionic/commit/b6c001935b4e51a04aa94b0bd6d849e783c8f607)), closes [#26401](https://github.com/ionic-team/ionic/issues/26401) [#26424](https://github.com/ionic-team/ionic/issues/26424)





## [6.3.9](https://github.com/ionic-team/ionic/compare/v6.3.8...v6.3.9) (2022-11-30)


### Bug Fixes

* **button:** fill can be set to undefined ([#26339](https://github.com/ionic-team/ionic/issues/26339)) ([2fe23d9](https://github.com/ionic-team/ionic/commit/2fe23d9d46c3593843c781c57340332e5a86fd64)), closes [#25886](https://github.com/ionic-team/ionic/issues/25886)
* **input:** clear icon can be styled ([#26354](https://github.com/ionic-team/ionic/issues/26354)) ([ccaff8d](https://github.com/ionic-team/ionic/commit/ccaff8d0dc66f8adc9cde838c084629391e4200d)), closes [#19178](https://github.com/ionic-team/ionic/issues/19178) [#17168](https://github.com/ionic-team/ionic/issues/17168)
* **reorder:** items animate once in firefox ([#26326](https://github.com/ionic-team/ionic/issues/26326)) ([7ae8117](https://github.com/ionic-team/ionic/commit/7ae81172844659d7f4581956ce17e5324f73beef)), closes [#21182](https://github.com/ionic-team/ionic/issues/21182)
* **segment:** segment in toolbar uses correct contrast ([#26353](https://github.com/ionic-team/ionic/issues/26353)) ([5a243cc](https://github.com/ionic-team/ionic/commit/5a243ccebc8e27bef6eb1ed2f797a0c1166199bf)), closes [#26350](https://github.com/ionic-team/ionic/issues/26350)





## [6.3.8](https://github.com/ionic-team/ionic/compare/v6.3.7...v6.3.8) (2022-11-22)


### Bug Fixes

* **modal:** status bar style defaults to app settings ([#26291](https://github.com/ionic-team/ionic/issues/26291)) ([a6c9e55](https://github.com/ionic-team/ionic/commit/a6c9e55adcaa963f4829d6963b9b1a7b246cef4e)), closes [#26173](https://github.com/ionic-team/ionic/issues/26173)
* **normalize:** normalize css resets button padding ([#26214](https://github.com/ionic-team/ionic/issues/26214)) ([e14c947](https://github.com/ionic-team/ionic/commit/e14c94722c2c8ec145d680f911b708a34f095cd3)), closes [#23928](https://github.com/ionic-team/ionic/issues/23928)
* **popover:** popover positions correctly on all frameworks ([#26306](https://github.com/ionic-team/ionic/issues/26306)) ([be9a399](https://github.com/ionic-team/ionic/commit/be9a399eeed37ae4a67add78ac1283ba0c5e4b14)), closes [#25337](https://github.com/ionic-team/ionic/issues/25337)
* **reorder-group:** support custom components ([#26289](https://github.com/ionic-team/ionic/issues/26289)) ([8425734](https://github.com/ionic-team/ionic/commit/842573477b1b498f2280badc8c7411832c1650a5)), closes [#19447](https://github.com/ionic-team/ionic/issues/19447)
* **segment:** scrollable segments center button on click ([#26285](https://github.com/ionic-team/ionic/issues/26285)) ([73ea64c](https://github.com/ionic-team/ionic/commit/73ea64c02fff1d63651f6c98f03b43265ba5227a)), closes [#25367](https://github.com/ionic-team/ionic/issues/25367)
* **toggle:** rtl layout renders correctly in safari ([#26315](https://github.com/ionic-team/ionic/issues/26315)) ([0932f89](https://github.com/ionic-team/ionic/commit/0932f89f5db63a1e6149f2f45de798d7485d72ee))





## [6.3.7](https://github.com/ionic-team/ionic/compare/v6.3.6...v6.3.7) (2022-11-16)


### Bug Fixes

* **action-sheet:** icons are aligned on MD mode ([#26256](https://github.com/ionic-team/ionic/issues/26256)) ([627d654](https://github.com/ionic-team/ionic/commit/627d654d24f97e340e4004a03f07467619e60149)), closes [#26249](https://github.com/ionic-team/ionic/issues/26249)
* **datetime:** clear button clears the selected date ([#26264](https://github.com/ionic-team/ionic/issues/26264)) ([9216744](https://github.com/ionic-team/ionic/commit/9216744205c1ecc0c3dd51490a25be102f27a91a)), closes [#26258](https://github.com/ionic-team/ionic/issues/26258)
* **datetime:** fonts now render consistently ([#26281](https://github.com/ionic-team/ionic/issues/26281)) ([f13ddca](https://github.com/ionic-team/ionic/commit/f13ddcaf470fb3d070298819675812cebf5f5ceb))
* **datetime:** max and min works with showDefaultButtons ([#26257](https://github.com/ionic-team/ionic/issues/26257)) ([e5cff9e](https://github.com/ionic-team/ionic/commit/e5cff9ecf39c13912cf6e062e4a084fadc59c399)), closes [#26146](https://github.com/ionic-team/ionic/issues/26146)
* **popover:** inline popover positioning with fit-content or auto width ([#26230](https://github.com/ionic-team/ionic/issues/26230)) ([0a8a958](https://github.com/ionic-team/ionic/commit/0a8a958cba02994ea0fefa265b17edddffe62e98)), closes [#24716](https://github.com/ionic-team/ionic/issues/24716)
* **popover:** popover positioning for controller and inline ([#26274](https://github.com/ionic-team/ionic/issues/26274)) ([31ab10d](https://github.com/ionic-team/ionic/commit/31ab10de4e1c8e38582b985f19414f73337a63c8)), closes [#24716](https://github.com/ionic-team/ionic/issues/24716)
* **textarea:** scrollbars are visible with overflow ([#26284](https://github.com/ionic-team/ionic/issues/26284)) ([7a990ff](https://github.com/ionic-team/ionic/commit/7a990ff403d7b7b80541c5d8f9cd05463c4fb593)), closes [#26278](https://github.com/ionic-team/ionic/issues/26278)





## [6.3.6](https://github.com/ionic-team/ionic/compare/v6.3.5...v6.3.6) (2022-11-10)


### Bug Fixes

* **datetime:** flip chevron icons when RTL is set on component directly ([#26195](https://github.com/ionic-team/ionic/issues/26195)) ([dd98677](https://github.com/ionic-team/ionic/commit/dd9867708b66543f5cbe978e0fa6ef34b37f9fc3))





## [6.3.5](https://github.com/ionic-team/ionic/compare/v6.3.4...v6.3.5) (2022-11-09)


### Bug Fixes

* **android:** account for chrome 108 resize ([#26244](https://github.com/ionic-team/ionic/issues/26244)) ([1a0b9ed](https://github.com/ionic-team/ionic/commit/1a0b9ed3bacffa9f602637c204f52cb3face5a3e))
* **datetime:** min/max correctly display available day periods ([#26241](https://github.com/ionic-team/ionic/issues/26241)) ([526e411](https://github.com/ionic-team/ionic/commit/526e4113d82d244e2574b24d72fda632bb2aa143)), closes [#26216](https://github.com/ionic-team/ionic/issues/26216)
* **overlays:** presenting an overlay does not create nested elements ([#26154](https://github.com/ionic-team/ionic/issues/26154)) ([bb00595](https://github.com/ionic-team/ionic/commit/bb005956eaff7401cfe1d6befcbf512424ddd283)), closes [#26117](https://github.com/ionic-team/ionic/issues/26117)





## [6.3.4](https://github.com/ionic-team/ionic/compare/v6.3.3...v6.3.4) (2022-11-02)


### Bug Fixes

* **datetime:** account for allowed values when setting default date ([#26093](https://github.com/ionic-team/ionic/issues/26093)) ([3745083](https://github.com/ionic-team/ionic/commit/3745083b7cdf8651d1c7f5f1a0214b487ea286ca)), closes [#24722](https://github.com/ionic-team/ionic/issues/24722)
* **modal, popover:** remove trigger click listeners when overlay is unmounted ([#26167](https://github.com/ionic-team/ionic/issues/26167)) ([1320948](https://github.com/ionic-team/ionic/commit/1320948b245be3defe8610b9f049e781a4903a6e))
* **modal:** buttons are highlighted with VoiceOver ([#26180](https://github.com/ionic-team/ionic/issues/26180)) ([1504b88](https://github.com/ionic-team/ionic/commit/1504b8888d6f79ea382935ed52b104b9f841d150)), closes [#26156](https://github.com/ionic-team/ionic/issues/26156)





## [6.3.3](https://github.com/ionic-team/ionic/compare/v6.3.2...v6.3.3) (2022-10-26)


### Bug Fixes

* **datetime:** empty string is treated as no value ([#26131](https://github.com/ionic-team/ionic/issues/26131)) ([51ab5f6](https://github.com/ionic-team/ionic/commit/51ab5f67b50013c0ed8ca3160d6dfc56bc269f2a)), closes [#26116](https://github.com/ionic-team/ionic/issues/26116)
* **datetime:** preferWheel can now show title ([#26101](https://github.com/ionic-team/ionic/issues/26101)) ([479d56b](https://github.com/ionic-team/ionic/commit/479d56b3b26d45bfd03d4095458c37ed00485c54)), closes [#26095](https://github.com/ionic-team/ionic/issues/26095)
* **datetime:** values are adjusted to be in bounds ([#26125](https://github.com/ionic-team/ionic/issues/26125)) ([0548fe8](https://github.com/ionic-team/ionic/commit/0548fe858854f0187e0dfe00efaec142cd5bb6cf)), closes [#25894](https://github.com/ionic-team/ionic/issues/25894) [#25708](https://github.com/ionic-team/ionic/issues/25708)
* **many:** haptics only fire on supported platforms ([#26130](https://github.com/ionic-team/ionic/issues/26130)) ([d4d569a](https://github.com/ionic-team/ionic/commit/d4d569ac09ab25ab5a490825cf1fc655fe97bb87)), closes [#26109](https://github.com/ionic-team/ionic/issues/26109)





## [6.3.2](https://github.com/ionic-team/ionic/compare/v6.3.1...v6.3.2) (2022-10-17)


### Bug Fixes

* **datetime:** header renders correct date ([#26120](https://github.com/ionic-team/ionic/issues/26120)) ([04df45a](https://github.com/ionic-team/ionic/commit/04df45a443e4faeea644daa76dc509fea0d24ca2)), closes [#26116](https://github.com/ionic-team/ionic/issues/26116)
* **datetime:** selecting days updates value ([#26121](https://github.com/ionic-team/ionic/issues/26121)) ([d76a24d](https://github.com/ionic-team/ionic/commit/d76a24dd9e485a2f3cc517231bbb1dab51fa1fd3))
* **modal:** sheet modal dismisses correctly ([#26110](https://github.com/ionic-team/ionic/issues/26110)) ([256b03f](https://github.com/ionic-team/ionic/commit/256b03f12a57c2b5904d9017e4fa93b11eea8fc7)), closes [#26108](https://github.com/ionic-team/ionic/issues/26108)





## [6.3.1](https://github.com/ionic-team/ionic/compare/v6.3.0...v6.3.1) (2022-10-12)


### Bug Fixes

* **datetime:** setting date async updates calendar grid ([#26070](https://github.com/ionic-team/ionic/issues/26070)) ([0aee328](https://github.com/ionic-team/ionic/commit/0aee328b4b84d5668752e5ae0792334d0173c2bb)), closes [#25776](https://github.com/ionic-team/ionic/issues/25776)
* **datetime:** setting max/min does not increase number of nodes rendered ([#26065](https://github.com/ionic-team/ionic/issues/26065)) ([a5d178f](https://github.com/ionic-team/ionic/commit/a5d178f4c03a0ad2501095afe1f75914b0462ae1)), closes [#26059](https://github.com/ionic-team/ionic/issues/26059)
* **item, card:** aria-label is reflected to the inner button ([#26028](https://github.com/ionic-team/ionic/issues/26028)) ([3c89ebe](https://github.com/ionic-team/ionic/commit/3c89ebe7216b2a19580a4f1ed23d5d1d4c37919d)), closes [#25885](https://github.com/ionic-team/ionic/issues/25885)
* **toolbar:** MD height only applies to MD segment ([#26042](https://github.com/ionic-team/ionic/issues/26042)) ([ab89679](https://github.com/ionic-team/ionic/commit/ab8967936c6bef5fc0a884cb8bf8f2deb7784c13)), closes [#18617](https://github.com/ionic-team/ionic/issues/18617)





# [6.3.0](https://github.com/ionic-team/ionic/compare/v6.2.9...v6.3.0) (2022-10-05)


### Bug Fixes

* **list:** remove extra border in md inset list items ([#25972](https://github.com/ionic-team/ionic/issues/25972)) ([3eb3dd5](https://github.com/ionic-team/ionic/commit/3eb3dd5afa02f7257e2594f56efe570be83719b6)), closes [#25278](https://github.com/ionic-team/ionic/issues/25278)
* **range:** indication when range knob is focused ([#25827](https://github.com/ionic-team/ionic/issues/25827)) ([2c815cf](https://github.com/ionic-team/ionic/commit/2c815cff139a0061883d3eef47816aea8801dcf4))


### Features

* **alert:** accept Promise for button handler ([#25702](https://github.com/ionic-team/ionic/issues/25702)) ([8e4783c](https://github.com/ionic-team/ionic/commit/8e4783c17298e8f7654590108430e80f22ed6a7a)), closes [#25700](https://github.com/ionic-team/ionic/issues/25700)
* **button:** submit from outside of form ([#25913](https://github.com/ionic-team/ionic/issues/25913)) ([b139838](https://github.com/ionic-team/ionic/commit/b13983848c9ea7387062953412eaae744c001ec7)), closes [#21194](https://github.com/ionic-team/ionic/issues/21194)
* **datetime-button:** support multiple date selection ([#25971](https://github.com/ionic-team/ionic/issues/25971)) ([a56a4a9](https://github.com/ionic-team/ionic/commit/a56a4a9c0528fe77859963f5b801a3d645be0b23))
* **datetime:** add header text to multiple selection; improve header consistency between modes ([#25817](https://github.com/ionic-team/ionic/issues/25817)) ([8a1b3c5](https://github.com/ionic-team/ionic/commit/8a1b3c5f300a1ec953d406b65601f84fa49aa807))





## [6.2.9](https://github.com/ionic-team/ionic/compare/v6.2.8...v6.2.9) (2022-09-28)


### Bug Fixes

* **animation:** improve compatibility with ssr ([#25992](https://github.com/ionic-team/ionic/issues/25992)) ([02234f6](https://github.com/ionic-team/ionic/commit/02234f69e0333266b4d500f24b3bb002c099bda2)), closes [#25987](https://github.com/ionic-team/ionic/issues/25987)
* **chip:** default color has contrast on dark mode ([#25998](https://github.com/ionic-team/ionic/issues/25998)) ([ef78a12](https://github.com/ionic-team/ionic/commit/ef78a123e553e27d9c41c2735bf44c21cbfa7ade)), closes [#25997](https://github.com/ionic-team/ionic/issues/25997)
* **datetime:** expand/collapse icon is not announced to screen readers ([#26018](https://github.com/ionic-team/ionic/issues/26018)) ([649d3cf](https://github.com/ionic-team/ionic/commit/649d3cf688d44226f63783bf784f747d1a61476c))
* **datetime:** swiping wheel no longer dismisses card modal ([#25981](https://github.com/ionic-team/ionic/issues/25981)) ([7543c84](https://github.com/ionic-team/ionic/commit/7543c84445e6698d29cafe75b423c33115bc534c))
* **datetime:** switching month and year accounts for day ([#25996](https://github.com/ionic-team/ionic/issues/25996)) ([11f44e9](https://github.com/ionic-team/ionic/commit/11f44e94f4abe81892f33a057055e5f9b5092528)), closes [#25585](https://github.com/ionic-team/ionic/issues/25585)
* **datetime:** time button is easier to access with screen readers ([#26019](https://github.com/ionic-team/ionic/issues/26019)) ([5846b41](https://github.com/ionic-team/ionic/commit/5846b418a7e0b2f0bd025c2dac1f248ecb2d17c2))
* **picker-internal:** fonts now render consistently ([#26020](https://github.com/ionic-team/ionic/issues/26020)) ([54f99bd](https://github.com/ionic-team/ionic/commit/54f99bd5b308386d43596677c9e9227dae822541))





## [6.2.8](https://github.com/ionic-team/ionic/compare/v6.2.7...v6.2.8) (2022-09-21)


### Bug Fixes

* **datetime:** account for 12AM with min times and 12 hour format ([#25952](https://github.com/ionic-team/ionic/issues/25952)) ([55ebd6c](https://github.com/ionic-team/ionic/commit/55ebd6cdf39c01b401e876b76e755bfa04db8f65)), closes [#25183](https://github.com/ionic-team/ionic/issues/25183)
* **item:** show the highlight on iOS when --highlight-height is set ([#25905](https://github.com/ionic-team/ionic/issues/25905)) ([d7db133](https://github.com/ionic-team/ionic/commit/d7db1333f13834ecb447b4b1da62cfffed9fb333))
* **overlays:** focus trapping no longer includes disabled elements ([#25949](https://github.com/ionic-team/ionic/issues/25949)) ([6cb5827](https://github.com/ionic-team/ionic/commit/6cb5827d069c255ab0a9a8c319aba9994a4c5196))
* **overlays:** focus trapping no longer includes hidden elements ([#25948](https://github.com/ionic-team/ionic/issues/25948)) ([5c10f98](https://github.com/ionic-team/ionic/commit/5c10f98ceb3ae42d3363b38ba786b9122676a59c))


### Performance Improvements

* **card:** avoid force compositing on ios ([#25942](https://github.com/ionic-team/ionic/issues/25942)) ([174c3b3](https://github.com/ionic-team/ionic/commit/174c3b30a0bce7e7ab13e5605348ec107af69dd6))





## [6.2.7](https://github.com/ionic-team/ionic/compare/v6.2.6...v6.2.7) (2022-09-14)


### Bug Fixes

* **datetime:** correct year is set in wheel picker ([#25896](https://github.com/ionic-team/ionic/issues/25896)) ([fb653eb](https://github.com/ionic-team/ionic/commit/fb653ebe67458a088adf0626741d190ceb2880a6)), closes [#25895](https://github.com/ionic-team/ionic/issues/25895)
* **footer:** padding is added correctly with tabs ([#25921](https://github.com/ionic-team/ionic/issues/25921)) ([edbb64c](https://github.com/ionic-team/ionic/commit/edbb64c4b6de7ace7043675a85fd503da18304d7)), closes [#25918](https://github.com/ionic-team/ionic/issues/25918)
* **input,textarea:** data-form-type attribute is assigned to inner input ([#25927](https://github.com/ionic-team/ionic/issues/25927)) ([9451b28](https://github.com/ionic-team/ionic/commit/9451b283e2cb30ac9087574461f6b9f4b6cc3e0f)), closes [#25908](https://github.com/ionic-team/ionic/issues/25908)
* **modal:** sheet is easier to dismiss with swipe ([#25883](https://github.com/ionic-team/ionic/issues/25883)) ([fa169d2](https://github.com/ionic-team/ionic/commit/fa169d2dca649107342fe365ef6c7da892ebb8fd)), closes [#24296](https://github.com/ionic-team/ionic/issues/24296)
* **tab-bar:** use correct import path ([#25898](https://github.com/ionic-team/ionic/issues/25898)) ([ad46045](https://github.com/ionic-team/ionic/commit/ad46045bcc251c9719ecf6621792f1a5b3c6afce)), closes [#25897](https://github.com/ionic-team/ionic/issues/25897)
* **textarea:** auto grow textarea line wraps long contents ([#25928](https://github.com/ionic-team/ionic/issues/25928)) ([777109a](https://github.com/ionic-team/ionic/commit/777109a7e8625ed61a8cc09e52fc06e104b124ea)), closes [#25893](https://github.com/ionic-team/ionic/issues/25893)





## [6.2.6](https://github.com/ionic-team/ionic/compare/v6.2.5...v6.2.6) (2022-09-07)


### Bug Fixes

* **datetime:** calendar day and years are now localized ([#25847](https://github.com/ionic-team/ionic/issues/25847)) ([cbd1268](https://github.com/ionic-team/ionic/commit/cbd1268a03204f05314f2ba284ad433457a9cf33)), closes [#25843](https://github.com/ionic-team/ionic/issues/25843)
* **datetime:** hourCycle formats hour correctly ([#25869](https://github.com/ionic-team/ionic/issues/25869)) ([1a1491d](https://github.com/ionic-team/ionic/commit/1a1491df0242da1cb3c9a7f128bbd4d5ce4dbf3e)), closes [#25862](https://github.com/ionic-team/ionic/issues/25862)
* **datetime:** month grid no longer loops on ios ([#25857](https://github.com/ionic-team/ionic/issues/25857)) ([c938054](https://github.com/ionic-team/ionic/commit/c938054605dffb6c3002a64a3d8aaf36892c7a93)), closes [#25752](https://github.com/ionic-team/ionic/issues/25752)





## [6.2.5](https://github.com/ionic-team/ionic/compare/v6.2.4...v6.2.5) (2022-08-31)


### Bug Fixes

* **action-sheet:** add aria-labelledby ([#25837](https://github.com/ionic-team/ionic/issues/25837)) ([5270151](https://github.com/ionic-team/ionic/commit/527015184e9413c1037277d3197bcaa33044c38c))
* **datetime:** next and previous buttons have correct labels ([#25845](https://github.com/ionic-team/ionic/issues/25845)) ([41e3387](https://github.com/ionic-team/ionic/commit/41e338730d32837fc9dd8a15477e37dea4cc76c9)), closes [#25844](https://github.com/ionic-team/ionic/issues/25844)
* **datetime:** only log out of bounds warning if value set ([#25835](https://github.com/ionic-team/ionic/issues/25835)) ([85af6ce](https://github.com/ionic-team/ionic/commit/85af6ce436890eb922d2ba32053fb8b8bc7fd4ff)), closes [#25833](https://github.com/ionic-team/ionic/issues/25833)
* **input:** clear button is not activated on swipe ([#25825](https://github.com/ionic-team/ionic/issues/25825)) ([ff71ad4](https://github.com/ionic-team/ionic/commit/ff71ad492d7671f8e550da7e08dbde30cb05ebf7)), closes [#24857](https://github.com/ionic-team/ionic/issues/24857)
* **modal:** handleBehavior can be used with controller ([#25821](https://github.com/ionic-team/ionic/issues/25821)) ([79ef1b5](https://github.com/ionic-team/ionic/commit/79ef1b57dc74fd856ed7c2904d7400d283cc081e)), closes [#25820](https://github.com/ionic-team/ionic/issues/25820)
* **searchbar:** clear button has focus indicator ([#25828](https://github.com/ionic-team/ionic/issues/25828)) ([373b4ff](https://github.com/ionic-team/ionic/commit/373b4ffe216ba584b92014cef501f64668e1f177))
* **searchbar:** keypress can activate clear button ([#25824](https://github.com/ionic-team/ionic/issues/25824)) ([c270756](https://github.com/ionic-team/ionic/commit/c270756356c7b23a1959ac5f4b8206a5cd1825c2))





## [6.2.4](https://github.com/ionic-team/ionic/compare/v6.2.3...v6.2.4) (2022-08-24)


### Bug Fixes

* **alert:** add default aria-label ([#25800](https://github.com/ionic-team/ionic/issues/25800)) ([d395a73](https://github.com/ionic-team/ionic/commit/d395a73cb6c419e6c0072746b8e4768cd5f78ef3))
* **alert:** use aria-labelledby and aria-describedby instead of aria-label ([#25805](https://github.com/ionic-team/ionic/issues/25805)) ([27318d7](https://github.com/ionic-team/ionic/commit/27318d75df60dfce1a90f23ba31ea2b6636ba42f))
* **breadcrumb:** separator is not announced by narrators ([#25796](https://github.com/ionic-team/ionic/issues/25796)) ([71fad38](https://github.com/ionic-team/ionic/commit/71fad3884bc55b266067efb346500c848b856946))
* **datetime:** close month/year picker when hidden ([#25789](https://github.com/ionic-team/ionic/issues/25789)) ([3b211b6](https://github.com/ionic-team/ionic/commit/3b211b60fd9a88be6e232f839ecc4be090181530)), closes [#25787](https://github.com/ionic-team/ionic/issues/25787)
* **modal:** role attribute can be customized ([#25804](https://github.com/ionic-team/ionic/issues/25804)) ([037d579](https://github.com/ionic-team/ionic/commit/037d579b2a3a660358f1e9c9b020c9510bb9c6b0))
* **refresher:** use componentOnReady utility for CE build ([#25783](https://github.com/ionic-team/ionic/issues/25783)) ([bd715a5](https://github.com/ionic-team/ionic/commit/bd715a52562f1f175d4bb6ea2dbfdd67a3e91db1)), closes [#25782](https://github.com/ionic-team/ionic/issues/25782)
* **select:** compareWith passes params in correct order ([#25764](https://github.com/ionic-team/ionic/issues/25764)) ([d631195](https://github.com/ionic-team/ionic/commit/d6311951243fd9b867ae5d4a7a08c8d341f8eb7a)), closes [#25759](https://github.com/ionic-team/ionic/issues/25759)





## [6.2.3](https://github.com/ionic-team/ionic/compare/v6.2.2...v6.2.3) (2022-08-17)


### Bug Fixes

* **css:** preserve whitespace in selectors when minifying css ([#25767](https://github.com/ionic-team/ionic/issues/25767)) ([bafa759](https://github.com/ionic-team/ionic/commit/bafa759655a0f3ca206255ba429f21d319c37aed)), closes [#25766](https://github.com/ionic-team/ionic/issues/25766)
* **datetime:** highlights now show above content in modal ([#25756](https://github.com/ionic-team/ionic/issues/25756)) ([d711658](https://github.com/ionic-team/ionic/commit/d7116581c8e92716f49877abc78d93dc39c34e1d)), closes [#25755](https://github.com/ionic-team/ionic/issues/25755)
* **footer:** remove toolbar bottom padding if near bottom slot tabs or keyboard is open ([#25746](https://github.com/ionic-team/ionic/issues/25746)) ([bb37446](https://github.com/ionic-team/ionic/commit/bb374460320b0ba2ee03a5a0ecebb3e7a9f0728e))
* **header:** hide from screen readers when collapsed ([#25744](https://github.com/ionic-team/ionic/issues/25744)) ([d0ba963](https://github.com/ionic-team/ionic/commit/d0ba9635998f2157970156438c1bb74d6b9682f2))
* **input:** exclude date inputs from scroll assist ([#25749](https://github.com/ionic-team/ionic/issues/25749)) ([abb56d2](https://github.com/ionic-team/ionic/commit/abb56d22b4a81d1bc34c689de4ef7218e7503b20)), closes [#25745](https://github.com/ionic-team/ionic/issues/25745)
* **item:** form validation caret color renders correctly ([#25725](https://github.com/ionic-team/ionic/issues/25725)) ([de20541](https://github.com/ionic-team/ionic/commit/de20541486bcf6e1d15f0ae5b0c5f177cce5eb38)), closes [#25719](https://github.com/ionic-team/ionic/issues/25719)
* **refresher:** refresher is visible with multiple custom scroll targets ([#25750](https://github.com/ionic-team/ionic/issues/25750)) ([e750e33](https://github.com/ionic-team/ionic/commit/e750e336167397ed996d9833763286f4881e79b5)), closes [#25495](https://github.com/ionic-team/ionic/issues/25495)





## [6.2.2](https://github.com/ionic-team/ionic/compare/v6.2.1...v6.2.2) (2022-08-10)


### Bug Fixes

* **datetime:** add correct null check when value changes ([#25716](https://github.com/ionic-team/ionic/issues/25716)) ([36bea1c](https://github.com/ionic-team/ionic/commit/36bea1ca2520c9eb9ee7705abb046607a52d198d)), closes [#25714](https://github.com/ionic-team/ionic/issues/25714)
* **datetime:** preferWheel respects column ordering by locale ([#25726](https://github.com/ionic-team/ionic/issues/25726)) ([dee0f51](https://github.com/ionic-team/ionic/commit/dee0f513ee443c0c69ea8e38a292c900e9c70221)), closes [#25722](https://github.com/ionic-team/ionic/issues/25722)





## [6.2.1](https://github.com/ionic-team/ionic/compare/v6.2.0...v6.2.1) (2022-08-03)


### Bug Fixes

* **datetime:** display time in user's timezone after selection ([#25694](https://github.com/ionic-team/ionic/issues/25694)) ([11c69c8](https://github.com/ionic-team/ionic/commit/11c69c8df50b75440c9e876b4d99d469d16e144f)), closes [#25693](https://github.com/ionic-team/ionic/issues/25693)
* **datetime:** selecting today with multiple date select now works ([#25699](https://github.com/ionic-team/ionic/issues/25699)) ([86b7000](https://github.com/ionic-team/ionic/commit/86b7000bcd1b4519e8c20907050e15ba7c99bab0))
* **nav:** exclude nav from custom dialog ([#25689](https://github.com/ionic-team/ionic/issues/25689)) ([d1e517b](https://github.com/ionic-team/ionic/commit/d1e517bfef03b822dfa7651681013277762eda08)), closes [#25677](https://github.com/ionic-team/ionic/issues/25677) [#25688](https://github.com/ionic-team/ionic/issues/25688)





# [6.2.0 Chromium](https://github.com/ionic-team/ionic-framework/compare/v6.1.15...v6.2.0) (2022-07-27)


### Bug Fixes

* **datetime:** account for previous years with preferWheel ([#25656](https://github.com/ionic-team/ionic-framework/issues/25656)) ([3a7f5f1](https://github.com/ionic-team/ionic-framework/commit/3a7f5f166ee8d8d7e1861313e2bc6f4856e4fbe9))
* **datetime:** switching months in wheel picker now selected nearest neighbor ([#25559](https://github.com/ionic-team/ionic-framework/issues/25559)) ([dd256e1](https://github.com/ionic-team/ionic-framework/commit/dd256e1313fa1c307f30b0dbb7fd0d1da8c555f7))
* **datetime:** switching presentation closes month/year picker ([#25667](https://github.com/ionic-team/ionic-framework/issues/25667)) ([57a21ad](https://github.com/ionic-team/ionic-framework/commit/57a21adb38331ee5d74dacd1b0a2568f41a2d21e))
* **nav:** pop() will unmount views within a modal ([#25638](https://github.com/ionic-team/ionic-framework/issues/25638)) ([db28794](https://github.com/ionic-team/ionic-framework/commit/db28794f0b75f2824ae26c101a8c52af70f43ffd)), closes [#25637](https://github.com/ionic-team/ionic-framework/issues/25637) [#21831](https://github.com/ionic-team/ionic-framework/issues/21831)
* **textarea:** textarea with autogrow will size to its contents ([#24205](https://github.com/ionic-team/ionic-framework/issues/24205)) ([a9cf2ab](https://github.com/ionic-team/ionic-framework/commit/a9cf2ab87012cdb6360d10536a29213adda3f585)), closes [#24793](https://github.com/ionic-team/ionic-framework/issues/24793) [#21242](https://github.com/ionic-team/ionic-framework/issues/21242)
* **vue:** input v-model accepts numbers ([#25666](https://github.com/ionic-team/ionic-framework/issues/25666)) ([ab65e9a](https://github.com/ionic-team/ionic-framework/commit/ab65e9a7b51c3a3f8c59962d3e1faff1564ab801)), closes [#25575](https://github.com/ionic-team/ionic-framework/issues/25575)


### Features

* **angular, react, vue:** add support for autoMountComponent ([#25552](https://github.com/ionic-team/ionic-framework/issues/25552)) ([805dfa0](https://github.com/ionic-team/ionic-framework/commit/805dfa05663098ef9c02b0745a383b5e7555908b))
* **datetime-button:** add button for displaying datetime in overlays ([#25655](https://github.com/ionic-team/ionic-framework/issues/25655)) ([4997331](https://github.com/ionic-team/ionic-framework/commit/499733105e4be23405e8afeeb26fee5cd2afc25b)), closes [#24316](https://github.com/ionic-team/ionic-framework/issues/24316)
* **datetime:** add multiple date selection ([#25514](https://github.com/ionic-team/ionic-framework/issues/25514)) ([9d31608](https://github.com/ionic-team/ionic-framework/commit/9d31608f2d471f531eb253832c8558d1effaf68a)), closes [#24674](https://github.com/ionic-team/ionic-framework/issues/24674)
* **datetime:** add wheel style picker for dates and times ([#25468](https://github.com/ionic-team/ionic-framework/issues/25468)) ([3d19771](https://github.com/ionic-team/ionic-framework/commit/3d19771185301870a2eb60f1ef4afd6f1c182494)), closes [#23981](https://github.com/ionic-team/ionic-framework/issues/23981)
* **datetime:** localize am/pm labels in time picker ([#25389](https://github.com/ionic-team/ionic-framework/issues/25389)) ([6bc0acc](https://github.com/ionic-team/ionic-framework/commit/6bc0acc4279a18c3309b11eeec76676c5015419a)), closes [#16279](https://github.com/ionic-team/ionic-framework/issues/16279)
* **modal:** clicking handle advances to the next breakpoint ([#25540](https://github.com/ionic-team/ionic-framework/issues/25540)) ([7cdc388](https://github.com/ionic-team/ionic-framework/commit/7cdc388b7805cbf23c9e1e928aa977cd77ebc8c4)), closes [#24069](https://github.com/ionic-team/ionic-framework/issues/24069)
* **range:** add reference point for start position of range slider ([#25598](https://github.com/ionic-team/ionic-framework/issues/25598)) ([c2781cc](https://github.com/ionic-team/ionic-framework/commit/c2781cc1c3b7e56a0e6f6c03cfa04fc2c82d6e8a)), closes [#24348](https://github.com/ionic-team/ionic-framework/issues/24348)
* **toggle:** on/off icons for toggle ([#25459](https://github.com/ionic-team/ionic-framework/issues/25459)) ([bc0bdc4](https://github.com/ionic-team/ionic-framework/commit/bc0bdc438ba72c695f9d961ddf837ec45e7816dd)), closes [#20524](https://github.com/ionic-team/ionic-framework/issues/20524)




## [6.1.15](https://github.com/ionic-team/ionic/compare/v6.1.14...v6.1.15) (2022-07-20)


### Bug Fixes

* **datetime:** use scroll listener to detect month changes ([#25586](https://github.com/ionic-team/ionic/issues/25586)) ([b7afcb0](https://github.com/ionic-team/ionic/commit/b7afcb0f0c36d84f3b4d65844df28e6293bc1ea5)), closes [#25257](https://github.com/ionic-team/ionic/issues/25257) [#25608](https://github.com/ionic-team/ionic/issues/25608) [#24980](https://github.com/ionic-team/ionic/issues/24980)
* **fab-button:** aria attributes are inherited ([#25635](https://github.com/ionic-team/ionic/issues/25635)) ([64ae3d2](https://github.com/ionic-team/ionic/commit/64ae3d2b9729c5c6be8644b1df6c8b3d40584d3b)), closes [#25633](https://github.com/ionic-team/ionic/issues/25633)
* **modal:** allow for custom dialog implementations ([#25630](https://github.com/ionic-team/ionic/issues/25630)) ([a6f3ae6](https://github.com/ionic-team/ionic/commit/a6f3ae67ab91ab95408ad425156167edc3570978)), closes [#24080](https://github.com/ionic-team/ionic/issues/24080)


### Performance Improvements

* **input:** passive event listener for touch start events ([#25610](https://github.com/ionic-team/ionic/issues/25610)) ([2d1efdb](https://github.com/ionic-team/ionic/commit/2d1efdbe6dd9436badab4684f2a484476489c166)), closes [#25599](https://github.com/ionic-team/ionic/issues/25599)





## [6.1.14](https://github.com/ionic-team/ionic/compare/v6.1.13...v6.1.14) (2022-07-13)


### Bug Fixes

* **datetime:** datetime works within stencil apps ([#25592](https://github.com/ionic-team/ionic/issues/25592)) ([7b10fa6](https://github.com/ionic-team/ionic/commit/7b10fa6476c2c2896c6810c57b3160f8c8896faa)), closes [#25591](https://github.com/ionic-team/ionic/issues/25591)





## [6.1.13](https://github.com/ionic-team/ionic/compare/v6.1.12...v6.1.13) (2022-07-06)


### Bug Fixes

* **all:** long press now preserves activated state ([#25551](https://github.com/ionic-team/ionic/issues/25551)) ([a8286f6](https://github.com/ionic-team/ionic/commit/a8286f6e42f734a027416ac6cd659e3dce4edccb)), closes [#25544](https://github.com/ionic-team/ionic/issues/25544)
* **datetime:** typing in time now updates value ([#25561](https://github.com/ionic-team/ionic/issues/25561)) ([1b1b1a3](https://github.com/ionic-team/ionic/commit/1b1b1a3800c4d044b4a3e7418f534e9271770ec6)), closes [#25560](https://github.com/ionic-team/ionic/issues/25560)





## [6.1.12](https://github.com/ionic-team/ionic/compare/v6.1.11...v6.1.12) (2022-06-29)


### Bug Fixes

* **datetime:** add dev warnings when setting out of bounds value ([#25513](https://github.com/ionic-team/ionic/issues/25513)) ([5dfaf63](https://github.com/ionic-team/ionic/commit/5dfaf63c6582811b61339a6fa50cf551cd8724d0))





## [6.1.11](https://github.com/ionic-team/ionic/compare/v6.1.10...v6.1.11) (2022-06-22)


### Bug Fixes

* **datetime:** closing time picker no longer changes month ([#25478](https://github.com/ionic-team/ionic/issues/25478)) ([f9ab9b5](https://github.com/ionic-team/ionic/commit/f9ab9b54ddb5a3004673e4aaa9cb62fd8e97ba07)), closes [#25438](https://github.com/ionic-team/ionic/issues/25438)
* **item:** multiple input appearance when using datetime ([#25484](https://github.com/ionic-team/ionic/issues/25484)) ([3089f38](https://github.com/ionic-team/ionic/commit/3089f38f4d335c44e9913e874813dd4205c2b160)), closes [#25479](https://github.com/ionic-team/ionic/issues/25479)
* **item:** multiple input appearance when using datetime ([#25498](https://github.com/ionic-team/ionic/issues/25498)) ([1a8d23d](https://github.com/ionic-team/ionic/commit/1a8d23da8125d54c3119eacb51206f7541c9f410)), closes [#25484](https://github.com/ionic-team/ionic/issues/25484) [#25483](https://github.com/ionic-team/ionic/issues/25483)
* **overlays:** focus is not moved if active element is in overlay ([#25481](https://github.com/ionic-team/ionic/issues/25481)) ([dcc2da2](https://github.com/ionic-team/ionic/commit/dcc2da2800e69d938b4a62db436d9f07d9663dce)), closes [#24127](https://github.com/ionic-team/ionic/issues/24127) [#24820](https://github.com/ionic-team/ionic/issues/24820)
* **refresher:** quickly swiping down no longer causes duplicate refresh ([#25476](https://github.com/ionic-team/ionic/issues/25476)) ([3abfa78](https://github.com/ionic-team/ionic/commit/3abfa780ccb32484b4d9f1b509e7ab910dfb901a)), closes [#25418](https://github.com/ionic-team/ionic/issues/25418)
* **vue:** components have correct type definitions ([#25499](https://github.com/ionic-team/ionic/issues/25499)) ([b1821e9](https://github.com/ionic-team/ionic/commit/b1821e9d0a55f20f74696f119de724ab70647977)), closes [#25485](https://github.com/ionic-team/ionic/issues/25485)





## [6.1.10](https://github.com/ionic-team/ionic/compare/v6.1.9...v6.1.10) (2022-06-15)


### Bug Fixes

* **fab-button:** improve ripple effect behavior on click ([#25413](https://github.com/ionic-team/ionic/issues/25413)) ([efdaf90](https://github.com/ionic-team/ionic/commit/efdaf90c5a767211e0034bab7cce5bd463ff5aa0)), closes [#21772](https://github.com/ionic-team/ionic/issues/21772)
* **modal:** backdrop animation when backdropBreakpoint is 1 ([#25430](https://github.com/ionic-team/ionic/issues/25430)) ([c10df52](https://github.com/ionic-team/ionic/commit/c10df52f39c527dd7e03176c56a2e6cb0ebe455f)), closes [#25402](https://github.com/ionic-team/ionic/issues/25402)
* **modal:** status bar color now correct with sheet modal ([#25424](https://github.com/ionic-team/ionic/issues/25424)) ([377c4f5](https://github.com/ionic-team/ionic/commit/377c4f597b972818d90132017d50c33074ddadab)), closes [#20501](https://github.com/ionic-team/ionic/issues/20501)
* **picker-column-internal:** switching off an input mode column preserves scroll ([#25467](https://github.com/ionic-team/ionic/issues/25467)) ([989429d](https://github.com/ionic-team/ionic/commit/989429d65cf57ef8fb69854639f8eac1a12369bc))
* **popover:** ensure popover does not go offscreen when adjusting top position ([#25350](https://github.com/ionic-team/ionic/issues/25350)) ([6926538](https://github.com/ionic-team/ionic/commit/692653842b43b5e36c51163f8261fde3b5bea40d)), closes [#25349](https://github.com/ionic-team/ionic/issues/25349)





## [6.1.9](https://github.com/ionic-team/ionic/compare/v6.1.8...v6.1.9) (2022-06-08)


### Bug Fixes

* **all:** ripple effect is no longer added when scrolling ([#25352](https://github.com/ionic-team/ionic/issues/25352)) ([0b275af](https://github.com/ionic-team/ionic/commit/0b275af5ac06f470b4d908b889f513956bf5d868)), closes [#22030](https://github.com/ionic-team/ionic/issues/22030)
* **datetime:** emit ionChange for non-calendar picker presentation ([#25380](https://github.com/ionic-team/ionic/issues/25380)) ([4e6a60b](https://github.com/ionic-team/ionic/commit/4e6a60b6a42287e5091728aecb61f6097e131b83)), closes [#25375](https://github.com/ionic-team/ionic/issues/25375)
* **datetime:** ensure that default month shown is always in bounds ([#25351](https://github.com/ionic-team/ionic/issues/25351)) ([866d452](https://github.com/ionic-team/ionic/commit/866d4528ad1b8ffa65258595d553ea934daa4add)), closes [#25320](https://github.com/ionic-team/ionic/issues/25320)
* **label:** text contents will repaint on change ([#25395](https://github.com/ionic-team/ionic/issues/25395)) ([52ec741](https://github.com/ionic-team/ionic/commit/52ec74193b4e2478cb84a6dfea261cb2113dcbff))





## [6.1.8](https://github.com/ionic-team/ionic/compare/v6.1.7...v6.1.8) (2022-06-01)


### Bug Fixes

* **all:** improve compatibility with vite ([#25381](https://github.com/ionic-team/ionic/issues/25381)) ([d83bcd2](https://github.com/ionic-team/ionic/commit/d83bcd2b7f9937550008f995ff91517777584373)), closes [#23823](https://github.com/ionic-team/ionic/issues/23823)
* **item-sliding:** swiping inside of virtual scroller now prevents scrolling ([#25345](https://github.com/ionic-team/ionic/issues/25345)) ([5a1a5f6](https://github.com/ionic-team/ionic/commit/5a1a5f6b4c2ab4059158986e907fff45d03be753))
* **range:** dragging knob no longer scrolls page ([#25343](https://github.com/ionic-team/ionic/issues/25343)) ([0b92dff](https://github.com/ionic-team/ionic/commit/0b92dffa92c05705ff83518c10608e3dc3651d51)), closes [#19004](https://github.com/ionic-team/ionic/issues/19004)





## [6.1.7](https://github.com/ionic-team/ionic/compare/v6.1.6...v6.1.7) (2022-05-26)


### Bug Fixes

* **accordion:** accordions expand when using binding ([#25322](https://github.com/ionic-team/ionic/issues/25322)) ([61e571e](https://github.com/ionic-team/ionic/commit/61e571e585ed8ad9b0ca2f98f57bb16616413ba6)), closes [#25307](https://github.com/ionic-team/ionic/issues/25307)
* **datetime:** don't update value on confirm call if no date was selected ([#25338](https://github.com/ionic-team/ionic/issues/25338)) ([9e5b10a](https://github.com/ionic-team/ionic/commit/9e5b10a2155c6b9de565931da384e0e49aeca7b7))
* **item, list:** list aria roles are added ([#25336](https://github.com/ionic-team/ionic/issues/25336)) ([311c634](https://github.com/ionic-team/ionic/commit/311c634d20e9e597db676d6f54e4b79cfe742a61)), closes [#19939](https://github.com/ionic-team/ionic/issues/19939)
* **menu:** rtl menu no longer disappears on ios 15 ([#25309](https://github.com/ionic-team/ionic/issues/25309)) ([6005431](https://github.com/ionic-team/ionic/commit/60054310afbab6151f6c29ff6e74666acd181a41)), closes [#25192](https://github.com/ionic-team/ionic/issues/25192)
* **modal:** swipe to close on content blocks scroll in ion-nav ([#25300](https://github.com/ionic-team/ionic/issues/25300)) ([fdc55c0](https://github.com/ionic-team/ionic/commit/fdc55c072765c87ad7c783e6d8a238b007f5f3ff)), closes [#25298](https://github.com/ionic-team/ionic/issues/25298)
* **nav:** swipe to go back works inside card modal ([#25333](https://github.com/ionic-team/ionic/issues/25333)) ([0156be6](https://github.com/ionic-team/ionic/commit/0156be61cbf73b25cb3c2cba1bd20adebbb3db4f)), closes [#25327](https://github.com/ionic-team/ionic/issues/25327)
* **refresher:** attach scroll listener to custom scroll target ([#25335](https://github.com/ionic-team/ionic/issues/25335)) ([8f5e4cd](https://github.com/ionic-team/ionic/commit/8f5e4cd9350b10a98afb7c98353c6719eee918bb)), closes [#25318](https://github.com/ionic-team/ionic/issues/25318)
* **types:** improve intellisense with colors ([#25347](https://github.com/ionic-team/ionic/issues/25347)) ([97cfbbb](https://github.com/ionic-team/ionic/commit/97cfbbb65d3e63c32d720e01c7368c68616bb531))





## [6.1.6](https://github.com/ionic-team/ionic/compare/v6.1.5...v6.1.6) (2022-05-18)


### Bug Fixes

* **loading:** spinner now respects —spinner-color ([#25261](https://github.com/ionic-team/ionic/issues/25261)) ([65f4c74](https://github.com/ionic-team/ionic/commit/65f4c742e7a5e5756f6f72dd853e38e885f90385)), closes [#25180](https://github.com/ionic-team/ionic/issues/25180)
* **modal:** reset breakpoint to initial breakpoint on present ([#25246](https://github.com/ionic-team/ionic/issues/25246)) ([2557bf3](https://github.com/ionic-team/ionic/commit/2557bf3c3eed9e33e89e07a8d73489da8d81bee3)), closes [#25245](https://github.com/ionic-team/ionic/issues/25245)
* **scroll-assist:** touch end events continue to bubble on inputs ([#25282](https://github.com/ionic-team/ionic/issues/25282)) ([780f16d](https://github.com/ionic-team/ionic/commit/780f16d9e04ee5aaaf91bb7c6ef15c72cc8aeb45)), closes [#25229](https://github.com/ionic-team/ionic/issues/25229)





## [6.1.5](https://github.com/ionic-team/ionic/compare/v6.1.4...v6.1.5) (2022-05-11)


### Bug Fixes

* **core:** @axe-core/playwright should be a devDependency ([#25244](https://github.com/ionic-team/ionic/issues/25244)) ([617ec48](https://github.com/ionic-team/ionic/commit/617ec48265157d1502c443395472c21ebdb2989e)), closes [#25242](https://github.com/ionic-team/ionic/issues/25242)
* **item:** counter has appropriate contrast ([#25266](https://github.com/ionic-team/ionic/issues/25266)) ([750be33](https://github.com/ionic-team/ionic/commit/750be33772e9ba71a3cda35709d17b7912aa68e2)), closes [#25262](https://github.com/ionic-team/ionic/issues/25262)
* **spinner:** alignment is now correct in rtl ([#25260](https://github.com/ionic-team/ionic/issues/25260)) ([e3c996d](https://github.com/ionic-team/ionic/commit/e3c996dea878a8dd276a0ca99f59b330125f9b75))





## [6.1.4](https://github.com/ionic-team/ionic/compare/v6.1.3...v6.1.4) (2022-05-04)


### Bug Fixes

* **datetime:** arrow navigation respects min/max values ([#25182](https://github.com/ionic-team/ionic/issues/25182)) ([6946e09](https://github.com/ionic-team/ionic/commit/6946e09815da605e37ff8e4d613a14288ea35fb0)), closes [#25073](https://github.com/ionic-team/ionic/issues/25073)
* **datetime:** hide footer when month-year picker is open ([#25205](https://github.com/ionic-team/ionic/issues/25205)) ([aa5e1b9](https://github.com/ionic-team/ionic/commit/aa5e1b962150b9ed9629812ec566873784526c83))
* **modal:** card modal can now be swiped to close on the content ([#25185](https://github.com/ionic-team/ionic/issues/25185)) ([7633ddb](https://github.com/ionic-team/ionic/commit/7633ddbc845745dfe36b5c8025c54c22c083c2f4)), closes [#22046](https://github.com/ionic-team/ionic/issues/22046)
* **modal:** card modal no longer dismisses from content with refresher ([#25227](https://github.com/ionic-team/ionic/issues/25227)) ([c4f811f](https://github.com/ionic-team/ionic/commit/c4f811f1dde0dcbcdaebaa3a4f5ef87e192b5cc5))





## [6.1.3](https://github.com/ionic-team/ionic/compare/v6.1.2...v6.1.3) (2022-04-27)


### Bug Fixes

* **core:** inherit aria attributes on host elements ([#25156](https://github.com/ionic-team/ionic/issues/25156)) ([611832b](https://github.com/ionic-team/ionic/commit/611832b0d51da295c1bf2897972c4e8baf6e23a3)), closes [#20127](https://github.com/ionic-team/ionic/issues/20127)
* **datetime:** if no default value, don't highlight active day until one is selected ([#25151](https://github.com/ionic-team/ionic/issues/25151)) ([9896939](https://github.com/ionic-team/ionic/commit/98969395abd400cc44d2d3825581a63eb64a56e0))
* **picker-column-internal:** center active item when rapidly opened ([#25155](https://github.com/ionic-team/ionic/issues/25155)) ([8e17fa9](https://github.com/ionic-team/ionic/commit/8e17fa9d5f9b00139693e34bc93b1f9c718ea3cf)), closes [#25154](https://github.com/ionic-team/ionic/issues/25154)
* **select:** avoid duplicate dialogs and backdrops when clicking ([#25175](https://github.com/ionic-team/ionic/issues/25175)) ([70d2784](https://github.com/ionic-team/ionic/commit/70d278414eb5124d17c5ffaba5231c6bfd285656)), closes [#25126](https://github.com/ionic-team/ionic/issues/25126)





## [6.1.2](https://github.com/ionic-team/ionic/compare/v6.1.1...v6.1.2) (2022-04-20)


### Bug Fixes

* **datetime:** time picker display matches dynamically set value ([#25010](https://github.com/ionic-team/ionic/issues/25010)) ([11493a0](https://github.com/ionic-team/ionic/commit/11493a086a4e3f2a4e9d3acdf5a9d49e810a5ef0)), closes [#24967](https://github.com/ionic-team/ionic/issues/24967)
* **modal:** add canDismiss option to modal options ([#25144](https://github.com/ionic-team/ionic/issues/25144)) ([2984ddf](https://github.com/ionic-team/ionic/commit/2984ddf111b6acbd9e47ed90830b6522179b6cee)), closes [#25143](https://github.com/ionic-team/ionic/issues/25143)





## [6.1.1](https://github.com/ionic-team/ionic/compare/v6.1.0...v6.1.1) (2022-04-15)


### Bug Fixes

* **all:** import path is now correct when using ionic in a stencil app ([#25123](https://github.com/ionic-team/ionic/issues/25123)) ([1b407ab](https://github.com/ionic-team/ionic/commit/1b407abdf5d8a2a18b6a2b9daca2d58b7b0f782b)), closes [#25122](https://github.com/ionic-team/ionic/issues/25122)
* **datetime:** account for 30 and 45 minute timezones when getting current date ([#25120](https://github.com/ionic-team/ionic/issues/25120)) ([96b2003](https://github.com/ionic-team/ionic/commit/96b2003b2bd5089d1faafe262e96c7445c5c3349)), closes [#25112](https://github.com/ionic-team/ionic/issues/25112)
* **modal, popover:** do not dismiss when ionDismiss is emitted from select ([#25125](https://github.com/ionic-team/ionic/issues/25125)) ([90115db](https://github.com/ionic-team/ionic/commit/90115db98540a5fc67b611ac2742d1221b8e96ff)), closes [#25124](https://github.com/ionic-team/ionic/issues/25124)





# [6.1.0](https://github.com/ionic-team/ionic/compare/v6.0.14...v6.1.0) (2022-04-13)


### Bug Fixes

* **accordion-group:** only allow keyboard interaction if header is focused ([#25091](https://github.com/ionic-team/ionic/issues/25091)) ([e1b555f](https://github.com/ionic-team/ionic/commit/e1b555f286956574876924068304fc44a78c027c))
* **datetime:** resolve warnings when importing into Stencil app ([#25106](https://github.com/ionic-team/ionic/issues/25106)) ([a61c004](https://github.com/ionic-team/ionic/commit/a61c004fb0c10d9fb0eca0987edf798386251ec2))
* **datetime:** warn when parsing an invalid date value ([#25049](https://github.com/ionic-team/ionic/issues/25049)) ([982dc85](https://github.com/ionic-team/ionic/commit/982dc853befe8ccf54163a0b145e563da06f5dc1))
* **menu:** preserve scroll position when focusing on open ([#25044](https://github.com/ionic-team/ionic/issues/25044)) ([da89684](https://github.com/ionic-team/ionic/commit/da896848776105ba1f7035c4412495786199bade))
* **picker-column:** column renders correctly with selected value ([#24988](https://github.com/ionic-team/ionic/issues/24988)) ([8318659](https://github.com/ionic-team/ionic/commit/83186598ed6cf08b0f0421076c4afb3ab53e1e57)), closes [#17664](https://github.com/ionic-team/ionic/issues/17664)
* **popover:** allow arrow on desktop ([#25056](https://github.com/ionic-team/ionic/issues/25056)) ([bcd00c7](https://github.com/ionic-team/ionic/commit/bcd00c7a6ebb6a00193f04458976ff8b86395215))
* **popover:** only focus trap ion-item children ([#24990](https://github.com/ionic-team/ionic/issues/24990)) ([0cd06a6](https://github.com/ionic-team/ionic/commit/0cd06a675474e1893b4c0801fab8ab79813537c8)), closes [#24633](https://github.com/ionic-team/ionic/issues/24633)
* **ripple-effect:** ripple displays on click or touch ([#25102](https://github.com/ionic-team/ionic/issues/25102)) ([2a313e9](https://github.com/ionic-team/ionic/commit/2a313e91179e19660a758470ed2218bbcf03e0bb)), closes [#25094](https://github.com/ionic-team/ionic/issues/25094)


### Features

* **content, reorder-group, header, footer, infinite-scroll, refresher:** add custom scroll target to improve compatibility with virtual scroll ([#24883](https://github.com/ionic-team/ionic/issues/24883)) ([2a438da](https://github.com/ionic-team/ionic/commit/2a438da010ddd4d4211e1879e27d7b28409daaa2)), closes [#23437](https://github.com/ionic-team/ionic/issues/23437)
* **datetime:** isDateEnabled to enable/disable specific days  ([#24898](https://github.com/ionic-team/ionic/issues/24898)) ([e932a04](https://github.com/ionic-team/ionic/commit/e932a042237e6f44bf278bcbd895d8569fc17348)), closes [#24209](https://github.com/ionic-team/ionic/issues/24209)
* **item:** counter formatter to customize counter text display ([#24336](https://github.com/ionic-team/ionic/issues/24336)) ([171020e](https://github.com/ionic-team/ionic/commit/171020e9d200ccfdef0f01c427b295bb50dd1fef)), closes [#24327](https://github.com/ionic-team/ionic/issues/24327)
* **modal:** ability to programmatically set current sheet breakpoint ([#24648](https://github.com/ionic-team/ionic/issues/24648)) ([3145c76](https://github.com/ionic-team/ionic/commit/3145c76934ac711038f9dcba98a385dfbe754953)), closes [#23917](https://github.com/ionic-team/ionic/issues/23917)
* **modal:** add canDismiss property to manage modal dismissing ([#24928](https://github.com/ionic-team/ionic/issues/24928)) ([4b21958](https://github.com/ionic-team/ionic/commit/4b21958ec57019afcde786598880e1f8edada2b1)), closes [#22297](https://github.com/ionic-team/ionic/issues/22297)
* **range:** add knobMoveStart and knobMoveEnd events ([#25011](https://github.com/ionic-team/ionic/issues/25011)) ([f5cb1f8](https://github.com/ionic-team/ionic/commit/f5cb1f8444ba050042e788f9f9ec7b6309bf1b60))
* **select:** add event for when overlay is dismissed ([#24400](https://github.com/ionic-team/ionic/issues/24400)) ([b835b7c](https://github.com/ionic-team/ionic/commit/b835b7c0c7840f41c54f96743cc0a779ff474ab6))





## [6.0.16](https://github.com/ionic-team/ionic/compare/v6.0.15...v6.0.16) (2022-04-08)

**Note:** Version bump only for package @ionic/core





## [6.0.15](https://github.com/ionic-team/ionic/compare/v6.0.14...v6.0.15) (2022-04-06)


### Bug Fixes

* **datetime:** warn when parsing an invalid date value ([#25049](https://github.com/ionic-team/ionic/issues/25049)) ([982dc85](https://github.com/ionic-team/ionic/commit/982dc853befe8ccf54163a0b145e563da06f5dc1))
* **picker-column:** column renders correctly with selected value ([#24988](https://github.com/ionic-team/ionic/issues/24988)) ([8318659](https://github.com/ionic-team/ionic/commit/83186598ed6cf08b0f0421076c4afb3ab53e1e57)), closes [#17664](https://github.com/ionic-team/ionic/issues/17664)
* **popover:** allow arrow on desktop ([#25056](https://github.com/ionic-team/ionic/issues/25056)) ([bcd00c7](https://github.com/ionic-team/ionic/commit/bcd00c7a6ebb6a00193f04458976ff8b86395215))





## [6.0.14](https://github.com/ionic-team/ionic/compare/v6.0.13...v6.0.14) (2022-03-30)

**Note:** Version bump only for package @ionic/core





## [6.0.13](https://github.com/ionic-team/ionic/compare/v6.0.12...v6.0.13) (2022-03-23)


### Bug Fixes

* **datetime:** presentation time emits ionChange once  ([#24968](https://github.com/ionic-team/ionic/issues/24968)) ([2909b08](https://github.com/ionic-team/ionic/commit/2909b080b7020299a4554c1459b4b190ff739085)), closes [#24967](https://github.com/ionic-team/ionic/issues/24967)
* **popover:** dismissing nested popover via backdrop now works ([#24957](https://github.com/ionic-team/ionic/issues/24957)) ([9e84ef7](https://github.com/ionic-team/ionic/commit/9e84ef7f91d76ca5a1ecaffc7592287267d5368b)), closes [#24954](https://github.com/ionic-team/ionic/issues/24954)





## [6.0.12](https://github.com/ionic-team/ionic/compare/v6.0.11...v6.0.12) (2022-03-16)


### Bug Fixes

* **datetime:** reinit behavior on presentation change ([#24828](https://github.com/ionic-team/ionic/issues/24828)) ([d46e1e8](https://github.com/ionic-team/ionic/commit/d46e1e8506ca5095817b421e9edb37d41451e885))
* **toast:** screen readers now announce toasts when presented ([#24937](https://github.com/ionic-team/ionic/issues/24937)) ([8a97f6b](https://github.com/ionic-team/ionic/commit/8a97f6b5c9ca1e77c1790abd1e924955b6b6ea27)), closes [#22333](https://github.com/ionic-team/ionic/issues/22333)





## [6.0.11](https://github.com/ionic-team/ionic/compare/v6.0.10...v6.0.11) (2022-03-09)


### Bug Fixes

* **datetime:** time picker now scrolls to correct value ([#24879](https://github.com/ionic-team/ionic/issues/24879)) ([331ce6d](https://github.com/ionic-team/ionic/commit/331ce6d6769900e2aec9e30d35b52cfd40cbb889)), closes [#24878](https://github.com/ionic-team/ionic/issues/24878)
* **ios:** swipe to go back now works in rtl mode ([#24866](https://github.com/ionic-team/ionic/issues/24866)) ([2ac9105](https://github.com/ionic-team/ionic/commit/2ac9105796a0765fabc48592b5b44ac58c568579)), closes [#19488](https://github.com/ionic-team/ionic/issues/19488)


### Performance Improvements

* improve treeshaking functionality ([#24895](https://github.com/ionic-team/ionic/issues/24895)) ([805907a](https://github.com/ionic-team/ionic/commit/805907af4e78179f1acc9cb02263b1ea10d4e3df)), closes [#24280](https://github.com/ionic-team/ionic/issues/24280)





## [6.0.10](https://github.com/ionic-team/ionic/compare/v6.0.9...v6.0.10) (2022-03-02)


### Bug Fixes

* **datetime:** confirm method now uses selected date ([#24827](https://github.com/ionic-team/ionic/issues/24827)) ([c35b898](https://github.com/ionic-team/ionic/commit/c35b898f1dc0fb706446b6971982df48fd72fe6d)), closes [#24823](https://github.com/ionic-team/ionic/issues/24823)
* **datetime:** persist minutes column on hour change ([#24829](https://github.com/ionic-team/ionic/issues/24829)) ([aacb58a](https://github.com/ionic-team/ionic/commit/aacb58a3224e3cc51c731d0c9aa52f52c9276692)), closes [#24821](https://github.com/ionic-team/ionic/issues/24821)
* **item-sliding:** close() will maintain disabled state ([#24847](https://github.com/ionic-team/ionic/issues/24847)) ([ea4a9bb](https://github.com/ionic-team/ionic/commit/ea4a9bb69465f8e97746b36638f0b3a26e45da18)), closes [#24747](https://github.com/ionic-team/ionic/issues/24747)
* **modal:** re-enable swipe gestures when modal is dismissed ([#24846](https://github.com/ionic-team/ionic/issues/24846)) ([836c01c](https://github.com/ionic-team/ionic/commit/836c01c73e42caab0101ac4988f0a9b27cf96a5b)), closes [#24817](https://github.com/ionic-team/ionic/issues/24817)
* **modal:** sheet modal now allows input focusing when backdrop disabled ([#24840](https://github.com/ionic-team/ionic/issues/24840)) ([e4ec572](https://github.com/ionic-team/ionic/commit/e4ec572043e22bd2626dbcfd204fc22a7335282c)), closes [#24581](https://github.com/ionic-team/ionic/issues/24581)





## [6.0.9](https://github.com/ionic-team/ionic/compare/v6.0.8...v6.0.9) (2022-02-23)


### Bug Fixes

* **datetime:** improve datetime sizing in modals ([#24762](https://github.com/ionic-team/ionic/issues/24762)) ([b0ac7de](https://github.com/ionic-team/ionic/commit/b0ac7de168c353ba4899cb74a2b38e25fd0cc0f1)), closes [#23992](https://github.com/ionic-team/ionic/issues/23992)
* **datetime:** month and year column order is now locale aware ([#24802](https://github.com/ionic-team/ionic/issues/24802)) ([16647b2](https://github.com/ionic-team/ionic/commit/16647b2c7290389755a4093145788f281c84b7e2)), closes [#24548](https://github.com/ionic-team/ionic/issues/24548)
* **datetime:** month picker no longer gives duplicate months on ios 14 and older ([#24792](https://github.com/ionic-team/ionic/issues/24792)) ([b6d7e1c](https://github.com/ionic-team/ionic/commit/b6d7e1c75740a61dcd02c21692e4d4632fb8df5c)), closes [#24663](https://github.com/ionic-team/ionic/issues/24663)
* **img:** draggable attribute is now inherited to inner img element ([#24781](https://github.com/ionic-team/ionic/issues/24781)) ([19ac238](https://github.com/ionic-team/ionic/commit/19ac2389eb0843173f51a12de41ac808cd8f0569)), closes [#21325](https://github.com/ionic-team/ionic/issues/21325)
* **modal:** backdropBreakpoint allows interactivity behind sheet ([#24798](https://github.com/ionic-team/ionic/issues/24798)) ([fca3f56](https://github.com/ionic-team/ionic/commit/fca3f56ca4568e63fd493debda088263caa86c64)), closes [#24797](https://github.com/ionic-team/ionic/issues/24797)
* **popover:** default alignment to 'center' for ios mode ([#24815](https://github.com/ionic-team/ionic/issues/24815)) ([243f673](https://github.com/ionic-team/ionic/commit/243f67362f25699bdb373be6b72cb9c14dc95a32))
* **react, vue:** scroll is no longer interrupted on ios ([#24791](https://github.com/ionic-team/ionic/issues/24791)) ([99c91ef](https://github.com/ionic-team/ionic/commit/99c91eff8764c9a1630adedab6a9765dd9754f7d)), closes [#24435](https://github.com/ionic-team/ionic/issues/24435)
* **select:** interface components now show correctly ([#24810](https://github.com/ionic-team/ionic/issues/24810)) ([2fc2de5](https://github.com/ionic-team/ionic/commit/2fc2de51771f4a5c3f20c6071284096e5bf31ec8)), closes [#24807](https://github.com/ionic-team/ionic/issues/24807)
* **toast:** toast is now correctly excluded from focus trapping ([#24816](https://github.com/ionic-team/ionic/issues/24816)) ([8246112](https://github.com/ionic-team/ionic/commit/8246112ca12f90edb98629ab82e27a792a1fafad)), closes [#24733](https://github.com/ionic-team/ionic/issues/24733)





## [6.0.8](https://github.com/ionic-team/ionic/compare/v6.0.7...v6.0.8) (2022-02-15)


### Bug Fixes

* **back-button, breadcrumb, item:** flip chevron icons on RTL ([#24705](https://github.com/ionic-team/ionic/issues/24705)) ([a093544](https://github.com/ionic-team/ionic/commit/a093544fdfc438ed03024285b2a35c5f645ea011))
* **datetime:** navigate to month within min range ([#24759](https://github.com/ionic-team/ionic/issues/24759)) ([7b3838c](https://github.com/ionic-team/ionic/commit/7b3838cc670de7845bb5937d204e86cdba93b6e6)), closes [#24757](https://github.com/ionic-team/ionic/issues/24757)
* **input:** only set native input value if different ([#24758](https://github.com/ionic-team/ionic/issues/24758)) ([fd031aa](https://github.com/ionic-team/ionic/commit/fd031aa1c3f05b7bfa3e0a0ee2a4793e29e22df5)), closes [#24753](https://github.com/ionic-team/ionic/issues/24753)
* **router-outlet:** getRouteId() returns the params set in setRouteId(). ([#24656](https://github.com/ionic-team/ionic/issues/24656)) ([be2205e](https://github.com/ionic-team/ionic/commit/be2205e5a2b2f8778bd1f7b4ea5cae0bf96f9ef3)), closes [#24652](https://github.com/ionic-team/ionic/issues/24652)
* **router-outlet:** navigating to same route with different params now activates component ([#24760](https://github.com/ionic-team/ionic/issues/24760)) ([abc36ae](https://github.com/ionic-team/ionic/commit/abc36ae80b060a659f7557ad90efe98b78f5ead9)), closes [#24653](https://github.com/ionic-team/ionic/issues/24653)





## [6.0.7](https://github.com/ionic-team/ionic/compare/v6.0.6...v6.0.7) (2022-02-09)


### Bug Fixes

* **angular:** inline modals now add .ion-page class correctly ([#24751](https://github.com/ionic-team/ionic/issues/24751)) ([ef46eaf](https://github.com/ionic-team/ionic/commit/ef46eafc9476a85ea3369e542f528d01d3cca0a8)), closes [#24750](https://github.com/ionic-team/ionic/issues/24750)





## [6.0.6](https://github.com/ionic-team/ionic/compare/v6.0.5...v6.0.6) (2022-02-09)


### Bug Fixes

* **action-sheet:** background includes safe area margin ([#24700](https://github.com/ionic-team/ionic/issues/24700)) ([8c22646](https://github.com/ionic-team/ionic/commit/8c22646d66e2077fc88aaacf350330097733bb9b)), closes [#24699](https://github.com/ionic-team/ionic/issues/24699)
* **angular, react,  vue:** overlays no longer throw errors when used inside tests ([#24681](https://github.com/ionic-team/ionic/issues/24681)) ([897ae4a](https://github.com/ionic-team/ionic/commit/897ae4a4546ac0dd811125d5513ef23d133a1589)), closes [#24549](https://github.com/ionic-team/ionic/issues/24549) [#24590](https://github.com/ionic-team/ionic/issues/24590)
* **datetime:** disable intersection observer during month update ([#24713](https://github.com/ionic-team/ionic/issues/24713)) ([aab4d30](https://github.com/ionic-team/ionic/commit/aab4d306f80851bfd8a02a6361e26d60faeaadb4)), closes [#24712](https://github.com/ionic-team/ionic/issues/24712)
* **datetime:** minutes only filtered when max hour matches current hour ([#24710](https://github.com/ionic-team/ionic/issues/24710)) ([231d6df](https://github.com/ionic-team/ionic/commit/231d6df622c1f5dd9ecdff6fed8f61a4bff332df)), closes [#24702](https://github.com/ionic-team/ionic/issues/24702)
* **input:** cursor position does not jump to end ([#24736](https://github.com/ionic-team/ionic/issues/24736)) ([4ff9524](https://github.com/ionic-team/ionic/commit/4ff9524e1057aa487069b5982c5f1ecdf51d982b)), closes [#24727](https://github.com/ionic-team/ionic/issues/24727)
* **input:** IME composition mode ([#24735](https://github.com/ionic-team/ionic/issues/24735)) ([c6381ce](https://github.com/ionic-team/ionic/commit/c6381ce4f90707774d1c8662bba874f7b306bd1c)), closes [#24669](https://github.com/ionic-team/ionic/issues/24669)
* **modal, popover:** quickly opening modal/popover no longer presents duplicates ([#24697](https://github.com/ionic-team/ionic/issues/24697)) ([928c5fb](https://github.com/ionic-team/ionic/commit/928c5fbfcbf3ef1b2c3074464fc20dcf1fe143ae))
* **modal:** inline modals inherit ion-page styling ([#24723](https://github.com/ionic-team/ionic/issues/24723)) ([596aad4](https://github.com/ionic-team/ionic/commit/596aad435b5102307da89dd626ca4682b78db452)), closes [#24706](https://github.com/ionic-team/ionic/issues/24706)
* **popover:** use alignment with popover options ([#24711](https://github.com/ionic-team/ionic/issues/24711)) ([f5c5c3c](https://github.com/ionic-team/ionic/commit/f5c5c3cffa4f34046b0e9471a9f193db3772180e)), closes [#24709](https://github.com/ionic-team/ionic/issues/24709)
* **router:** router push with relative path ([#24719](https://github.com/ionic-team/ionic/issues/24719)) ([d40c0c3](https://github.com/ionic-team/ionic/commit/d40c0c3a0993eaefbe5107e98958c6b0699a62c2)), closes [#24718](https://github.com/ionic-team/ionic/issues/24718)
* **select:** value is selected when given array ([#24687](https://github.com/ionic-team/ionic/issues/24687)) ([6ee7d15](https://github.com/ionic-team/ionic/commit/6ee7d159ecfff3382fadb524c5c430172d40c267)), closes [#24742](https://github.com/ionic-team/ionic/issues/24742)





## [6.0.5](https://github.com/ionic-team/ionic/compare/v6.0.4...v6.0.5) (2022-02-02)


### Bug Fixes

* **datetime:** prevent navigating to disabled months ([#24421](https://github.com/ionic-team/ionic/issues/24421)) ([b40fc46](https://github.com/ionic-team/ionic/commit/b40fc4632efcdc01f1062d9bcec826afff5cf4ea)), closes [#24208](https://github.com/ionic-team/ionic/issues/24208) [#24482](https://github.com/ionic-team/ionic/issues/24482)
* **input:** min/max compatibility with react-hook-form ([#24657](https://github.com/ionic-team/ionic/issues/24657)) ([1f91883](https://github.com/ionic-team/ionic/commit/1f918835f437a59f7a70fc59d9305647aa9c298d)), closes [#24489](https://github.com/ionic-team/ionic/issues/24489)


### Performance Improvements

* **various:** don't use lazy-loaded icon names in components ([#24671](https://github.com/ionic-team/ionic/issues/24671)) ([484de50](https://github.com/ionic-team/ionic/commit/484de5074de212dffb4bf4f73bade7acec103fe8))





## [6.0.4](https://github.com/ionic-team/ionic/compare/v6.0.3...v6.0.4) (2022-01-26)


### Bug Fixes

* **accordion:** items inside of the content now correct display borders ([#24618](https://github.com/ionic-team/ionic/issues/24618)) ([d3311df](https://github.com/ionic-team/ionic/commit/d3311df96765948d0a395e4ba99fb9117b44adcb)), closes [#24613](https://github.com/ionic-team/ionic/issues/24613)
* **col:** col no longer errors when running in non-browser environment ([#24603](https://github.com/ionic-team/ionic/issues/24603)) ([af0135c](https://github.com/ionic-team/ionic/commit/af0135ce7dbe737b2df46094fd3dc8a41bdb60ae)), closes [#24446](https://github.com/ionic-team/ionic/issues/24446)
* **datetime:** datetime locale with h23 will respect max time range ([#24610](https://github.com/ionic-team/ionic/issues/24610)) ([5925e76](https://github.com/ionic-team/ionic/commit/5925e7608ef04f8877e4dd8a80b2c8bdc1cfd4bd)), closes [#24588](https://github.com/ionic-team/ionic/issues/24588)
* **datetime:** timepicker popover will position relative to click target ([#24616](https://github.com/ionic-team/ionic/issues/24616)) ([378c632](https://github.com/ionic-team/ionic/commit/378c63264366964e6ea11e1a2ff8791a40f182d4)), closes [#24531](https://github.com/ionic-team/ionic/issues/24531) [#24415](https://github.com/ionic-team/ionic/issues/24415)
* **input:** ion-input accepts any string value ([#24606](https://github.com/ionic-team/ionic/issues/24606)) ([43c5977](https://github.com/ionic-team/ionic/commit/43c5977d48cb12331c1d3107eb73f29b92c5e049)), closes [#19884](https://github.com/ionic-team/ionic/issues/19884)
* **item:** label text aligns with input text ([#24620](https://github.com/ionic-team/ionic/issues/24620)) ([94d033c](https://github.com/ionic-team/ionic/commit/94d033c4216ae9978aed6346c1c0ea2aec4d375b)), closes [#24404](https://github.com/ionic-team/ionic/issues/24404)
* **item:** match material design character counter ([#24335](https://github.com/ionic-team/ionic/issues/24335)) ([54db1a1](https://github.com/ionic-team/ionic/commit/54db1a1e7c71c78e843370848fc768582768333e)), closes [#24334](https://github.com/ionic-team/ionic/issues/24334)
* **menu:** focus trapping with menu and overlays no longer results in errors ([#24611](https://github.com/ionic-team/ionic/issues/24611)) ([632dafc](https://github.com/ionic-team/ionic/commit/632dafcd57de5086deebdc7d586b01710aa1a3ce)), closes [#24361](https://github.com/ionic-team/ionic/issues/24361) [#24481](https://github.com/ionic-team/ionic/issues/24481)
* **modal:** native keyboard will dismiss when bottom sheet is dragged ([#24642](https://github.com/ionic-team/ionic/issues/24642)) ([525f01f](https://github.com/ionic-team/ionic/commit/525f01f086ebf95ab62af0162b876a25f50a3d4b)), closes [#23878](https://github.com/ionic-team/ionic/issues/23878)
* **range:** setting dir on ion-range to enable rtl mode now supported ([#24597](https://github.com/ionic-team/ionic/issues/24597)) ([5dba4e5](https://github.com/ionic-team/ionic/commit/5dba4e5ce0a07f69a08f2b427e8010b311910f88)), closes [#20201](https://github.com/ionic-team/ionic/issues/20201)
* **searchbar:** setting dir on ion-searchbar to enable rtl mode now supported ([#24602](https://github.com/ionic-team/ionic/issues/24602)) ([35e5235](https://github.com/ionic-team/ionic/commit/35e523564561c0f3323efa761c4654016b97ef69))
* **segment:** setting dir on ion-segment to enable rtl mode now supported ([#24601](https://github.com/ionic-team/ionic/issues/24601)) ([2940e73](https://github.com/ionic-team/ionic/commit/2940e73a4504247eecb0de6c433104f529530850)), closes [#23978](https://github.com/ionic-team/ionic/issues/23978)
* **spinner:** ensure transform doesn't overwrite circular animation ([#24643](https://github.com/ionic-team/ionic/issues/24643)) ([88ce010](https://github.com/ionic-team/ionic/commit/88ce010418eaca38786b51720c696860b417ab6d))
* **toast:** allow input focus while toast is visible ([#24572](https://github.com/ionic-team/ionic/issues/24572)) ([29f1140](https://github.com/ionic-team/ionic/commit/29f1140384ae7e1402b09c3760e168cf79833619)), closes [#24571](https://github.com/ionic-team/ionic/issues/24571)
* **toggle:** setting dir on ion-toggle to enable rtl mode now supported ([#24600](https://github.com/ionic-team/ionic/issues/24600)) ([353dbc0](https://github.com/ionic-team/ionic/commit/353dbc0537ef3b46b9ba13a365ebc5da269de4c7))





## [6.0.3](https://github.com/ionic-team/ionic/compare/v6.0.2...v6.0.3) (2022-01-19)


### Bug Fixes

* **datetime:** showing calendar grid no longer causes month to switch on ios 15 ([#24554](https://github.com/ionic-team/ionic/issues/24554)) ([3d20959](https://github.com/ionic-team/ionic/commit/3d2095922147ea3763e977412977edd9586fec5d)), closes [#24405](https://github.com/ionic-team/ionic/issues/24405)
* **item:** error slot visible in Safari ([#24579](https://github.com/ionic-team/ionic/issues/24579)) ([af01a8b](https://github.com/ionic-team/ionic/commit/af01a8b3073dce784cc042923d712b9492638d32)), closes [#24575](https://github.com/ionic-team/ionic/issues/24575)
* **menu:** remove main attribute that was supposed to removed in v5 ([#24565](https://github.com/ionic-team/ionic/issues/24565)) ([7704ac3](https://github.com/ionic-team/ionic/commit/7704ac3a3710396248590daecb945b76825a0539)), closes [#24563](https://github.com/ionic-team/ionic/issues/24563)
* **modal:** life cycle events for controller modals ([#24508](https://github.com/ionic-team/ionic/issues/24508)) ([9a15753](https://github.com/ionic-team/ionic/commit/9a15753fd95e32155abdeb490ec57cb72385ad1a)), closes [#24460](https://github.com/ionic-team/ionic/issues/24460)
* **overlays:** getTop now returns the top-most presented overlay ([#24547](https://github.com/ionic-team/ionic/issues/24547)) ([f5b4382](https://github.com/ionic-team/ionic/commit/f5b4382fd5728365e4badf39bc1dd0c149b45c2c)), closes [#19111](https://github.com/ionic-team/ionic/issues/19111)





## [6.0.2](https://github.com/ionic-team/ionic/compare/v6.0.1...v6.0.2) (2022-01-11)


### Bug Fixes

* **breadcrumb:** support routerLink on breadcrumb ([#24509](https://github.com/ionic-team/ionic/issues/24509)) ([5bb1414](https://github.com/ionic-team/ionic/commit/5bb1414f7fa04ea07954cb3f68883ee2f162586a)), closes [#24493](https://github.com/ionic-team/ionic/issues/24493)
* **css:** inline css source in source maps ([#24514](https://github.com/ionic-team/ionic/issues/24514)) ([987d46c](https://github.com/ionic-team/ionic/commit/987d46cfa6e48a932330f04f2e8eb7054b11baf8)), closes [#24441](https://github.com/ionic-team/ionic/issues/24441)
* **datetime:** add top padding to MD calendar month grid ([#24522](https://github.com/ionic-team/ionic/issues/24522)) ([bd82b5d](https://github.com/ionic-team/ionic/commit/bd82b5dc1d06ba22a5410858802d57735fdcf450)), closes [#24408](https://github.com/ionic-team/ionic/issues/24408)
* **datetime:** RTL will no longer infinitely scroll ([#24475](https://github.com/ionic-team/ionic/issues/24475)) ([8f00008](https://github.com/ionic-team/ionic/commit/8f000089c2986f292147c7f501f23c8c7d1df457)), closes [#24472](https://github.com/ionic-team/ionic/issues/24472)
* **datetime:** time picker format with hourCycle h23 ([#24476](https://github.com/ionic-team/ionic/issues/24476)) ([a3724e6](https://github.com/ionic-team/ionic/commit/a3724e6a5662c5bc1b724d80540530472827506e)), closes [#24474](https://github.com/ionic-team/ionic/issues/24474)
* **datetime:** update active day styling when day is selected ([#24454](https://github.com/ionic-team/ionic/issues/24454)) ([4304391](https://github.com/ionic-team/ionic/commit/430439191dba824c11290d7f8622fea10ced6c40)), closes [#24414](https://github.com/ionic-team/ionic/issues/24414) [#24451](https://github.com/ionic-team/ionic/issues/24451)
* **datetime:** wheel picker shows correct column order in rtl ([#24546](https://github.com/ionic-team/ionic/issues/24546)) ([c90ce31](https://github.com/ionic-team/ionic/commit/c90ce311a86ccb7c06b1cde91a4659f6682df04d)), closes [#24378](https://github.com/ionic-team/ionic/issues/24378)
* **overlays:** define custom element children ([#24439](https://github.com/ionic-team/ionic/issues/24439)) ([4715b83](https://github.com/ionic-team/ionic/commit/4715b83abb30ec5930710d16e5bfe8fc88a940ce)), closes [#24393](https://github.com/ionic-team/ionic/issues/24393)
* **popover:** allow arrow configuration with controller approach ([#24512](https://github.com/ionic-team/ionic/issues/24512)) ([b39003a](https://github.com/ionic-team/ionic/commit/b39003a4c67cd7e01d09be012c9e12d99ca1730a)), closes [#24487](https://github.com/ionic-team/ionic/issues/24487)
* **radio:** fix radio not showing checked state when not in a group ([#24423](https://github.com/ionic-team/ionic/issues/24423)) ([94a781c](https://github.com/ionic-team/ionic/commit/94a781cb6a3d92c5e6cab1a7603bfe25826a753c))
* **react,vue:** backdrop for inline modal/popover overlay ([#24453](https://github.com/ionic-team/ionic/issues/24453)) ([77f8412](https://github.com/ionic-team/ionic/commit/77f8412b746222793cd9d17f12f50d512ab5e886)), closes [#24449](https://github.com/ionic-team/ionic/issues/24449)
* **react:** building app for production now works correctly with vite ([#24515](https://github.com/ionic-team/ionic/issues/24515)) ([32fad3d](https://github.com/ionic-team/ionic/commit/32fad3d02cb6b012a772de03eafe3e3a6b1300e0)), closes [#24229](https://github.com/ionic-team/ionic/issues/24229)
* **refresher:** import icons to avoid errors in react and vue ([#24525](https://github.com/ionic-team/ionic/issues/24525)) ([388622f](https://github.com/ionic-team/ionic/commit/388622f9734b7b832bca3ede99820a7124faa618)), closes [#24480](https://github.com/ionic-team/ionic/issues/24480)
