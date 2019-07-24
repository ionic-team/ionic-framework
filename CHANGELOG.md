## [4.6.2](https://github.com/ionic-team/ionic/compare/v4.6.1...v4.6.2) (2019-07-10)


### Bug Fixes

* **menu-button:** hide menu button when auto hide or split pane ([#18702](https://github.com/ionic-team/ionic/issues/18702)) ([24840d4](https://github.com/ionic-team/ionic/commit/24840d4)), closes [#18666](https://github.com/ionic-team/ionic/issues/18666)
* **menu-button:** move font-size to host for easier customization ([#18699](https://github.com/ionic-team/ionic/issues/18699)) ([876ab41](https://github.com/ionic-team/ionic/commit/876ab41)), closes [#18667](https://github.com/ionic-team/ionic/issues/18667)
* **overlays:** fallback to step color if overlay background variable is unset ([#18709](https://github.com/ionic-team/ionic/issues/18709)) ([f16b118](https://github.com/ionic-team/ionic/commit/f16b118)), closes [#18658](https://github.com/ionic-team/ionic/issues/18658)
* **virtual-scroll:**  remove runOutsideAngular error ([#18752](https://github.com/ionic-team/ionic/issues/18752)) ([8beeff2](https://github.com/ionic-team/ionic/commit/8beeff2)), closes [#18746](https://github.com/ionic-team/ionic/issues/18746)
* **vue:** update imports for types and ionicons ([f56fea6](https://github.com/ionic-team/ionic/commit/f56fea6)), closes [#18701](https://github.com/ionic-team/ionic/issues/18701)


### Performance Improvements

* **all:** minify better by using arrow functions ([#18730](https://github.com/ionic-team/ionic/issues/18730)) ([03c1d19](https://github.com/ionic-team/ionic/commit/03c1d19))



## [4.6.1](https://github.com/ionic-team/ionic/compare/v4.6.0...v4.6.1) (2019-07-09)


### Bug Fixes

* **app:** add hydrated to hide white screen with multiple ionic dependencies ([#18649](https://github.com/ionic-team/ionic/issues/18649))
* **datetime:** datetime no longer reports having a value if none is set ([#18541](https://github.com/ionic-team/ionic/issues/18541)) ([92e0f98](https://github.com/ionic-team/ionic/commit/92e0f98)), closes [#17979](https://github.com/ionic-team/ionic/issues/17979) [#18540](https://github.com/ionic-team/ionic/issues/18540)
* **fab-button:** set opacity on disabled fab button ([#18685](https://github.com/ionic-team/ionic/issues/18685)) ([6042b39](https://github.com/ionic-team/ionic/commit/6042b39)), closes [#18682](https://github.com/ionic-team/ionic/issues/18682)
* **icon:** load icons properly with baseHref ([#18650](https://github.com/ionic-team/ionic/issues/18650)), ([#18637](https://github.com/ionic-team/ionic/issues/18637))
* **icon:** bind icon name properly ([#18707](https://github.com/ionic-team/ionic/issues/18707))
* **infinite-scroll:** fix scroll listener ([0d58101](https://github.com/ionic-team/ionic/commit/0d58101))
* **item:** do not disable entire item if there are multiple inputs ([#18696](https://github.com/ionic-team/ionic/issues/18696)) ([dfa2b13](https://github.com/ionic-team/ionic/commit/dfa2b13)), closes [#18655](https://github.com/ionic-team/ionic/issues/18655) [#18670](https://github.com/ionic-team/ionic/issues/18670)
* **router-link:** add missing target prop ([#18659](https://github.com/ionic-team/ionic/issues/18659)) ([1f51ab2](https://github.com/ionic-team/ionic/commit/1f51ab2)), closes [#18655](https://github.com/ionic-team/ionic/issues/18655)
* **router-outlet:** fix swipe to go back ([b69fb69](https://github.com/ionic-team/ionic/commit/b69fb69))
* **scss:** copy all scss files ([36a58df](https://github.com/ionic-team/ionic/commit/36a58df))
* **searchbar:** proper styling after navigating ([#18642](https://github.com/ionic-team/ionic/issues/18642))
* **slides:** use correct order for pushing slides dynamically ([#18633](https://github.com/ionic-team/ionic/issues/18633))
* **tabs:** select proper tab by default and do not emit tab change if selectedTab is undefined ([03c834c](https://github.com/ionic-team/ionic/commit/03c834c))
* **overlay:** make create opts optional ([44c88ad](https://github.com/ionic-team/ionic/commit/44c88ad))


### Performance Improvements

* **angular:** skip zone ([e059fc8](https://github.com/ionic-team/ionic/commit/e059fc8))



# [4.6.0 Carbon](https://github.com/ionic-team/ionic/compare/v4.5.0...v4.6.0) (2019-06-26)


### Bug Fixes

* **button:** default opacity for disabled clear buttons ([#18560](https://github.com/ionic-team/ionic/issues/18560)) ([f48dc3d](https://github.com/ionic-team/ionic/commit/f48dc3d)), closes [#18555](https://github.com/ionic-team/ionic/issues/18555)
* **button:** update solid buttons to use tint and shade colors ([#18537](https://github.com/ionic-team/ionic/issues/18537)) ([26ecf2b](https://github.com/ionic-team/ionic/commit/26ecf2b))
* **menu:** change ARIA role from complementary to navigation ([#18330](https://github.com/ionic-team/ionic/issues/18330)) ([9e4346b](https://github.com/ionic-team/ionic/commit/9e4346b)), closes [#18318](https://github.com/ionic-team/ionic/issues/18318)
* **segment:** apply hover properly for segment with color ([#18549](https://github.com/ionic-team/ionic/issues/18549)) ([78e477b](https://github.com/ionic-team/ionic/commit/78e477b))
* **segment:** default ripple to currentColor ([#18547](https://github.com/ionic-team/ionic/issues/18547)) ([832306c](https://github.com/ionic-team/ionic/commit/832306c))


### Features

* **components:** add missing button/a props to components that render them ([#17883](https://github.com/ionic-team/ionic/issues/17883)) ([eca4121](https://github.com/ionic-team/ionic/commit/eca4121)), closes [#16848](https://github.com/ionic-team/ionic/issues/16848) [#16889](https://github.com/ionic-team/ionic/issues/16889)
* **fab-button:** add hover state using tint colors ([#18536](https://github.com/ionic-team/ionic/issues/18536)) ([ad00679](https://github.com/ionic-team/ionic/commit/ad00679)), closes [#17624](https://github.com/ionic-team/ionic/issues/17624)
* **item:** add hover and focused states ([#18606](https://github.com/ionic-team/ionic/issues/18606)) ([8a88dd2](https://github.com/ionic-team/ionic/commit/8a88dd2)), closes [#18279](https://github.com/ionic-team/ionic/issues/18279) [#17624](https://github.com/ionic-team/ionic/issues/17624)
* **router-link:** add router-link and deprecate anchor ([#18620](https://github.com/ionic-team/ionic/issues/18620)) ([d4c7b03](https://github.com/ionic-team/ionic/commit/d4c7b03))


### Enhancements

* **stencil:** update to Stencil One to improve app performance 🎉🎊 ([b40f7d3](https://github.com/ionic-team/ionic/commit/b40f7d3))



# [4.5.0 Boron](https://github.com/ionic-team/ionic/compare/v4.4.2...v4.5.0) (2019-06-12)


### Bug Fixes

* **angular:** ensure all NavigationExtras values are preserved when navigating ([#18468](https://github.com/ionic-team/ionic/issues/18468)) ([7610787](https://github.com/ionic-team/ionic/commit/7610787)), closes [#18469](https://github.com/ionic-team/ionic/issues/18469)
* **button:** set opacity on the host element for disabled button ([#18509](https://github.com/ionic-team/ionic/issues/18509)) ([320719b](https://github.com/ionic-team/ionic/commit/320719b)), closes [#16965](https://github.com/ionic-team/ionic/issues/16965)
* **button:** use correct border-radius on menu and back button ([#18501](https://github.com/ionic-team/ionic/issues/18501)) ([055e125](https://github.com/ionic-team/ionic/commit/055e125)), closes [#17624](https://github.com/ionic-team/ionic/issues/17624)
* **button:** use correct size on a dynamic button in an item ([#18395](https://github.com/ionic-team/ionic/issues/18395)) ([a3e23fc](https://github.com/ionic-team/ionic/commit/a3e23fc)), closes [#18085](https://github.com/ionic-team/ionic/issues/18085)
* **card:** remove white space from bottom of card ([#18328](https://github.com/ionic-team/ionic/issues/18328)) ([d53e7aa](https://github.com/ionic-team/ionic/commit/d53e7aa))
* **content:** prevent ion-searchbar from receiving padding adjustment when keyboard is open ([#18008](https://github.com/ionic-team/ionic/issues/18008)) ([b2290a6](https://github.com/ionic-team/ionic/commit/b2290a6)), closes [#18007](https://github.com/ionic-team/ionic/issues/18007)
* **datetime:** recalculate time columns on change ([#18380](https://github.com/ionic-team/ionic/issues/18380)) ([292b24a](https://github.com/ionic-team/ionic/commit/292b24a))
* **item:** start align the content under stacked and floating labels ([#18379](https://github.com/ionic-team/ionic/issues/18379)) ([f0af707](https://github.com/ionic-team/ionic/commit/f0af707)), closes [#16375](https://github.com/ionic-team/ionic/issues/16375)
* **item:** inherit overflow to allow better customization ([#18502](https://github.com/ionic-team/ionic/issues/18502)) ([8d2a47e](https://github.com/ionic-team/ionic/commit/8d2a47e)), closes [#17670](https://github.com/ionic-team/ionic/issues/17670)
* **item:** use a step color if the activated background is not set ([#18450](https://github.com/ionic-team/ionic/issues/18450)) ([1899c13](https://github.com/ionic-team/ionic/commit/1899c13)), closes [#18449](https://github.com/ionic-team/ionic/issues/18449)
* **item-sliding:** use the correct gesture direction and side for rtl ([#18366](https://github.com/ionic-team/ionic/issues/18366)) ([4545100](https://github.com/ionic-team/ionic/commit/4545100)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **label:** include the ion-text-wrap class styles for larger font ([#18374](https://github.com/ionic-team/ionic/issues/18374)) ([4bba540](https://github.com/ionic-team/ionic/commit/4bba540))
* **platform:** prevent error with Platform.is on Android 4.4 ([#18387](https://github.com/ionic-team/ionic/issues/18387)) ([54bdb36](https://github.com/ionic-team/ionic/commit/54bdb36))
* **react:** ensure element exists in controller before dismissing it ([0fd3e5d](https://github.com/ionic-team/ionic/commit/0fd3e5d))
* **slides:** resolve issue where double tap to zoom was enabled by default ([10de1da](https://github.com/ionic-team/ionic/commit/10de1da)), closes [#18035](https://github.com/ionic-team/ionic/issues/18035)
* **tabs:** allow selection on enter and spacebar press ([#18381](https://github.com/ionic-team/ionic/issues/18381)) ([11cde99](https://github.com/ionic-team/ionic/commit/11cde99)), closes [#18363](https://github.com/ionic-team/ionic/issues/18363)
* **textarea:** inherit white-space for better customization ([#18508](https://github.com/ionic-team/ionic/issues/18508)) ([a583902](https://github.com/ionic-team/ionic/commit/a583902)), closes [#18495](https://github.com/ionic-team/ionic/issues/18495)
* **virtual-scroll:** do not crash with an empty cell list ([#17799](https://github.com/ionic-team/ionic/issues/17799)) ([20c146e](https://github.com/ionic-team/ionic/commit/20c146e))


### Features

* **back-button:** add variables and support for focused and hover states ([#18451](https://github.com/ionic-team/ionic/issues/18451)) ([58672fb](https://github.com/ionic-team/ionic/commit/58672fb)), closes [#18465](https://github.com/ionic-team/ionic/issues/18465)
* **button:** add variables for customizing hover state ([#18499](https://github.com/ionic-team/ionic/issues/18499)) ([5c5934b](https://github.com/ionic-team/ionic/commit/5c5934b)), closes [#17974](https://github.com/ionic-team/ionic/issues/17974)
* **item-divider:** add inner padding CSS variables ([#18490](https://github.com/ionic-team/ionic/issues/18490)) ([35c143a](https://github.com/ionic-team/ionic/commit/35c143a)), closes [#18484](https://github.com/ionic-team/ionic/issues/18484)
* **menu-button:** add variables for hover and focused states ([#18434](https://github.com/ionic-team/ionic/issues/18434)) ([5ba0aa9](https://github.com/ionic-team/ionic/commit/5ba0aa9)), closes [#18279](https://github.com/ionic-team/ionic/issues/18279)
* **searchbar:** add cancel button options ([b959e0b](https://github.com/ionic-team/ionic/commit/b959e0b))
* **toast:** allow html content ([#18423](https://github.com/ionic-team/ionic/issues/18423)) ([c8104a2](https://github.com/ionic-team/ionic/commit/c8104a2))



## [4.4.2](https://github.com/ionic-team/ionic/compare/v4.4.1...v4.4.2) (2019-05-22)


### Bug Fixes

* **angular:** account for query params and fragments within a string when navigating ([#18356](https://github.com/ionic-team/ionic/issues/18356)) ([b79f68a](https://github.com/ionic-team/ionic/commit/b79f68a))



## [4.4.1](https://github.com/ionic-team/ionic/compare/v4.4.0...v4.4.1) (2019-05-22)


### Bug Fixes

* **angular:** ensure active page is not removed from change detection ([#18299](https://github.com/ionic-team/ionic/issues/18299)) ([b8d4961](https://github.com/ionic-team/ionic/commit/b8d4961)), closes [#18293](https://github.com/ionic-team/ionic/issues/18293)
* **angular:** preserve queryParams and fragment when going back ([#18298](https://github.com/ionic-team/ionic/issues/18298)) ([bdd5109](https://github.com/ionic-team/ionic/commit/bdd5109)), closes [#16744](https://github.com/ionic-team/ionic/issues/16744)
* **buttons:** use theme/color toolbar colors for buttons ([#18191](https://github.com/ionic-team/ionic/issues/18191)) ([0511989](https://github.com/ionic-team/ionic/commit/0511989)), closes [#18184](https://github.com/ionic-team/ionic/issues/18184) [#17840](https://github.com/ionic-team/ionic/issues/17840)
* **datetime:** update label direction in RTL ([#18340](https://github.com/ionic-team/ionic/issues/18340)) ([17345ef](https://github.com/ionic-team/ionic/commit/17345ef))
* **fab:** position fab buttons properly in RTL ([#18325](https://github.com/ionic-team/ionic/issues/18325)) ([845def8](https://github.com/ionic-team/ionic/commit/845def8)), references [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **icon:** remove stroke and move fill to host element ([#18241](https://github.com/ionic-team/ionic/issues/18241)) ([394cf8d](https://github.com/ionic-team/ionic/commit/394cf8d)), closes [#16483](https://github.com/ionic-team/ionic/issues/16483)
* **input:** keep entire input in view when scrolling with keyboard open ([#18253](https://github.com/ionic-team/ionic/issues/18253)) ([3cad778](https://github.com/ionic-team/ionic/commit/3cad778)), closes [#17457](https://github.com/ionic-team/ionic/issues/17457)
* **label:** position floating/stacked labels properly in RTL ([#18315](https://github.com/ionic-team/ionic/issues/18315)) ([00a27dc](https://github.com/ionic-team/ionic/commit/00a27dc)), references [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **loading:** allow html content ([#18242](https://github.com/ionic-team/ionic/issues/18242)) ([a6cb5f2](https://github.com/ionic-team/ionic/commit/a6cb5f2)), closes [#18135](https://github.com/ionic-team/ionic/issues/18135)
* **overlay:** hide scrollbars on non-scrollable content ([#16767](https://github.com/ionic-team/ionic/issues/16767)) ([875d563](https://github.com/ionic-team/ionic/commit/875d563)), closes [#14178](https://github.com/ionic-team/ionic/issues/14178)
* **picker:** update the column positions in RTL ([#18339](https://github.com/ionic-team/ionic/issues/18339)) ([788a56c](https://github.com/ionic-team/ionic/commit/788a56c)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **range:** update border-radius on range pin for RTL ([#18321](https://github.com/ionic-team/ionic/issues/18321)) ([4855351](https://github.com/ionic-team/ionic/commit/4855351)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **searchbar:** position buttons properly in RTL ([#18325](https://github.com/ionic-team/ionic/issues/18325)) ([845def8](https://github.com/ionic-team/ionic/commit/845def8)), references [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **segment:** update segment border for RTL ([#18326](https://github.com/ionic-team/ionic/issues/18326)) ([805b225](https://github.com/ionic-team/ionic/commit/805b225)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **slides:** allow clicks to propagate to buttons ([#16728](https://github.com/ionic-team/ionic/issues/16728)) ([a8f9dfe](https://github.com/ionic-team/ionic/commit/a8f9dfe))
* **tab-button:** apply background-focused when tabbing into tab button ([#17502](https://github.com/ionic-team/ionic/issues/17502)) ([d788a8e](https://github.com/ionic-team/ionic/commit/d788a8e)), closes [#17042](https://github.com/ionic-team/ionic/issues/17042)
* **tabs:** position badge properly in RTL (only in Chrome) ([#18325](https://github.com/ionic-team/ionic/issues/18325)) ([845def8](https://github.com/ionic-team/ionic/commit/845def8)), references [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **tabs:** select the tab called by the select method after initialization ([#18300](https://github.com/ionic-team/ionic/issues/18300)) ([da38647](https://github.com/ionic-team/ionic/commit/da38647)), closes [#17957](https://github.com/ionic-team/ionic/issues/17957)
* **toggle:** position toggle icon properly in RTL ([#18325](https://github.com/ionic-team/ionic/issues/18325)) ([845def8](https://github.com/ionic-team/ionic/commit/845def8)), references [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **toolbar:** update md toolbar button spacing and padding to match spec ([#17537](https://github.com/ionic-team/ionic/issues/17537)) ([fa87e35](https://github.com/ionic-team/ionic/commit/fa87e35)), closes [#16950](https://github.com/ionic-team/ionic/issues/16950) [#14444](https://github.com/ionic-team/ionic/issues/14444)



# [4.4.0 Beryllium](https://github.com/ionic-team/ionic/compare/v4.3.1...v4.4.0) (2019-05-08)


### Bug Fixes

* **button:** apply round property to button sizes in iOS ([#18125](https://github.com/ionic-team/ionic/issues/18125)) ([ae0eccc](https://github.com/ionic-team/ionic/commit/ae0eccc)), closes [#18108](https://github.com/ionic-team/ionic/issues/18108)
* **datetime:** default to current date when value is null ([#18105](https://github.com/ionic-team/ionic/issues/18105)) ([ca233b5](https://github.com/ionic-team/ionic/commit/ca233b5)), closes [#18099](https://github.com/ionic-team/ionic/issues/18099)
* **input:** clear on edit from inside native input ([#17115](https://github.com/ionic-team/ionic/issues/17115)) ([85093d6](https://github.com/ionic-team/ionic/commit/85093d6)), closes [#17055](https://github.com/ionic-team/ionic/issues/17055)
* **item:** use the global activated background for md ripple color ([#16752](https://github.com/ionic-team/ionic/issues/16752)) ([95945c0](https://github.com/ionic-team/ionic/commit/95945c0)), closes [#16585](https://github.com/ionic-team/ionic/issues/16585)
* **label:** use primary color on focus for md input labels ([#18183](https://github.com/ionic-team/ionic/issues/18183)) ([ddb8ef8](https://github.com/ionic-team/ionic/commit/ddb8ef8)), closes [#15602](https://github.com/ionic-team/ionic/issues/15602)
* **menu** add prefixed transform for side menu animation ([#18128](https://github.com/ionic-team/ionic/issues/18128)) ([2457a23](https://github.com/ionic-team/ionic/commit/2457a23)), closes [#17729](https://github.com/ionic-team/ionic/issues/17729)
* **reorder-group:** remove required parameter for the complete method ([#18084](https://github.com/ionic-team/ionic/issues/18084)) ([bd96491](https://github.com/ionic-team/ionic/commit/bd96491)), closes [#16302](https://github.com/ionic-team/ionic/issues/16302)
* **segment:** decrease icon size on ios and stretch segment buttons to fill height ([#17751](https://github.com/ionic-team/ionic/issues/17751)) ([0fa645b](https://github.com/ionic-team/ionic/commit/0fa645b)), closes [#17069](https://github.com/ionic-team/ionic/issues/17069)
* **textarea:** reposition textarea when keyboard appears ([#18098](https://github.com/ionic-team/ionic/issues/18098)) ([3cdab10](https://github.com/ionic-team/ionic/commit/3cdab10)), closes [#17847](https://github.com/ionic-team/ionic/issues/17847)
* **toast:** allow button-color CSS variable to be overridden ([#18133](https://github.com/ionic-team/ionic/issues/18133)) ([0c83fd3](https://github.com/ionic-team/ionic/commit/0c83fd3)), closes [#18127](https://github.com/ionic-team/ionic/issues/18127)


### Features

* **card:** add button functionality ([#17997](https://github.com/ionic-team/ionic/issues/17997)) ([669ec0d](https://github.com/ionic-team/ionic/commit/669ec0d)), closes [#17773](https://github.com/ionic-team/ionic/issues/17773)
* **img:** add ionImgWillLoad event and emit ionImgDidLoad when image is loaded ([#18159](https://github.com/ionic-team/ionic/issues/18159)) ([38ffb98](https://github.com/ionic-team/ionic/commit/38ffb98)), closes [#17652](https://github.com/ionic-team/ionic/issues/17652) [#18161](https://github.com/ionic-team/ionic/issues/18161)
* **item-sliding:** add open method ([#17964](https://github.com/ionic-team/ionic/issues/17964)) ([f912206](https://github.com/ionic-team/ionic/commit/f912206)), closes [#17899](https://github.com/ionic-team/ionic/issues/17899)
* **menu-button:** add css variables for padding ([#18188](https://github.com/ionic-team/ionic/issues/18188)) ([ef98977](https://github.com/ionic-team/ionic/commit/ef98977)), closes [#18187](https://github.com/ionic-team/ionic/issues/18187)
* **refresher:** add pullFactor property to control speed ([#16697](https://github.com/ionic-team/ionic/issues/16697)) ([9030dcc](https://github.com/ionic-team/ionic/commit/9030dcc)), closes [#15425](https://github.com/ionic-team/ionic/issues/15425)
* **searchbar:** add disabled property ([#17935](https://github.com/ionic-team/ionic/issues/17935)) ([a5b9066](https://github.com/ionic-team/ionic/commit/a5b9066)), closes [#17921](https://github.com/ionic-team/ionic/issues/17921)
* **textarea:** add option to expand textarea as value changes ([#16916](https://github.com/ionic-team/ionic/issues/16916)) ([cc8678a](https://github.com/ionic-team/ionic/commit/cc8678a))



## [4.3.1](https://github.com/ionic-team/ionic/compare/v4.3.0...v4.3.1) (2019-04-26)


### Bug Fixes

* **angular:** support replaceUrl with angular <7.2 ([#18106](https://github.com/ionic-team/ionic/issues/18106)) ([eb3cbe4](https://github.com/ionic-team/ionic/commit/eb3cbe4))
* **security:** sanitize components using innerHTML ([#18146](https://github.com/ionic-team/ionic/issues/18146)) ([b839e6f](https://github.com/ionic-team/ionic/commit/b839e6f))



# [4.3.0 Lithium](https://github.com/ionic-team/ionic/compare/v4.2.0...v4.3.0) (2019-04-17)


### Bug Fixes

* **action-sheet:** default buttons to empty array ([9e63947](https://github.com/ionic-team/ionic/commit/9e63947))
* **angular:** back button correctly goes back to proper tab ([#18005](https://github.com/ionic-team/ionic/issues/18005)) ([52e5a8d](https://github.com/ionic-team/ionic/commit/52e5a8d)), closes [#17278](https://github.com/ionic-team/ionic/issues/17278) [#15216](https://github.com/ionic-team/ionic/issues/15216)
* **components:** add mode classes to components for use in shadow elements ([#17838](https://github.com/ionic-team/ionic/issues/17838)) ([e5c8c10](https://github.com/ionic-team/ionic/commit/e5c8c10)), closes [#17608](https://github.com/ionic-team/ionic/issues/17608)
* **datetime:** date strings no longer revert to previous day ([#18018](https://github.com/ionic-team/ionic/issues/18018)) ([cc60b60](https://github.com/ionic-team/ionic/commit/cc60b60)), closes [#17977](https://github.com/ionic-team/ionic/issues/17977)
* **input:** prevent input from losing focus when tapping clear button ([#18004](https://github.com/ionic-team/ionic/issues/18004)) ([29bb4fc](https://github.com/ionic-team/ionic/commit/29bb4fc)), closes [#18002](https://github.com/ionic-team/ionic/issues/18002)
* **item:** use the correct input highlight for an inset line item ([#18052](https://github.com/ionic-team/ionic/issues/18052)) ([72be80c](https://github.com/ionic-team/ionic/commit/72be80c)), closes [#18051](https://github.com/ionic-team/ionic/issues/18051)
* **item-sliding:** hide closed side options while dragging side options open ([#17986](https://github.com/ionic-team/ionic/issues/17986)) ([f13722c](https://github.com/ionic-team/ionic/commit/f13722c)), closes [#17822](https://github.com/ionic-team/ionic/issues/17822)
* **slides:** allow zoom to work ([18b347b](https://github.com/ionic-team/ionic/commit/18b347b)), closes [#17981](https://github.com/ionic-team/ionic/issues/17981)
* **slides:** expose interface to provide custom animations ([#17959](https://github.com/ionic-team/ionic/issues/17959)) ([4474974](https://github.com/ionic-team/ionic/commit/4474974)), closes [#16616](https://github.com/ionic-team/ionic/issues/16616)
* **textarea:** float label when a value is changed async ([#18024](https://github.com/ionic-team/ionic/issues/18024)) ([494991e](https://github.com/ionic-team/ionic/commit/494991e)), closes [#17555](https://github.com/ionic-team/ionic/issues/17555) [#17559](https://github.com/ionic-team/ionic/issues/17559)
* **textarea:** update label alignment for inputs and textareas ([#18042](https://github.com/ionic-team/ionic/issues/18042)) ([38ae362](https://github.com/ionic-team/ionic/commit/38ae362)), closes [#16187](https://github.com/ionic-team/ionic/issues/16187)
* **vue:** use direction type from core ([#17901](https://github.com/ionic-team/ionic/issues/17901)) ([fa13173](https://github.com/ionic-team/ionic/commit/fa13173))


### Features

* **toast:** add header and additional custom toast buttons ([#17147](https://github.com/ionic-team/ionic/issues/17147)) ([6e1a8f1](https://github.com/ionic-team/ionic/commit/6e1a8f1)), closes [#16791](https://github.com/ionic-team/ionic/issues/16791) [#16237](https://github.com/ionic-team/ionic/issues/16237) [#17611](https://github.com/ionic-team/ionic/issues/17611)
* **toast:** add variables to change position start/end of toast ([#17961](https://github.com/ionic-team/ionic/issues/17961)) ([07e739a](https://github.com/ionic-team/ionic/commit/07e739a)), closes [#17854](https://github.com/ionic-team/ionic/issues/17854)



# [4.2.0 Helium](https://github.com/ionic-team/ionic/compare/v4.1.2...v4.2.0) (2019-04-03)


### Bug Fixes

* **angular:** properly check for replaceUrl in routing ([#17879](https://github.com/ionic-team/ionic/issues/17879)) ([f2c8db9](https://github.com/ionic-team/ionic/commit/f2c8db9)), closes [#15181](https://github.com/ionic-team/ionic/issues/15181)
* **angular:** return proper types in the overlay.getTop method ([#17802](https://github.com/ionic-team/ionic/issues/17802)) ([439b10e](https://github.com/ionic-team/ionic/commit/439b10e))
* **angular:** support relative router links ([d9a7c63](https://github.com/ionic-team/ionic/commit/d9a7c63)), closes [#17888](https://github.com/ionic-team/ionic/issues/17888) [#16534](https://github.com/ionic-team/ionic/issues/16534) [#16736](https://github.com/ionic-team/ionic/issues/16736) [#16954](https://github.com/ionic-team/ionic/issues/16954)
* **angular:** update ng-add schematic ([9443bfe](https://github.com/ionic-team/ionic/commit/9443bfe))
* **css:** resolve spinner and checkbox issues on older chrome versions ([#17896](https://github.com/ionic-team/ionic/issues/17896)) ([dbb39cd](https://github.com/ionic-team/ionic/commit/dbb39cd)), closes [#17524](https://github.com/ionic-team/ionic/issues/17524) [#17501](https://github.com/ionic-team/ionic/issues/17501)
* **datetime:** default to local date when no date given ([#17706](https://github.com/ionic-team/ionic/issues/17706)) ([bab56e8](https://github.com/ionic-team/ionic/commit/bab56e8))
* **datetime:** recalculate day column when month or year is changed ([#17815](https://github.com/ionic-team/ionic/issues/17815)) ([9273f97](https://github.com/ionic-team/ionic/commit/9273f97)), closes [#14233](https://github.com/ionic-team/ionic/issues/14233) [#14732](https://github.com/ionic-team/ionic/issues/14732) [#15452](https://github.com/ionic-team/ionic/issues/15452) [#15794](https://github.com/ionic-team/ionic/issues/15794) [#17633](https://github.com/ionic-team/ionic/issues/16733) [#17060](https://github.com/ionic-team/ionic/issues/17060) [#17510](https://github.com/ionic-team/ionic/issues/17510) [#17521](https://github.com/ionic-team/ionic/issues/17521)
* **item-option:** add styling and behaviour for disabled item-option ([#17909](https://github.com/ionic-team/ionic/issues/17909)) ([346ecb2](https://github.com/ionic-team/ionic/commit/346ecb2)), closes [#17905](https://github.com/ionic-team/ionic/issues/17905)
* **progress-bar:** flip rtl using the existing reversed property ([#17464](https://github.com/ionic-team/ionic/issues/17464)) ([fccaaf8](https://github.com/ionic-team/ionic/commit/fccaaf8)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **react:** ensure tabs are resilient to optional tabs ([#17862](https://github.com/ionic-team/ionic/issues/17862)) ([c29f5a6](https://github.com/ionic-team/ionic/commit/c29f5a6))
* **reorder-group:** add ability to reorder items inside shadow ([#17747](https://github.com/ionic-team/ionic/issues/17747)) ([352797e](https://github.com/ionic-team/ionic/commit/352797e)), closes [#17746](https://github.com/ionic-team/ionic/issues/17746)
* **select:** update overlay options when added asynchronously ([#17860](https://github.com/ionic-team/ionic/issues/17860)) ([1ecfcd1](https://github.com/ionic-team/ionic/commit/1ecfcd1)), closes [#15716](https://github.com/ionic-team/ionic/issues/15716) [#17851](https://github.com/ionic-team/ionic/issues/17851)
* **virtual-scroll:** use correct item top calculation with header or footer function ([#15948](https://github.com/ionic-team/ionic/issues/15948)) ([#17345](https://github.com/ionic-team/ionic/issues/17345)) ([a8a48a4](https://github.com/ionic-team/ionic/commit/a8a48a4)), closes [#17298](https://github.com/ionic-team/ionic/issues/17298)
* **vue:** back button event handling ([#17877](https://github.com/ionic-team/ionic/issues/17877)) ([dceec07](https://github.com/ionic-team/ionic/commit/dceec07))
* **vue:** update popover to use correct controller ([#17865](https://github.com/ionic-team/ionic/issues/17865)) ([0cb7db0](https://github.com/ionic-team/ionic/commit/0cb7db0))


### Features

* **img:** add ionError event ([#17134](https://github.com/ionic-team/ionic/issues/17134)) ([04f931f](https://github.com/ionic-team/ionic/commit/04f931f)), closes [#16947](https://github.com/ionic-team/ionic/issues/16947)
* **range:** add ticks attribute ([#17718](https://github.com/ionic-team/ionic/issues/17718)) ([016fa16](https://github.com/ionic-team/ionic/commit/016fa16)), closes [#17717](https://github.com/ionic-team/ionic/issues/17717)
* **vue:** support for ion-tabs ([#17678](https://github.com/ionic-team/ionic/issues/17678)) ([ee71675](https://github.com/ionic-team/ionic/commit/ee71675))
* **vue:** support ion-vue-router ([#17821](https://github.com/ionic-team/ionic/issues/17821)) ([71e5994](https://github.com/ionic-team/ionic/commit/71e5994))



## [4.1.2](https://github.com/ionic-team/ionic/compare/v4.1.1...v4.1.2) (2019-03-20)


### Bug Fixes

* **chip:** use transparent outline on color chips ([#17719](https://github.com/ionic-team/ionic/issues/17719)) ([f6783db](https://github.com/ionic-team/ionic/commit/f6783db))
* **datetime:** default to local date ([#17706](https://github.com/ionic-team/ionic/issues/17706)) ([bab56e8](https://github.com/ionic-team/ionic/commit/bab56e8))
* **input:** use max-height for input for consistency across browsers ([#17394](https://github.com/ionic-team/ionic/issues/17394)) ([67a9137](https://github.com/ionic-team/ionic/commit/67a9137))
* **item:** add missing ripple color CSS property ([#17814](https://github.com/ionic-team/ionic/issues/17814)) ([807820f](https://github.com/ionic-team/ionic/commit/807820f)), closes [#17523](https://github.com/ionic-team/ionic/issues/17523)
* **item-option:** add styling for slots other than icon-only ([#17711](https://github.com/ionic-team/ionic/issues/17711)) ([14f758c](https://github.com/ionic-team/ionic/commit/14f758c)), closes [#17737](https://github.com/ionic-team/ionic/issues/17737) [#17402](https://github.com/ionic-team/ionic/issues/17402)
* **platform:** account for larger tablets ([#17630](https://github.com/ionic-team/ionic/issues/17630)) ([29dbd07](https://github.com/ionic-team/ionic/commit/29dbd07))
* **popover:** update animation origin in RTL/MD ([#17645](https://github.com/ionic-team/ionic/issues/17645)) ([617453b](https://github.com/ionic-team/ionic/commit/617453b)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **spinner:** fix default spinner logic for relevant components ([#17660](https://github.com/ionic-team/ionic/issues/17660)) ([9c48fa7](https://github.com/ionic-team/ionic/commit/9c48fa7)), closes [#17659](https://github.com/ionic-team/ionic/issues/17659)
* **toggle:** do not use the contrast color for toggle inner color ([#17798](https://github.com/ionic-team/ionic/issues/17798)) ([2225941](https://github.com/ionic-team/ionic/commit/2225941)), closes [#17536](https://github.com/ionic-team/ionic/issues/17536)
* **transition:** animate all toolbars in iOS page transitions ([#17224](https://github.com/ionic-team/ionic/issues/17224)) ([7d01207](https://github.com/ionic-team/ionic/commit/7d01207))



## [4.1.1](https://github.com/ionic-team/ionic/compare/v4.1.0...v4.1.1) (2019-03-07)


### Bug Fixes

* **display:** update to correct css classes ([cabbeb2](https://github.com/ionic-team/ionic/commit/cabbeb2))



# [4.1.0 Hydrogen](https://github.com/ionic-team/ionic/compare/v4.0.2...v4.1.0) (2019-03-06)


### Bug Fixes

* **angular:** fix adding [@ionic](https://github.com/ionic)/angular when using ng add ([#17597](https://github.com/ionic-team/ionic/issues/17597)) ([484d92c](https://github.com/ionic-team/ionic/commit/484d92c)), closes [#17596](https://github.com/ionic-team/ionic/issues/17596)
* **animation:** fix header flicker on ios ([#17422](https://github.com/ionic-team/ionic/issues/17422)) ([ad20bd6](https://github.com/ionic-team/ionic/commit/ad20bd6))
* **css:** add the missing css classes to flex and float utils ([#17570](https://github.com/ionic-team/ionic/issues/17570)) ([c49276c](https://github.com/ionic-team/ionic/commit/c49276c)), closes [#17569](https://github.com/ionic-team/ionic/issues/17569)
* **fab:** disabled fab button no longer opens fab list ([#17620](https://github.com/ionic-team/ionic/issues/17620)) ([c475dab](https://github.com/ionic-team/ionic/commit/c475dab))
* **img:** remove space under img ([#17582](https://github.com/ionic-team/ionic/issues/17582)) ([621c79b](https://github.com/ionic-team/ionic/commit/621c79b))
* **item:** slotted ion-icon receives custom color ([#17585](https://github.com/ionic-team/ionic/issues/17585)) ([14dd871](https://github.com/ionic-team/ionic/commit/14dd871))
* **item-sliding:** no longer close all open items when deleting an item ([#17579](https://github.com/ionic-team/ionic/issues/17579)) ([3de7795](https://github.com/ionic-team/ionic/commit/3de7795))
* **loading:** add backdropDismiss to the interface ([#17668](https://github.com/ionic-team/ionic/issues/17668)) ([28fd75e](https://github.com/ionic-team/ionic/commit/28fd75e)), closes [#17369](https://github.com/ionic-team/ionic/issues/17369)
* **popover:** update placement per md spec ([#17429](https://github.com/ionic-team/ionic/issues/17429)) ([a99d179](https://github.com/ionic-team/ionic/commit/a99d179))
* **range:** clamp values that are out of bounds ([#17623](https://github.com/ionic-team/ionic/issues/17623)) ([5a197ca](https://github.com/ionic-team/ionic/commit/5a197ca))
* **refresher:** check for cancelable before preventing default ([#17351](https://github.com/ionic-team/ionic/issues/17351)) ([f205b10](https://github.com/ionic-team/ionic/commit/f205b10)), closes [#15256](https://github.com/ionic-team/ionic/issues/15256)
* **reorder:** allow sliding items to be reordered ([#17568](https://github.com/ionic-team/ionic/issues/17568)) ([3b331b5](https://github.com/ionic-team/ionic/commit/3b331b5))
* **ssr:** fix angular global window and document references ([f44c17e](https://github.com/ionic-team/ionic/commit/f44c17e))
* **ssr:** fix global window and document references ([#17590](https://github.com/ionic-team/ionic/issues/17590)) ([4646f53](https://github.com/ionic-team/ionic/commit/4646f53))
* **vue:** correct passing of props and data to components ([#17188](https://github.com/ionic-team/ionic/issues/17188)) ([2ce4940](https://github.com/ionic-team/ionic/commit/2ce4940))


### Features

* **checkbox:** implement indeterminate state ([#16951](https://github.com/ionic-team/ionic/issues/16951)) ([c641ae1](https://github.com/ionic-team/ionic/commit/c641ae1)), closes [#16943](https://github.com/ionic-team/ionic/issues/16943)
* **css:** add CSS display utilities ([#17359](https://github.com/ionic-team/ionic/issues/17359)) ([6bea9d3](https://github.com/ionic-team/ionic/commit/6bea9d3)), closes [#10904](https://github.com/ionic-team/ionic/issues/10904)
* **select:** add compareWith property ([#17358](https://github.com/ionic-team/ionic/issues/17358)) ([69ecebb](https://github.com/ionic-team/ionic/commit/69ecebb))
* **skeleton-text:** adds animated prop and support for CSS styling ([#17612](https://github.com/ionic-team/ionic/issues/17612)) ([d66b12b](https://github.com/ionic-team/ionic/commit/d66b12b)), closes [ionic-team/ionic-docs#407](https://github.com/ionic-team/ionic-docs/issues/407)



## [4.0.2](https://github.com/ionic-team/ionic/compare/v4.0.1...v4.0.2) (2019-02-20)


### Bug Fixes

* **button:** show proper shade for activated button on ios ([#17508](https://github.com/ionic-team/ionic/issues/17508)) ([3a9b679](https://github.com/ionic-team/ionic/commit/3a9b679)), closes [#17436](https://github.com/ionic-team/ionic/issues/17436)
* **config:** update types for scrollPadding, inputBlurring and hideCaretOnScroll to boolean ([#17302](https://github.com/ionic-team/ionic/issues/17302)) ([39fbc32](https://github.com/ionic-team/ionic/commit/39fbc32))
* **datetime:** default to current date when no value given ([#17443](https://github.com/ionic-team/ionic/issues/17443)) ([644f9f4](https://github.com/ionic-team/ionic/commit/644f9f4))
* **item-sliding:** Sliding no longer breaks after removing an item ([#17492](https://github.com/ionic-team/ionic/issues/17492)) ([e27bb2e](https://github.com/ionic-team/ionic/commit/e27bb2e))
* **range:** implement RTL (from PR 17157) ([#17384](https://github.com/ionic-team/ionic/issues/17384)) ([4f203bc](https://github.com/ionic-team/ionic/commit/4f203bc)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **searchbar:** allow setting of toolbar color and searchbar color ([#17474](https://github.com/ionic-team/ionic/issues/17474)) ([ba4e117](https://github.com/ionic-team/ionic/commit/ba4e117))
* **select:** Account for when options are not loaded immediately ([#17405](https://github.com/ionic-team/ionic/issues/17405)) ([f9f1775](https://github.com/ionic-team/ionic/commit/f9f1775))
* **tab-bar:** add translucent tab-bar styles back ([#17376](https://github.com/ionic-team/ionic/issues/17376)) ([374bd77](https://github.com/ionic-team/ionic/commit/374bd77))



## [4.0.1](https://github.com/ionic-team/ionic/compare/v4.0.0...v4.0.1) (2019-02-06)


### Bug Fixes

* **build:** modify rollup.config.js to work with Windows ([#17231](https://github.com/ionic-team/ionic/issues/17231)) ([d26d43d](https://github.com/ionic-team/ionic/commit/d26d43d))
* **grid:** add flex to ion-grid to allow it to properly render in an ion-item ([#17258](https://github.com/ionic-team/ionic/issues/17258)) ([40c6955](https://github.com/ionic-team/ionic/commit/40c6955)), closes [#17075](https://github.com/ionic-team/ionic/issues/17075)
* **menu:** fix content shadow when revealed in iOS ([#17383](https://github.com/ionic-team/ionic/issues/17383)) ([fc43faa](https://github.com/ionic-team/ionic/commit/fc43faa))
* **platform:** add additional check for safari PWA ([a584f6e](https://github.com/ionic-team/ionic/commit/a584f6e))
* **platform:** add mobileweb platform back ([cf2b2b3](https://github.com/ionic-team/ionic/commit/cf2b2b3))
* **popover:** apply fixed position to keep backdrop in viewport ([#17352](https://github.com/ionic-team/ionic/issues/17352)) ([ee3b04a](https://github.com/ionic-team/ionic/commit/ee3b04a)), closes [#17337](https://github.com/ionic-team/ionic/issues/17337)
* **popover:** originate animation from right in RTL/MD ([#17381](https://github.com/ionic-team/ionic/issues/17381)) ([bc3aa21](https://github.com/ionic-team/ionic/commit/bc3aa21))
* **range:** chrome bug with will-change ([74ce34f](https://github.com/ionic-team/ionic/commit/74ce34f))
* **react:** duplicate events being fired in ionic/react ([#17321](https://github.com/ionic-team/ionic/issues/17321)) ([a415001](https://github.com/ionic-team/ionic/commit/a415001))
* **reorder:** capture click event ([#17244](https://github.com/ionic-team/ionic/issues/17244)) ([986e67b](https://github.com/ionic-team/ionic/commit/986e67b)), closes [#17241](https://github.com/ionic-team/ionic/issues/17241)
* **searchbar:** hide search icon when focused with cancel button ([#17260](https://github.com/ionic-team/ionic/issues/17260)) ([c87867c](https://github.com/ionic-team/ionic/commit/c87867c)), closes [#17252](https://github.com/ionic-team/ionic/issues/17252)


# [4.0.0 Neutronium](https://github.com/ionic-team/ionic/compare/v4.0.0-rc.3...v4.0.0) (2019-01-23)

Enjoy! 🎈

# [4.0.0-rc.3](https://github.com/ionic-team/ionic/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2019-01-22)


### Bug Fixes

* **alert:** update styles for rtl ([#17129](https://github.com/ionic-team/ionic/issues/17129)) ([ceae5d2](https://github.com/ionic-team/ionic/commit/ceae5d2)), closes [#16295](https://github.com/ionic-team/ionic/issues/16295) [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **angular:** apply validation classes properly ([2b4d7b7](https://github.com/ionic-team/ionic/commit/2b4d7b7)), closes [#17171](https://github.com/ionic-team/ionic/issues/17171) [#16052](https://github.com/ionic-team/ionic/issues/16052) [#15572](https://github.com/ionic-team/ionic/issues/15572) [#16452](https://github.com/ionic-team/ionic/issues/16452) [#17063](https://github.com/ionic-team/ionic/issues/17063)
* **angular:** navigateRoot + animated ([#17164](https://github.com/ionic-team/ionic/issues/17164)) ([a6559a4](https://github.com/ionic-team/ionic/commit/a6559a4)), closes [#17144](https://github.com/ionic-team/ionic/issues/17144)
* **angular:** race condition when fast navigation ([#17197](https://github.com/ionic-team/ionic/issues/17197)) ([a945b03](https://github.com/ionic-team/ionic/commit/a945b03)), closes [#17194](https://github.com/ionic-team/ionic/issues/17194) [#16449](https://github.com/ionic-team/ionic/issues/16449) [#15413](https://github.com/ionic-team/ionic/issues/15413)
* **button:** avoid using attribute selectors for disabled ([#17198](https://github.com/ionic-team/ionic/issues/17198)) ([3defbf3](https://github.com/ionic-team/ionic/commit/3defbf3))
* **content:** tap-click deadlock ([#17170](https://github.com/ionic-team/ionic/issues/17170)) ([5cb7f68](https://github.com/ionic-team/ionic/commit/5cb7f68)), closes [#17138](https://github.com/ionic-team/ionic/issues/17138) [#16863](https://github.com/ionic-team/ionic/issues/16863) [#16191](https://github.com/ionic-team/ionic/issues/16191) [#16911](https://github.com/ionic-team/ionic/issues/16911)
* **fab:** remove layout contain from content ([#17048](https://github.com/ionic-team/ionic/issues/17048)) ([0cf1894](https://github.com/ionic-team/ionic/commit/0cf1894)), closes [#16780](https://github.com/ionic-team/ionic/issues/16780)
* **gesture:** destroy gesture handler when it's done ([#17184](https://github.com/ionic-team/ionic/issues/17184)) ([59bd823](https://github.com/ionic-team/ionic/commit/59bd823)), closes [#16433](https://github.com/ionic-team/ionic/issues/16433) [#16974](https://github.com/ionic-team/ionic/issues/16974)
* **icon:** update ionicons to flip for rtl ([#17196](https://github.com/ionic-team/ionic/issues/17196)) ([d3b6e60](https://github.com/ionic-team/ionic/commit/d3b6e60)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012)
* **item:** fix margins on slotted content (avatar, thumbnail) ([#17065](https://github.com/ionic-team/ionic/issues/17065)) ([3612651](https://github.com/ionic-team/ionic/commit/3612651)), closes [#16997](https://github.com/ionic-team/ionic/issues/16997)
* **searchbar:** keep search icon shown when searchbar has focus ([#17154](https://github.com/ionic-team/ionic/issues/17154)) ([c917bb4](https://github.com/ionic-team/ionic/commit/c917bb4))
* **select:** pass click event to popover interface ([#17146](https://github.com/ionic-team/ionic/issues/17146)) ([3ff9faf](https://github.com/ionic-team/ionic/commit/3ff9faf)), closes [#17142](https://github.com/ionic-team/ionic/issues/17142)
* **textarea:** new-line in firefox ([#17176](https://github.com/ionic-team/ionic/issues/17176)) ([e7538f3](https://github.com/ionic-team/ionic/commit/e7538f3)), closes [#17155](https://github.com/ionic-team/ionic/issues/17155)


### Features

* **angular:** add global pop() ([#17182](https://github.com/ionic-team/ionic/issues/17182)) ([766c79d](https://github.com/ionic-team/ionic/commit/766c79d)), closes [#16340](https://github.com/ionic-team/ionic/issues/16340)
* **datetime:** add readonly prop ([#17139](https://github.com/ionic-team/ionic/issues/17139)) ([d513e8a](https://github.com/ionic-team/ionic/commit/d513e8a))
* **input:** add getInputElement() ([#17183](https://github.com/ionic-team/ionic/issues/17183)) ([a90084c](https://github.com/ionic-team/ionic/commit/a90084c)), closes [#17174](https://github.com/ionic-team/ionic/issues/17174)
* **react:** complete controller integrations and navigation ([#16849](https://github.com/ionic-team/ionic/issues/16849)) ([f46cd50](https://github.com/ionic-team/ionic/commit/f46cd50))
* **slides:** expose updateAutoHeight ([#17208](https://github.com/ionic-team/ionic/issues/17208)) ([835aea9](https://github.com/ionic-team/ionic/commit/835aea9)), closes [#15079](https://github.com/ionic-team/ionic/issues/15079)


### BREAKING CHANGES

- `NavController.goBack()` renamed to `NavController.back()`


# [4.0.0-rc.2](https://github.com/ionic-team/ionic/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2019-01-16)


### Bug Fixes

* **action-sheet:** remove the height shift on press and update iOS design ([#16862](https://github.com/ionic-team/ionic/issues/16862)) ([82457d8](https://github.com/ionic-team/ionic/commit/82457d8)), closes [#16715](https://github.com/ionic-team/ionic/issues/16715) [#16790](https://github.com/ionic-team/ionic/issues/16790)
* **angular:** fix slides ([#17085](https://github.com/ionic-team/ionic/issues/17085)) ([8357e5c](https://github.com/ionic-team/ionic/commit/8357e5c))
* **angular:** hide some internal methods ([#17121](https://github.com/ionic-team/ionic/issues/17121)) ([4d5dcd4](https://github.com/ionic-team/ionic/commit/4d5dcd4))
* **angular:** NavController methods return a promise ([#17106](https://github.com/ionic-team/ionic/issues/17106)) ([3aaf87a](https://github.com/ionic-team/ionic/commit/3aaf87a)), closes [#17103](https://github.com/ionic-team/ionic/issues/17103)
* **angular:** ViewChild() fix ([#17037](https://github.com/ionic-team/ionic/issues/17037)) ([27a4709](https://github.com/ionic-team/ionic/commit/27a4709)), closes [#17034](https://github.com/ionic-team/ionic/issues/17034)
* **datetime:** do no change order of formatted dates w/ rtl ([#17024](https://github.com/ionic-team/ionic/issues/17024)) ([169da37](https://github.com/ionic-team/ionic/commit/169da37))
* **fab-button:** add default padding for fab-button ([#17050](https://github.com/ionic-team/ionic/issues/17050)) ([418052f](https://github.com/ionic-team/ionic/commit/418052f))
* **icon:** fix rtl detail icon for ios ([#17016](https://github.com/ionic-team/ionic/issues/17016)) ([b4f3405](https://github.com/ionic-team/ionic/commit/b4f3405)), closes [#14958](https://github.com/ionic-team/ionic/issues/14958)
* **input:** disable shadow-dom for text inputs ([#17043](https://github.com/ionic-team/ionic/issues/17043)) ([63e0501](https://github.com/ionic-team/ionic/commit/63e0501)), closes [#17020](https://github.com/ionic-team/ionic/issues/17020)
* **input:** fix display of ion-input in narrow ion-item in Firefox ([#16978](https://github.com/ionic-team/ionic/issues/16978)) ([1099dc3](https://github.com/ionic-team/ionic/commit/1099dc3))
* **inputs:** fix styles in firefox ([#17066](https://github.com/ionic-team/ionic/issues/17066)) ([0120eee](https://github.com/ionic-team/ionic/commit/0120eee))
* **inputs:** keyboard focus improvements ([#16838](https://github.com/ionic-team/ionic/issues/16838)) ([6364e4e](https://github.com/ionic-team/ionic/commit/6364e4e)), closes [#16815](https://github.com/ionic-team/ionic/issues/16815) [#16872](https://github.com/ionic-team/ionic/issues/16872) [#13978](https://github.com/ionic-team/ionic/issues/13978) [#16610](https://github.com/ionic-team/ionic/issues/16610)
* **item:** no lines on item should take precedence over list lines ([#17049](https://github.com/ionic-team/ionic/issues/17049)) ([d2fa946](https://github.com/ionic-team/ionic/commit/d2fa946)), closes [#16900](https://github.com/ionic-team/ionic/issues/16900)
* **picker:** do not change datetime/picker column order in RTL ([#17018](https://github.com/ionic-team/ionic/issues/17018)) ([1338d71](https://github.com/ionic-team/ionic/commit/1338d71)), closes [#16294](https://github.com/ionic-team/ionic/issues/16294)
* **rtl:** fix rtl back button default ([#17109](https://github.com/ionic-team/ionic/issues/17109)) ([a9a23af](https://github.com/ionic-team/ionic/commit/a9a23af)), closes [#15357](https://github.com/ionic-team/ionic/issues/15357)
* **utils:** remove console log ([#17116](https://github.com/ionic-team/ionic/issues/17116)) ([b0f51d4](https://github.com/ionic-team/ionic/commit/b0f51d4))


### Features

* **angular:** add tabs events ([#17125](https://github.com/ionic-team/ionic/issues/17125)) ([6929bb8](https://github.com/ionic-team/ionic/commit/6929bb8))
* **angular:** expose getSelected() ([#17079](https://github.com/ionic-team/ionic/issues/17079)) ([3c801db](https://github.com/ionic-team/ionic/commit/3c801db)), closes [#17068](https://github.com/ionic-team/ionic/issues/17068)


### Reverts

* **test:** update avatar index.html ([9e80b73](https://github.com/ionic-team/ionic/commit/9e80b73))

### BREAKING CHANGES

#### ionChange removed from ion-tabs

- `(ionChange)` becomes `(ionTabsDidChange)`

#### ion-tabs getSelected() returns a string

Previously the `getSelected()` method of `ion-tabs` returned a reference to the selected
`ion-tab`, now it returns the name of tab as string.



# [4.0.0-rc.1](https://github.com/ionic-team/ionic/compare/v4.0.0-rc.0...v4.0.0-rc.1) (2019-01-09)


### Bug Fixes

* **angular:** update [@angular](https://github.com/angular)/router dependency ([#16998](https://github.com/ionic-team/ionic/issues/16998)) ([76e9e02](https://github.com/ionic-team/ionic/commit/76e9e02))
* **col:** handle RTL offset-*, pull-*, and push-* ([#16702](https://github.com/ionic-team/ionic/issues/16702)) ([6d6472b](https://github.com/ionic-team/ionic/commit/6d6472b))
* **fab:** fab size when href provided ([b3316d4](https://github.com/ionic-team/ionic/commit/b3316d4)), closes [#16833](https://github.com/ionic-team/ionic/issues/16833)
* **menu:** swipe-back has higher priority ([f05c599](https://github.com/ionic-team/ionic/commit/f05c599)), closes [#16864](https://github.com/ionic-team/ionic/issues/16864)
* **overlays:** make them hidden until presented ([#16903](https://github.com/ionic-team/ionic/issues/16903)) ([302be53](https://github.com/ionic-team/ionic/commit/302be53)), closes [#16685](https://github.com/ionic-team/ionic/issues/16685)
* **popover:** position properly in RTL / MD modes ([#16745](https://github.com/ionic-team/ionic/issues/16745)) ([7846019](https://github.com/ionic-team/ionic/commit/7846019))
* **ripple-effect:** never capture click ([#16955](https://github.com/ionic-team/ionic/issues/16955)) ([7ee8aa6](https://github.com/ionic-team/ionic/commit/7ee8aa6)), closes [#16939](https://github.com/ionic-team/ionic/issues/16939)
* **segment:** update indicator and border based on theme ([#16821](https://github.com/ionic-team/ionic/issues/16821)) ([74587db](https://github.com/ionic-team/ionic/commit/74587db)), closes [#16820](https://github.com/ionic-team/ionic/issues/16820)
* **select:** interfaceOptions can customize mode ([#16826](https://github.com/ionic-team/ionic/issues/16826)) ([1227d57](https://github.com/ionic-team/ionic/commit/1227d57)), closes [#16825](https://github.com/ionic-team/ionic/issues/16825)
* **tab-button:** allow standalone tab-button ([#16905](https://github.com/ionic-team/ionic/issues/16905)) ([6ca7645](https://github.com/ionic-team/ionic/commit/6ca7645)), closes [#16845](https://github.com/ionic-team/ionic/issues/16845)
* **tabs:** fix goto root ([#16926](https://github.com/ionic-team/ionic/issues/16926)) ([8ee9205](https://github.com/ionic-team/ionic/commit/8ee9205)), closes [#16917](https://github.com/ionic-team/ionic/issues/16917)


### Features

* **radio-group:** add missing implementation for property allowEmptySelection ([#16880](https://github.com/ionic-team/ionic/issues/16880)) ([09726b0](https://github.com/ionic-team/ionic/commit/09726b0)), closes [#16841](https://github.com/ionic-team/ionic/issues/16841)
* **react:** add missing simple components to react. ([#16836](https://github.com/ionic-team/ionic/issues/16836)) ([696f62c](https://github.com/ionic-team/ionic/commit/696f62c))
* **react:** create initial portal implementation for overlay ctrls ([#16830](https://github.com/ionic-team/ionic/issues/16830)) ([99bdd1f](https://github.com/ionic-team/ionic/commit/99bdd1f))
* **react:** Initial implementations of controller required elements. ([#16817](https://github.com/ionic-team/ionic/issues/16817)) ([e30c5f1](https://github.com/ionic-team/ionic/commit/e30c5f1))


### Performance Improvements

* **angular:** bundle size improvements for angular ([#16966](https://github.com/ionic-team/ionic/issues/16966)) ([44fb45e](https://github.com/ionic-team/ionic/commit/44fb45e))
* **angular:** flat ng modules ([#17007](https://github.com/ionic-team/ionic/issues/17007)) ([0b84e27](https://github.com/ionic-team/ionic/commit/0b84e27)), closes [#17001](https://github.com/ionic-team/ionic/issues/17001)
* **angular:** proxy fast properties ([#16888](https://github.com/ionic-team/ionic/issues/16888)) ([ca9ec3e](https://github.com/ionic-team/ionic/commit/ca9ec3e))


### BREAKING CHANGES

In order to speed up the build and reduce the main bundle size,
we have moved the ionicons outside the webpack build pipeline.

Instead, a new copy task needs to be added to the `angular.json`, specifically to the
the `"assets"` option of the `"build"`.

#### angular.json

```diff
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets",
                "output": "assets"
              },
+             {
+               "glob": "**/*.svg",
+               "input": "node_modules/ionicons/dist/ionicons/svg",
+               "output": "./svg"
+             }
```


# [4.0.0-rc.0](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.19...v4.0.0-rc.0) (2018-12-19)


### Bug Fixes

* **action-sheet:** set 100% height to fix scrollable options ([#16789](https://github.com/ionic-team/ionic/issues/16789)) ([e3d7282](https://github.com/ionic-team/ionic/commit/e3d7282))
* **all:** ts 3.2 issues ([f393a82](https://github.com/ionic-team/ionic/commit/f393a82))
* **angular:** Fix cordova browser error when resumed ([#16810](https://github.com/ionic-team/ionic/issues/16810)) ([e735d2c](https://github.com/ionic-team/ionic/commit/e735d2c))
* **angular:** fix sibling router-outlets ([#16774](https://github.com/ionic-team/ionic/issues/16774)) ([35e3848](https://github.com/ionic-team/ionic/commit/35e3848)), closes [#16411](https://github.com/ionic-team/ionic/issues/16411)
* **angular:** router-outlet memory leak ([2c41823](https://github.com/ionic-team/ionic/commit/2c41823)), closes [#16285](https://github.com/ionic-team/ionic/issues/16285)
* **body:** body background matches ion-content ([0699884](https://github.com/ionic-team/ionic/commit/0699884))
* **core:** export ionic lifecycle names ([77640c9](https://github.com/ionic-team/ionic/commit/77640c9)), closes [#16760](https://github.com/ionic-team/ionic/issues/16760)
* **core:** ts lint issue ([#16814](https://github.com/ionic-team/ionic/issues/16814)) ([fb38002](https://github.com/ionic-team/ionic/commit/fb38002))
* **list:** adjust label margin to align with spec for md ([#16751](https://github.com/ionic-team/ionic/issues/16751)) ([60ef98d](https://github.com/ionic-team/ionic/commit/60ef98d)), closes [#16643](https://github.com/ionic-team/ionic/issues/16643)
* **modal:** --box-shadow ([e2ee0b6](https://github.com/ionic-team/ionic/commit/e2ee0b6)), closes [#16798](https://github.com/ionic-team/ionic/issues/16798)
* **progress-bar:** looking nice inside toolbar ([b5efede](https://github.com/ionic-team/ionic/commit/b5efede))
* **pwa:** use 100% of the viewport ([4c4bdf2](https://github.com/ionic-team/ionic/commit/4c4bdf2))
* **tab-bar:** adds selected color if tab bar is using a color ([#16766](https://github.com/ionic-team/ionic/issues/16766)) ([54e5a24](https://github.com/ionic-team/ionic/commit/54e5a24)), closes [#16761](https://github.com/ionic-team/ionic/issues/16761)
* **virtual-scroll:** fixes dynamic changes ([d1cecf1](https://github.com/ionic-team/ionic/commit/d1cecf1))


### Features

* **angular:** expose animationDirection ([#16802](https://github.com/ionic-team/ionic/issues/16802)) ([320eb03](https://github.com/ionic-team/ionic/commit/320eb03))
* **angular:** tabs.select() ([56dd8ae](https://github.com/ionic-team/ionic/commit/56dd8ae)), closes [#16753](https://github.com/ionic-team/ionic/issues/16753)


### Performance Improvements

* **angular:** detach from change detection ([f613b3b](https://github.com/ionic-team/ionic/commit/f613b3b))



# [4.0.0-beta.19](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.18...v4.0.0-beta.19) (2018-12-14)


### Bug Fixes

* **angular:** tab-bar slot=top ([#16727](https://github.com/ionic-team/ionic/issues/16727)) ([d4e4b52](https://github.com/ionic-team/ionic/commit/d4e4b52)), closes [#16722](https://github.com/ionic-team/ionic/issues/16722)
* **angular:** virtual-scroll ([#16729](https://github.com/ionic-team/ionic/issues/16729)) ([f05c7d6](https://github.com/ionic-team/ionic/commit/f05c7d6)), closes [#16725](https://github.com/ionic-team/ionic/issues/16725) [#16432](https://github.com/ionic-team/ionic/issues/16432) [#16023](https://github.com/ionic-team/ionic/issues/16023) [#14591](https://github.com/ionic-team/ionic/issues/14591) [#16050](https://github.com/ionic-team/ionic/issues/16050) [#15587](https://github.com/ionic-team/ionic/issues/15587)
* **datetime:** picker inherits mode ([#16731](https://github.com/ionic-team/ionic/issues/16731)) ([f93e4fd](https://github.com/ionic-team/ionic/commit/f93e4fd)), closes [#16717](https://github.com/ionic-team/ionic/issues/16717)
* **fab-button:** adding size prop instead of [mini] ([#16692](https://github.com/ionic-team/ionic/issues/16692)) ([e8cec60](https://github.com/ionic-team/ionic/commit/e8cec60)), closes [#16680](https://github.com/ionic-team/ionic/issues/16680)
* **fab-button:** get translucent working including with color ([#16750](https://github.com/ionic-team/ionic/issues/16750)) ([c2ada84](https://github.com/ionic-team/ionic/commit/c2ada84)), closes [#16450](https://github.com/ionic-team/ionic/issues/16450)


### Features

* **react:** add initial react code. ([#16748](https://github.com/ionic-team/ionic/issues/16748)) ([33e0ae4](https://github.com/ionic-team/ionic/commit/33e0ae4))

### BREAKING CHANGES

#### Core Components

Removes the `--width` and `--height` variables from the following components, in favor of CSS:

- Button
- FAB Button
- Checkbox
- Removes the `--width`/`--height` and adds a `--size` variable that is set on the width and height, allowing width and height to still be set and border-radius to still use it as a variable
- Radio
- Removes the `--width`/`--height` and `--inner-width`/`--inner-height` variables. Calculates inner values based on parent element size.

#### Overlay Components

The following components have all been converted to shadow (or scoped) and have CSS variables for width/height:

- Action Sheet _(scoped)_
- Alert _(scoped)_
- Loading _(scoped)_
- Menu _(shadow)_
- Modal _(scoped)_
- Picker _(scoped)_
- Popover _(scoped)_
- Toast _(shadow)_

The above components will now have the following CSS variables for consistency among overlays:

| Name |
| ----------------- |
| `--height` |
| `--max-height` |
| `--max-width` |
| `--min-height` |
| `--min-width` |
| `--width` |

If the component does not set the value, it will default to `auto`.

#### Removed CSS Variables

The following CSS properties have been removed:

| Component | Property | Reason |
| ---------------| --------------------| --------------------------------|
| **Button** | `--height` | Use CSS instead |
| **Button** | `--margin-bottom` | Use CSS instead |
| **Button** | `--margin-end` | Use CSS instead |
| **Button** | `--margin-start` | Use CSS instead |
| **Button** | `--margin-top` | Use CSS instead |
| **Button** | `--width` | Use CSS instead |
| **Checkbox** | `--height` | Use CSS or `--size` |
| **Checkbox** | `--width` | Use CSS or `--size` |
| **FAB Button** | `--width` | Use CSS instead |
| **FAB Button** | `--height` | Use CSS instead |
| **FAB Button** | `--margin-bottom` | Use CSS instead |
| **FAB Button** | `--margin-end` | Use CSS instead |
| **FAB Button** | `--margin-start` | Use CSS instead |
| **FAB Button** | `--margin-top` | Use CSS instead |
| **Menu** | `--width-small` | Use a media query and `--width` |
| **Radio** | `--width` | Use CSS instead |
| **Radio** | `--height` | Use CSS instead |
| **Radio** | `--inner-height` | Calculated based on parent |
| **Radio** | `--inner-width` | Calculated based on parent |

#### FAB Button mini

Renamed `[mini]` attribute to `[size=small]` in `ion-fab-button`.

```diff
- <ion-fab-button mini></ion-fab-button>
+ <ion-fab-button size="small"></ion-fab-button>
```

# [4.0.0-beta.18](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.17...v4.0.0-beta.18) (2018-12-13)


### Bug Fixes

* **all:** type issues with TS 3.2 ([aa9d0d4](https://github.com/ionic-team/ionic/commit/aa9d0d4))
* **angular:** disable change detection detach ([68e2619](https://github.com/ionic-team/ionic/commit/68e2619))
* **angular:** lint issue ([a961dca](https://github.com/ionic-team/ionic/commit/a961dca))
* **angular:** only routerLink works with angular router ([63cbc92](https://github.com/ionic-team/ionic/commit/63cbc92))
* **angular:** remove rogue console debug message ([#16530](https://github.com/ionic-team/ionic/issues/16530)) ([9a47fc4](https://github.com/ionic-team/ionic/commit/9a47fc4)), closes [#16529](https://github.com/ionic-team/ionic/issues/16529)
* **angular:** routerLink updates href ([c8d9685](https://github.com/ionic-team/ionic/commit/c8d9685))
* **angular:** swipe to go backs in tabs ([#16710](https://github.com/ionic-team/ionic/issues/16710)) ([2553820](https://github.com/ionic-team/ionic/commit/2553820))
* **angular:** swipeBackEnabled global config ([#16668](https://github.com/ionic-team/ionic/issues/16668)) ([d69427e](https://github.com/ionic-team/ionic/commit/d69427e)), closes [#16624](https://github.com/ionic-team/ionic/issues/16624)
* **angular:** wait for core defined in angular initializer ([#16693](https://github.com/ionic-team/ionic/issues/16693)) ([060794e](https://github.com/ionic-team/ionic/commit/060794e))
* **button:** reduce iOS border radius ([#16575](https://github.com/ionic-team/ionic/issues/16575)) ([b1e56bb](https://github.com/ionic-team/ionic/commit/b1e56bb))
* **button:** relax css containment to "content" ([#16553](https://github.com/ionic-team/ionic/issues/16553)) ([802a3d1](https://github.com/ionic-team/ionic/commit/802a3d1))
* **button/chip:** move hover styles into media query ([#16664](https://github.com/ionic-team/ionic/issues/16664)) ([a2c7b95](https://github.com/ionic-team/ionic/commit/a2c7b95)), closes [#16108](https://github.com/ionic-team/ionic/issues/16108)
* **content:** do not scroll on pan-x ([#16721](https://github.com/ionic-team/ionic/issues/16721)) ([b6aea08](https://github.com/ionic-team/ionic/commit/b6aea08))
* **img:** fire didLoad in safari ([#16571](https://github.com/ionic-team/ionic/issues/16571)) ([2ce986f](https://github.com/ionic-team/ionic/commit/2ce986f)), closes [#16557](https://github.com/ionic-team/ionic/issues/16557)
* **item-divider:** use prop for sticky ([#16691](https://github.com/ionic-team/ionic/issues/16691)) ([a6a1723](https://github.com/ionic-team/ionic/commit/a6a1723))
* **loading:** add backdropDismiss closes [#16527](https://github.com/ionic-team/ionic/issues/16527) ([#16570](https://github.com/ionic-team/ionic/issues/16570)) ([a251b50](https://github.com/ionic-team/ionic/commit/a251b50))
* **react:** add class based APIs ([#16665](https://github.com/ionic-team/ionic/issues/16665)) ([2933f61](https://github.com/ionic-team/ionic/commit/2933f61)), closes [#16583](https://github.com/ionic-team/ionic/issues/16583)
* **refresher:** close animation and hidden on pull down ([#16700](https://github.com/ionic-team/ionic/issues/16700)) ([6b0fc49](https://github.com/ionic-team/ionic/commit/6b0fc49)), closes [#16254](https://github.com/ionic-team/ionic/issues/16254)
* **segment:** set colors in the parent segment and remove the unused color property ([#16590](https://github.com/ionic-team/ionic/issues/16590)) ([8029df3](https://github.com/ionic-team/ionic/commit/8029df3)), closes [#14853](https://github.com/ionic-team/ionic/issues/14853)
* **segment-button:** make layout default to icon-top ([#16573](https://github.com/ionic-team/ionic/issues/16573)) ([841375e](https://github.com/ionic-team/ionic/commit/841375e))
* **select:** selection-option is hidden in edge ([#16607](https://github.com/ionic-team/ionic/issues/16607)) ([6776e65](https://github.com/ionic-team/ionic/commit/6776e65)), closes [#16580](https://github.com/ionic-team/ionic/issues/16580)
* **select-option:** using external style ([8050247](https://github.com/ionic-team/ionic/commit/8050247))
* **tab-bar:** hide on keyboard events ([#16688](https://github.com/ionic-team/ionic/issues/16688)) ([1473805](https://github.com/ionic-team/ionic/commit/1473805)), closes [#16419](https://github.com/ionic-team/ionic/issues/16419)
* **tab-bar:** update tab-bar to set the color/background of tab-button ([#16641](https://github.com/ionic-team/ionic/issues/16641)) ([2f63049](https://github.com/ionic-team/ionic/commit/2f63049)), closes [#14853](https://github.com/ionic-team/ionic/issues/14853)
* **theming:** update ios design for button and card ([#16586](https://github.com/ionic-team/ionic/issues/16586)) ([9c8c650](https://github.com/ionic-team/ionic/commit/9c8c650))
* **toolbar:** style all slotted content in order not only buttons ([#16617](https://github.com/ionic-team/ionic/issues/16617)) ([86fc9a5](https://github.com/ionic-team/ionic/commit/86fc9a5))


### Features

* **all:** vscode HTML autocompletion support ([#16687](https://github.com/ionic-team/ionic/issues/16687)) ([9b83bef](https://github.com/ionic-team/ionic/commit/9b83bef))
* **fab-button:** add css border properties ([#16656](https://github.com/ionic-team/ionic/issues/16656)) ([64557a7](https://github.com/ionic-team/ionic/commit/64557a7)), closes [#16652](https://github.com/ionic-team/ionic/issues/16652)
* **modal:** add css vars ([#16605](https://github.com/ionic-team/ionic/issues/16605)) ([235c685](https://github.com/ionic-team/ionic/commit/235c685))
* **progress-bar:** add progress bar component ([#16559](https://github.com/ionic-team/ionic/issues/16559)) ([9167fb4](https://github.com/ionic-team/ionic/commit/9167fb4)), closes [#16558](https://github.com/ionic-team/ionic/issues/16558)
* **range:** add support for range bar border radius ([#16519](https://github.com/ionic-team/ionic/issues/16519)) ([c036cb0](https://github.com/ionic-team/ionic/commit/c036cb0))
* **theme:** default colors based in step colors ([95c0b1b](https://github.com/ionic-team/ionic/commit/95c0b1b))
* **toast:** add CSS variables for box-shadow and border ([#16679](https://github.com/ionic-team/ionic/issues/16679)) ([1a299b0](https://github.com/ionic-team/ionic/commit/1a299b0))


### BREAKING CHANGES

#### [ANGULAR] Tabs

Tabs got the last bit of changes needed in order to support lazy loading of components. To support this, some changes are required for the router config. Using the tabs starter as an example, here's a diff of the changes:

<detail>

```diff
 import { RouterModule, Routes } from '@angular/router';

 import { TabsPage } from './tabs.page';
-import { Tab1Page } from '../tab1/tab1.page';
-import { Tab2Page } from '../tab2/tab2.page';
-import { Tab3Page } from '../tab3/tab3.page';

 const routes: Routes = [
   {
     path: 'tabs',
     component: TabsPage,
     children: [
-      {
-        path: '',
-        redirectTo: '/tabs/(tab1:tab1)',
-        pathMatch: 'full',
-      },
       {
         path: 'tab1',
-        outlet: 'tab1',
-        component: Tab1Page
+        children: [
+          {
+            path: '',
+            loadChildren: '../tab1/tab1.module#Tab1PageModule'
+          }
+        ]
       },
       {
         path: 'tab2',
-        outlet: 'tab2',
-        component: Tab2Page
+        children: [
+          {
+            path: '',
+            loadChildren: '../tab2/tab2.module#Tab2PageModule'
+          }
+        ]
       },
       {
         path: 'tab3',
-        outlet: 'tab3',
-        component: Tab3Page
+        children: [
+          {
+            path: '',
+            loadChildren: '../tab3/tab3.module#Tab3PageModule'
+          }
+        ]
+      },
+      {
+        path: '',
+        redirectTo: '/tabs/tab1',
+        pathMatch: 'full'
       }
     ]
   },
   {
     path: '',
-    redirectTo: '/tabs/(tab1:tab1)',
+    redirectTo: '/tabs/tab1',
     pathMatch: 'full'
   }
 ];
```

</detail>

And for the tabs markup, we have something close to pre-beta 16 tabs, but still provides a custom tab-bar.


<detail>

```diff
 <ion-tabs>

-  <ion-tab tab="tab1">
-    <ion-router-outlet name="tab1"></ion-router-outlet>
-  </ion-tab>
-  <ion-tab tab="tab2">
-    <ion-router-outlet name="tab2"></ion-router-outlet>
-  </ion-tab>
-  <ion-tab tab="tab3">
-    <ion-router-outlet name="tab3"></ion-router-outlet>
-  </ion-tab>
-
   <ion-tab-bar slot="bottom">
-
-    <ion-tab-button tab="tab1" href="/tabs/(tab1:tab1)">
+    <ion-tab-button tab="tab1">
       <ion-icon name="flash"></ion-icon>
       <ion-label>Tab One</ion-label>
     </ion-tab-button>

-    <ion-tab-button tab="tab2" href="/tabs/(tab2:tab2)">
+    <ion-tab-button tab="tab2">
       <ion-icon name="apps"></ion-icon>
       <ion-label>Tab Two</ion-label>
     </ion-tab-button>

-    <ion-tab-button tab="tab3" href="/tabs/(tab3:tab3)">
+    <ion-tab-button tab="tab3">
       <ion-icon name="send"></ion-icon>
       <ion-label>Tab Three</ion-label>
     </ion-tab-button>
-
   </ion-tab-bar>

 </ion-tabs>
```

</detail>



### [ANGULAR] href does not cause Angular Router to navigate

For consistency sake, the `href` attribute of `ion-button`, `ion-item` and `ion-anchor` no longer
trigger navigation using the Angular’s Router,instead use angular’s `[routerLink]`:

```diff
- <ion-button href="/path/to/page">
+ <ion-button routerLink="/path/to/page">
```

This change will not affect SEO since ionic will still use `href` under the hood.


### [ANGULAR] Prefixed Ion- components

For consistency with other frameworks and the rest of APIs and tooling, the exported
ionic components are prefixed with `Ion`.

```diff
- import { Input } from '@ionic/angular';
+ import { IonInput } from '@ionic/angular';
```

This change might also help to improve autocompletion, and prevent collisions with other libraries.

[More info](https://github.com/ionic-team/ionic/issues/16550)


<a name="4.0.0-beta.17"></a>
# [4.0.0-beta.17](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.16...v4.0.0-beta.17) (2018-11-29)


### Bug Fixes

* **alert:** accepts any value ([#16476](https://github.com/ionic-team/ionic/issues/16476)) ([50b0c6f](https://github.com/ionic-team/ionic/commit/50b0c6f)), closes [#16170](https://github.com/ionic-team/ionic/issues/16170)
* **angular:** accept other url schemas ([e8e7183](https://github.com/ionic-team/ionic/commit/e8e7183))
* **angular:** avoid forEach in classList ([359bdcf](https://github.com/ionic-team/ionic/commit/359bdcf))
* **angular:** cleanup ion-invalid class ([34cd1d1](https://github.com/ionic-team/ionic/commit/34cd1d1)), closes [#16353](https://github.com/ionic-team/ionic/issues/16353)
* **angular:** default value of BooleanValueAccessor should be false ([#16420](https://github.com/ionic-team/ionic/issues/16420)) ([429e083](https://github.com/ionic-team/ionic/commit/429e083))
* **angular:** es6 classes break in ie11 ([#16417](https://github.com/ionic-team/ionic/issues/16417)) ([ce1fcea](https://github.com/ionic-team/ionic/commit/ce1fcea)), closes [#15979](https://github.com/ionic-team/ionic/issues/15979)
* **angular:** fix controlValueAccessor for boolean ([b645bfd](https://github.com/ionic-team/ionic/commit/b645bfd)), closes [#16371](https://github.com/ionic-team/ionic/issues/16371)
* **angular:** fix tabs with useHash ([#16392](https://github.com/ionic-team/ionic/issues/16392)) ([f831186](https://github.com/ionic-team/ionic/commit/f831186)), closes [#16390](https://github.com/ionic-team/ionic/issues/16390)
* **angular:** no animate in browser nav ([276c883](https://github.com/ionic-team/ionic/commit/276c883))
* **angular:** tune routerLink default behaviour ([#16405](https://github.com/ionic-team/ionic/issues/16405)) ([72bc025](https://github.com/ionic-team/ionic/commit/72bc025))
* **item-sliding:** use a white item background instead of transparent ([#16507](https://github.com/ionic-team/ionic/issues/16507)) ([2d33c63](https://github.com/ionic-team/ionic/commit/2d33c63)), closes [#16474](https://github.com/ionic-team/ionic/issues/16474)
* **label:** move default flex and margin to item ([#16461](https://github.com/ionic-team/ionic/issues/16461)) ([723d17b](https://github.com/ionic-team/ionic/commit/723d17b)), closes [#15393](https://github.com/ionic-team/ionic/issues/15393)
* **list:** do not style last child items by default ([#16456](https://github.com/ionic-team/ionic/issues/16456)) ([09d69b9](https://github.com/ionic-team/ionic/commit/09d69b9)), closes [#15185](https://github.com/ionic-team/ionic/issues/15185)
* **menu-controller:** _getInstance() is internal ([723296e](https://github.com/ionic-team/ionic/commit/723296e))
* **mode:** lazy load same component, two different modes ([#16401](https://github.com/ionic-team/ionic/issues/16401)) ([4dd4ccc](https://github.com/ionic-team/ionic/commit/4dd4ccc))
* **radio:** removd hard coded inner-width and inner-height for iOS ([5096503](https://github.com/ionic-team/ionic/commit/5096503))
* **range:** add slot margins ([#16464](https://github.com/ionic-team/ionic/issues/16464)) ([69f63b3](https://github.com/ionic-team/ionic/commit/69f63b3))
* **segment:** height fits content ([#16511](https://github.com/ionic-team/ionic/issues/16511)) ([aa61e81](https://github.com/ionic-team/ionic/commit/aa61e81))
* **tab-bar:** update to match MD design and remove transforms ([#16348](https://github.com/ionic-team/ionic/issues/16348)) ([bc3e192](https://github.com/ionic-team/ionic/commit/bc3e192)), closes [#16231](https://github.com/ionic-team/ionic/issues/16231) [#16231](https://github.com/ionic-team/ionic/issues/16231) [ionic-team/ionic-docs#175](https://github.com/ionic-team/ionic-docs/issues/175) [ionic-team/ionic-docs#163](https://github.com/ionic-team/ionic-docs/issues/163)
* **themes:** update default toolbar and tab background to #fff ([#16454](https://github.com/ionic-team/ionic/issues/16454)) ([12bcb41](https://github.com/ionic-team/ionic/commit/12bcb41)), closes [#16384](https://github.com/ionic-team/ionic/issues/16384)
* **toast:** make longer toasts available with pre-wrap ([#16361](https://github.com/ionic-team/ionic/issues/16361)) ([52cea5a](https://github.com/ionic-team/ionic/commit/52cea5a)), closes [#16360](https://github.com/ionic-team/ionic/issues/16360)
* **toolbar:** match MD button spec ([#16378](https://github.com/ionic-team/ionic/issues/16378)) ([7d7b995](https://github.com/ionic-team/ionic/commit/7d7b995))


### Features

* support ng add ([#15323](https://github.com/ionic-team/ionic/issues/15323)) ([75dd853](https://github.com/ionic-team/ionic/commit/75dd853))
* **ripple-effect:** adds unbounded ripple-effect ([#16399](https://github.com/ionic-team/ionic/issues/16399)) ([2884076](https://github.com/ionic-team/ionic/commit/2884076))
* **ripple-effect:** add option to disable ripple-effect ([#16393](https://github.com/ionic-team/ionic/issues/16393)) ([838f40d](https://github.com/ionic-team/ionic/commit/838f40d)), closes [#16379](https://github.com/ionic-team/ionic/issues/16379)



<a name="4.0.0-beta.16"></a>
# [4.0.0-beta.16](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.15...v4.0.0-beta.16) (2018-11-16)


### BREAKING CHANGES

Segment Button now requires the text to be wrapped in an `ion-label` element for improved styling.

*Old usage:*

 ```html
<ion-segment-button>
  Item One
</ion-segment-button>
 ```
 *New usage:*

 ```html
<ion-segment-button>
  <ion-label>Item One</ion-label>
</ion-segment-button>
 ```

#### Simplifying Chip

Because of updates to the Material Design spec, `ion-chip` no longer requires a chip-specific version of `ion-icon` or `ion-button`. Chips themselves should be interactive and don't require a nested button.

*Old usage:*

```html
<ion-chip>
  <ion-chip-icon name="checkmark"><ion-chip-icon>
</ion-chip>
```

*New usage:*

```html
<ion-chip>
  <ion-icon name="checkmark"></ion-icon>
</ion-chip>
```


### Bug Fixes

* **alert:** use tint for md button active background ([#16278](https://github.com/ionic-team/ionic/issues/16278)) ([0fec722](https://github.com/ionic-team/ionic/commit/0fec722))
* **all:** update types to be required ([#16218](https://github.com/ionic-team/ionic/issues/16218)) ([091625d](https://github.com/ionic-team/ionic/commit/091625d))
* **angular:** add swipe-to-go-back gesture ([108691d](https://github.com/ionic-team/ionic/commit/108691d))
* **angular:** adds tabs stack ([adae8d4](https://github.com/ionic-team/ionic/commit/adae8d4))
* **angular:** disable transition heuristics by default ([d9172b7](https://github.com/ionic-team/ionic/commit/d9172b7))
* **angular:** es6 build ([#16207](https://github.com/ionic-team/ionic/issues/16207)) ([a981116](https://github.com/ionic-team/ionic/commit/a981116)), closes [#15979](https://github.com/ionic-team/ionic/issues/15979)
* **angular:** fix handler outside zone ([b8dae5e](https://github.com/ionic-team/ionic/commit/b8dae5e)), closes [#16338](https://github.com/ionic-team/ionic/issues/16338)
* **backdrop:** update opacity to match MD spec ([#16188](https://github.com/ionic-team/ionic/issues/16188)) ([3c9ed31](https://github.com/ionic-team/ionic/commit/3c9ed31))
* **checkbox:** align vertically ([#16331](https://github.com/ionic-team/ionic/issues/16331)) ([bd3ca42](https://github.com/ionic-team/ionic/commit/bd3ca42))
* **checkbox:** match MD spec ([#16186](https://github.com/ionic-team/ionic/issues/16186)) ([240171a](https://github.com/ionic-team/ionic/commit/240171a))
* **gesture:** release gesture when it's disabled ([c9b4e66](https://github.com/ionic-team/ionic/commit/c9b4e66)), closes [#16335](https://github.com/ionic-team/ionic/issues/16335)
* **input:** remove clear icon in edge ([59bee23](https://github.com/ionic-team/ionic/commit/59bee23))
* **input:** remove red shadow for firefox ([767d299](https://github.com/ionic-team/ionic/commit/767d299)), closes [#16318](https://github.com/ionic-team/ionic/issues/16318)
* **input:** scroll assist works in with shadow-dom ([#16206](https://github.com/ionic-team/ionic/issues/16206)) ([d817cc3](https://github.com/ionic-team/ionic/commit/d817cc3)), closes [#15888](https://github.com/ionic-team/ionic/issues/15888) [#15294](https://github.com/ionic-team/ionic/issues/15294) [#15895](https://github.com/ionic-team/ionic/issues/15895)
* **inputs:** fix aria with shadow-dom ([#16329](https://github.com/ionic-team/ionic/issues/16329)) ([fd79b57](https://github.com/ionic-team/ionic/commit/fd79b57))
* **inputs:** inherit in edge causes problems ([0abf992](https://github.com/ionic-team/ionic/commit/0abf992))
* **item:** update to match Material Design spec ([#16182](https://github.com/ionic-team/ionic/issues/16182)) ([e416c23](https://github.com/ionic-team/ionic/commit/e416c23)), closes [#14799](https://github.com/ionic-team/ionic/issues/14799)
* **label:** placeholder + floating label ([#16111](https://github.com/ionic-team/ionic/issues/16111)) ([a8be529](https://github.com/ionic-team/ionic/commit/a8be529))
* **list-header:** match MD bottom margin, match MD text color ([#16274](https://github.com/ionic-team/ionic/issues/16274)) ([6794447](https://github.com/ionic-team/ionic/commit/6794447))
* **menu:** update box-shadow for MD to match spec ([#16183](https://github.com/ionic-team/ionic/issues/16183)) ([335acf9](https://github.com/ionic-team/ionic/commit/335acf9))
* **range:** increase MD horizontal padding ([#16312](https://github.com/ionic-team/ionic/issues/16312)) ([5d00501](https://github.com/ionic-team/ionic/commit/5d00501))
* **range:** use fully opaque base in color active bar ([#16224](https://github.com/ionic-team/ionic/issues/16224)) ([0757126](https://github.com/ionic-team/ionic/commit/0757126))
* **ripple-effect:** follow MD spec ([#16330](https://github.com/ionic-team/ionic/issues/16330)) ([6d59446](https://github.com/ionic-team/ionic/commit/6d59446))
* **searchbar:** align cancel button to center with search icon position ([#16259](https://github.com/ionic-team/ionic/issues/16259)) ([5957867](https://github.com/ionic-team/ionic/commit/5957867))
* **segment-button:** make layout optional ([e9e33ad](https://github.com/ionic-team/ionic/commit/e9e33ad))
* **tab-button:** layout is mutable ([#16332](https://github.com/ionic-team/ionic/issues/16332)) ([02a266c](https://github.com/ionic-team/ionic/commit/02a266c))
* **tabs:** works with no href ([8e0f1ba](https://github.com/ionic-team/ionic/commit/8e0f1ba))
* **toast:** update toast design to match MD spec ([#16323](https://github.com/ionic-team/ionic/issues/16323)) ([188a635](https://github.com/ionic-team/ionic/commit/188a635)), closes [#16271](https://github.com/ionic-team/ionic/issues/16271)
* **toggle:** match MD toggle track background for off state ([#16277](https://github.com/ionic-team/ionic/issues/16277)) ([8e2a6dd](https://github.com/ionic-team/ionic/commit/8e2a6dd))


### Features

* **segment:** adds global variable for targeting segment in toolbar ([#16344](https://github.com/ionic-team/ionic/issues/16344)) ([10971cc](https://github.com/ionic-team/ionic/commit/10971cc))
* **segment:** adds scrollable and layout props and updates to follow the spec  ([#16273](https://github.com/ionic-team/ionic/issues/16273)) ([256745c](https://github.com/ionic-team/ionic/commit/256745c)), closes [#16232](https://github.com/ionic-team/ionic/issues/16232) [#16081](https://github.com/ionic-team/ionic/issues/16081) [#14853](https://github.com/ionic-team/ionic/issues/14853)


### Performance Improvements

* **angular:** remove duplicated code in value-accessor ([bfbbeca](https://github.com/ionic-team/ionic/commit/bfbbeca))


### Dependencies

If you are using @ionic/angular, please update the version number of any @angular packages in your package.json file to `7.0.3`.

```
"dependencies": {
  "@angular/common": "~7.0.3",
  "@angular/core": "~7.0.3",
  "@angular/forms": "~7.0.3",
  "@angular/http": "~7.0.3",
  "@angular/platform-browser": "~7.0.3",
  "@angular/platform-browser-dynamic": "~7.0.3",
  "@angular/router": "~7.0.3",
  "rxjs": "6.3.3",
```

```
"devDependencies": {
  "@angular-devkit/architect": "~0.10.5",
  "@angular-devkit/build-angular": "~0.10.5",
  "@angular-devkit/core": "~7.0.5",
  "@angular-devkit/schematics": "~7.0.5",
  "@angular/cli": "~7.0.3",
  "@angular/compiler": "~7.0.3",
  "@angular/compiler-cli": "~7.0.3",
  "@angular/language-service": "~7.0.3",
```

<a name="4.0.0-beta.15"></a>
# [4.0.0-beta.15](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.13...v4.0.0-beta.15) (2018-11-01)

# Breaking Changes

## Removed Global CSS Variables

The following global CSS variables have been removed for the reasons listed.

| Variable Name                     | Reason                                          |
| ----------------------------------| ------------------------------------------------|
| `--ion-toolbar-color-inactive`    | Unused                                          |
| `--ion-ripple-background-color`   | Unused / Ripple color is based on component     |
| `--ion-header-size`               | Removed in favor of using CSS for h1-h6         |
| `--ion-header-step`               | Removed in favor of using CSS for h1-h6         |

## Renamed Global CSS Variables

The following global CSS variables have been renamed for the reasons listed.

| Old Variable Name                        | New Variable Name                  | Reason                                                                        |
| -----------------------------------------| -----------------------------------| ------------------------------------------------------------------------------|
| `--ion-toolbar-text-color`               | `--ion-toolbar-color`              | Variable is not limited to text color                                         |
| `--ion-toolbar-color-active`             | `--ion-toolbar-color-activated`    | Consistency with our component variables                                      |
| `--ion-tabbar-text-color`                | `--ion-tab-bar-color`              | Variable is not limited to text color                                         |
| `--ion-tabbar-text-color-active`         | `--ion-tab-bar-color-activated`    | Consistency with our component variables                                      |
| `--ion-tabbar-background-color`          | `--ion-tab-bar-background`         | Applies to the background property                                            |
| `--ion-tabbar-background-color-focused`  | `--ion-tab-bar-background-focused` | Applies to the background property                                            |
| `--ion-item-background-color`            | `--ion-item-background`            | Applies to the background property                                            |
| `--ion-item-background-color-active`     | `--ion-item-background-activated`  | Applies to the background property / Consistency with our component variables |
| `--ion-item-text-color`                  | `--ion-item-color`                 | Variable is not limited to text color                                         |
| `--ion-placeholder-text-color`           | `--ion-placeholder-color`          | Consistency with other variables                                              |

## Rethinking Tabs

One of the most valuable and complex components in Ionic's toolkit is Tabs. Tabs started off as a simple component that would create a tabbed interface to allow users to switch between different views in a way that was consistent with native UX paradigms.

Over time, we started hearing people ask for more features to be added: "Can we have one tab button that is just a button?" "Can I customize how the tab buttons are displayed?" "Can I use a custom icon in the tab?"

Traditionally, these features, and many others, were difficult to accomplish because Tabs was doing a lot of magic behind the scenes to generate the Tab bar and buttons. With this in mind, we thought it was time for a refresh to offer as much flexibility as possible within Tabs.

In order to do this, we had to change how Tabs were written in an app. Prior to Beta 14, Tabs would look like this:

```html
<ion-tabs>
  <ion-tab label="Home" icon="home" href="/tabs/(home:home)">
    <ion-router-outlet name="home"></ion-router-outlet>
  </ion-tab>
  <ion-tab label="About" icon="information-circle" href="/tabs/(about:about)">
    <ion-router-outlet name="about"></ion-router-outlet>
  </ion-tab>
  <ion-tab label="Contact" icon="contacts" href="/tabs/(contact:contact)">
    <ion-router-outlet name="contact"></ion-router-outlet>
  </ion-tab>
</ion-tabs>
```

Here, we have an `ion-tab` element that accepts an icon, a label, and a link to navigate to as properties. This is pretty much how Tabs have worked all the way back to Ionic 1. In Beta 14, we've removed some of the magic from Tabs which allows for more customization:

```html
<ion-tabs>
  <ion-tab-bar>

    <!-- No ion-tab, just a link that looks like a tab -->
    <ion-tab-button href="https://ionicframework.com">
      <!-- <a href="https://ionicframework.com"> -->
      <ion-icon name="globe"></ion-icon>
      <ion-label>Schedule</ion-label>
    </ion-tab-button>

    <!-- No ion-tab, just a button that looks like a tab -->
    <ion-tab-button (click)="openCamera()">
      <ion-icon name="camera"></ion-icon>
      <ion-label>Photo</ion-label>
    </ion-tab-button>

    <!-- Connected to ion-tab, on click will show the ion-tab with id home-view -->
    <ion-tab-button tab="home-view">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
  </ion-tab-bar>

  <ion-tab tab="home-view">
    <ion-content></ion-content>
    <!-- or -->
    <ion-nav></ion-nav>
    <!-- or -->
    <ion-router-outlet></ion-router-outlet>
  </ion-tab>

</ion-tabs>
```

There's a lot going on here, so let's break it down:

1. A single parent `ion-tabs` wraps the entire layout. Same as before.
2. A new element, `ion-tab-bar`, creates the Tab Bar which will contain buttons.
3. A new element, `ion-tab-button`, is used to create each button in the Tab Bar. These could be static links to different routes, buttons with click handlers on them, or link to whole tab views.
4. The `ion-tab` component becomes a separate container that has inline content (`ion-content`), a navigation component (`ion-nav`) or a router outlet (`ion-router-outlet`).

To connect the `ion-tab-button` to the `ion-tab`, the `tab` property must be added to both of these components. For example:

```html
<ion-tabs>
  <ion-tab-bar>
    <ion-tab-button tab="home-view"></ion-tab-button>
  </ion-tab-bar>

  <ion-tab tab="home-view"></ion-tab>
</ion-tabs>
```

Since the `tab` property is the same on the `ion-tab-button` and `ion-tab`, when the Tab Button is tapped, the `home-view` Tab will become active. This takes the magic out of Tabs while making the behavior between the tab buttons and the views much more explicit.

Some other benefits of this refactor include:

- Can now be written as a standalone Tab Bar (with no attached Tab)
- Works with a navigation component or a plain content element
- Works with shadow DOM and allows easy customization of the Tab Bar
- Gives full control over the elements inside of the Tab Bar
- Integrates nicely with other frameworks that have different ways of rendering element nodes

Lastly, this change also fixes some outstanding issues with Tabs, so we're excited to get this out to you all!


### Bug Fixes

* **action-sheet:** update Action Sheet design to match MD spec ([#16135](https://github.com/ionic-team/ionic/issues/16135)) ([068303d](https://github.com/ionic-team/ionic/commit/068303d))
* **alert:** match MD spec ([#16145](https://github.com/ionic-team/ionic/issues/16145)) ([287aec8](https://github.com/ionic-team/ionic/commit/287aec8))
* **alert:** update alert min/max interface ([#15987](https://github.com/ionic-team/ionic/issues/15987)) ([a0c60ff](https://github.com/ionic-team/ionic/commit/a0c60ff)), closes [#15986](https://github.com/ionic-team/ionic/issues/15986)
* **angular:** generate proxies for ion-tabbar ([#15954](https://github.com/ionic-team/ionic/issues/15954)) ([45b46b4](https://github.com/ionic-team/ionic/commit/45b46b4))
* **angular:** make sure angular form control onChange is fired when needed ([#16126](https://github.com/ionic-team/ionic/issues/16126)) ([d5f2e6f](https://github.com/ionic-team/ionic/commit/d5f2e6f))
* **badge:** match MD padding ([#16134](https://github.com/ionic-team/ionic/issues/16134)) ([615c518](https://github.com/ionic-team/ionic/commit/615c518))
* **button:** match MD spec timing, outline, hover ([#16160](https://github.com/ionic-team/ionic/issues/16160)) ([0faa355](https://github.com/ionic-team/ionic/commit/0faa355))
* **button:** match updated MD specs ([#16144](https://github.com/ionic-team/ionic/issues/16144)) ([e9579d5](https://github.com/ionic-team/ionic/commit/e9579d5))
* **card:** adjust styles to match MD ([#16093](https://github.com/ionic-team/ionic/issues/16093)) ([44b0eab](https://github.com/ionic-team/ionic/commit/44b0eab))
* **checkbox:** end position by default ([9da51b3](https://github.com/ionic-team/ionic/commit/9da51b3))
* **cordova:** fix resume event in cordova browser ([#15945](https://github.com/ionic-team/ionic/issues/15945)) ([4318520](https://github.com/ionic-team/ionic/commit/4318520)), closes [#15944](https://github.com/ionic-team/ionic/issues/15944)
* **datetime:** can participate in native <form> ([#16106](https://github.com/ionic-team/ionic/issues/16106)) ([aad7711](https://github.com/ionic-team/ionic/commit/aad7711)), closes [#16075](https://github.com/ionic-team/ionic/issues/16075)
* **datetime:** pickerOptions are all optional ([#16101](https://github.com/ionic-team/ionic/issues/16101)) ([f014181](https://github.com/ionic-team/ionic/commit/f014181)), closes [#16095](https://github.com/ionic-team/ionic/issues/16095)
* **fab-button:** use correct background in list and update the md icon color ([#16092](https://github.com/ionic-team/ionic/issues/16092)) ([9dfc863](https://github.com/ionic-team/ionic/commit/9dfc863)), closes [#16091](https://github.com/ionic-team/ionic/issues/16091)
* **header:** update box shadow to match MD spec ([#16149](https://github.com/ionic-team/ionic/issues/16149)) ([00544e9](https://github.com/ionic-team/ionic/commit/00544e9))
* **infinite-scroll:** disabled resets loading/busy state ([#16107](https://github.com/ionic-team/ionic/issues/16107)) ([33448c6](https://github.com/ionic-team/ionic/commit/33448c6)), closes [#15994](https://github.com/ionic-team/ionic/issues/15994)
* **inputs:** add z-index for all inputs ([92ee4ef](https://github.com/ionic-team/ionic/commit/92ee4ef)), closes [#16157](https://github.com/ionic-team/ionic/issues/16157)
* **inputs:** disabled handling ([#16071](https://github.com/ionic-team/ionic/issues/16071)) ([ef6895a](https://github.com/ionic-team/ionic/commit/ef6895a))
* **label:** do not animate float labels on initial load ([#16036](https://github.com/ionic-team/ionic/issues/16036)) ([e644fc9](https://github.com/ionic-team/ionic/commit/e644fc9))
* **note:** update note font size for MD ([#16088](https://github.com/ionic-team/ionic/issues/16088)) ([6f2b9b0](https://github.com/ionic-team/ionic/commit/6f2b9b0))
* **picker:** delay option animate until after options initialized ([#16037](https://github.com/ionic-team/ionic/issues/16037)) ([a74e565](https://github.com/ionic-team/ionic/commit/a74e565))
* **picker:** fix iOS picker options that shouldn't be showing ([#16055](https://github.com/ionic-team/ionic/issues/16055)) ([02ef52b](https://github.com/ionic-team/ionic/commit/02ef52b))
* **popover:** update border radius to match MD ([#16086](https://github.com/ionic-team/ionic/issues/16086)) ([9c733e9](https://github.com/ionic-team/ionic/commit/9c733e9))
* **popover:** update the box shadow to match MD spec ([#16089](https://github.com/ionic-team/ionic/issues/16089)) ([fdb7da9](https://github.com/ionic-team/ionic/commit/fdb7da9))
* **radio:** match MD sizing ([#16087](https://github.com/ionic-team/ionic/issues/16087)) ([6723248](https://github.com/ionic-team/ionic/commit/6723248))
* **range:** match MD spec ([#16150](https://github.com/ionic-team/ionic/issues/16150)) ([b2f493f](https://github.com/ionic-team/ionic/commit/b2f493f))
* **reorder-group:** event bubbles up ([#16030](https://github.com/ionic-team/ionic/issues/16030)) ([ce80b24](https://github.com/ionic-team/ionic/commit/ce80b24)), closes [#16010](https://github.com/ionic-team/ionic/issues/16010)
* **screenshot:** update screenshot ci ([#15969](https://github.com/ionic-team/ionic/issues/15969)) ([80b5c8c](https://github.com/ionic-team/ionic/commit/80b5c8c))
* **searchbar:** do not animate during initial load ([#16147](https://github.com/ionic-team/ionic/issues/16147)) ([e94b522](https://github.com/ionic-team/ionic/commit/e94b522))
* **tab-bar:** align tab text to the center ([#16130](https://github.com/ionic-team/ionic/issues/16130)) ([67eb7cf](https://github.com/ionic-team/ionic/commit/67eb7cf)), closes [#15273](https://github.com/ionic-team/ionic/issues/15273)
* **tabs:** name prop is not longer used ([6d11cc1](https://github.com/ionic-team/ionic/commit/6d11cc1))
* **theming:** update global css variable naming and default values  ([#16003](https://github.com/ionic-team/ionic/issues/16003)) ([b2021fd](https://github.com/ionic-team/ionic/commit/b2021fd)), closes [#15989](https://github.com/ionic-team/ionic/issues/15989) [#15559](https://github.com/ionic-team/ionic/issues/15559)
* **toggle:** fix box-shadow overflow in toggle ([#15955](https://github.com/ionic-team/ionic/issues/15955)) ([8a4dc74](https://github.com/ionic-team/ionic/commit/8a4dc74)), closes [#14626](https://github.com/ionic-team/ionic/issues/14626)
* **angular:** fix ngModel accessor ([fab8b60](https://github.com/ionic-team/ionic/commit/fab8b60))
* **color:** edge currentColor bug ([#16177](https://github.com/ionic-team/ionic/issues/16177)) ([fce30eb](https://github.com/ionic-team/ionic/commit/fce30eb)), closes [#16168](https://github.com/ionic-team/ionic/issues/16168)
* **searchbar:** fix crash on cancel event ([#16181](https://github.com/ionic-team/ionic/issues/16181)) ([9c79d98](https://github.com/ionic-team/ionic/commit/9c79d98)), closes [#16143](https://github.com/ionic-team/ionic/issues/16143)
* **tab-bar:** safe-bottom area is applied correctly ([#16179](https://github.com/ionic-team/ionic/issues/16179)) ([1532bd2](https://github.com/ionic-team/ionic/commit/1532bd2)), closes [#16175](https://github.com/ionic-team/ionic/issues/16175)
* **tabs:** use slot instead of placement ([72f0a76](https://github.com/ionic-team/ionic/commit/72f0a76))


### Features

* **toast:** add "color" prop ([#16100](https://github.com/ionic-team/ionic/issues/16100)) ([c982856](https://github.com/ionic-team/ionic/commit/c982856)), closes [#16099](https://github.com/ionic-team/ionic/issues/16099)


### Performance Improvements

* **angular:** disable async queue ([#16118](https://github.com/ionic-team/ionic/issues/16118)) ([c2f5803](https://github.com/ionic-team/ionic/commit/c2f5803))



<a name="4.0.0-beta.13"></a>
# [4.0.0-beta.13](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.12...v4.0.0-beta.13) (2018-10-14)


### Bug Fixes

* **all:** avoid using focus() since it conflicts with HTMLElement ([5560dcd](https://github.com/ionic-team/ionic/commit/5560dcd)), closes [#15810](https://github.com/ionic-team/ionic/issues/15810)
* **all:** disable animations in e2e tests ([9d109d6](https://github.com/ionic-team/ionic/commit/9d109d6))
* **all:** docs for all missing props ([a72fced](https://github.com/ionic-team/ionic/commit/a72fced))
* **angular:** add "main" to package.json as workaround for webstorm ([c57a7cc](https://github.com/ionic-team/ionic/commit/c57a7cc))
* **angular:** backButton event uses ionBackButton ([0337c7f](https://github.com/ionic-team/ionic/commit/0337c7f))
* **angular:** only bypass zone in high-rate events ([f63c0f5](https://github.com/ionic-team/ionic/commit/f63c0f5)), closes [#15765](https://github.com/ionic-team/ionic/issues/15765)
* **button:** use class instead of reflect ([e189cc6](https://github.com/ionic-team/ionic/commit/e189cc6)), closes [#15623](https://github.com/ionic-team/ionic/issues/15623)
* **card:** include card-header in current color ([b5e39c8](https://github.com/ionic-team/ionic/commit/b5e39c8))
* **card:** update currentColor to use contrast color ([a9a29f7](https://github.com/ionic-team/ionic/commit/a9a29f7))
* **card-header:** get color property working ([92514b3](https://github.com/ionic-team/ionic/commit/92514b3)), closes [#14723](https://github.com/ionic-team/ionic/issues/14723) [#14853](https://github.com/ionic-team/ionic/issues/14853)
* **col:** fix CSS is undefined error on IE11 ([#15882](https://github.com/ionic-team/ionic/issues/15882)) ([06a3028](https://github.com/ionic-team/ionic/commit/06a3028))
* **content:** iOS should not have scroll in desktop ([8cb1886](https://github.com/ionic-team/ionic/commit/8cb1886)), closes [#15858](https://github.com/ionic-team/ionic/issues/15858)
* **css:** avoid cleancss bug ([f87d4bf](https://github.com/ionic-team/ionic/commit/f87d4bf)), closes [#15807](https://github.com/ionic-team/ionic/issues/15807)
* **css:** remove selection color ([6b0d812](https://github.com/ionic-team/ionic/commit/6b0d812))
* **docs:** Fix commit link on CONTRIBUTING.md ([#15834](https://github.com/ionic-team/ionic/issues/15834)) ([fe0c3b4](https://github.com/ionic-team/ionic/commit/fe0c3b4))
* **fab-button:** add and document css properties ([098bd82](https://github.com/ionic-team/ionic/commit/098bd82)), closes [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **fab-button:** ripple-effect in safari ([844c33a](https://github.com/ionic-team/ionic/commit/844c33a)), closes [#15768](https://github.com/ionic-team/ionic/issues/15768)
* **hide/show:** fix show-when/hide-when ([fd01308](https://github.com/ionic-team/ionic/commit/fd01308)), closes [#15813](https://github.com/ionic-team/ionic/issues/15813)
* **infinite-scroll:** implements position="top" ([b4a73ad](https://github.com/ionic-team/ionic/commit/b4a73ad)), closes [#15481](https://github.com/ionic-team/ionic/issues/15481)
* **input:** add and document custom properties ([23df042](https://github.com/ionic-team/ionic/commit/23df042)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **input:** tabindex or tab in ion-input do not work with clearInput fix ([e916500](https://github.com/ionic-team/ionic/commit/e916500))
* **ion-datetime:** keep the model value consistently an ISO string ([#15907](https://github.com/ionic-team/ionic/issues/15907)) ([b46052b](https://github.com/ionic-team/ionic/commit/b46052b))
* **item:** add input highlight using an absolute div ([#15856](https://github.com/ionic-team/ionic/issues/15856)) ([f885f7d](https://github.com/ionic-team/ionic/commit/f885f7d)), closes [#14036](https://github.com/ionic-team/ionic/issues/14036) [#9639](https://github.com/ionic-team/ionic/issues/9639) [#14952](https://github.com/ionic-team/ionic/issues/14952) [#15690](https://github.com/ionic-team/ionic/issues/15690)
* **item:** detail context based in text color ([e51f1f3](https://github.com/ionic-team/ionic/commit/e51f1f3))
* **label:** add color variable, examples to test and document ([b485eba](https://github.com/ionic-team/ionic/commit/b485eba)), closes [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **list:** don't show inset lines for full line list ([6eae95a](https://github.com/ionic-team/ionic/commit/6eae95a))
* **menu:** menu registers itself before it's ready ([08beee3](https://github.com/ionic-team/ionic/commit/08beee3))
* **menu:** overlays can block menu closing ([11aa241](https://github.com/ionic-team/ionic/commit/11aa241)), closes [#15880](https://github.com/ionic-team/ionic/issues/15880)
* **menu:** wait until all menus are ready ([a5c2cc1](https://github.com/ionic-team/ionic/commit/a5c2cc1)), closes [#15727](https://github.com/ionic-team/ionic/issues/15727)
* **menu-button:** color ([386cf82](https://github.com/ionic-team/ionic/commit/386cf82)), closes [#15546](https://github.com/ionic-team/ionic/issues/15546) [#15545](https://github.com/ionic-team/ionic/issues/15545)
* **menu-button:** Not visible if toolbar has primary color ([#15847](https://github.com/ionic-team/ionic/issues/15847)) ([e2ea08b](https://github.com/ionic-team/ionic/commit/e2ea08b))
* **modal/popover:** lifecycle events ([19c449e](https://github.com/ionic-team/ionic/commit/19c449e)), closes [#15806](https://github.com/ionic-team/ionic/issues/15806)
* **picker:** stop animation when it's closed ([e81af2d](https://github.com/ionic-team/ionic/commit/e81af2d)), closes [#15854](https://github.com/ionic-team/ionic/issues/15854)
* **popover:** showBackdrop hides backdrop ([f00be0d](https://github.com/ionic-team/ionic/commit/f00be0d)), closes [#15878](https://github.com/ionic-team/ionic/issues/15878)
* **reorder-group:** delegate dom reordering ([5f65942](https://github.com/ionic-team/ionic/commit/5f65942)), closes [#15836](https://github.com/ionic-team/ionic/issues/15836)
* **slides:** disable autoplay by default ([db6ddb0](https://github.com/ionic-team/ionic/commit/db6ddb0)), closes [#15766](https://github.com/ionic-team/ionic/issues/15766)
* **tabbar:** css variables assigned to the host ([545db2e](https://github.com/ionic-team/ionic/commit/545db2e))
* **tabs:** badgeColor works again ([3d98587](https://github.com/ionic-team/ionic/commit/3d98587)), closes [#15559](https://github.com/ionic-team/ionic/issues/15559) [#14840](https://github.com/ionic-team/ionic/issues/14840)
* **tabs:** fix async deadlock ([905c7db](https://github.com/ionic-team/ionic/commit/905c7db))
* **title:** allow color to be set for title without attribute ([a9b3064](https://github.com/ionic-team/ionic/commit/a9b3064)), closes [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **toggle:** improve animation motion ([5330574](https://github.com/ionic-team/ionic/commit/5330574))


### Features

* **angular:** observer based api to override hardware back button ([6a5aec8](https://github.com/ionic-team/ionic/commit/6a5aec8)), closes [#15820](https://github.com/ionic-team/ionic/issues/15820)
* **menu:** add new lifeycle events ([64b52b5](https://github.com/ionic-team/ionic/commit/64b52b5))
* **nav:** animation is customizable ([24f3373](https://github.com/ionic-team/ionic/commit/24f3373)), closes [#15851](https://github.com/ionic-team/ionic/issues/15851)
* **overlays:** expose animation customization ([dc976cc](https://github.com/ionic-team/ionic/commit/dc976cc))
* initial vue support ([73cff0c](https://github.com/ionic-team/ionic/commit/73cff0c))


### Performance Improvements

* prevent unnecesary event listener changes ([a999c1f](https://github.com/ionic-team/ionic/commit/a999c1f))



<a name="4.0.0-beta.12"></a>
# [4.0.0-beta.12](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.11...v4.0.0-beta.12) (2018-09-26)


### Bug Fixes

* **action-sheet:** allow async button handler returned value ([3d3e6a4](https://github.com/ionic-team/ionic/commit/3d3e6a4))
* **alert:** check if value is null instead of truthy ([799f0d7](https://github.com/ionic-team/ionic/commit/799f0d7)), closes [#15420](https://github.com/ionic-team/ionic/issues/15420)
* **all:** gesture controller can block scrolling ([633360f](https://github.com/ionic-team/ionic/commit/633360f)), closes [#15725](https://github.com/ionic-team/ionic/issues/15725)
* **all:** lint errors ([f8eafa7](https://github.com/ionic-team/ionic/commit/f8eafa7))
* **all:** safe margins for fab, item-header, tabbar ([62eff0a](https://github.com/ionic-team/ionic/commit/62eff0a))
* **angular:** add event listener on window ([#15628](https://github.com/ionic-team/ionic/issues/15628)) ([7bd33a7](https://github.com/ionic-team/ionic/commit/7bd33a7))
* **angular:** import icons using webpack apis ([b71b36c](https://github.com/ionic-team/ionic/commit/b71b36c))
* **angular:** ionic/core is only a dep ([236d8a4](https://github.com/ionic-team/ionic/commit/236d8a4))
* **angular:** value is updates based in ionChange ([e18f8bf](https://github.com/ionic-team/ionic/commit/e18f8bf)), closes [#15722](https://github.com/ionic-team/ionic/issues/15722)
* **app:** statusTap and hardwareGB can be activated with config ([c048f9f](https://github.com/ionic-team/ionic/commit/c048f9f)), closes [#15617](https://github.com/ionic-team/ionic/issues/15617)
* **back-button:** add and document custom properties ([b3aebb8](https://github.com/ionic-team/ionic/commit/b3aebb8)), closes [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14853](https://github.com/ionic-team/ionic/issues/14853)
* **back-button:** default md color is inhered ([d0867b5](https://github.com/ionic-team/ionic/commit/d0867b5))
* **button:** default button width to auto to avoid inheriting ([bac49ca](https://github.com/ionic-team/ionic/commit/bac49ca)), closes [#15522](https://github.com/ionic-team/ionic/issues/15522)
* **button:** disable :hover on non supported devices ([#15705](https://github.com/ionic-team/ionic/issues/15705)) ([67eb661](https://github.com/ionic-team/ionic/commit/67eb661))
* **button:** disable pointer events in toolbar buttons ([d145cae](https://github.com/ionic-team/ionic/commit/d145cae)), closes [#15623](https://github.com/ionic-team/ionic/issues/15623)
* **buttons:** fix activated, position, animation ([9d6169a](https://github.com/ionic-team/ionic/commit/9d6169a))
* **color:** do not accept empty color ([ede5525](https://github.com/ionic-team/ionic/commit/ede5525)), closes [#15732](https://github.com/ionic-team/ionic/issues/15732)
* **content:** apply background to the inner scroll element ([f68c457](https://github.com/ionic-team/ionic/commit/f68c457)), closes [#15635](https://github.com/ionic-team/ionic/issues/15635)
* **content:** nested content ([5f5ba66](https://github.com/ionic-team/ionic/commit/5f5ba66)), closes [#15680](https://github.com/ionic-team/ionic/issues/15680)
* **datetime:** check for null instead of undefined ([407b147](https://github.com/ionic-team/ionic/commit/407b147)), closes [#15605](https://github.com/ionic-team/ionic/issues/15605)
* **datetime:** convert to shadow and fix broken styles ([fa77017](https://github.com/ionic-team/ionic/commit/fa77017)), closes [#15547](https://github.com/ionic-team/ionic/issues/15547) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **fab:** do not reset fab activated if it's false ([d619d8d](https://github.com/ionic-team/ionic/commit/d619d8d))
* **gestures:** change itemSliding gesture priority ([48927e6](https://github.com/ionic-team/ionic/commit/48927e6)), closes [#15608](https://github.com/ionic-team/ionic/issues/15608)
* **input:** fix text type for select change event ([694b6a8](https://github.com/ionic-team/ionic/commit/694b6a8))
* **item:** add the multiple inputs class to fix select/datetime in item ([1cd792e](https://github.com/ionic-team/ionic/commit/1cd792e)), closes [#15401](https://github.com/ionic-team/ionic/issues/15401)
* **item-divider:** add and document custom properties ([06cb138](https://github.com/ionic-team/ionic/commit/06cb138)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **item-option:** add and document custom properties ([2a040e0](https://github.com/ionic-team/ionic/commit/2a040e0)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14943](https://github.com/ionic-team/ionic/issues/14943)
* **menu:** crash when menu if forcedClosed ([22e15b4](https://github.com/ionic-team/ionic/commit/22e15b4))
* **menu:** opening a menu autocloses any opened ones ([8796f9f](https://github.com/ionic-team/ionic/commit/8796f9f))
* **menu-controller:** expose registerAnimation ([29d00da](https://github.com/ionic-team/ionic/commit/29d00da)), closes [#15701](https://github.com/ionic-team/ionic/issues/15701)
* **overlay:** register backbutton handler only when needed ([#15615](https://github.com/ionic-team/ionic/issues/15615)) ([b2b5d93](https://github.com/ionic-team/ionic/commit/b2b5d93)), closes [#15601](https://github.com/ionic-team/ionic/issues/15601)
* **platform:** using desktop instead of window ([c8de84d](https://github.com/ionic-team/ionic/commit/c8de84d))
* add safe area cutouts ([#15750](https://github.com/ionic-team/ionic/issues/15750)) ([a3c85ae](https://github.com/ionic-team/ionic/commit/a3c85ae))
* **radio:** add css variables to make it customizable ([9ec8e74](https://github.com/ionic-team/ionic/commit/9ec8e74)), closes [#15729](https://github.com/ionic-team/ionic/issues/15729)
* **select:** add position styles to work as standalone ([224b4f8](https://github.com/ionic-team/ionic/commit/224b4f8))
* **select:** placeholder can be reset if value = null ([602f668](https://github.com/ionic-team/ionic/commit/602f668))
* **select:** show placeholder when multiple is empty ([29862e8](https://github.com/ionic-team/ionic/commit/29862e8))
* **select-popover:** add scoped to apply proper styles to list ([fd1b636](https://github.com/ionic-team/ionic/commit/fd1b636))
* **slides:** add back zoom plugin for swiper ([6890ecc](https://github.com/ionic-team/ionic/commit/6890ecc)), closes [#15676](https://github.com/ionic-team/ionic/issues/15676)
* **slides:** fix mutable options ([681981f](https://github.com/ionic-team/ionic/commit/681981f))
* **tap-click:** prevent activated while scrolling ([7f38d37](https://github.com/ionic-team/ionic/commit/7f38d37)), closes [#15752](https://github.com/ionic-team/ionic/issues/15752)
* **toast:** button color is contrast ([f65ec10](https://github.com/ionic-team/ionic/commit/f65ec10)), closes [#15737](https://github.com/ionic-team/ionic/issues/15737)


### Features

* **animation:** ability to disable animations w/ querystring ([734b222](https://github.com/ionic-team/ionic/commit/734b222))
* **app:** adds _forceStatusbarPadding for ionic lab ([0379977](https://github.com/ionic-team/ionic/commit/0379977))
* **ripple:** ability to disable ripple effect w/ querystring ([efca0ae](https://github.com/ionic-team/ionic/commit/efca0ae))
* **screenshot:** update to use stencil e2e screenshot testing ([43b9045](https://github.com/ionic-team/ionic/commit/43b9045))


### Reverts

* **content:** block scrolling in ion-content ([9badb08](https://github.com/ionic-team/ionic/commit/9badb08))



<a name="4.0.0-beta.11"></a>
# [4.0.0-beta.11](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.10...v4.0.0-beta.11) (2018-09-14)


### Bug Fixes

* **slides:** swiper must be a vendor ([3435473](https://github.com/ionic-team/ionic/commit/3435473))



<a name="4.0.0-beta.10"></a>
# [4.0.0-beta.10](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.9...v4.0.0-beta.10) (2018-09-14)


### Bug Fixes

* **animation:** always call onFinish() ([c23c5a4](https://github.com/ionic-team/ionic/commit/c23c5a4))
* **button:** vanilla color is usable ([b8b9b83](https://github.com/ionic-team/ionic/commit/b8b9b83))
* **segment:** unselected color ([b9e42eb](https://github.com/ionic-team/ionic/commit/b9e42eb))
* **slides:** swiper is not required as dependency ([29f324b](https://github.com/ionic-team/ionic/commit/29f324b))



<a name="4.0.0-beta.9"></a>
# [4.0.0-beta.9](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.7...v4.0.0-beta.9) (2018-09-14)


### Bug Fixes

* **anchor:** make it activatable ([6c62e6c](https://github.com/ionic-team/ionic/commit/6c62e6c))
* **angular:** only append the component when the parent element is not the container element ([6d6f70c](https://github.com/ionic-team/ionic/commit/6d6f70c)), closes [#14737](https://github.com/ionic-team/ionic/issues/14737)
* **back-button:** subscribe to body ([37c9be7](https://github.com/ionic-team/ionic/commit/37c9be7))
* **button:** add custom properties and remove --ion-color overrides ([#15463](https://github.com/ionic-team/ionic/issues/15463)) ([3af4361](https://github.com/ionic-team/ionic/commit/3af4361)), closes [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **core:** matchBreakpoint will return true if breakPoint is empty string ([#15498](https://github.com/ionic-team/ionic/issues/15498)) ([b362b0a](https://github.com/ionic-team/ionic/commit/b362b0a)), closes [#15495](https://github.com/ionic-team/ionic/issues/15495)
* **esm:** reorganiza exports ([bb19243](https://github.com/ionic-team/ionic/commit/bb19243))
* **fab-button:** add routerDirection ([2398634](https://github.com/ionic-team/ionic/commit/2398634)), closes [#15551](https://github.com/ionic-team/ionic/issues/15551)
* **input:** value might be null/undefined ([83543b7](https://github.com/ionic-team/ionic/commit/83543b7))
* **item:** update hostContext to use ion-item element ([21d1f2e](https://github.com/ionic-team/ionic/commit/21d1f2e))
* **item-option:** add activated and ripple to button ([78e2a0a](https://github.com/ionic-team/ionic/commit/78e2a0a)), closes [#14943](https://github.com/ionic-team/ionic/issues/14943)
* **item-option:** enable ripple-effect ([428a5da](https://github.com/ionic-team/ionic/commit/428a5da))
* **item-sliding:** make sure options are ready ([7f59f91](https://github.com/ionic-team/ionic/commit/7f59f91))
* **list-header:** add and document custom properties ([5ccc1fd](https://github.com/ionic-team/ionic/commit/5ccc1fd)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **menu:** ios styles ([281f9a3](https://github.com/ionic-team/ionic/commit/281f9a3))
* **nav:** matches() function ([9420b88](https://github.com/ionic-team/ionic/commit/9420b88))
* **overlay:** animation can be interrupted ([ca58664](https://github.com/ionic-team/ionic/commit/ca58664)), closes [#15506](https://github.com/ionic-team/ionic/issues/15506)
* **overlay:** only register backButton listener once ([75c2d74](https://github.com/ionic-team/ionic/commit/75c2d74))
* **popover:** content sizing, scoped css ([51d4e08](https://github.com/ionic-team/ionic/commit/51d4e08)), closes [#15237](https://github.com/ionic-team/ionic/issues/15237) [#15589](https://github.com/ionic-team/ionic/issues/15589) [#15331](https://github.com/ionic-team/ionic/issues/15331)
* **popover:** remove unneeded code ([b26c017](https://github.com/ionic-team/ionic/commit/b26c017))
* **radio:** add and document custom properties ([0f9a7b4](https://github.com/ionic-team/ionic/commit/0f9a7b4)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **range:** update range ratio when new min/max are passed ([#15512](https://github.com/ionic-team/ionic/issues/15512)) ([f62601f](https://github.com/ionic-team/ionic/commit/f62601f)), closes [#15511](https://github.com/ionic-team/ionic/issues/15511)
* **searchbar:** add and document custom properties ([7f57e02](https://github.com/ionic-team/ionic/commit/7f57e02)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **searchbar:** inherit color from color toolbar ([3042f57](https://github.com/ionic-team/ionic/commit/3042f57))
* **searchbar:** ionCancel event ([20a7599](https://github.com/ionic-team/ionic/commit/20a7599)), closes [#15476](https://github.com/ionic-team/ionic/issues/15476)
* **segment:** fix css var + host-context() ([49ab065](https://github.com/ionic-team/ionic/commit/49ab065))
* **slides:** correct order of parameters ([6442dfc](https://github.com/ionic-team/ionic/commit/6442dfc)), closes [#15407](https://github.com/ionic-team/ionic/issues/15407)
* **slides:** Methods wait for execution until swiper is initialized ([#15576](https://github.com/ionic-team/ionic/issues/15576)) ([ea01900](https://github.com/ionic-team/ionic/commit/ea01900))
* **slides:** Update swiperOptions default to match version 4 of Swiper ([#15578](https://github.com/ionic-team/ionic/issues/15578)) ([db35af2](https://github.com/ionic-team/ionic/commit/db35af2))
* **slides:** Updated lockSwipes methods to match the new swiper.js API ([#15469](https://github.com/ionic-team/ionic/issues/15469)) ([efb99cb](https://github.com/ionic-team/ionic/commit/efb99cb))
* **sliding-item:** swipe event ([127da1a](https://github.com/ionic-team/ionic/commit/127da1a))
* **test:** treeshake check runs last ([b56f136](https://github.com/ionic-team/ionic/commit/b56f136))
* **test:** workaround for nav tests ([a4b1179](https://github.com/ionic-team/ionic/commit/a4b1179))
* **toast:** adds role timeout and cancel ([2f2a255](https://github.com/ionic-team/ionic/commit/2f2a255)), closes [#15477](https://github.com/ionic-team/ionic/issues/15477)
* **toast:** render on top ([ac42180](https://github.com/ionic-team/ionic/commit/ac42180))
* **toggle:** empty hidden input value when not checked ([1f19862](https://github.com/ionic-team/ionic/commit/1f19862))
* handle failure in hardware back button ([6da765b](https://github.com/ionic-team/ionic/commit/6da765b))
* remove argument-less catch() ([ff919de](https://github.com/ionic-team/ionic/commit/ff919de))


### Features

* **angular:** integrate back-button with ng router ([1bcca01](https://github.com/ionic-team/ionic/commit/1bcca01))
* **app:** hardware back button support ([dfac9dc](https://github.com/ionic-team/ionic/commit/dfac9dc))
* **overlays:** close overlay with back-button ([4ccbefa](https://github.com/ionic-team/ionic/commit/4ccbefa))
* **router:** add support for relative paths ([b28aeab](https://github.com/ionic-team/ionic/commit/b28aeab)), closes [#15499](https://github.com/ionic-team/ionic/issues/15499)
* **virtual-scroller:** add <template> support ([d40d0a7](https://github.com/ionic-team/ionic/commit/d40d0a7))


### Performance Improvements

* **router:** prevent initializaing page twice ([3dd9604](https://github.com/ionic-team/ionic/commit/3dd9604))
* **slides:** tree-shake dependency ([9d3a259](https://github.com/ionic-team/ionic/commit/9d3a259))



<a name="4.0.0-beta.8"></a>
# [4.0.0-beta.8](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2018-09-06)


### Bug Fixes

* **button:** add custom properties and remove --ion-color overrides ([#15463](https://github.com/ionic-team/ionic/issues/15463)) ([3af4361](https://github.com/ionic-team/ionic/commit/3af4361)), closes [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **menu:** ios styles ([281f9a3](https://github.com/ionic-team/ionic/commit/281f9a3))
* **radio:** add and document custom properties ([0f9a7b4](https://github.com/ionic-team/ionic/commit/0f9a7b4)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **searchbar:** inherit color from color toolbar ([3042f57](https://github.com/ionic-team/ionic/commit/3042f57))
* **slides:** correct order of parameters ([6442dfc](https://github.com/ionic-team/ionic/commit/6442dfc)), closes [#15407](https://github.com/ionic-team/ionic/issues/15407)
* **test:** treeshake check runs last ([b56f136](https://github.com/ionic-team/ionic/commit/b56f136))
* **test:** workaround for nav tests ([a4b1179](https://github.com/ionic-team/ionic/commit/a4b1179))
* **toggle:** empty hidden input value when not checked ([1f19862](https://github.com/ionic-team/ionic/commit/1f19862))


### Features

* **angular:** integrate back-button with ng router ([1bcca01](https://github.com/ionic-team/ionic/commit/1bcca01))
* **app:** hardware back button support ([dfac9dc](https://github.com/ionic-team/ionic/commit/dfac9dc))
* **overlays:** close overlay with back-button ([4ccbefa](https://github.com/ionic-team/ionic/commit/4ccbefa))
* **virtual-scroller:** add <template> support ([d40d0a7](https://github.com/ionic-team/ionic/commit/d40d0a7))



<a name="4.0.0-beta.7"></a>
# [4.0.0-beta.7](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2018-08-30)


### Bug Fixes

* **list:** add closeSlidingItems() ([81fbbb8](https://github.com/ionic-team/ionic/commit/81fbbb8)), closes [#15378](https://github.com/ionic-team/ionic/issues/15378)
* **menu:** await animation check ([f00db59](https://github.com/ionic-team/ionic/commit/f00db59)), closes [#15377](https://github.com/ionic-team/ionic/issues/15377)
* **range:** add and document custom properties ([cf35445](https://github.com/ionic-team/ionic/commit/cf35445)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **slides:** isEnd() returns a boolean ([771c517](https://github.com/ionic-team/ionic/commit/771c517)), closes [#15376](https://github.com/ionic-team/ionic/issues/15376)



<a name="4.0.0-beta.6"></a>
# [4.0.0-beta.6](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2018-08-29)

### Breaking Changes

- All methods of all ionic components return a promise.
- `colors.css` has been renamed to `core.css`, the global stylesheet needs to be updated:

#### Stencil

```diff
+ @import "~@ionic/core/css/core.css";
  @import "~@ionic/core/css/normalize.css";
  @import "~@ionic/core/css/structure.css";
  @import "~@ionic/core/css/typography.css";
- @import "~@ionic/core/css/colors.css";

  @import "~@ionic/core/css/padding.css";
  @import "~@ionic/core/css/float-elements.css";
  @import "~@ionic/core/css/text-alignment.css";
  @import "~@ionic/core/css/text-transformation.css";
  @import "~@ionic/core/css/flex-utils.css";
```

#### Angular

```diff
+ @import "~@ionic/angular/css/core.css";
  @import "~@ionic/angular/css/normalize.css";
  @import "~@ionic/angular/css/structure.css";
  @import "~@ionic/angular/css/typography.css";
- @import "~@ionic/angular/css/colors.css";

  @import "~@ionic/angular/css/padding.css";
  @import "~@ionic/angular/css/float-elements.css";
  @import "~@ionic/angular/css/text-alignment.css";
  @import "~@ionic/angular/css/text-transformation.css";
  @import "~@ionic/angular/css/flex-utils.css";
```

### Bug Fixes

* **alert:** header is not mandatory ([1f71f76](https://github.com/ionic-team/ionic/commit/1f71f76))
* **alert:** name is non-null ([2268346](https://github.com/ionic-team/ionic/commit/2268346))
* **alert:** type and name props are optional ([#14815](https://github.com/ionic-team/ionic/issues/14815)) ([99a2925](https://github.com/ionic-team/ionic/commit/99a2925))
* **angular:** NavController signatures ([6fdeb31](https://github.com/ionic-team/ionic/commit/6fdeb31)), closes [#15353](https://github.com/ionic-team/ionic/issues/15353)
* **angular:** overlay not found ([8dfc52f](https://github.com/ionic-team/ionic/commit/8dfc52f)), closes [#15349](https://github.com/ionic-team/ionic/issues/15349)
* **angular:** platform does not crash ([82f9fd4](https://github.com/ionic-team/ionic/commit/82f9fd4)), closes [#15348](https://github.com/ionic-team/ionic/issues/15348)
* **angular:** virtual-scroll ([f9bf5c0](https://github.com/ionic-team/ionic/commit/f9bf5c0)), closes [#15355](https://github.com/ionic-team/ionic/issues/15355)
* **css:** add core.css ([#15220](https://github.com/ionic-team/ionic/issues/15220)) ([096d9a7](https://github.com/ionic-team/ionic/commit/096d9a7)), closes [#15170](https://github.com/ionic-team/ionic/issues/15170)
* **datetime:** fix year to allow current and max year ([f30ae88](https://github.com/ionic-team/ionic/commit/f30ae88)), closes [#14895](https://github.com/ionic-team/ionic/issues/14895)
* **grid:** working check for CSS custom variables in Safari ([#15228](https://github.com/ionic-team/ionic/issues/15228)) ([baefda3](https://github.com/ionic-team/ionic/commit/baefda3))
* **ion-reorder-group:** adds ionItemReorder event  ([7fc170c](https://github.com/ionic-team/ionic/commit/7fc170c)), closes [#14640](https://github.com/ionic-team/ionic/issues/14640)
* **overlay:** overlay is not hidden ([89ba55d](https://github.com/ionic-team/ionic/commit/89ba55d))
* **overlay:** overlays are hidden until presented ([ba428cd](https://github.com/ionic-team/ionic/commit/ba428cd)), closes [#15345](https://github.com/ionic-team/ionic/issues/15345)
* **overlays:** expose mode, id, keyboardClose ([cc960c3](https://github.com/ionic-team/ionic/commit/cc960c3)), closes [#15366](https://github.com/ionic-team/ionic/issues/15366)
* **radio-group:** accept any value ([16452b2](https://github.com/ionic-team/ionic/commit/16452b2)), closes [#15334](https://github.com/ionic-team/ionic/issues/15334)
* **segment:** set --color-checked in md color toolbar ([5d32115](https://github.com/ionic-team/ionic/commit/5d32115)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **toast:** add position middle ([25479e4](https://github.com/ionic-team/ionic/commit/25479e4))



<a name="4.0.0-beta.5"></a>
# [4.0.0-beta.5](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2018-08-27)

### Bug Fixes

- Ionic/angular compiler error

### Breaking Changes

#### NavController

Changes are required to accommodate some new useful routing APIs and match the ng router ones closely:

```
goForward() -> navigateForward()
goBack() -> navigateBack()
goRoot() -> navigateRoot()
```

#### Dependencies

The following dependencies need to be updated to resolve build errors

- Update Angular to 6.1 or higher
  - [Angular changelog](https://github.com/angular/angular/blob/master/CHANGELOG.md#610-2018-07-25)
- Update Typescript to 2.9.2
  - `"typescript": "~2.9.2"`


<a name="4.0.0-beta.4"></a>
# [4.0.0-beta.4](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2018-08-27)


### Bug Fixes

* **alert:** remove unneeded warning ([8447f28](https://github.com/ionic-team/ionic/commit/8447f28))
* **all:** add customization of font-style ([c957ea6](https://github.com/ionic-team/ionic/commit/c957ea6))
* **angular:** back navigation and back-button play better ([#15293](https://github.com/ionic-team/ionic/issues/15293)) ([9ddfb1b](https://github.com/ionic-team/ionic/commit/9ddfb1b)), closes [#15290](https://github.com/ionic-team/ionic/issues/15290)
* **angular:** expose router.navigate() ([7aa4f13](https://github.com/ionic-team/ionic/commit/7aa4f13)), closes [#15332](https://github.com/ionic-team/ionic/issues/15332)
* **app:** --ion-safe-area-right typo ([77ca2bd](https://github.com/ionic-team/ionic/commit/77ca2bd))
* **app:** listen statusTap event ([dc82675](https://github.com/ionic-team/ionic/commit/dc82675))
* **app:** statusbarPadding config is a boolean ([b387de4](https://github.com/ionic-team/ionic/commit/b387de4))
* **build:** do not export in component modules ([da2dc7b](https://github.com/ionic-team/ionic/commit/da2dc7b))
* **buttons:** margin between buttons ([359c47f](https://github.com/ionic-team/ionic/commit/359c47f))
* **card:** remove calculated width to work with dynamic margin ([059d365](https://github.com/ionic-team/ionic/commit/059d365)), closes [#15223](https://github.com/ionic-team/ionic/issues/15223)
* **chip:** add and document custom properties ([07e99a1](https://github.com/ionic-team/ionic/commit/07e99a1)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14853](https://github.com/ionic-team/ionic/issues/14853) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **config:** scrollAssist boolean definition ([#15203](https://github.com/ionic-team/ionic/issues/15203)) ([2af72fa](https://github.com/ionic-team/ionic/commit/2af72fa))
* **config:** using sessionStorage is not safe ([091b433](https://github.com/ionic-team/ionic/commit/091b433))
* **content:** document and add custom properties ([0372aec](https://github.com/ionic-team/ionic/commit/0372aec)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14853](https://github.com/ionic-team/ionic/issues/14853)
* **content:** fix scroll events ([962578e](https://github.com/ionic-team/ionic/commit/962578e)), closes [#15244](https://github.com/ionic-team/ionic/issues/15244)
* **content:** scrollToPoint reliability ([e0f1259](https://github.com/ionic-team/ionic/commit/e0f1259)), closes [#15257](https://github.com/ionic-team/ionic/issues/15257)
* **datetime:** allow values to be zero ([#14480](https://github.com/ionic-team/ionic/issues/14480)) ([e0b8e24](https://github.com/ionic-team/ionic/commit/e0b8e24))
* **docs:** add missed menu title in the list ([#15300](https://github.com/ionic-team/ionic/issues/15300)) ([5f3c7cd](https://github.com/ionic-team/ionic/commit/5f3c7cd))
* **docs:** use shape property to get round buttons ([#15321](https://github.com/ionic-team/ionic/issues/15321)) ([d4c812f](https://github.com/ionic-team/ionic/commit/d4c812f))
* **docs:** use shape property to get round buttons ([#15322](https://github.com/ionic-team/ionic/issues/15322)) ([5c6fe45](https://github.com/ionic-team/ionic/commit/5c6fe45))
* **hide-when:** mode is a reserved property ([c446d1b](https://github.com/ionic-team/ionic/commit/c446d1b))
* **img:** add object-fit to the host to avoid skewing the inner img ([2e94227](https://github.com/ionic-team/ionic/commit/2e94227))
* **infinite-scroll:** remove unused method ([926758e](https://github.com/ionic-team/ionic/commit/926758e))
* **input:** clearInput works in device ([ac96705](https://github.com/ionic-team/ionic/commit/ac96705)), closes [#15319](https://github.com/ionic-team/ionic/issues/15319)
* **menu:** do not override --ion-color-base ([a890828](https://github.com/ionic-team/ionic/commit/a890828))
* **modal:** make sure content is ready ([2c8bc04](https://github.com/ionic-team/ionic/commit/2c8bc04)), closes [#14969](https://github.com/ionic-team/ionic/issues/14969)
* **nav:** remove nav-decor once transition finished ([b8a87fb](https://github.com/ionic-team/ionic/commit/b8a87fb)), closes [#15121](https://github.com/ionic-team/ionic/issues/15121)
* **note:** do not overide --ion-color-base ([5f90dbf](https://github.com/ionic-team/ionic/commit/5f90dbf))
* **overlay:** expose "animated" API ([8b768fb](https://github.com/ionic-team/ionic/commit/8b768fb)), closes [#14775](https://github.com/ionic-team/ionic/issues/14775)
* **overlays:** dismiss last overlay ([c1c5102](https://github.com/ionic-team/ionic/commit/c1c5102))
* **overlays:** esc button works closed top overlays ([c567a82](https://github.com/ionic-team/ionic/commit/c567a82)), closes [#14662](https://github.com/ionic-team/ionic/issues/14662)
* **picker:** tune scrolling speed ([bd75bf4](https://github.com/ionic-team/ionic/commit/bd75bf4))
* **platform:** better detect platforms + css API ([3ffa3cd](https://github.com/ionic-team/ionic/commit/3ffa3cd)), closes [#15165](https://github.com/ionic-team/ionic/issues/15165) [#15116](https://github.com/ionic-team/ionic/issues/15116)
* **popover:** make sure content is ready ([8bf60e7](https://github.com/ionic-team/ionic/commit/8bf60e7))
* **popover:** they should not below other overlays ([d83e7f8](https://github.com/ionic-team/ionic/commit/d83e7f8)), closes [#14662](https://github.com/ionic-team/ionic/issues/14662)
* **refresher:** tune threshold ([d129f62](https://github.com/ionic-team/ionic/commit/d129f62)), closes [#15233](https://github.com/ionic-team/ionic/issues/15233)
* **ripple-effect:** add and document custom properties ([37a149c](https://github.com/ionic-team/ionic/commit/37a149c)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **segment:** add and document custom properties ([08c6c97](https://github.com/ionic-team/ionic/commit/08c6c97)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808) [#14854](https://github.com/ionic-team/ionic/issues/14854)
* **select:** add and document custom properties ([88613ff](https://github.com/ionic-team/ionic/commit/88613ff)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **select:** random type in generated.d.ts ([11edc49](https://github.com/ionic-team/ionic/commit/11edc49))
* **select:** support any kind of value ([151c58e](https://github.com/ionic-team/ionic/commit/151c58e)), closes [#15200](https://github.com/ionic-team/ionic/issues/15200)
* **skeleton-text:** add and document custom properties ([b213500](https://github.com/ionic-team/ionic/commit/b213500)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **slides:** document custom properties ([ecf1eb8](https://github.com/ionic-team/ionic/commit/ecf1eb8)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **split-pane:** add and document custom properties ([9104850](https://github.com/ionic-team/ionic/commit/9104850)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **textarea:** remove autocomplete prop ([5989f15](https://github.com/ionic-team/ionic/commit/5989f15))
* **title:** mode is inherited ([94ea0a6](https://github.com/ionic-team/ionic/commit/94ea0a6)), closes [#15187](https://github.com/ionic-team/ionic/issues/15187)
* **toggle:** cursor: pointer in desktop ([86acb8c](https://github.com/ionic-team/ionic/commit/86acb8c))
* **toolbar:** add position relative to host for toolbar background ([ac2db9f](https://github.com/ionic-team/ionic/commit/ac2db9f)), closes [#15193](https://github.com/ionic-team/ionic/issues/15193)
* **transition:** cleanup transition ([70a38ac](https://github.com/ionic-team/ionic/commit/70a38ac)), closes [#15317](https://github.com/ionic-team/ionic/issues/15317)
* **virtual-scroll:** update VS when items change ([3adfb98](https://github.com/ionic-team/ionic/commit/3adfb98))


### Features

* **all:** strong typed ComponentProps ([57d2375](https://github.com/ionic-team/ionic/commit/57d2375))
* **inputs:** add focus() method ([c66a34a](https://github.com/ionic-team/ionic/commit/c66a34a)), closes [#15266](https://github.com/ionic-team/ionic/issues/15266) [#15268](https://github.com/ionic-team/ionic/issues/15268)
* **platform:** add capacitor ([7356ba5](https://github.com/ionic-team/ionic/commit/7356ba5))


### Performance Improvements

* **overlay:** prevent layout thrashing ([ed5c8eb](https://github.com/ionic-team/ionic/commit/ed5c8eb))
* **ripple-effect:** using requestIdleCallback ([ea1c3d4](https://github.com/ionic-team/ionic/commit/ea1c3d4))


<a name="4.0.0-beta.3"></a>
# [4.0.0-beta.3](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2018-08-16)


### Bug Fixes

* **all:** improve text customization ([6e3e07b](https://github.com/ionic-team/ionic/commit/6e3e07b))
* **all:** safe-area using css variables ([aa23d08](https://github.com/ionic-team/ionic/commit/aa23d08))
* **all:** user-select for desktop ([2d70ee4](https://github.com/ionic-team/ionic/commit/2d70ee4))
* **anchor:** add custom properties and make sure color works properly ([8fef263](https://github.com/ionic-team/ionic/commit/8fef263)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **angular:** add ion-backdrop ([89e8256](https://github.com/ionic-team/ionic/commit/89e8256)), closes [#14971](https://github.com/ionic-team/ionic/issues/14971)
* **angular:** save internal data ([f84bb76](https://github.com/ionic-team/ionic/commit/f84bb76)), closes [#14888](https://github.com/ionic-team/ionic/issues/14888) [#14885](https://github.com/ionic-team/ionic/issues/14885) [#15054](https://github.com/ionic-team/ionic/issues/15054) [#15050](https://github.com/ionic-team/ionic/issues/15050)
* **avatar:** document and add custom properties ([6738ab7](https://github.com/ionic-team/ionic/commit/6738ab7)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **badge:** add custom properties and make sure color works properly ([9beca98](https://github.com/ionic-team/ionic/commit/9beca98)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **card:** add custom CSS properties and remove css overrides on item ([5ed2201](https://github.com/ionic-team/ionic/commit/5ed2201)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808) [#9198](https://github.com/ionic-team/ionic/issues/9198) [#12646](https://github.com/ionic-team/ionic/issues/12646)
* **card-subtitle:** add and document custom CSS properties ([7050039](https://github.com/ionic-team/ionic/commit/7050039)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **card-title:** add and document custom CSS properties ([1ad9818](https://github.com/ionic-team/ionic/commit/1ad9818)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **checkbox:** document and add custom CSS properties ([3e3cc6c](https://github.com/ionic-team/ionic/commit/3e3cc6c)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850) [#14808](https://github.com/ionic-team/ionic/issues/14808)
* **config:** add persistance mode ([db0049f](https://github.com/ionic-team/ionic/commit/db0049f)), closes [#15102](https://github.com/ionic-team/ionic/issues/15102)
* **config:** persistConfig ([1e1964d](https://github.com/ionic-team/ionic/commit/1e1964d))
* **content:** overflow-behavior: contain ([6173479](https://github.com/ionic-team/ionic/commit/6173479))
* **content:** scrolling Y ([01323ac](https://github.com/ionic-team/ionic/commit/01323ac))
* **content:** scrollToTop ([695abcf](https://github.com/ionic-team/ionic/commit/695abcf))
* **css:** --ion-item-background > --ion-item-background-color ([#15101](https://github.com/ionic-team/ionic/issues/15101)) ([e3010e1](https://github.com/ionic-team/ionic/commit/e3010e1))
* **datetime:** add open() method ([f032769](https://github.com/ionic-team/ionic/commit/f032769)), closes [#14923](https://github.com/ionic-team/ionic/issues/14923)
* **docs:** replace ion-navbar with ion-toolbar ([#15126](https://github.com/ionic-team/ionic/issues/15126)) ([0219309](https://github.com/ionic-team/ionic/commit/0219309))
* **fab-button:** sets pointer-events none when disabled ([04d33e5](https://github.com/ionic-team/ionic/commit/04d33e5)), closes [#15129](https://github.com/ionic-team/ionic/issues/15129) [#15120](https://github.com/ionic-team/ionic/issues/15120)
* **input:** event interfaces ([2e7d355](https://github.com/ionic-team/ionic/commit/2e7d355))
* **menu:** dismiss when clicking outside ([288eeb5](https://github.com/ionic-team/ionic/commit/288eeb5)), closes [#15096](https://github.com/ionic-team/ionic/issues/15096)
* **picker:** allow 0 as the selectedIndex ([d19061c](https://github.com/ionic-team/ionic/commit/d19061c)), closes [#14563](https://github.com/ionic-team/ionic/issues/14563)
* **range:** adds css var ([3ab835c](https://github.com/ionic-team/ionic/commit/3ab835c)), closes [#15064](https://github.com/ionic-team/ionic/issues/15064)
* **router:** transition race condition ([50ad1e7](https://github.com/ionic-team/ionic/commit/50ad1e7)), closes [#14873](https://github.com/ionic-team/ionic/issues/14873) [#15090](https://github.com/ionic-team/ionic/issues/15090)
* **segment:** center align text ([154b70e](https://github.com/ionic-team/ionic/commit/154b70e))
* **segment-button:** add and document custom properties ([85ffe01](https://github.com/ionic-team/ionic/commit/85ffe01)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **select:** apply proper styles for stacked/floating selects ([42ca99d](https://github.com/ionic-team/ionic/commit/42ca99d)), closes [#15140](https://github.com/ionic-team/ionic/issues/15140) [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **spinner:** add and document custom properties ([da6df2a](https://github.com/ionic-team/ionic/commit/da6df2a)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **split-pane:** disabled prop is dynamic ([149039b](https://github.com/ionic-team/ionic/commit/149039b)), closes [#14959](https://github.com/ionic-team/ionic/issues/14959)
* **tabbar:** fix highlight bar ([39104cb](https://github.com/ionic-team/ionic/commit/39104cb))
* **tabs:** get the tabbar layout working with shadow DOM ([#15113](https://github.com/ionic-team/ionic/issues/15113)) ([575c5eb](https://github.com/ionic-team/ionic/commit/575c5eb)), closes [#14611](https://github.com/ionic-team/ionic/issues/14611)
* **tap-click:** nested buttons get activated first ([03da98e](https://github.com/ionic-team/ionic/commit/03da98e))
* **tap-click:** works inside shadow-dom ([0dc70f7](https://github.com/ionic-team/ionic/commit/0dc70f7)), closes [#15128](https://github.com/ionic-team/ionic/issues/15128)
* **textarea:** add and document custom properties ([5dfcd47](https://github.com/ionic-team/ionic/commit/5dfcd47))
* **textarea:** add ion color classes ([5627811](https://github.com/ionic-team/ionic/commit/5627811))
* **thumbnail:** add and document custom properties ([c88e1ad](https://github.com/ionic-team/ionic/commit/c88e1ad)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **toast:** add and document custom properties ([5f6f6a1](https://github.com/ionic-team/ionic/commit/5f6f6a1)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **toast:** statusbarPadding ([3da1bf4](https://github.com/ionic-team/ionic/commit/3da1bf4))
* **toggle:** add and document custom properties ([773c2c2](https://github.com/ionic-team/ionic/commit/773c2c2)), closes [#14850](https://github.com/ionic-team/ionic/issues/14850)
* **toolbar:** add and document custom properties ([dd114ff](https://github.com/ionic-team/ionic/commit/dd114ff))
* **virtual-scroll:** fix viewportOffset calculation ([b7e741a](https://github.com/ionic-team/ionic/commit/b7e741a)), closes [#14963](https://github.com/ionic-team/ionic/issues/14963)
* **virtual-scroll:** use FunctionalComponent for JSX integration ([b53ce4b](https://github.com/ionic-team/ionic/commit/b53ce4b))


### Features

* **config:** strongly typed config ([0169045](https://github.com/ionic-team/ionic/commit/0169045)), closes [#15097](https://github.com/ionic-team/ionic/issues/15097)
* **select:** add open method ([4047812](https://github.com/ionic-team/ionic/commit/4047812)), closes [#14881](https://github.com/ionic-team/ionic/issues/14881)



<a name="4.0.0-beta.2"></a>
# [4.0.0-beta.2](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2018-08-08)


### Bug Fixes

* **all:** buttons are type="button" ([2b7007f](https://github.com/ionic-team/ionic/commit/2b7007f))
* **app:** fix statusbarPadding ([2c925b7](https://github.com/ionic-team/ionic/commit/2c925b7)), closes [#15073](https://github.com/ionic-team/ionic/issues/15073)
* **chip:** conforms to ion-icon ([f49fa4a](https://github.com/ionic-team/ionic/commit/f49fa4a)), closes [#15053](https://github.com/ionic-team/ionic/issues/15053)
* **content:** remove scroll-inner ([efd77c9](https://github.com/ionic-team/ionic/commit/efd77c9)), closes [#14985](https://github.com/ionic-team/ionic/issues/14985)
* **datetime:** fix gesture ([e9fd184](https://github.com/ionic-team/ionic/commit/e9fd184))
* **datetime:** ionChange event ([8b35e37](https://github.com/ionic-team/ionic/commit/8b35e37))
* **header:** safe margin when statubarPadding=0 ([b69d01d](https://github.com/ionic-team/ionic/commit/b69d01d))
* **input:** hide clear button ([141b86c](https://github.com/ionic-team/ionic/commit/141b86c)), closes [#15002](https://github.com/ionic-team/ionic/issues/15002)
* **menu:** add width and small-width css variables ([#14997](https://github.com/ionic-team/ionic/issues/14997)) ([69f5cc8](https://github.com/ionic-team/ionic/commit/69f5cc8))
* **menu:** content's box-shadow ([48e2a4e](https://github.com/ionic-team/ionic/commit/48e2a4e))
* **nav:** animation backdrop ([948d083](https://github.com/ionic-team/ionic/commit/948d083))
* **popover:** ion-scroll sizing ([b85d4a0](https://github.com/ionic-team/ionic/commit/b85d4a0)), closes [#14911](https://github.com/ionic-team/ionic/issues/14911)
* **range:** value changes when using keyboard ([27fdc9a](https://github.com/ionic-team/ionic/commit/27fdc9a)), closes [#15065](https://github.com/ionic-team/ionic/issues/15065)
* **searchbar:** color ([14d6270](https://github.com/ionic-team/ionic/commit/14d6270)), closes [#14998](https://github.com/ionic-team/ionic/issues/14998)
* **sliding:** fix core gesture logic + priority configuration ([a77ee2a](https://github.com/ionic-team/ionic/commit/a77ee2a)), closes [#14763](https://github.com/ionic-team/ionic/issues/14763)
* **split-pane:** side=end works properly ([dc50003](https://github.com/ionic-team/ionic/commit/dc50003)), closes [#15013](https://github.com/ionic-team/ionic/issues/15013)
* **tab:** edge prop ([2a4327f](https://github.com/ionic-team/ionic/commit/2a4327f)), closes [#15003](https://github.com/ionic-team/ionic/issues/15003)
* **tap-click:** desktop also needs tap-click ([9f4d873](https://github.com/ionic-team/ionic/commit/9f4d873))


### Features

* **core:** add check for standalone mode ([#15001](https://github.com/ionic-team/ionic/issues/15001)) ([0b4b9fe](https://github.com/ionic-team/ionic/commit/0b4b9fe))
* **item-sliding:** adds disabled prop ([9773e2a](https://github.com/ionic-team/ionic/commit/9773e2a)), closes [#14831](https://github.com/ionic-team/ionic/issues/14831)


### Performance Improvements

* **app:** move app css to global css ([a71f382](https://github.com/ionic-team/ionic/commit/a71f382))
* **menu:** flickering ([8253b04](https://github.com/ionic-team/ionic/commit/8253b04))
* **scroll:** filter velocity using exponential moving window ([419ef7b](https://github.com/ionic-team/ionic/commit/419ef7b))



<a name="4.0.0-beta.1"></a>
# [4.0.0-beta.1](https://github.com/ionic-team/ionic/compare/v4.0.0-beta.0...v4.0.0-beta.1) (2018-08-01)


### Bug Fixes

* **accesibility:** boolean aria-* properties ([4f9cbfe](https://github.com/ionic-team/ionic/commit/4f9cbfe))
* **all:** strong type text fields ([1d001a3](https://github.com/ionic-team/ionic/commit/1d001a3))
* **all:** updated tslint rules to latest ([92e21a8](https://github.com/ionic-team/ionic/commit/92e21a8))
* **angular:** events ([7a0545d](https://github.com/ionic-team/ionic/commit/7a0545d)), closes [#14866](https://github.com/ionic-team/ionic/issues/14866)
* **angular:** ion-router-outlet exposes animated ([266336e](https://github.com/ionic-team/ionic/commit/266336e)), closes [#14913](https://github.com/ionic-team/ionic/issues/14913)
* **angular:** pass proper animated value ([7813acc](https://github.com/ionic-team/ionic/commit/7813acc))
* **app:** statusbarPadding ([fd8f875](https://github.com/ionic-team/ionic/commit/fd8f875))
* **app:** user-select on desktop ([8a1ad1d](https://github.com/ionic-team/ionic/commit/8a1ad1d))
* **button:** do not change border radius if round button in toolbar ([#14941](https://github.com/ionic-team/ionic/issues/14941)) ([ad006dd](https://github.com/ionic-team/ionic/commit/ad006dd)), closes [#7661](https://github.com/ionic-team/ionic/issues/7661)
* **button:** improve text style inherency ([25423a0](https://github.com/ionic-team/ionic/commit/25423a0)), closes [#14927](https://github.com/ionic-team/ionic/issues/14927)
* **button:** submit forms using fake button ([c05d672](https://github.com/ionic-team/ionic/commit/c05d672)), closes [#14890](https://github.com/ionic-team/ionic/issues/14890) [#14786](https://github.com/ionic-team/ionic/issues/14786)
* **color:** make desktop selection beautiful ([0cdb500](https://github.com/ionic-team/ionic/commit/0cdb500))
* **config:** avoid using startWith for IE support ([73a9f14](https://github.com/ionic-team/ionic/commit/73a9f14)), closes [#14922](https://github.com/ionic-team/ionic/issues/14922)
* **content:** bottom padding ([be4eda5](https://github.com/ionic-team/ionic/commit/be4eda5))
* **fab:** add styles for disabled ([520da8d](https://github.com/ionic-team/ionic/commit/520da8d)), closes [#14867](https://github.com/ionic-team/ionic/issues/14867)
* **flex-utils:** add missing flex attributes ([7c12e1b](https://github.com/ionic-team/ionic/commit/7c12e1b))
* **input:** add color support for ion-input ([f676f98](https://github.com/ionic-team/ionic/commit/f676f98)), closes [#14864](https://github.com/ionic-team/ionic/issues/14864)
* **inputs:** better customization for placeholder color ([517104f](https://github.com/ionic-team/ionic/commit/517104f))
* **item:** only use pointer cursor for <button> and <a> ([f19553f](https://github.com/ionic-team/ionic/commit/f19553f))
* **pointer-events:** listening to document ([afb0906](https://github.com/ionic-team/ionic/commit/afb0906))
* **refresher:** default to disabled false, add to breaking changes ([f1826a6](https://github.com/ionic-team/ionic/commit/f1826a6)), closes [#14879](https://github.com/ionic-team/ionic/issues/14879)
* **router-outlet:** fix stack attribute detection ([#14921](https://github.com/ionic-team/ionic/issues/14921)) ([16e992a](https://github.com/ionic-team/ionic/commit/16e992a))
* **searchbar:** fix input bluring ([d65174b](https://github.com/ionic-team/ionic/commit/d65174b)), closes [#14916](https://github.com/ionic-team/ionic/issues/14916)
* **slides:** update events to match swipers ([fc0d4c0](https://github.com/ionic-team/ionic/commit/fc0d4c0)), closes [#14865](https://github.com/ionic-team/ionic/issues/14865)
* **title:** can be used nested ([d1969bd](https://github.com/ionic-team/ionic/commit/d1969bd)), closes [#14905](https://github.com/ionic-team/ionic/issues/14905)
* **title:** support color ([7da0ac4](https://github.com/ionic-team/ionic/commit/7da0ac4))


### Features

* **menu:** configurable using menuType ([a62759c](https://github.com/ionic-team/ionic/commit/a62759c)), closes [#14901](https://github.com/ionic-team/ionic/issues/14901)


### Performance Improvements

* **app:** tap-click is a ES ([b0ac5ba](https://github.com/ionic-team/ionic/commit/b0ac5ba))
* **css:** always emit compressed css ([143f0f0](https://github.com/ionic-team/ionic/commit/143f0f0))
* **gesture:** lazy loaded dynamic ES module ([49cac8b](https://github.com/ionic-team/ionic/commit/49cac8b))
* **icon:** disable icon lazy loading when it's not needed ([7292fc7](https://github.com/ionic-team/ionic/commit/7292fc7))



<a name="4.0.0-beta.0"></a>
# [4.0.0-beta.0](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.14...v4.0.0-beta.0) (2018-07-25)

## Enjoy! :tada:


### Bug Fixes

* **angular:** always dispatch lifecycle events ([5677daa](https://github.com/ionic-team/ionic/commit/5677daa))



<a name="4.0.0-alpha.14"></a>
# [4.0.0-alpha.14](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.13...v4.0.0-alpha.14) (2018-07-25)


### Bug Fixes

* **angular:** hide pages properly ([a44b844](https://github.com/ionic-team/ionic/commit/a44b844))
* **angular:** make pages invisible before they are rendered ([a589816](https://github.com/ionic-team/ionic/commit/a589816))
* **transition:** make sure hidden is removed ([f52dece](https://github.com/ionic-team/ionic/commit/f52dece))



<a name="4.0.0-alpha.13"></a>
# [4.0.0-alpha.13](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.12...v4.0.0-alpha.13) (2018-07-24)


### Bug Fixes

* **css:** revert hidden css ([7d3d98d](https://github.com/ionic-team/ionic/commit/7d3d98d))
* **tab:** prevent infinite loop ([05b258c](https://github.com/ionic-team/ionic/commit/05b258c))
* **toolbar:** remove transparent border on translucent toolbar ([55cb354](https://github.com/ionic-team/ionic/commit/55cb354))



<a name="4.0.0-alpha.12"></a>
# [4.0.0-alpha.12](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.11...v4.0.0-alpha.12) (2018-07-24)


### Bug Fixes

* **all:** accesibility and global styles for hidden nodes ([4b844ef](https://github.com/ionic-team/ionic/commit/4b844ef))
* **checkbox:** get css variable customization working better ([3e7aa4b](https://github.com/ionic-team/ionic/commit/3e7aa4b))
* **content:** set height to make it accessible for children elements ([#14772](https://github.com/ionic-team/ionic/issues/14772)) ([857b42d](https://github.com/ionic-team/ionic/commit/857b42d))
* **grid:** set the flex and width to auto when size is auto ([ba30671](https://github.com/ionic-team/ionic/commit/ba30671)), closes [#14807](https://github.com/ionic-team/ionic/issues/14807)
* **inputs:** inputs work inside <form> ([8324bd1](https://github.com/ionic-team/ionic/commit/8324bd1))
* **label:** style color ([5c0e9e6](https://github.com/ionic-team/ionic/commit/5c0e9e6))
* **list:** hide the last item border when there are no lines ([#14770](https://github.com/ionic-team/ionic/issues/14770)) ([26f7379](https://github.com/ionic-team/ionic/commit/26f7379)), closes [#14769](https://github.com/ionic-team/ionic/issues/14769)
* **margin:** adds css variables ([f6c8f3f](https://github.com/ionic-team/ionic/commit/f6c8f3f)), closes [#14798](https://github.com/ionic-team/ionic/issues/14798) [#14826](https://github.com/ionic-team/ionic/issues/14826)
* **menu-button:** fix sass linting ([d22f04b](https://github.com/ionic-team/ionic/commit/d22f04b))
* **menu-button:** get proper styles when used inside ion-buttons ([811eee7](https://github.com/ionic-team/ionic/commit/811eee7))
* **modal:** use flex to position modal to make it easier to size ([9488a98](https://github.com/ionic-team/ionic/commit/9488a98)), closes [#14392](https://github.com/ionic-team/ionic/issues/14392)
* **overlay:** remove global css vars in overlays for local ones ([38b1e47](https://github.com/ionic-team/ionic/commit/38b1e47))
* **refresher:** find parent ion-content properly ([4eab209](https://github.com/ionic-team/ionic/commit/4eab209)), closes [#14833](https://github.com/ionic-team/ionic/issues/14833)
* **slides:** swiper container should take up 100% height ([1d201ec](https://github.com/ionic-team/ionic/commit/1d201ec)), closes [#14771](https://github.com/ionic-team/ionic/issues/14771)
* **spinner:** color can be customized in non-shadow-dom ([65008e7](https://github.com/ionic-team/ionic/commit/65008e7))
* **spinner:** get paused attribute working and update tests ([3ab1e2d](https://github.com/ionic-team/ionic/commit/3ab1e2d)), closes [#14811](https://github.com/ionic-team/ionic/issues/14811)


### Features

* **button:** overflow is configurable ([ddb1e49](https://github.com/ionic-team/ionic/commit/ddb1e49)), closes [#14839](https://github.com/ionic-team/ionic/issues/14839)
* **menu:** add getWidth() ([cb4acab](https://github.com/ionic-team/ionic/commit/cb4acab)), closes [#14794](https://github.com/ionic-team/ionic/issues/14794)



<a name="4.0.0-alpha.11"></a>
# [4.0.0-alpha.11](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.10...v4.0.0-alpha.11) (2018-07-16)


### Bug Fixes

* **anchor:** add proper styling, support for colors, and basic test ([1dbf5bb](https://github.com/ionic-team/ionic/commit/1dbf5bb)), closes [#14777](https://github.com/ionic-team/ionic/issues/14777)
* **anchor:** inner <a> inherits text styles ([9aedfc6](https://github.com/ionic-team/ionic/commit/9aedfc6))
* **button:** add box-sizing so anchor buttons won't exceed max-width ([9c9f081](https://github.com/ionic-team/ionic/commit/9c9f081)), closes [#14760](https://github.com/ionic-team/ionic/issues/14760)
* **button:** set display type on host ([89d1526](https://github.com/ionic-team/ionic/commit/89d1526))
* **button:** submit form w/ ion-button within shadow dom ([4ed8541](https://github.com/ionic-team/ionic/commit/4ed8541)), closes [#14776](https://github.com/ionic-team/ionic/issues/14776)
* **item:** add cursor pointer back to native item ([43f1fec](https://github.com/ionic-team/ionic/commit/43f1fec)), closes [#14743](https://github.com/ionic-team/ionic/issues/14743)
* **searchbar:** use tag in toolbar context selector ([124b87c](https://github.com/ionic-team/ionic/commit/124b87c))
* **segment:** add styles for in a color toolbar ([d9e4ca7](https://github.com/ionic-team/ionic/commit/d9e4ca7))
* **spinner:** style CSS props ([2798bb0](https://github.com/ionic-team/ionic/commit/2798bb0))
* **tab:** props are reactive ([00c4c77](https://github.com/ionic-team/ionic/commit/00c4c77))
* **tab-button:** add a class to hide the tab when show is false ([eb9ed17](https://github.com/ionic-team/ionic/commit/eb9ed17))
* **tabs:** add the colors to the tabbar as well ([5348e7c](https://github.com/ionic-team/ionic/commit/5348e7c)), closes [#14758](https://github.com/ionic-team/ionic/issues/14758)
* **tabs:** fix the tabs so the color property works on tab button ([8aed3bf](https://github.com/ionic-team/ionic/commit/8aed3bf)), closes [#14758](https://github.com/ionic-team/ionic/issues/14758)
* **virtual-scroll:** read viewport size for every scroll event ([1d3eb3f](https://github.com/ionic-team/ionic/commit/1d3eb3f))



<a name="4.0.0-alpha.10"></a>
# [4.0.0-alpha.10](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.9...v4.0.0-alpha.10) (2018-07-11)


### Bug Fixes

* **angular:** publish css to npm ([748c209](https://github.com/ionic-team/ionic/commit/748c209))
* **item:** pass the correct type property to the button tag ([5f8b02e](https://github.com/ionic-team/ionic/commit/5f8b02e)), closes [#14740](https://github.com/ionic-team/ionic/issues/14740)
* **tabs:** correct alignment for label/icon only tabs ([b46c3e2](https://github.com/ionic-team/ionic/commit/b46c3e2))
* **tabs:** update the tabbar placement value to match the property it applies to ([45583bc](https://github.com/ionic-team/ionic/commit/45583bc))
* **toolbar:** get translucency working with header, footer and toolbar ([f6ab5b6](https://github.com/ionic-team/ionic/commit/f6ab5b6))



<a name="4.0.0-alpha.9"></a>
# [4.0.0-alpha.9](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.8...v4.0.0-alpha.9) (2018-07-10)


### Bug Fixes

* **angular:** esm ([0e68f17](https://github.com/ionic-team/ionic/commit/0e68f17))


<a name="4.0.0-alpha.8"></a>
# [4.0.0-alpha.8](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.7...v4.0.0-alpha.8) (2018-07-09)


### Bug Fixes

* **angular:** avoid TS 2.8 features ([c736bac](https://github.com/ionic-team/ionic/commit/c736bac))
* **angular:** correct subscription to cordova ready event ([#14577](https://github.com/ionic-team/ionic/issues/14577)) ([5967352](https://github.com/ionic-team/ionic/commit/5967352))
* **bundling:** fix EventEmitter import ([8e47101](https://github.com/ionic-team/ionic/commit/8e47101))
* linting ([e629e29](https://github.com/ionic-team/ionic/commit/e629e29))
* **icon:** target element for style and add to breaking ([949d93e](https://github.com/ionic-team/ionic/commit/949d93e))
* **overlay:** make type an any ([15dc651](https://github.com/ionic-team/ionic/commit/15dc651))
* **router:** fix reuse strategy ([bd53bba](https://github.com/ionic-team/ionic/commit/bd53bba))
* **scripts:** update github release notes ([fc078af](https://github.com/ionic-team/ionic/commit/fc078af))
* **tabs:** align tab title and icons to flex-start ([c11d74b](https://github.com/ionic-team/ionic/commit/c11d74b)), closes [#14606](https://github.com/ionic-team/ionic/issues/14606)


### Features

* **all:** custom icons ([e6638e7](https://github.com/ionic-team/ionic/commit/e6638e7))
* **dir:** default to ltr css, rtl overrides w/ [dir=rtl] selectors ([fb4353c](https://github.com/ionic-team/ionic/commit/fb4353c))
* **slides:** update swiper to latest ([8e164d6](https://github.com/ionic-team/ionic/commit/8e164d6))



<a name="4.0.0-alpha.7"></a>
# [4.0.0-alpha.7](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.6...v4.0.0-alpha.7) (2018-05-17)


### Bug Fixes

* **all:** strong typing for color ([618f708](https://github.com/ionic-team/ionic/commit/618f708))
* **angular:** platform logic belongs to core ([af5db2f](https://github.com/ionic-team/ionic/commit/af5db2f))
* **angular:** build script ([a88e1e8](https://github.com/ionic-team/ionic/commit/a88e1e8))
* **angular:** params are assigned to props ([7fa6e43](https://github.com/ionic-team/ionic/commit/7fa6e43))
* **angular:** populated the platforms array ([#14466](https://github.com/ionic-team/ionic/issues/14466)) ([d177087](https://github.com/ionic-team/ionic/commit/d177087))
* **angular:** Required<> is not available ([8aa6965](https://github.com/ionic-team/ionic/commit/8aa6965))
* **angular:** routerLink integration ([ed8ff4f](https://github.com/ionic-team/ionic/commit/ed8ff4f))
* **content:** scrol-inner takes all height ([3da0c98](https://github.com/ionic-team/ionic/commit/3da0c98))
* **nav:** Remove console.log ([#14467](https://github.com/ionic-team/ionic/issues/14467)) ([d93b1d5](https://github.com/ionic-team/ionic/commit/d93b1d5))
* **refresher:** adds threshold ([34ae904](https://github.com/ionic-team/ionic/commit/34ae904))
* **router:** accepts root direction ([ae9d0c7](https://github.com/ionic-team/ionic/commit/ae9d0c7))
* **router:** fix push() public interface ([875b9d0](https://github.com/ionic-team/ionic/commit/875b9d0))


### Features

* **img:** adds lazy load image ([b06c65f](https://github.com/ionic-team/ionic/commit/b06c65f))



<a name="4.0.0-alpha.6"></a>
# [4.0.0-alpha.6](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.5...v4.0.0-alpha.6) (2018-05-10)


### Bug Fixes

* **angular:** aot ([714f4a6](https://github.com/ionic-team/ionic/commit/714f4a6))



<a name="4.0.0-alpha.5"></a>
# [4.0.0-alpha.5](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.4...v4.0.0-alpha.5) (2018-05-10)


### Bug Fixes

* **alert:** onDidDismiss() is called ([7b33039](https://github.com/ionic-team/ionic/commit/7b33039))
* **all:** snapshot tests ([cc7ab4e](https://github.com/ionic-team/ionic/commit/cc7ab4e))
* **angular:** exports ([50021cd](https://github.com/ionic-team/ionic/commit/50021cd))
* **angular:** routerLink uses <a> ([526c9a8](https://github.com/ionic-team/ionic/commit/526c9a8))
* **angular:** setup config provider correctly ([82fbe31](https://github.com/ionic-team/ionic/commit/82fbe31))
* **angular:** unexport some es2017 js ([f7bcb68](https://github.com/ionic-team/ionic/commit/f7bcb68))
* **app:** fix the statusbar-padding to match new structure ([6c2d539](https://github.com/ionic-team/ionic/commit/6c2d539))
* **back-button:** fix position ([e00da6d](https://github.com/ionic-team/ionic/commit/e00da6d))
* **capacitor:** detect capacitor native ([23d86eb](https://github.com/ionic-team/ionic/commit/23d86eb))
* **hover:** remove ion-app .enable-hover css ([a939fa2](https://github.com/ionic-team/ionic/commit/a939fa2))
* **inputs:** interactive css to rule all them ([1bd5467](https://github.com/ionic-team/ionic/commit/1bd5467))
* **refresher:** move gesture target to content ([df2faa4](https://github.com/ionic-team/ionic/commit/df2faa4))
* **router:** change events when URL changes ([ece86ee](https://github.com/ionic-team/ionic/commit/ece86ee))
* **router:** dynamic redirects ([ba551fd](https://github.com/ionic-team/ionic/commit/ba551fd))
* **router:** route information is stateless ([0f8477d](https://github.com/ionic-team/ionic/commit/0f8477d))
* **snapshot:** using md mode ([e352d1b](https://github.com/ionic-team/ionic/commit/e352d1b))
* **theming:** update contrast colors ([ae1028d](https://github.com/ionic-team/ionic/commit/ae1028d))
* **virtual-scroll:** JSX can render headers and footers ([012127d](https://github.com/ionic-team/ionic/commit/012127d))
* **virtual-scroll:** linting ([df8a4f7](https://github.com/ionic-team/ionic/commit/df8a4f7))


### Performance Improvements

* **all:** dynamic import ([bb809b6](https://github.com/ionic-team/ionic/commit/bb809b6))



<a name="4.0.0-alpha.4"></a>
# [4.0.0-alpha.4](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.3...v4.0.0-alpha.4) (2018-04-30)


### Bug Fixes

* **angular:** compare router params length ([b3a9c7f](https://github.com/ionic-team/ionic/commit/b3a9c7f))
* **angular:** Config provider ([329a348](https://github.com/ionic-team/ionic/commit/329a348))
* **angular:** platform.ready() returns type ([c0ec02e](https://github.com/ionic-team/ionic/commit/c0ec02e))
* **angular:** update proxies ([da0bfc7](https://github.com/ionic-team/ionic/commit/da0bfc7))
* **config:** add object.entries polyfil ([c917a3c](https://github.com/ionic-team/ionic/commit/c917a3c))
* **config:** add setupConfig util ([0c1476e](https://github.com/ionic-team/ionic/commit/0c1476e))
* **lint:** import order ([8b1452c](https://github.com/ionic-team/ionic/commit/8b1452c))
* **nav:** rename animate to animated ([98a3519](https://github.com/ionic-team/ionic/commit/98a3519))
* **prerender:** router compatible with prerender ([9c7b0ca](https://github.com/ionic-team/ionic/commit/9c7b0ca))
* **router:** error when it can't initialize property ([e56b2ee](https://github.com/ionic-team/ionic/commit/e56b2ee))
* **router:** initial load waits until outlet attaches ([c905ba4](https://github.com/ionic-team/ionic/commit/c905ba4))
* **router:** root prop ([89d5a35](https://github.com/ionic-team/ionic/commit/89d5a35))
* **router:** writeURL() for non root base ([af4bcb8](https://github.com/ionic-team/ionic/commit/af4bcb8))
* **scripts:** github release ([545d3c2](https://github.com/ionic-team/ionic/commit/545d3c2))
* **segment:** checked can be changed dynamically ([78454b4](https://github.com/ionic-team/ionic/commit/78454b4))
* **select:** cssClass + strong typed ([826e02b](https://github.com/ionic-team/ionic/commit/826e02b))
* **toast:** only use constant and env if supported ([#14399](https://github.com/ionic-team/ionic/issues/14399)) ([9bee0f0](https://github.com/ionic-team/ionic/commit/9bee0f0))
* **validate:** fix type errors ([3328314](https://github.com/ionic-team/ionic/commit/3328314))


### Features

* **router:** add willChange event ([d613411](https://github.com/ionic-team/ionic/commit/d613411))



<a name="4.0.0-alpha.3"></a>
# [4.0.0-alpha.3](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.2...v4.0.0-alpha.3) (2018-04-23)


### Bug Fixes

* **all:** strong typed events ([d5129df](https://github.com/ionic-team/ionic/commit/d5129df))
* **angular:** adds missing events ([c929dad](https://github.com/ionic-team/ionic/commit/c929dad))
* **angular:** Config provider ([c87f0c5](https://github.com/ionic-team/ionic/commit/c87f0c5))
* **angular:** platform ready() ([2b3c14b](https://github.com/ionic-team/ionic/commit/2b3c14b))
* **overlay:** cssClasses applied to overlay ([43d7538](https://github.com/ionic-team/ionic/commit/43d7538))
* **prerender:** local references to window/document ([78bd146](https://github.com/ionic-team/ionic/commit/78bd146))
* **virtual-scroll:** queue.write ([c1cbbc5](https://github.com/ionic-team/ionic/commit/c1cbbc5))


### Features

* **angular:** animation is explicit ([099b3ed](https://github.com/ionic-team/ionic/commit/099b3ed))


### Performance Improvements

* **platform:** remove from critical path ([86a6cde](https://github.com/ionic-team/ionic/commit/86a6cde))



<a name="4.0.0-alpha.2"></a>
# [4.0.0-alpha.2](https://github.com/ionic-team/ionic/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) (2018-04-13)


### Bug Fixes

* **angular:** add NavParams ([22ebbce](https://github.com/ionic-team/ionic/commit/22ebbce))
* **angular:** change detection in deep ViewContainers ([850d7fc](https://github.com/ionic-team/ionic/commit/850d7fc))
* **angular:** emit es5 code ([02c1e83](https://github.com/ionic-team/ionic/commit/02c1e83))
* **angular:** icon proxy ([db5313e](https://github.com/ionic-team/ionic/commit/db5313e))
* **angular:** router-outlet uses stack by default ([5c91101](https://github.com/ionic-team/ionic/commit/5c91101))
* **angular:** using es2017 types ([12a27bc](https://github.com/ionic-team/ionic/commit/12a27bc))
* **angular:** viewContainer in overlays ([8ad3df9](https://github.com/ionic-team/ionic/commit/8ad3df9))
* **back-button:** get the back button color working ([5f4250b](https://github.com/ionic-team/ionic/commit/5f4250b))
* **fab:** fix fab activation ([a203534](https://github.com/ionic-team/ionic/commit/a203534))
* **label:** inline position by default ([fde878b](https://github.com/ionic-team/ionic/commit/fde878b))
* **label:** using prop for position ([b1ee4b8](https://github.com/ionic-team/ionic/commit/b1ee4b8)), closes [#14288](https://github.com/ionic-team/ionic/issues/14288)
* **mode:** set mode css class on ion-app ([fcb08e1](https://github.com/ionic-team/ionic/commit/fcb08e1))
* **props:** update stencil ([ea24ad6](https://github.com/ionic-team/ionic/commit/ea24ad6))
* **react:** FrameworkDelegate matches API ([e40a6b0](https://github.com/ionic-team/ionic/commit/e40a6b0))
* **toast:** account for safe-area on ios ([d984214](https://github.com/ionic-team/ionic/commit/d984214))


### Features

* **angular:** adds DomController ([6a31f39](https://github.com/ionic-team/ionic/commit/6a31f39)), closes [#14286](https://github.com/ionic-team/ionic/issues/14286)
* **angular:** push/setRoot/pop ([4d23cba](https://github.com/ionic-team/ionic/commit/4d23cba))
* **DomController:** add DomController provider using stencil queue ([bceece7](https://github.com/ionic-team/ionic/commit/bceece7))
* **queue:** use stencil's queue controller for dom read/writes ([d623b3b](https://github.com/ionic-team/ionic/commit/d623b3b))
* **router:** dont reuse the component if the params are different ([5899b03](https://github.com/ionic-team/ionic/commit/5899b03))
* **routerDirection:** refactors goBack ([54d7a12](https://github.com/ionic-team/ionic/commit/54d7a12))



<a name="4.0.0-alpha.1"></a>
# [4.0.0-alpha.1](https://github.com/ionic-team/ionic/compare/v0.2.2...v4.0.0-alpha.1) (2018-04-06)


### Bug Fixes

* **angular:** change detection ([79ba639](https://github.com/ionic-team/ionic/commit/79ba639))
* **angular:** proxy methods ([5153da4](https://github.com/ionic-team/ionic/commit/5153da4))
* **angular:** proxy outputs ([64a9497](https://github.com/ionic-team/ionic/commit/64a9497))
* **menu:** prerender ([a3cd5db](https://github.com/ionic-team/ionic/commit/a3cd5db))
* **split-pane:** prerender ([c6e962c](https://github.com/ionic-team/ionic/commit/c6e962c))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/ionic-team/ionic/compare/v0.2.1...v0.2.2) (2018-04-05)


### Bug Fixes

* **back-button:** fix menu and back button alignment ([#14268](https://github.com/ionic-team/ionic/issues/14268)) ([57fbf6c](https://github.com/ionic-team/ionic/commit/57fbf6c))
* **ripple-effect:** animation ([25c852c](https://github.com/ionic-team/ionic/commit/25c852c))
* **sass:** add missing alert css properties ([#14269](https://github.com/ionic-team/ionic/issues/14269)) ([3471dd6](https://github.com/ionic-team/ionic/commit/3471dd6)), closes [#14258](https://github.com/ionic-team/ionic/issues/14258)
* **script:** release script pushes tags ([d23108a](https://github.com/ionic-team/ionic/commit/d23108a))
* **scripts:** improve script ([2215c6a](https://github.com/ionic-team/ionic/commit/2215c6a))
* **select:** pass header and subHeader to interfaces ([2195895](https://github.com/ionic-team/ionic/commit/2195895))
* **select:** wrap the text for the message in a popover ([0a0959b](https://github.com/ionic-team/ionic/commit/0a0959b))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/ionic-team/ionic/compare/v0.2.0...v0.2.1) (2018-04-04)


### Bug Fixes

* **angular:** back button prevents default ([4db687e](https://github.com/ionic-team/ionic/commit/4db687e))
* **angular:** back-button ([1f78390](https://github.com/ionic-team/ionic/commit/1f78390))
* **angular:** back-button does not push view ([bb46b5f](https://github.com/ionic-team/ionic/commit/bb46b5f))
* **angular:** tabs flickering ([7e97006](https://github.com/ionic-team/ionic/commit/7e97006))
* **app:** hide elements ([11cb42f](https://github.com/ionic-team/ionic/commit/11cb42f))
* **scripts:** update dep version ([974b949](https://github.com/ionic-team/ionic/commit/974b949))


### Features

* **angular:** href integration ([09e6b7e](https://github.com/ionic-team/ionic/commit/09e6b7e))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ionic-team/ionic/compare/v0.1.6...v0.2.0) (2018-04-02)


### Bug Fixes

* **angular:** URL based tabs ([14fedb9](https://github.com/ionic-team/ionic/commit/14fedb9))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/ionic-team/ionic/compare/v0.1.5...v0.1.6) (2018-04-02)


### Bug Fixes

* **angular:** lifecycles ([062641d](https://github.com/ionic-team/ionic/commit/062641d))
* **angular:** modal and popover ([acd411d](https://github.com/ionic-team/ionic/commit/acd411d))
* **angular:** module exports ([cece447](https://github.com/ionic-team/ionic/commit/cece447))
* **angular:** proxies ([2308239](https://github.com/ionic-team/ionic/commit/2308239))
* **angular:** tabs angular tests ([ff1ed88](https://github.com/ionic-team/ionic/commit/ff1ed88))
* **router-outlet:** enteringEl !== leavingEl ([0d44253](https://github.com/ionic-team/ionic/commit/0d44253))
* **router-outlet:** mutable prop ([ff06dab](https://github.com/ionic-team/ionic/commit/ff06dab))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/ionic-team/ionic/compare/v0.1.4...v0.1.5) (2018-03-29)


### Bug Fixes

* **all:** absolute positioning ([4fcddad](https://github.com/ionic-team/ionic/commit/4fcddad))
* **angular:** goback navigation ([7b9a00e](https://github.com/ionic-team/ionic/commit/7b9a00e))
* **angular:** ion-back-button ([9c789ce](https://github.com/ionic-team/ionic/commit/9c789ce))
* **angular:** stack based navigation ([726938f](https://github.com/ionic-team/ionic/commit/726938f))
* **avatar:** adjust wide images to fill instead of squish ([b0f8ca5](https://github.com/ionic-team/ionic/commit/b0f8ca5))
* **back-button:** empty text is a valid value ([eb0ff2f](https://github.com/ionic-team/ionic/commit/eb0ff2f))
* **back-button:** ios style ([2b8e489](https://github.com/ionic-team/ionic/commit/2b8e489))
* **button:** dynamic bar-button ([d0c5f53](https://github.com/ionic-team/ionic/commit/d0c5f53))
* **checkbox:** update ios checkbox to be closer to native ([b29fce1](https://github.com/ionic-team/ionic/commit/b29fce1))
* **components:** add font-smoothing to mixing components ([9caeec7](https://github.com/ionic-team/ionic/commit/9caeec7))
* **covers:** absolute positioning ([ce09978](https://github.com/ionic-team/ionic/commit/ce09978))
* **item-option:** remove outline on active/focus ([eae6869](https://github.com/ionic-team/ionic/commit/eae6869)), closes [#14191](https://github.com/ionic-team/ionic/issues/14191)
* **label:** add missing text-wrap styles for ios ([a9bd76a](https://github.com/ionic-team/ionic/commit/a9bd76a)), closes [#13157](https://github.com/ionic-team/ionic/issues/13157)
* **menu:** default menu mode ([c31bcde](https://github.com/ionic-team/ionic/commit/c31bcde))
* **nav:** animated opts ([57a5d49](https://github.com/ionic-team/ionic/commit/57a5d49))
* **nav:** no animation ([4fdfddb](https://github.com/ionic-team/ionic/commit/4fdfddb))
* **nav:** transition name ([011a374](https://github.com/ionic-team/ionic/commit/011a374))
* **picker:** do not scroll ([1c06bfe](https://github.com/ionic-team/ionic/commit/1c06bfe))
* **ripple-effect:** tapclick is required in ionic ([d57122c](https://github.com/ionic-team/ionic/commit/d57122c))
* **router:** change detection for componentProps ([a718f7e](https://github.com/ionic-team/ionic/commit/a718f7e))
* **router:** explicit goback should not push ([7a26162](https://github.com/ionic-team/ionic/commit/7a26162))
* **router:** fixes navChanged() ([dddaee1](https://github.com/ionic-team/ionic/commit/dddaee1))
* **router:** ion-nav ([113af9e](https://github.com/ionic-team/ionic/commit/113af9e))
* **router:** loging ([ffaec16](https://github.com/ionic-team/ionic/commit/ffaec16))
* **router:** route change detection ([9e9f2a2](https://github.com/ionic-team/ionic/commit/9e9f2a2))
* **router:** wait RAF ([b26a563](https://github.com/ionic-team/ionic/commit/b26a563))
* **slides:** unload slides correctly ([59c6891](https://github.com/ionic-team/ionic/commit/59c6891))
* **thumbnail:** adjust wide images to fill instead of squish ([54558c9](https://github.com/ionic-team/ionic/commit/54558c9))
* **toast:** dismiss timeout ([44f343d](https://github.com/ionic-team/ionic/commit/44f343d))
* **toolbar:** unused private ([c9d2a0d](https://github.com/ionic-team/ionic/commit/c9d2a0d))
* **transition:** nav ios transition ([095f9c8](https://github.com/ionic-team/ionic/commit/095f9c8))


### Features

* **button:** goback attribute ([00fc460](https://github.com/ionic-team/ionic/commit/00fc460))
* **config:** add set to config ([69a6f8d](https://github.com/ionic-team/ionic/commit/69a6f8d))
* **content:** scrollEnabled ([5c2678f](https://github.com/ionic-team/ionic/commit/5c2678f))
* **menu-controller:** expose registerAnimation ([153f8ca](https://github.com/ionic-team/ionic/commit/153f8ca))
* **nav:** goBack directive ([862e571](https://github.com/ionic-team/ionic/commit/862e571))
* **nav-controller:** goback best guess ([46bbd0f](https://github.com/ionic-team/ionic/commit/46bbd0f))
* **ripple:** css variable color ([77fc792](https://github.com/ionic-team/ionic/commit/77fc792))
* **tab:** framework support ([48d1bd4](https://github.com/ionic-team/ionic/commit/48d1bd4))


### Performance Improvements

* **app:** platform is not needed ([e681836](https://github.com/ionic-team/ionic/commit/e681836))


### Reverts

* **toolbar:** revert to use old button attributes ([574c346](https://github.com/ionic-team/ionic/commit/574c346)), closes [#14172](https://github.com/ionic-team/ionic/issues/14172)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/ionic-team/ionic/compare/v0.1.4-9...v0.1.4) (2018-03-21)


### Bug Fixes

* **action-sheet:** update padding on title to match native ([f0a40fa](https://github.com/ionic-team/ionic/commit/f0a40fa))
* **alert:** update colors for alert text and input borders ([605ec93](https://github.com/ionic-team/ionic/commit/605ec93)), closes [#14196](https://github.com/ionic-team/ionic/issues/14196)
* **alert:** update md alert to closer match spec ([7d53e49](https://github.com/ionic-team/ionic/commit/7d53e49))
* **all:** ts strict (part 4) ([4693229](https://github.com/ionic-team/ionic/commit/4693229))
* **angular:** router-outlet animation ([943e2f7](https://github.com/ionic-team/ionic/commit/943e2f7))
* **chip:** use lighter background color ([08553f1](https://github.com/ionic-team/ionic/commit/08553f1)), closes [#14196](https://github.com/ionic-team/ionic/issues/14196)
* **picker:** does not scroll ([b49a45d](https://github.com/ionic-team/ionic/commit/b49a45d))
* **router:** reusing checks params ([371fc19](https://github.com/ionic-team/ionic/commit/371fc19))
* **router-outlet:** css and change logic ([6e683c5](https://github.com/ionic-team/ionic/commit/6e683c5))


### Features

* **fab:** add box shadow and transition for ios ([d26074a](https://github.com/ionic-team/ionic/commit/d26074a))
* **ion-router-outlet:** adds router-outlet ([c03afab](https://github.com/ionic-team/ionic/commit/c03afab))



<a name="0.1.4-9"></a>
## [0.1.4-9](https://github.com/ionic-team/ionic/compare/v0.1.4-8...v0.1.4-9) (2018-03-20)


### Bug Fixes

* **all:** ts strict (part 3) ([06ad60e](https://github.com/ionic-team/ionic/commit/06ad60e))
* **angular:** ion-nav no routing ([9094c66](https://github.com/ionic-team/ionic/commit/9094c66))
* **angular:** removeViewFromDom ([41f54f8](https://github.com/ionic-team/ionic/commit/41f54f8))
* **back-button:** use correct color for ios back button ([b82c382](https://github.com/ionic-team/ionic/commit/b82c382)), closes [#14177](https://github.com/ionic-team/ionic/issues/14177)
* **overlays:** page is removed properly ([9988c75](https://github.com/ionic-team/ionic/commit/9988c75))
* **theming:** update spinner classes to new names ([f578122](https://github.com/ionic-team/ionic/commit/f578122))


### Features

* **angular:** ion-nav ([f39d3ad](https://github.com/ionic-team/ionic/commit/f39d3ad))



<a name="0.1.4-8"></a>
## [0.1.4-8](https://github.com/ionic-team/ionic/compare/v0.1.4-7...v0.1.4-8) (2018-03-19)


### Bug Fixes

* **back-button:** apply the proper color to the back button ([7d2de18](https://github.com/ionic-team/ionic/commit/7d2de18)), closes [#14177](https://github.com/ionic-team/ionic/issues/14177)


### Features

* **nav:** support for rootParams ([50abcf5](https://github.com/ionic-team/ionic/commit/50abcf5))



<a name="0.1.4-7"></a>
## [0.1.4-7](https://github.com/ionic-team/ionic/compare/v0.1.4-6...v0.1.4-7) (2018-03-16)


### Features

* **router:** wildcard redirects ([2bdf4ad](https://github.com/ionic-team/ionic/commit/2bdf4ad))



<a name="0.1.4-6"></a>
## [0.1.4-6](https://github.com/ionic-team/ionic/compare/v0.1.4-5...v0.1.4-6) (2018-03-15)


### Bug Fixes

* **alert:** backdrop calls cancel handler ([de22eca](https://github.com/ionic-team/ionic/commit/de22eca))
* **alert:** set input value ([6e2a9c9](https://github.com/ionic-team/ionic/commit/6e2a9c9))
* **angular:** create angular delegate ([3b5f758](https://github.com/ionic-team/ionic/commit/3b5f758))
* **angular:** fix overlays ([cc4fecc](https://github.com/ionic-team/ionic/commit/cc4fecc))
* **angular:** modal and popover support ([9a0755a](https://github.com/ionic-team/ionic/commit/9a0755a))
* **demos:** fixes angular ([f398b3a](https://github.com/ionic-team/ionic/commit/f398b3a))
* **overlay:** using hostData for zIndex ([64f0866](https://github.com/ionic-team/ionic/commit/64f0866))
* **overlay:** wrong stencil import ([22f6a34](https://github.com/ionic-team/ionic/commit/22f6a34))
* **overlays:** OverlayController interface ([6e2ca85](https://github.com/ionic-team/ionic/commit/6e2ca85))
* **popover:** lifecycles ([b56c2a8](https://github.com/ionic-team/ionic/commit/b56c2a8))
* **router:** ambiguous routes ([b4f46ee](https://github.com/ionic-team/ionic/commit/b4f46ee))
* **router:** fix selection ([207f416](https://github.com/ionic-team/ionic/commit/207f416))
* **router:** rename API to match stencil-router ([e729610](https://github.com/ionic-team/ionic/commit/e729610))
* **router:** retuning string path ([f48d817](https://github.com/ionic-team/ionic/commit/f48d817))
* **toggle:** ios shadow ([7df023a](https://github.com/ionic-team/ionic/commit/7df023a))


### Features

* **ion-router:** dynamic routes ([7c3cba0](https://github.com/ionic-team/ionic/commit/7c3cba0))
* **overlay:** adds lifecycle events ([0b099ce](https://github.com/ionic-team/ionic/commit/0b099ce))
* **overlays:** adds onDidDismiss and onWillDismiss ([7dcf8a5](https://github.com/ionic-team/ionic/commit/7dcf8a5))


### Performance Improvements

* **scss:** optimize multi dir ([#14156](https://github.com/ionic-team/ionic/issues/14156)) ([ba63d01](https://github.com/ionic-team/ionic/commit/ba63d01))



<a name="0.1.4-5"></a>
## [0.1.4-5](https://github.com/ionic-team/ionic/compare/v0.1.4-4...v0.1.4-5) (2018-03-09)


### Bug Fixes

* **item:** button outline ([f671008](https://github.com/ionic-team/ionic/commit/f671008))
* **router:** fix flickering ([f2ac6e3](https://github.com/ionic-team/ionic/commit/f2ac6e3))
* **router:** flickering 2 ([88f2981](https://github.com/ionic-team/ionic/commit/88f2981))
* **router:** tslint ([1ace045](https://github.com/ionic-team/ionic/commit/1ace045))


### Features

* **router:** adds redirectTo ([f5c6333](https://github.com/ionic-team/ionic/commit/f5c6333))



<a name="0.1.4-4"></a>
## [0.1.4-4](https://github.com/ionic-team/ionic/compare/v0.1.4-3...v0.1.4-4) (2018-03-08)


### Bug Fixes

* **back-button:** implements back animation ([64a787a](https://github.com/ionic-team/ionic/commit/64a787a))
* **route:** params is not undefined ([8b6df5a](https://github.com/ionic-team/ionic/commit/8b6df5a))



<a name="0.1.4-3"></a>
## [0.1.4-3](https://github.com/ionic-team/ionic/compare/v0.1.4-2...v0.1.4-3) (2018-03-08)


### Bug Fixes

* **router:** passing params to ion-nav ([d1263a8](https://github.com/ionic-team/ionic/commit/d1263a8))


### Features

* **back-button:** adds defaultHref ([5271f68](https://github.com/ionic-team/ionic/commit/5271f68))
* **nav:** params ([878d7e6](https://github.com/ionic-team/ionic/commit/878d7e6))
* **route:** adds route-link ([4a3030f](https://github.com/ionic-team/ionic/commit/4a3030f))
* **router:** reverse lookup with params ([3ce8a67](https://github.com/ionic-team/ionic/commit/3ce8a67))



<a name="0.1.4-2"></a>
## [0.1.4-2](https://github.com/ionic-team/ionic/compare/v0.1.4-0...v0.1.4-2) (2018-03-07)


### Bug Fixes

* **fab:** add side as a property for fab list ([7387d34](https://github.com/ionic-team/ionic/commit/7387d34))
* **ion-router:** fixes routing algorithm ([c8a27b7](https://github.com/ionic-team/ionic/commit/c8a27b7))
* **item:** href ([540c33b](https://github.com/ionic-team/ionic/commit/540c33b))
* **overlays:** bundling of overlays ([9650bec](https://github.com/ionic-team/ionic/commit/9650bec))
* **router:** invalid url ([c7fe694](https://github.com/ionic-team/ionic/commit/c7fe694))
* **routing:** flickering (part 1) ([7b264f9](https://github.com/ionic-team/ionic/commit/7b264f9))
* **tabs:** do not select when using router ([174d9b5](https://github.com/ionic-team/ionic/commit/174d9b5))


### Features

* **router:** adds parameters ([f29e3f4](https://github.com/ionic-team/ionic/commit/f29e3f4))
* **virtual-scroll:** adds JSX support ([dc8b363](https://github.com/ionic-team/ionic/commit/dc8b363))



<a name="0.1.4-1"></a>
## [0.1.4-1](https://github.com/ionic-team/ionic/compare/v0.1.4-0...v0.1.4-1) (2018-03-07)


### Bug Fixes

* **ion-router:** fixes routing algorithm ([c8a27b7](https://github.com/ionic-team/ionic/commit/c8a27b7))
* **overlays:** bundling of overlays ([9650bec](https://github.com/ionic-team/ionic/commit/9650bec))
* **routing:** flickering (part 1) ([7b264f9](https://github.com/ionic-team/ionic/commit/7b264f9))
* **tabs:** do not select when using router ([174d9b5](https://github.com/ionic-team/ionic/commit/174d9b5))


### Features

* **virtual-scroll:** adds JSX support ([dc8b363](https://github.com/ionic-team/ionic/commit/dc8b363))



<a name="0.1.4-0"></a>
## [0.1.4-0](https://github.com/ionic-team/ionic/compare/v0.1.3...v0.1.4-0) (2018-03-06)

### Refactor

- Refactored navigation system

### Bug Fixes

* **testing:** do not throw error for missing Ionic global ([aa91d11](https://github.com/ionic-team/ionic/commit/aa91d11))
* **zone:** forgot to remove console.logs ([4ec3e48](https://github.com/ionic-team/ionic/commit/4ec3e48))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/ionic-team/ionic/compare/v0.1.2...v0.1.3) (2018-03-03)

### Performance Improvements

* Updates to latest stencil, that includes the zone bypassing abilities.

### Bug Fixes

* **ts:** ts strict fixes ([8ff02c7](https://github.com/ionic-team/ionic/commit/8ff02c7))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/ionic-team/ionic/compare/v0.1.1...v0.1.2) (2018-03-03)


### Performance Improvements

* **events:** bypass ngzone ([7366c38](https://github.com/ionic-team/ionic/commit/7366c38))
* **scroll:** watchdog + simplification ([33a6274](https://github.com/ionic-team/ionic/commit/33a6274))


### Bug Fixes

* **scroll:** clearInterval just to be safe ([6da9882](https://github.com/ionic-team/ionic/commit/6da9882))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/ionic-team/ionic/commit/291e85e61128b2f3101d9cea6b42d4cf751dc481) (2018-03-01)


### Bug Fixes

* **button:** pass the property type instead of hardcoding button ([10e481a](https://github.com/ionic-team/ionic/commit/10e481a))



<a name="0.1.0"></a>

## [0.1.0](https://github.com/ionic-team/ionic/commit/43a8c4c7a719169336a84964fc1c737562d764a6) (2018-03-01)
