# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
