# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.5.7](https://github.com/ionic-team/ionic-framework/compare/v7.5.6...v7.5.7) (2023-11-29)


### Bug Fixes

* **alert:** date inputs render correctly in mobile safari ([#28495](https://github.com/ionic-team/ionic-framework/issues/28495)) ([b833f0e](https://github.com/ionic-team/ionic-framework/commit/b833f0e826ddd261230e2e29b70e2dc884d8cb04)), closes [#28494](https://github.com/ionic-team/ionic-framework/issues/28494)
* **datetime:** allow disabling datetime with prefer-wheel ([#28511](https://github.com/ionic-team/ionic-framework/issues/28511)) ([01130e1](https://github.com/ionic-team/ionic-framework/commit/01130e12e1d73bbf558da9d4dffd7122822ff39c))





## [7.5.6](https://github.com/ionic-team/ionic-framework/compare/v7.5.5...v7.5.6) (2023-11-21)


### Bug Fixes

* **alert:** match MD spec on tablet  ([#28501](https://github.com/ionic-team/ionic-framework/issues/28501)) ([6a2be9f](https://github.com/ionic-team/ionic-framework/commit/6a2be9fa3c12a893d98dc139a1575a6e7e3c7c26)), closes [#23977](https://github.com/ionic-team/ionic-framework/issues/23977)
* **datetime:** updating value with min scrolls to new value ([#28549](https://github.com/ionic-team/ionic-framework/issues/28549)) ([388d19e](https://github.com/ionic-team/ionic-framework/commit/388d19e04f83f85abd4602adb04cc71ac575764a)), closes [#28548](https://github.com/ionic-team/ionic-framework/issues/28548)





## [7.5.5](https://github.com/ionic-team/ionic-framework/compare/v7.5.4...v7.5.5) (2023-11-15)


### Bug Fixes

* **accordion-group:** correct accordion is open on load ([#28510](https://github.com/ionic-team/ionic-framework/issues/28510)) ([a000dd2](https://github.com/ionic-team/ionic-framework/commit/a000dd2c0b65be8ab5b2ad19f2748fbca13d5085)), closes [#28506](https://github.com/ionic-team/ionic-framework/issues/28506)
* **action-sheet:** adjust height for safe area with scrollable options ([#28504](https://github.com/ionic-team/ionic-framework/issues/28504)) ([900267e](https://github.com/ionic-team/ionic-framework/commit/900267eb36c36f2af63435f6b46acca52b3bdab7)), closes [#27777](https://github.com/ionic-team/ionic-framework/issues/27777)
* **header:** collapsible large title does not flicker when collapse prop not reflected ([#28472](https://github.com/ionic-team/ionic-framework/issues/28472)) ([8227b0e](https://github.com/ionic-team/ionic-framework/commit/8227b0ee6d5250e122a34a83c644f8a74fbbafd5)), closes [#28466](https://github.com/ionic-team/ionic-framework/issues/28466)
* **item-divider:** apply safe area to proper side regardless of direction ([#28420](https://github.com/ionic-team/ionic-framework/issues/28420)) ([4513e0c](https://github.com/ionic-team/ionic-framework/commit/4513e0c6b066d4990800c707e1d97f69c8fcfb0c))
* **radio-group:** emit value change on componentDidLoad ([#28488](https://github.com/ionic-team/ionic-framework/issues/28488)) ([73b8bfd](https://github.com/ionic-team/ionic-framework/commit/73b8bfde3f060490958c10f58d0f68de80cb957f)), closes [#28356](https://github.com/ionic-team/ionic-framework/issues/28356)
* **searchbar:** cancel icon aligns with back button ([#28478](https://github.com/ionic-team/ionic-framework/issues/28478)) ([c053fd9](https://github.com/ionic-team/ionic-framework/commit/c053fd9c68d9b1add1335db80be962215946a0b1)), closes [#28468](https://github.com/ionic-team/ionic-framework/issues/28468)

> [!NOTE]
> Ionic Vue developers utilizing the `v-ion-change` or `v-ion-input` workaround for https://github.com/ionic-team/ionic-framework/issues/27292 should remove this workaround when updating to Ionic v7.5.5.





## [7.5.4](https://github.com/ionic-team/ionic-framework/compare/v7.5.3...v7.5.4) (2023-11-08)


### Bug Fixes

* **inputs:** remove invalid legacy warnings in input, textarea, and select ([#28484](https://github.com/ionic-team/ionic-framework/issues/28484)) ([c765dcb](https://github.com/ionic-team/ionic-framework/commit/c765dcbac4148762768d8c2bea9103e7d38c510b))
* **item:** apply safe area to proper side regardless of direction ([#28403](https://github.com/ionic-team/ionic-framework/issues/28403)) ([ed040b0](https://github.com/ionic-team/ionic-framework/commit/ed040b09e9cbd4246864e690542132defc6a6578))
* **list:** remove border from last item with item-sliding ([#28439](https://github.com/ionic-team/ionic-framework/issues/28439)) ([cafafcc](https://github.com/ionic-team/ionic-framework/commit/cafafcc9d166ef536dcb73edd522c8f2a0fb95b6)), closes [#28435](https://github.com/ionic-team/ionic-framework/issues/28435)





## [7.5.3](https://github.com/ionic-team/ionic-framework/compare/v7.5.2...v7.5.3) (2023-11-01)


### Bug Fixes

* **alert:** long words wrap to next line ([#28408](https://github.com/ionic-team/ionic-framework/issues/28408)) ([34257d6](https://github.com/ionic-team/ionic-framework/commit/34257d681e9034b0a001aa45e17222f3aab5ed76)), closes [#28406](https://github.com/ionic-team/ionic-framework/issues/28406)
* **angular:** standalone form components do not error when multiple are used ([#28423](https://github.com/ionic-team/ionic-framework/issues/28423)) ([89698b3](https://github.com/ionic-team/ionic-framework/commit/89698b338fb05cde427c98720c238d2365abdaa7)), closes [#28418](https://github.com/ionic-team/ionic-framework/issues/28418)
* **datetime:** allow calendar navigation in readonly mode; disallow keyboard navigation when disabled ([#28336](https://github.com/ionic-team/ionic-framework/issues/28336)) ([f6a6877](https://github.com/ionic-team/ionic-framework/commit/f6a6877044a6d912a92aab00c3c78897da09415d)), closes [#28121](https://github.com/ionic-team/ionic-framework/issues/28121)
* **input, textarea, select:** use consistent sizes ([#28390](https://github.com/ionic-team/ionic-framework/issues/28390)) ([b31ecbb](https://github.com/ionic-team/ionic-framework/commit/b31ecbbfe8deb87604686d752e92e672dd9b277a)), closes [#28388](https://github.com/ionic-team/ionic-framework/issues/28388)
* **list-header:** apply safe area to proper side regardless of direction ([#28371](https://github.com/ionic-team/ionic-framework/issues/28371)) ([f99d530](https://github.com/ionic-team/ionic-framework/commit/f99d5305fb4b1607b42e34a0b7653d8e1b5bf23f))
* **segment:** avoid scrolling webkit bug ([#28376](https://github.com/ionic-team/ionic-framework/issues/28376)) ([8e2f818](https://github.com/ionic-team/ionic-framework/commit/8e2f81867175e9980e6d072b0a4414baae571223)), closes [#28373](https://github.com/ionic-team/ionic-framework/issues/28373)
* **tab-bar:** apply safe area to proper side regardless of direction ([#28372](https://github.com/ionic-team/ionic-framework/issues/28372)) ([d47b7e7](https://github.com/ionic-team/ionic-framework/commit/d47b7e750310ceb2f2c7ecfda8343923ff8d564a))





## [7.5.2](https://github.com/ionic-team/ionic-framework/compare/v7.5.1...v7.5.2) (2023-10-25)


### Bug Fixes

* **alert, action-sheet:** show scrollbar for long list of options ([#28369](https://github.com/ionic-team/ionic-framework/issues/28369)) ([60f3d65](https://github.com/ionic-team/ionic-framework/commit/60f3d6579498ebad75c4f5163fca3947ac2dadff)), closes [#18487](https://github.com/ionic-team/ionic-framework/issues/18487)
* **fab:** apply safe area in positioning to proper side regardless of direction ([#28377](https://github.com/ionic-team/ionic-framework/issues/28377)) ([331c08a](https://github.com/ionic-team/ionic-framework/commit/331c08aad542de158e53ed351705d4c396bb4e90))
* **input, searchbar, textarea:** ensure nativeInput is always available ([#28362](https://github.com/ionic-team/ionic-framework/issues/28362)) ([2b015b2](https://github.com/ionic-team/ionic-framework/commit/2b015b22144e306444f2bf30ace0b5cc7e32a710)), closes [#28283](https://github.com/ionic-team/ionic-framework/issues/28283)
* **menu:** menu no longer disappears with multiple split panes ([#28370](https://github.com/ionic-team/ionic-framework/issues/28370)) ([5a30082](https://github.com/ionic-team/ionic-framework/commit/5a30082546cb19eb98128ca9091b35094841d4f2)), closes [#18683](https://github.com/ionic-team/ionic-framework/issues/18683) [#15538](https://github.com/ionic-team/ionic-framework/issues/15538) [#22341](https://github.com/ionic-team/ionic-framework/issues/22341)
* **rtl:** allow :host to use rtl() ([#28353](https://github.com/ionic-team/ionic-framework/issues/28353)) ([6b7d288](https://github.com/ionic-team/ionic-framework/commit/6b7d288536307fcb49231dca66ab938b389ea85e))





## [7.5.1](https://github.com/ionic-team/ionic-framework/compare/v7.5.0...v7.5.1) (2023-10-18)


### Bug Fixes

* **angular:** do not create duplicate menuController instances ([#28343](https://github.com/ionic-team/ionic-framework/issues/28343)) ([fa78676](https://github.com/ionic-team/ionic-framework/commit/fa78676d57eb80655ee9447ffa07dcfdae0c6b2a)), closes [#28337](https://github.com/ionic-team/ionic-framework/issues/28337)
* **title:** large title transition supports dynamic font scaling ([#28290](https://github.com/ionic-team/ionic-framework/issues/28290)) ([fe47594](https://github.com/ionic-team/ionic-framework/commit/fe47594dc0bbb047f0bade144cf07b084fbeef5e)), closes [#28351](https://github.com/ionic-team/ionic-framework/issues/28351)





# [7.5.0](https://github.com/ionic-team/ionic-framework/compare/v7.4.4...v7.5.0) (2023-10-11)


### Bug Fixes

* **alert:** stop Enter keypress for checkboxes ([#28279](https://github.com/ionic-team/ionic-framework/issues/28279)) ([72b3899](https://github.com/ionic-team/ionic-framework/commit/72b389993df4b0dc392262a106d7949e176b13af))
* **select:** use correct aria-haspopup value ([#28265](https://github.com/ionic-team/ionic-framework/issues/28265)) ([01167fc](https://github.com/ionic-team/ionic-framework/commit/01167fc185db9bbb45b3a4086aff98008a76af2c))
* **toast:** toast does not warn when positionAnchor is undefined ([#28312](https://github.com/ionic-team/ionic-framework/issues/28312)) ([c37b3d8](https://github.com/ionic-team/ionic-framework/commit/c37b3d8bf4b440506fdc96455a532c6316e5673d))


### Features

* **a11y:** add dynamic font scaling ([#28314](https://github.com/ionic-team/ionic-framework/issues/28314)) ([f806781](https://github.com/ionic-team/ionic-framework/commit/f8067819eeb577db163bf3e0f95fc73064d62b8a)), closes [#24638](https://github.com/ionic-team/ionic-framework/issues/24638) [#18592](https://github.com/ionic-team/ionic-framework/issues/18592)
* **angular, react, vue, core:** export openURL utility ([#28295](https://github.com/ionic-team/ionic-framework/issues/28295)) ([6da82aa](https://github.com/ionic-team/ionic-framework/commit/6da82aab816b28bfc174f7634ded1fc1e06502ab)), closes [#27911](https://github.com/ionic-team/ionic-framework/issues/27911)
* **angular:** ship Ionic components as Angular standalone components ([#28311](https://github.com/ionic-team/ionic-framework/issues/28311)) ([57e2476](https://github.com/ionic-team/ionic-framework/commit/57e247637005b10f0d21d5ac5f5232bcb1908301))
* **datetime:** add support for h11 and h24 hour formats ([#28219](https://github.com/ionic-team/ionic-framework/issues/28219)) ([597bc3f](https://github.com/ionic-team/ionic-framework/commit/597bc3f085c5ff1451c73d0cf4d7d664943e712f)), closes [#23750](https://github.com/ionic-team/ionic-framework/issues/23750)
* **toast:** allow custom positioning relative to specific element ([#28248](https://github.com/ionic-team/ionic-framework/issues/28248)) ([897ff6f](https://github.com/ionic-team/ionic-framework/commit/897ff6f7493d8d7e4ab22c6ae59de066b43ce682)), closes [#17499](https://github.com/ionic-team/ionic-framework/issues/17499)





## [7.4.4](https://github.com/ionic-team/ionic-framework/compare/v7.4.3...v7.4.4) (2023-10-11)


### Bug Fixes

* **animation:** play method resolves when animation is stopped ([#28264](https://github.com/ionic-team/ionic-framework/issues/28264)) ([e6031fb](https://github.com/ionic-team/ionic-framework/commit/e6031fbef0698dac0a346cd6202c47f2abf54f95))
* **checkbox, radio, toggle:** disabled elements are not interactive ([#28294](https://github.com/ionic-team/ionic-framework/issues/28294)) ([c70432e](https://github.com/ionic-team/ionic-framework/commit/c70432e6934bcf1d570e1f7cf671c52d2bb52a8b)), closes [#28293](https://github.com/ionic-team/ionic-framework/issues/28293)
* **content:** fullscreen offset is computed correctly with tab bar ([#28245](https://github.com/ionic-team/ionic-framework/issues/28245)) ([7375dd6](https://github.com/ionic-team/ionic-framework/commit/7375dd6abafdf7457f23deb53ad5f016456a6af2)), closes [#21130](https://github.com/ionic-team/ionic-framework/issues/21130)
* **core:** allow fullscreen scroll content to flow outside container for translucent tab bar ([#28246](https://github.com/ionic-team/ionic-framework/issues/28246)) ([b297529](https://github.com/ionic-team/ionic-framework/commit/b297529afc4b93a93f7eaecd31dd5a88a3de5f4e)), closes [#17676](https://github.com/ionic-team/ionic-framework/issues/17676)
* **core:** swipe to go back gesture has priority over other horizontal swipe gestures ([#28304](https://github.com/ionic-team/ionic-framework/issues/28304)) ([d5f0c77](https://github.com/ionic-team/ionic-framework/commit/d5f0c776dfb5cb40b8119c596805dad3adb621e0)), closes [#28303](https://github.com/ionic-team/ionic-framework/issues/28303)
* **header:** collapsible large title main header does not flicker on load ([#28277](https://github.com/ionic-team/ionic-framework/issues/28277)) ([3259da0](https://github.com/ionic-team/ionic-framework/commit/3259da0de181c8f82c38d9de13733213c77d398f)), closes [#27060](https://github.com/ionic-team/ionic-framework/issues/27060)
* **menu:** do not error if disabled or swipeGesture is changed mid-animation ([#28268](https://github.com/ionic-team/ionic-framework/issues/28268)) ([a169044](https://github.com/ionic-team/ionic-framework/commit/a1690441e5bcee8176da32700de6f9e3fde9635e)), closes [#20092](https://github.com/ionic-team/ionic-framework/issues/20092) [#19676](https://github.com/ionic-team/ionic-framework/issues/19676) [#19000](https://github.com/ionic-team/ionic-framework/issues/19000)
* **segment:** scroll to active segment-button on first load ([#28276](https://github.com/ionic-team/ionic-framework/issues/28276)) ([1167a93](https://github.com/ionic-team/ionic-framework/commit/1167a9325fb930b6c727bc26889f5488d9620062)), closes [#28096](https://github.com/ionic-team/ionic-framework/issues/28096)





## [7.4.3](https://github.com/ionic-team/ionic-framework/compare/v7.4.2...v7.4.3) (2023-10-04)


### Bug Fixes

* **fab-button:** position is correct with custom sizes ([#28195](https://github.com/ionic-team/ionic-framework/issues/28195)) ([eb41b55](https://github.com/ionic-team/ionic-framework/commit/eb41b556b57c97139b9c36dc3e3be3711d8afaca)), closes [#22564](https://github.com/ionic-team/ionic-framework/issues/22564)
* **range:** knob positions are correct on initial render with custom elements build ([#28257](https://github.com/ionic-team/ionic-framework/issues/28257)) ([ac2c8e6](https://github.com/ionic-team/ionic-framework/commit/ac2c8e6c22da4d0d8224def24ddef56ee9d26246)), closes [#25444](https://github.com/ionic-team/ionic-framework/issues/25444)





## [7.4.2](https://github.com/ionic-team/ionic-framework/compare/v7.4.1...v7.4.2) (2023-09-27)


### Bug Fixes

* **title:** large title uses custom font on transition ([#28231](https://github.com/ionic-team/ionic-framework/issues/28231)) ([71a7af0](https://github.com/ionic-team/ionic-framework/commit/71a7af0f52fe62937b1dea1ca2739e78801a2a6d))





## [7.4.1](https://github.com/ionic-team/ionic-framework/compare/v7.4.0...v7.4.1) (2023-09-20)


### Bug Fixes

* **overlays:** correctly re-add root to accessibility tree ([#28183](https://github.com/ionic-team/ionic-framework/issues/28183)) ([81714d4](https://github.com/ionic-team/ionic-framework/commit/81714d45bd97f0ba91729959b60a0dc1d1d06533)), closes [#28180](https://github.com/ionic-team/ionic-framework/issues/28180)
* **radio,toggle,checkbox,select:** padded space is clickable in items ([#28136](https://github.com/ionic-team/ionic-framework/issues/28136)) ([5b7e422](https://github.com/ionic-team/ionic-framework/commit/5b7e422dc0bfd4d58fb31f62715af47e62dabb57)), closes [#27169](https://github.com/ionic-team/ionic-framework/issues/27169)
* **range:** knob is not cut off in item with modern syntax ([#28199](https://github.com/ionic-team/ionic-framework/issues/28199)) ([0104d89](https://github.com/ionic-team/ionic-framework/commit/0104d899270d73e16f2850a5fd7d2ba25a9e7ef0)), closes [#27199](https://github.com/ionic-team/ionic-framework/issues/27199)
* **scroll-assist:** improve input scroll accuracy with native resizing ([#28169](https://github.com/ionic-team/ionic-framework/issues/28169)) ([b5c736f](https://github.com/ionic-team/ionic-framework/commit/b5c736f5ac829efebedf3256ddf77ab3daa7a5f6)), closes [#22940](https://github.com/ionic-team/ionic-framework/issues/22940)
* **scroll-assist:** re-run when keyboard changes ([#28174](https://github.com/ionic-team/ionic-framework/issues/28174)) ([3f06da4](https://github.com/ionic-team/ionic-framework/commit/3f06da4cfc0d59c658e17e09ccb1ea28a29339f9)), closes [#22940](https://github.com/ionic-team/ionic-framework/issues/22940)





# [7.4.0](https://github.com/ionic-team/ionic-framework/compare/v7.3.4...v7.4.0) (2023-09-14)


### Bug Fixes

* **datetime:** scroll to newly selected date when value changes ([#27806](https://github.com/ionic-team/ionic-framework/issues/27806)) ([32244fb](https://github.com/ionic-team/ionic-framework/commit/32244fbdd1931e59a9e3cedd2b143c8ee7d01459)), closes [#26391](https://github.com/ionic-team/ionic-framework/issues/26391)
* **many:** add correct scale to stacked labels ([#28163](https://github.com/ionic-team/ionic-framework/issues/28163)) ([8cb8786](https://github.com/ionic-team/ionic-framework/commit/8cb878669e53bad25bbe2787826b6d02d292848a))
* **range:** add correct margin in item ([#28161](https://github.com/ionic-team/ionic-framework/issues/28161)) ([1d2b867](https://github.com/ionic-team/ionic-framework/commit/1d2b867f2207d366e355265b081bc9aabe31ce7e))


### Features

* **checkbox, radio, toggle, range:** stacked labels for form controls ([#28075](https://github.com/ionic-team/ionic-framework/issues/28075)) ([e6c7bb6](https://github.com/ionic-team/ionic-framework/commit/e6c7bb60e7e61c965f45e2bf3e3bd16f5125ad56))
* **datetime:** add disabled part ([#28134](https://github.com/ionic-team/ionic-framework/issues/28134)) ([cd8d509](https://github.com/ionic-team/ionic-framework/commit/cd8d5091a133804ac97d0394354dcf7cd73d9355))
* **datetime:** add parts for calendar day, active, and today ([#27641](https://github.com/ionic-team/ionic-framework/issues/27641)) ([79b005d](https://github.com/ionic-team/ionic-framework/commit/79b005da704c2ce481e1e3bc4d24cdba06a36d04)), closes [#25340](https://github.com/ionic-team/ionic-framework/issues/25340)
* export TransitionOptions interface and getIonPageElement ([#28140](https://github.com/ionic-team/ionic-framework/issues/28140)) ([19f3bb2](https://github.com/ionic-team/ionic-framework/commit/19f3bb23fd5587848fc41a744ca46ef5985c04d2)), closes [#28137](https://github.com/ionic-team/ionic-framework/issues/28137)





## [7.3.4](https://github.com/ionic-team/ionic-framework/compare/v7.3.3...v7.3.4) (2023-09-13)


### Bug Fixes

* **menu:** remove app dir from safe area padding ([#28123](https://github.com/ionic-team/ionic-framework/issues/28123)) ([e0542a7](https://github.com/ionic-team/ionic-framework/commit/e0542a7867871fa45a7fe6a4986e7de633063b4b))





## [7.3.3](https://github.com/ionic-team/ionic-framework/compare/v7.3.2...v7.3.3) (2023-09-06)


### Bug Fixes

* **modal:** swipe to dismiss resets status bar style ([#28110](https://github.com/ionic-team/ionic-framework/issues/28110)) ([176585f](https://github.com/ionic-team/ionic-framework/commit/176585f446b04a6a0cedab2e09417637dbfc78ee)), closes [#28105](https://github.com/ionic-team/ionic-framework/issues/28105)
* **overlays:** prevent overlays from getting stuck open ([#28069](https://github.com/ionic-team/ionic-framework/issues/28069)) ([584e9d3](https://github.com/ionic-team/ionic-framework/commit/584e9d3be220343451c2d4b9bf90658ecd530de1)), closes [#27200](https://github.com/ionic-team/ionic-framework/issues/27200)
* **popover:** dynamic width popover is positioned correctly ([#28072](https://github.com/ionic-team/ionic-framework/issues/28072)) ([2a80eb6](https://github.com/ionic-team/ionic-framework/commit/2a80eb6bd0b16a9dab9bea600bb7f935d25c0e1b)), closes [#27190](https://github.com/ionic-team/ionic-framework/issues/27190) [#24780](https://github.com/ionic-team/ionic-framework/issues/24780)
* **textarea:** cols property is respected ([#28081](https://github.com/ionic-team/ionic-framework/issues/28081)) ([6d4eabc](https://github.com/ionic-team/ionic-framework/commit/6d4eabcc1046c28c1abf69a8bda3e06f80cf3f8f)), closes [#22142](https://github.com/ionic-team/ionic-framework/issues/22142)





## [7.3.2](https://github.com/ionic-team/ionic-framework/compare/v7.3.1...v7.3.2) (2023-08-30)


### Bug Fixes

* **datetime:** gracefully handle invalid min/max ([#28054](https://github.com/ionic-team/ionic-framework/issues/28054)) ([01fc9b4](https://github.com/ionic-team/ionic-framework/commit/01fc9b45116f7ad6ddc56c7fb1535dec798c2b3a)), closes [#28041](https://github.com/ionic-team/ionic-framework/issues/28041)





## [7.3.1](https://github.com/ionic-team/ionic-framework/compare/v7.3.0...v7.3.1) (2023-08-23)


### Bug Fixes

* **input, textarea:** clearOnEdit does not clear when pressing Tab ([#28005](https://github.com/ionic-team/ionic-framework/issues/28005)) ([444acc1](https://github.com/ionic-team/ionic-framework/commit/444acc1f1bca348b62dfb398067cc087529f67f1)), closes [#27746](https://github.com/ionic-team/ionic-framework/issues/27746)





# [7.3.0](https://github.com/ionic-team/ionic-framework/compare/v7.2.4...v7.3.0) (2023-08-16)


### Bug Fixes

* **alert:** radio and checkbox labels wrap to next line ([#27898](https://github.com/ionic-team/ionic-framework/issues/27898)) ([0d3127a](https://github.com/ionic-team/ionic-framework/commit/0d3127ad09df3c914a8c254f14931de5ca3beb31)), closes [#17269](https://github.com/ionic-team/ionic-framework/issues/17269)


### Features

* **action-sheet:** add htmlAttributes property for passing attributes to buttons ([#27863](https://github.com/ionic-team/ionic-framework/issues/27863)) ([5ce4ec0](https://github.com/ionic-team/ionic-framework/commit/5ce4ec0439e4f31aba31062fd8af4a2ad792a54f))
* **alert:** add htmlAttributes property for passing attributes to buttons ([#27862](https://github.com/ionic-team/ionic-framework/issues/27862)) ([06be0e5](https://github.com/ionic-team/ionic-framework/commit/06be0e511164ebdaa6af9a3747d0585260c030a9))
* **toast:** add htmlAttributes property for passing attributes to buttons   ([#27855](https://github.com/ionic-team/ionic-framework/issues/27855)) ([9a68588](https://github.com/ionic-team/ionic-framework/commit/9a685882b7085d911ff09eedacc367629e32348a))
* **toast:** add shadow part for cancel button ([#27921](https://github.com/ionic-team/ionic-framework/issues/27921)) ([e9faf54](https://github.com/ionic-team/ionic-framework/commit/e9faf54d0a7409521706ce9c8b0d26f3fbe9ba41)), closes [#27920](https://github.com/ionic-team/ionic-framework/issues/27920)





## [7.2.4](https://github.com/ionic-team/ionic-framework/compare/v7.2.3...v7.2.4) (2023-08-16)


### Bug Fixes

* **tap-click:** do not error in document-less environment ([#27972](https://github.com/ionic-team/ionic-framework/issues/27972)) ([28bd4ba](https://github.com/ionic-team/ionic-framework/commit/28bd4ba720bb77d5f5c48cd7a45e0015daddc9dd))
* **title:** large title aligns with ios spec ([#27969](https://github.com/ionic-team/ionic-framework/issues/27969)) ([8fa12fc](https://github.com/ionic-team/ionic-framework/commit/8fa12fc88857df27a1ca11249f0085e100fe1474)), closes [#27966](https://github.com/ionic-team/ionic-framework/issues/27966)





## [7.2.3](https://github.com/ionic-team/ionic-framework/compare/v7.2.2...v7.2.3) (2023-08-09)


### Bug Fixes

* **button:** hidden button is added when form is set async ([#27955](https://github.com/ionic-team/ionic-framework/issues/27955)) ([e9fa300](https://github.com/ionic-team/ionic-framework/commit/e9fa30002bd5dec4f2f56a15c84eec1b3e794942)), closes [#27952](https://github.com/ionic-team/ionic-framework/issues/27952)
* **datetime:** changing months work if partially visible ([#27917](https://github.com/ionic-team/ionic-framework/issues/27917)) ([eb19c28](https://github.com/ionic-team/ionic-framework/commit/eb19c289d6581639f6df7aff002bebdf2b27d31c)), closes [#27913](https://github.com/ionic-team/ionic-framework/issues/27913)
* **item-sliding:** account for options added before watcher ([#27915](https://github.com/ionic-team/ionic-framework/issues/27915)) ([a0b3ef0](https://github.com/ionic-team/ionic-framework/commit/a0b3ef02af718e232246515bb873ad8c090fa55d)), closes [#27910](https://github.com/ionic-team/ionic-framework/issues/27910)
* **many:** overlays present if isOpen is true on load ([#27933](https://github.com/ionic-team/ionic-framework/issues/27933)) ([a0e6ac6](https://github.com/ionic-team/ionic-framework/commit/a0e6ac6013552c5e3acdde33575d4aaf4d4c0bda)), closes [#27928](https://github.com/ionic-team/ionic-framework/issues/27928)
* **modal:** setCurrentBreakpoint respects animated prop ([#27924](https://github.com/ionic-team/ionic-framework/issues/27924)) ([da55ab9](https://github.com/ionic-team/ionic-framework/commit/da55ab949ef1894738da5a6241176089b7a2b6e3)), closes [#27923](https://github.com/ionic-team/ionic-framework/issues/27923)
* **nav:** improve reliability of swipe back gesture when quickly swiping back ([#27904](https://github.com/ionic-team/ionic-framework/issues/27904)) ([9500769](https://github.com/ionic-team/ionic-framework/commit/9500769f114d180613f0340b1a328b5e631b7188)), closes [#27893](https://github.com/ionic-team/ionic-framework/issues/27893)





## [7.2.2](https://github.com/ionic-team/ionic-framework/compare/v7.2.1...v7.2.2) (2023-08-02)


### Bug Fixes

* **datetime-button:** render correct text when passing partial date values ([#27816](https://github.com/ionic-team/ionic-framework/issues/27816)) ([bd1910b](https://github.com/ionic-team/ionic-framework/commit/bd1910ba69348877ad5f99d9db2b59d06693b91e)), closes [#27797](https://github.com/ionic-team/ionic-framework/issues/27797)
* **input, textarea:** input does not block floating label ([#27870](https://github.com/ionic-team/ionic-framework/issues/27870)) ([f14c440](https://github.com/ionic-team/ionic-framework/commit/f14c440d6321ef9f168b272338e5cd21cab384ef)), closes [#27812](https://github.com/ionic-team/ionic-framework/issues/27812)
* **item-options:** use correct safe area padding ([#27853](https://github.com/ionic-team/ionic-framework/issues/27853)) ([0b8f1bc](https://github.com/ionic-team/ionic-framework/commit/0b8f1bc7dd4170a2a8c9ed3aede173dd489b25ea))
* **radio:** radios can be focused and are announced with group ([#27817](https://github.com/ionic-team/ionic-framework/issues/27817)) ([ba2f49b](https://github.com/ionic-team/ionic-framework/commit/ba2f49b8a460520d20ac198db800ea2d9e5b015f)), closes [#27438](https://github.com/ionic-team/ionic-framework/issues/27438)
* **select:** popover uses modern form syntax ([#27818](https://github.com/ionic-team/ionic-framework/issues/27818)) ([0c117cf](https://github.com/ionic-team/ionic-framework/commit/0c117cfe7f383b7c7837d27de5a6eee12ddd6c2f)), closes [#27071](https://github.com/ionic-team/ionic-framework/issues/27071) [#27786](https://github.com/ionic-team/ionic-framework/issues/27786)





## [7.2.1](https://github.com/ionic-team/ionic-framework/compare/v7.2.0...v7.2.1) (2023-07-26)


### Bug Fixes

* **item-sliding:** buttons are not interactive on close ([#27829](https://github.com/ionic-team/ionic-framework/issues/27829)) ([6e4919c](https://github.com/ionic-team/ionic-framework/commit/6e4919caff90fc60988e5cc85ad7161844eb5b51)), closes [#22722](https://github.com/ionic-team/ionic-framework/issues/22722)
* **modal:** body background is reset with inline card modals ([#27835](https://github.com/ionic-team/ionic-framework/issues/27835)) ([38626d9](https://github.com/ionic-team/ionic-framework/commit/38626d96809d1c6be523ea62a4fac1dec73ee891)), closes [#27830](https://github.com/ionic-team/ionic-framework/issues/27830)





# [7.2.0](https://github.com/ionic-team/ionic-framework/compare/v7.1.4...v7.2.0) (2023-07-19)


### Features

* **button:** allow button to increase in height when text wraps ([#27547](https://github.com/ionic-team/ionic-framework/issues/27547)) ([6fe716f](https://github.com/ionic-team/ionic-framework/commit/6fe716fd1320935632854e5d4f741b57801bda92))
* **searchbar:** add name property ([#27737](https://github.com/ionic-team/ionic-framework/issues/27737)) ([7131037](https://github.com/ionic-team/ionic-framework/commit/71310372c94862342d607007ece127340df92a8c)), closes [#27675](https://github.com/ionic-team/ionic-framework/issues/27675)





## [7.1.4](https://github.com/ionic-team/ionic-framework/compare/v7.1.3...v7.1.4) (2023-07-19)


### Bug Fixes

* **angular:** menu button is enabled with Angular Universal builds ([#27814](https://github.com/ionic-team/ionic-framework/issues/27814)) ([2cf1a0b](https://github.com/ionic-team/ionic-framework/commit/2cf1a0bcae7d766aa25951c53470876f9569906c)), closes [#27524](https://github.com/ionic-team/ionic-framework/issues/27524) [#22206](https://github.com/ionic-team/ionic-framework/issues/22206)
* **button:** submit form when pressing enter key ([#27790](https://github.com/ionic-team/ionic-framework/issues/27790)) ([b78af75](https://github.com/ionic-team/ionic-framework/commit/b78af7598f19ca5e1b440ddc0091a62d86321066)), closes [#19368](https://github.com/ionic-team/ionic-framework/issues/19368)
* **radio, checkbox, toggle:** add top and bottom margins when in ion-item ([#27788](https://github.com/ionic-team/ionic-framework/issues/27788)) ([35f0ec5](https://github.com/ionic-team/ionic-framework/commit/35f0ec581a55e0cb080f0793fb94d3e424c06d4d)), closes [#27498](https://github.com/ionic-team/ionic-framework/issues/27498)
* safari no longer adjusts text in landscape ([#27787](https://github.com/ionic-team/ionic-framework/issues/27787)) ([66584b0](https://github.com/ionic-team/ionic-framework/commit/66584b03d0b33507170f954009998c72fb3f7755)), closes [#27782](https://github.com/ionic-team/ionic-framework/issues/27782)
* **textarea:** stacked/floating textarea size is correct on safari ([#27766](https://github.com/ionic-team/ionic-framework/issues/27766)) ([2cb7013](https://github.com/ionic-team/ionic-framework/commit/2cb701395487c6a0304400f6b821659ae6def820)), closes [#27345](https://github.com/ionic-team/ionic-framework/issues/27345)





## [7.1.3](https://github.com/ionic-team/ionic-framework/compare/v7.1.2...v7.1.3) (2023-07-12)


### Bug Fixes

* avoid unresolved import warning on stencil apps ([#27765](https://github.com/ionic-team/ionic-framework/issues/27765)) ([2085025](https://github.com/ionic-team/ionic-framework/commit/2085025644f075e63d04bece56eca4f2beeadbb6)), closes [#27762](https://github.com/ionic-team/ionic-framework/issues/27762)
* **overlays:** first button is not focused on backdrop tap ([#27774](https://github.com/ionic-team/ionic-framework/issues/27774)) ([82c568b](https://github.com/ionic-team/ionic-framework/commit/82c568b8c8e1e9934e1928452aa5216619290e7b)), closes [#27773](https://github.com/ionic-team/ionic-framework/issues/27773)





## [7.1.2](https://github.com/ionic-team/ionic-framework/compare/v7.1.1...v7.1.2) (2023-07-06)


### Bug Fixes

* **back-button:** show correct background on focus + hover with ios ([#27723](https://github.com/ionic-team/ionic-framework/issues/27723)) ([db9a001](https://github.com/ionic-team/ionic-framework/commit/db9a0010df3c7fd0fcd0dbcd8c4ad3b30d022b5c)), closes [#27722](https://github.com/ionic-team/ionic-framework/issues/27722)
* **nav:** root component is mounted with root params ([#27676](https://github.com/ionic-team/ionic-framework/issues/27676)) ([1f06be4](https://github.com/ionic-team/ionic-framework/commit/1f06be4a31965f2a949b4866a585aee6af0af29d)), closes [#27146](https://github.com/ionic-team/ionic-framework/issues/27146)





## [7.1.1](https://github.com/ionic-team/ionic-framework/compare/v7.1.0...v7.1.1) (2023-06-26)


### Bug Fixes

* **textarea:** autogrow resizes correctly ([#27691](https://github.com/ionic-team/ionic-framework/issues/27691)) ([f263611](https://github.com/ionic-team/ionic-framework/commit/f263611260c465bfeefc2db7b1ea04bfa5b54303)), closes [#27688](https://github.com/ionic-team/ionic-framework/issues/27688)





# [7.1.0](https://github.com/ionic-team/ionic-framework/compare/v7.0.14...v7.1.0) (2023-06-21)


### Bug Fixes

* **datetime:** ascending order for years ([#27551](https://github.com/ionic-team/ionic-framework/issues/27551)) ([2098806](https://github.com/ionic-team/ionic-framework/commit/209880622a4600f88c4878e82975ad0492bd55db)), closes [#27422](https://github.com/ionic-team/ionic-framework/issues/27422)
* **select:** hide notch cutout if no visible label provided ([#27649](https://github.com/ionic-team/ionic-framework/issues/27649)) ([606a892](https://github.com/ionic-team/ionic-framework/commit/606a892e400a531cac5c413dc7492a54ae0e1fea))


### Features

* **datetime:** add part for month/year button ([#27618](https://github.com/ionic-team/ionic-framework/issues/27618)) ([d44422e](https://github.com/ionic-team/ionic-framework/commit/d44422e224374804010746a12f398d3c0d6a9f2c)), closes [#26596](https://github.com/ionic-team/ionic-framework/issues/26596)
* **datetime:** add shadow parts and CSS variables for styling wheel pickers ([#27529](https://github.com/ionic-team/ionic-framework/issues/27529)) ([f2c1845](https://github.com/ionic-team/ionic-framework/commit/f2c1845fba11d8273331c601052f0f34457b6649)), closes [#25945](https://github.com/ionic-team/ionic-framework/issues/25945)
* **input:** add experimental label slot ([#27650](https://github.com/ionic-team/ionic-framework/issues/27650)) ([a45395c](https://github.com/ionic-team/ionic-framework/commit/a45395cc02b2617b80e6c2389fa745e7c20540fc)), closes [#27061](https://github.com/ionic-team/ionic-framework/issues/27061)
* **range:** add label prop ([#27408](https://github.com/ionic-team/ionic-framework/issues/27408)) ([368add2](https://github.com/ionic-team/ionic-framework/commit/368add2a5ca3820a1f9623c96d29bcccfa693fdc))
* **segment, segment-button:** update segment value property to accept numbers ([#27222](https://github.com/ionic-team/ionic-framework/issues/27222)) ([ec95ae5](https://github.com/ionic-team/ionic-framework/commit/ec95ae5cd38e3d2b9ec9fdbc9e237fa1241f7a4e)), closes [#27221](https://github.com/ionic-team/ionic-framework/issues/27221)
* **segment:** display segment as a grid and add an ellipsis to overflowing text in a segment button  ([#27457](https://github.com/ionic-team/ionic-framework/issues/27457)) ([448e63f](https://github.com/ionic-team/ionic-framework/commit/448e63fef0aca603214cb357dec37e1db2a0f052)), closes [#16532](https://github.com/ionic-team/ionic-framework/issues/16532)
* **select:** add label slot ([#27545](https://github.com/ionic-team/ionic-framework/issues/27545)) ([af92cb2](https://github.com/ionic-team/ionic-framework/commit/af92cb28c8819c88b40192b5dcbafedc1eb2064a)), closes [#26838](https://github.com/ionic-team/ionic-framework/issues/26838)
* **select:** add props to customize toggle icons ([#27648](https://github.com/ionic-team/ionic-framework/issues/27648)) ([95e28b6](https://github.com/ionic-team/ionic-framework/commit/95e28b6629843af7dce62f20bc8e31adfb391990)), closes [#17248](https://github.com/ionic-team/ionic-framework/issues/17248)
* **select:** expose container and label as CSS parts  ([#27541](https://github.com/ionic-team/ionic-framework/issues/27541)) ([5c10f88](https://github.com/ionic-team/ionic-framework/commit/5c10f88b2eb4d869966ea9a6d1db34185cefe676)), closes [#27112](https://github.com/ionic-team/ionic-framework/issues/27112)
* **textarea:** add experimental label slot ([#27677](https://github.com/ionic-team/ionic-framework/issues/27677)) ([8bcd9e8](https://github.com/ionic-team/ionic-framework/commit/8bcd9e8b35f252a4efaec7a7be7d69a70beefa9f)), closes [#27061](https://github.com/ionic-team/ionic-framework/issues/27061)





## [7.0.14](https://github.com/ionic-team/ionic-framework/compare/v7.0.13...v7.0.14) (2023-06-15)


### Bug Fixes

* **keyboard:** keyboard events emit correctly when Capacitor is available but the Keyboard plugin is not ([#27655](https://github.com/ionic-team/ionic-framework/issues/27655)) ([7a38a00](https://github.com/ionic-team/ionic-framework/commit/7a38a006a94f1240d93102f2f42bbfc4d76a679e)), closes [#27654](https://github.com/ionic-team/ionic-framework/issues/27654)
* **toast:** allow color for translucent toast ([#27652](https://github.com/ionic-team/ionic-framework/issues/27652)) ([d555375](https://github.com/ionic-team/ionic-framework/commit/d555375c146639b32e85c57a8cdd4d52313ef4cf)), closes [#27567](https://github.com/ionic-team/ionic-framework/issues/27567)





## [7.0.13](https://github.com/ionic-team/ionic-framework/compare/v7.0.12...v7.0.13) (2023-06-14)


### Bug Fixes

* **react:** onDoubleClick fires on components ([#27611](https://github.com/ionic-team/ionic-framework/issues/27611)) ([3e191df](https://github.com/ionic-team/ionic-framework/commit/3e191df3dd43dcdd5a5f717166d4db9834340a2b)), closes [#21320](https://github.com/ionic-team/ionic-framework/issues/21320)





## [7.0.12](https://github.com/ionic-team/ionic-framework/compare/v7.0.11...v7.0.12) (2023-06-08)


### Bug Fixes

* **refresher:** scroll styles are reset when using non-native refresher ([#27602](https://github.com/ionic-team/ionic-framework/issues/27602)) ([92c5545](https://github.com/ionic-team/ionic-framework/commit/92c55452fdf4ac7b8d15ce75a4e867aab9321cfb)), closes [#27601](https://github.com/ionic-team/ionic-framework/issues/27601)





## [7.0.11](https://github.com/ionic-team/ionic-framework/compare/v7.0.9...v7.0.11) (2023-06-07)


### Bug Fixes

* **header, footer:** resolve CSP violations with box shadow ([#27560](https://github.com/ionic-team/ionic-framework/issues/27560)) ([e75fa58](https://github.com/ionic-team/ionic-framework/commit/e75fa582c4ca507b09f62bbce649f02ca49da7a0))
* **item-sliding:** refresh sliding behavior when options are added or removed asynchronously ([#27572](https://github.com/ionic-team/ionic-framework/issues/27572)) ([b2a226a](https://github.com/ionic-team/ionic-framework/commit/b2a226ae663695be0666cd862510d8d843c80b9a)), closes [#25578](https://github.com/ionic-team/ionic-framework/issues/25578)
* **keyboard:** listen on correct events for keyboard lifecycle ([#27569](https://github.com/ionic-team/ionic-framework/issues/27569)) ([7871210](https://github.com/ionic-team/ionic-framework/commit/7871210e9e4ecc09353b821b60f977498a01ee8d)), closes [#27558](https://github.com/ionic-team/ionic-framework/issues/27558)
* **radio:** radio with modern syntax is keyboard navigable ([#27530](https://github.com/ionic-team/ionic-framework/issues/27530)) ([d87e692](https://github.com/ionic-team/ionic-framework/commit/d87e692c6c2c3d146514b093853d5e262137a9e5)), closes [#27268](https://github.com/ionic-team/ionic-framework/issues/27268)
* **select:** prevent click event from firing twice ([#27570](https://github.com/ionic-team/ionic-framework/issues/27570)) ([ba7e60e](https://github.com/ionic-team/ionic-framework/commit/ba7e60e8669b1980b9a0c6267617894e16b4a2d4))


### Performance Improvements

* passive event listener for focus visible ([#27568](https://github.com/ionic-team/ionic-framework/issues/27568)) ([e54bf14](https://github.com/ionic-team/ionic-framework/commit/e54bf142c39743913d982a1f1709629b4b034969)), closes [#27566](https://github.com/ionic-team/ionic-framework/issues/27566)





## [7.0.10](https://github.com/ionic-team/ionic-framework/compare/v7.0.9...v7.0.10) (2023-05-31)


### Performance Improvements

* passive event listener for focus visible ([#27568](https://github.com/ionic-team/ionic-framework/issues/27568)) ([e54bf14](https://github.com/ionic-team/ionic-framework/commit/e54bf142c39743913d982a1f1709629b4b034969)), closes [#27566](https://github.com/ionic-team/ionic-framework/issues/27566)





## [7.0.9](https://github.com/ionic-team/ionic-framework/compare/v7.0.8...v7.0.9) (2023-05-25)


### Bug Fixes

* **core:** handle uncaught native keyboard exceptions ([#27514](https://github.com/ionic-team/ionic-framework/issues/27514)) ([0e7359c](https://github.com/ionic-team/ionic-framework/commit/0e7359c07f53eccb362ff2bf331396c0376ba6f3)), closes [#27503](https://github.com/ionic-team/ionic-framework/issues/27503)
* **segment:** remove duplicate ripple effect on pointerup ([#27448](https://github.com/ionic-team/ionic-framework/issues/27448)) ([01f9959](https://github.com/ionic-team/ionic-framework/commit/01f99597f71b35a60a70f6d76c1e3e1917978d6d)), closes [#27338](https://github.com/ionic-team/ionic-framework/issues/27338)





## [7.0.8](https://github.com/ionic-team/ionic-framework/compare/v7.0.7...v7.0.8) (2023-05-24)


### Bug Fixes

* **many:** update form controls (radio, checkbox, toggle, input, select) to have consistent disabled opacity ([#27396](https://github.com/ionic-team/ionic-framework/issues/27396)) ([995a848](https://github.com/ionic-team/ionic-framework/commit/995a8485751bb4058a59c7e958b1200f8f6539fa)), closes [#27184](https://github.com/ionic-team/ionic-framework/issues/27184)
* **picker-column:** correct RTL direction ([#27460](https://github.com/ionic-team/ionic-framework/issues/27460)) ([d3dd72f](https://github.com/ionic-team/ionic-framework/commit/d3dd72fff67b3b437106e187e75f798653d105e2)), closes [#21205](https://github.com/ionic-team/ionic-framework/issues/21205)
* **popover:** blur translucent popover in chromium ([#27484](https://github.com/ionic-team/ionic-framework/issues/27484)) ([a59eefb](https://github.com/ionic-team/ionic-framework/commit/a59eefb6a312d338895c46d80320ebe91cccac23)), closes [#22176](https://github.com/ionic-team/ionic-framework/issues/22176)





## [7.0.7](https://github.com/ionic-team/ionic-framework/compare/v7.0.6...v7.0.7) (2023-05-17)


### Bug Fixes

* **accordion:** state updates if value changes ([#27463](https://github.com/ionic-team/ionic-framework/issues/27463)) ([3cbc592](https://github.com/ionic-team/ionic-framework/commit/3cbc592154a2b76cf63dfef67cb63de94dcec887)), closes [#27461](https://github.com/ionic-team/ionic-framework/issues/27461)
* **checkbox, radio:** update border colors to match MD2 spec ([#27357](https://github.com/ionic-team/ionic-framework/issues/27357)) ([eabc6f3](https://github.com/ionic-team/ionic-framework/commit/eabc6f357675919dd82bea29a1776c0ca1bf89fd)), closes [#27170](https://github.com/ionic-team/ionic-framework/issues/27170)
* **datetime-button:** log error if non-datetime instance is passed ([#27456](https://github.com/ionic-team/ionic-framework/issues/27456)) ([7b7e05a](https://github.com/ionic-team/ionic-framework/commit/7b7e05aa697a51ebfac42f96aa9510d4d96336de))
* **footer, tab-bar:** wait for resize before re-showing ([#27417](https://github.com/ionic-team/ionic-framework/issues/27417)) ([70d9854](https://github.com/ionic-team/ionic-framework/commit/70d9854d8df5259ed715e282a6ca40ca3bea6192)), closes [#25990](https://github.com/ionic-team/ionic-framework/issues/25990)
* **many:** form controls labels have increased margin ([#27447](https://github.com/ionic-team/ionic-framework/issues/27447)) ([381de0b](https://github.com/ionic-team/ionic-framework/commit/381de0b3d324805161232d8556fffd7022fcd84c)), closes [#27129](https://github.com/ionic-team/ionic-framework/issues/27129)
* **picker-column:** dynamically change options ([#27359](https://github.com/ionic-team/ionic-framework/issues/27359)) ([7c7fb2b](https://github.com/ionic-team/ionic-framework/commit/7c7fb2b1a3bf35b123716b2f975231ceb01dcc07)), closes [#21763](https://github.com/ionic-team/ionic-framework/issues/21763)
* **picker-column:** prevSelected is set to the correct value ([#27458](https://github.com/ionic-team/ionic-framework/issues/27458)) ([9dc126d](https://github.com/ionic-team/ionic-framework/commit/9dc126d38727c1ca16a75cfa65daab9a630be678)), closes [#21764](https://github.com/ionic-team/ionic-framework/issues/21764)
* **select:** floating label covers placeholder when when blurred ([#27446](https://github.com/ionic-team/ionic-framework/issues/27446)) ([921bfae](https://github.com/ionic-team/ionic-framework/commit/921bfae9e68257734a9695cab9245bb335eb88fa)), closes [#27201](https://github.com/ionic-team/ionic-framework/issues/27201)
* **select:** modern syntax works with forms ([#27480](https://github.com/ionic-team/ionic-framework/issues/27480)) ([13d2d11](https://github.com/ionic-team/ionic-framework/commit/13d2d115d44f109c3ea2a47bcb518c6090126325)), closes [#27478](https://github.com/ionic-team/ionic-framework/issues/27478)
* **spinner:** allow resizing of dots, bubbles, and circles ([#27424](https://github.com/ionic-team/ionic-framework/issues/27424)) ([e5ae45d](https://github.com/ionic-team/ionic-framework/commit/e5ae45d32fde7328a704a6ffa18940106a069fa2)), closes [#18115](https://github.com/ionic-team/ionic-framework/issues/18115)
* **tab-button:** use darker text to pass a11y ([#27355](https://github.com/ionic-team/ionic-framework/issues/27355)) ([0b23814](https://github.com/ionic-team/ionic-framework/commit/0b23814e0ba167ee6b2a2e430c47823d312d8c3c))





## [7.0.6](https://github.com/ionic-team/ionic-framework/compare/v7.0.5...v7.0.6) (2023-05-11)


### Bug Fixes

* **content:** prevent forceUpdate in SSR ([#27440](https://github.com/ionic-team/ionic-framework/issues/27440)) ([e930988](https://github.com/ionic-team/ionic-framework/commit/e9309880d18cf03c1c139b00fe4b80794804e3de)), closes [#27411](https://github.com/ionic-team/ionic-framework/issues/27411)
* **item-sliding:** options display on rtl ([#27203](https://github.com/ionic-team/ionic-framework/issues/27203)) ([b16fd1d](https://github.com/ionic-team/ionic-framework/commit/b16fd1d6f962f8fb6a57eb8301ecd904e1ca2153)), closes [#26103](https://github.com/ionic-team/ionic-framework/issues/26103) [#25285](https://github.com/ionic-team/ionic-framework/issues/25285)
* **modal, popover:** wait for contents to mount ([#27344](https://github.com/ionic-team/ionic-framework/issues/27344)) ([c98ad6f](https://github.com/ionic-team/ionic-framework/commit/c98ad6f16ab147024fb74c179218fd8ff7f87db1)), closes [#27343](https://github.com/ionic-team/ionic-framework/issues/27343)
* **overlays:** assign incremental id to overlay host ([#27278](https://github.com/ionic-team/ionic-framework/issues/27278)) ([9313a91](https://github.com/ionic-team/ionic-framework/commit/9313a914b7802dd4327caa970906ea18e882a3ce))
* **range:** round value to same number of decimal places as props to avoid floating point rounding errors ([#27375](https://github.com/ionic-team/ionic-framework/issues/27375)) ([6e83ba4](https://github.com/ionic-team/ionic-framework/commit/6e83ba4051922da0a179a370d5baa0c57df8b01d)), closes [#21968](https://github.com/ionic-team/ionic-framework/issues/21968)
* **types:** export DatetimeHighlightStyle ([#27360](https://github.com/ionic-team/ionic-framework/issues/27360)) ([a37cdb1](https://github.com/ionic-team/ionic-framework/commit/a37cdb1c5ddab96e2e95369cc4e4b04a5ef0c5c7)), closes [#27353](https://github.com/ionic-team/ionic-framework/issues/27353)





## [7.0.5](https://github.com/ionic-team/ionic-framework/compare/v7.0.4...v7.0.5) (2023-05-03)


### Bug Fixes

* **many:** form components do not take up full width in slot ([#27306](https://github.com/ionic-team/ionic-framework/issues/27306)) ([bfe7b38](https://github.com/ionic-team/ionic-framework/commit/bfe7b388318aca98014a0748f678e41a0f3910ae)), closes [#27305](https://github.com/ionic-team/ionic-framework/issues/27305)
* **scroll-assist:** set correct scroll padding ([#27261](https://github.com/ionic-team/ionic-framework/issues/27261)) ([7e1f996](https://github.com/ionic-team/ionic-framework/commit/7e1f996dc63cd414b30b22aebbfc09b0b6b4f6fc)), closes [#27257](https://github.com/ionic-team/ionic-framework/issues/27257)
* **toggle:** swipe gesture applies to knob ([#27255](https://github.com/ionic-team/ionic-framework/issues/27255)) ([6524582](https://github.com/ionic-team/ionic-framework/commit/65245826e3a775bcb8a5d6cfd05230f53470fc66)), closes [#27254](https://github.com/ionic-team/ionic-framework/issues/27254)





## [7.0.4](https://github.com/ionic-team/ionic-framework/compare/v7.0.3...v7.0.4) (2023-04-26)


### Bug Fixes

* **breadcumb:** set background when focused on md ([#27274](https://github.com/ionic-team/ionic-framework/issues/27274)) ([01e028b](https://github.com/ionic-team/ionic-framework/commit/01e028b789f84e80f20ce2be7be7f8519f925211)), closes [#27273](https://github.com/ionic-team/ionic-framework/issues/27273)
* **ios:** scroll assist sizes input correctly ([#27253](https://github.com/ionic-team/ionic-framework/issues/27253)) ([a874992](https://github.com/ionic-team/ionic-framework/commit/a8749929e01b07043631fbc8c522d39cbc3ae798)), closes [#27249](https://github.com/ionic-team/ionic-framework/issues/27249)
* **modal:** set default text color ([#27207](https://github.com/ionic-team/ionic-framework/issues/27207)) ([c267b43](https://github.com/ionic-team/ionic-framework/commit/c267b43396057d9fab344a30bd83d00523911dc1)), closes [#26060](https://github.com/ionic-team/ionic-framework/issues/26060) [/github.com/ionic-team/ionic-framework/blob/main/core/src/components/popover/popover.scss#L42](https://github.com//github.com/ionic-team/ionic-framework/blob/main/core/src/components/popover/popover.scss/issues/L42)
* **select:** adjust label alignment when in a card ([#27202](https://github.com/ionic-team/ionic-framework/issues/27202)) ([5a2b87c](https://github.com/ionic-team/ionic-framework/commit/5a2b87cbcc5c789d02b29e776e2b9768d7ad5631)), closes [#27086](https://github.com/ionic-team/ionic-framework/issues/27086)





## [7.0.3](https://github.com/ionic-team/ionic/compare/v7.0.1...v7.0.3) (2023-04-19)


### Bug Fixes

* **accordion:** inset style respects animated property ([#27173](https://github.com/ionic-team/ionic/issues/27173)) ([114fe28](https://github.com/ionic-team/ionic/commit/114fe28f3cc9ee52bc5eefa569353f490ab01023)), closes [#27047](https://github.com/ionic-team/ionic/issues/27047)
* **datetime:** clamp date between min and max when using month picker ([#27185](https://github.com/ionic-team/ionic/issues/27185)) ([0385c08](https://github.com/ionic-team/ionic/commit/0385c0862c98c9387b38d3a4416d74a2cc132ddd)), closes [#27027](https://github.com/ionic-team/ionic/issues/27027)
* **input:** string values are emitted ([#27226](https://github.com/ionic-team/ionic/issues/27226)) ([cdb0627](https://github.com/ionic-team/ionic/commit/cdb0627c87299ba36da670c81f9d4e3446bb500d))
* **item:** ios active state has correct contrast ([#27134](https://github.com/ionic-team/ionic/issues/27134)) ([bbdb0ca](https://github.com/ionic-team/ionic/commit/bbdb0ca480d7cd46c030d1947ced712653cf122b)), closes [#000](https://github.com/ionic-team/ionic/issues/000) [#000](https://github.com/ionic-team/ionic/issues/000)
* **many:** dynamic label support for modern form controls ([#27156](https://github.com/ionic-team/ionic/issues/27156)) ([30b548b](https://github.com/ionic-team/ionic/commit/30b548b167883f0a657b0410d3bcf76dbb6895e0)), closes [#27085](https://github.com/ionic-team/ionic/issues/27085)
* **menu:** export menu interfaces ([#27227](https://github.com/ionic-team/ionic/issues/27227)) ([80d8c66](https://github.com/ionic-team/ionic/commit/80d8c667666ffdb6b8e668ef94cc58a93045bd0e))
* **menu:** refs are not destroyed on unmount ([#27141](https://github.com/ionic-team/ionic/issues/27141)) ([b81b0d1](https://github.com/ionic-team/ionic/commit/b81b0d14258d7b8caf028e6cfe81772ed2f5f119)), closes [/github.com/ionic-team/ionic-framework/blob/687b37ad3e3237b874473817bb7b59143ac113ce/packages/core/src/components/menu/menu.tsx#L136-L137](https://github.com//github.com/ionic-team/ionic-framework/blob/687b37ad3e3237b874473817bb7b59143ac113ce/packages/core/src/components/menu/menu.tsx/issues/L136-L137)
* **radio:** takes up full height in item ([#27168](https://github.com/ionic-team/ionic/issues/27168)) ([987c79f](https://github.com/ionic-team/ionic/commit/987c79f05b6791084c4526d80c8c28a28047dd58)), closes [/github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/checkbox/checkbox.scss#L42](https://github.com//github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/checkbox/checkbox.scss/issues/L42) [/github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/toggle/toggle.scss#L43](https://github.com//github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/toggle/toggle.scss/issues/L43)
* **segment-button:** update checked state on render ([#26970](https://github.com/ionic-team/ionic/issues/26970)) ([16aa977](https://github.com/ionic-team/ionic/commit/16aa9770bba983705d807ad363498693a0e7969b)), closes [#26830](https://github.com/ionic-team/ionic/issues/26830)
* **segment:** segment disables segment buttons created asyncronously ([#27155](https://github.com/ionic-team/ionic/issues/27155)) ([ad6b130](https://github.com/ionic-team/ionic/commit/ad6b1301cf8528f7c9ad3c52730f01861117b380))
* **select:** respect --border-radius with modern template ([#27213](https://github.com/ionic-team/ionic/issues/27213)) ([6ffbdbb](https://github.com/ionic-team/ionic/commit/6ffbdbb3b2b69290cf25753d535bc7483bd7c6e8)), closes [#27208](https://github.com/ionic-team/ionic/issues/27208)
* **select:** text does not overlap icon ([#27125](https://github.com/ionic-team/ionic/issues/27125)) ([6fc0024](https://github.com/ionic-team/ionic/commit/6fc002458ad23b129a214fd34d3a2fdc33800373)), closes [#27081](https://github.com/ionic-team/ionic/issues/27081)
* **textarea:** legacy textarea respects padding ([#27219](https://github.com/ionic-team/ionic/issues/27219)) ([742d429](https://github.com/ionic-team/ionic/commit/742d4295ddfe40c643d9dd21ffc6d9fb3eb6f717)), closes [#27218](https://github.com/ionic-team/ionic/issues/27218)
* **toast:** screen readers announce content ([#27198](https://github.com/ionic-team/ionic/issues/27198)) ([76c8b94](https://github.com/ionic-team/ionic/commit/76c8b94e2a818e1b824701b788d5ed8b6e554d42)), closes [#25866](https://github.com/ionic-team/ionic/issues/25866)
* **vue:** components have correct name in Vue Dev Tools ([#27180](https://github.com/ionic-team/ionic/issues/27180)) ([07941a5](https://github.com/ionic-team/ionic/commit/07941a59ba68a46d1345fecec6df82fb4655a0b5)), closes [#25199](https://github.com/ionic-team/ionic/issues/25199)





## [7.0.2](https://github.com/ionic-team/ionic/compare/v7.0.1...v7.0.2) (2023-04-12)


### Bug Fixes

* **item:** ios active state has correct contrast ([#27134](https://github.com/ionic-team/ionic/issues/27134)) ([bbdb0ca](https://github.com/ionic-team/ionic/commit/bbdb0ca480d7cd46c030d1947ced712653cf122b)), closes [#000](https://github.com/ionic-team/ionic/issues/000) [#000](https://github.com/ionic-team/ionic/issues/000)
* **menu:** refs are not destroyed on unmount ([#27141](https://github.com/ionic-team/ionic/issues/27141)) ([b81b0d1](https://github.com/ionic-team/ionic/commit/b81b0d14258d7b8caf028e6cfe81772ed2f5f119)), closes [/github.com/ionic-team/ionic-framework/blob/687b37ad3e3237b874473817bb7b59143ac113ce/packages/core/src/components/menu/menu.tsx#L136-L137](https://github.com//github.com/ionic-team/ionic-framework/blob/687b37ad3e3237b874473817bb7b59143ac113ce/packages/core/src/components/menu/menu.tsx/issues/L136-L137)
* **radio:** takes up full height in item ([#27168](https://github.com/ionic-team/ionic/issues/27168)) ([987c79f](https://github.com/ionic-team/ionic/commit/987c79f05b6791084c4526d80c8c28a28047dd58)), closes [/github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/checkbox/checkbox.scss#L42](https://github.com//github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/checkbox/checkbox.scss/issues/L42) [/github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/toggle/toggle.scss#L43](https://github.com//github.com/ionic-team/ionic-framework/blob/cb8f07c5530ffc222580a3e3bae8dc85f62c73e5/core/src/components/toggle/toggle.scss/issues/L43)
* **segment:** segment disables segment buttons created asyncronously ([#27155](https://github.com/ionic-team/ionic/issues/27155)) ([ad6b130](https://github.com/ionic-team/ionic/commit/ad6b1301cf8528f7c9ad3c52730f01861117b380))





## [7.0.1](https://github.com/ionic-team/ionic/compare/v7.0.0...v7.0.1) (2023-04-05)


### Bug Fixes

* **breadcrumbs:** color attribute shows on DOM for Vue ([#27068](https://github.com/ionic-team/ionic/issues/27068)) ([141ced5](https://github.com/ionic-team/ionic/commit/141ced50103098fd711e0088ea8be4efdaadd0a9))
* **item-divider:** removal of unneeded margin unset ([#27042](https://github.com/ionic-team/ionic/issues/27042)) ([d925237](https://github.com/ionic-team/ionic/commit/d925237082cd2f55a573ddb0301afcbd84f4fda0)), closes [#17012](https://github.com/ionic-team/ionic/issues/17012) [ionic-team/ionic-framework#27024](https://github.com/ionic-team/ionic-framework/issues/27024)
* **item-divider:** set padding-end for md ([#27019](https://github.com/ionic-team/ionic/issues/27019)) ([426913d](https://github.com/ionic-team/ionic/commit/426913d0de50e65a76b029258daa09e6567c6515)), closes [#23785](https://github.com/ionic-team/ionic/issues/23785)
* **menu:** update location when dynamically changing side or doc dir ([#27079](https://github.com/ionic-team/ionic/issues/27079)) ([a35886e](https://github.com/ionic-team/ionic/commit/a35886e71c7c4b8abdd01ad33d92828c04249dc5)), closes [#25601](https://github.com/ionic-team/ionic/issues/25601) [#19489](https://github.com/ionic-team/ionic/issues/19489)
* **picker-column-internal:** hide empty picker items from screenreaders ([#27038](https://github.com/ionic-team/ionic/issues/27038)) ([4e7424d](https://github.com/ionic-team/ionic/commit/4e7424de035888e324b03af321c90ebbb6402746)), closes [#26809](https://github.com/ionic-team/ionic/issues/26809)
* **refresher:** set overflow styles when using custom scroll target ([#27058](https://github.com/ionic-team/ionic/issues/27058)) ([adbb50c](https://github.com/ionic-team/ionic/commit/adbb50ca5b92793ba002e4d704b2a643b92aabc7))
* **vue:** v-model props have correct type ([#27067](https://github.com/ionic-team/ionic/issues/27067)) ([14145dc](https://github.com/ionic-team/ionic/commit/14145dcaebef4dde7654317597fdee6a0cdb4bfa)), closes [#27057](https://github.com/ionic-team/ionic/issues/27057)


### Reverts

* Revert "bug(breadcrumbs): color attribute shows on DOM for Vue (#27040)" (#27069) ([abadeed](https://github.com/ionic-team/ionic/commit/abadeedc9e953f8a1e114d98e118d4c2f05c73dd)), closes [#27040](https://github.com/ionic-team/ionic/issues/27040) [#27069](https://github.com/ionic-team/ionic/issues/27069)





# [7.0.0](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.5...v7.0.0) (2023-03-29)

**Note:** Version bump only for package @ionic/core





# [7.0.0-rc.5](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.4...v7.0.0-rc.5) (2023-03-29)


### Bug Fixes

* **select:** alert header defaults to label ([#27034](https://github.com/ionic-team/ionic/issues/27034)) ([408457a](https://github.com/ionic-team/ionic/commit/408457aa95843cbf9fae7ce52d0f9de5e3362060)), closes [#27028](https://github.com/ionic-team/ionic/issues/27028)
* **select:** update iOS icon ([#27001](https://github.com/ionic-team/ionic/issues/27001)) ([ee19891](https://github.com/ionic-team/ionic/commit/ee198915424f1d4304283b44b526e3dcbe1f3494))





## [6.7.1](https://github.com/ionic-team/ionic/compare/v6.7.0...v6.7.1) (2023-03-29)


### Bug Fixes
* **item-sliding:** open method works with items added async ([#27035](https://github.com/ionic-team/ionic/issues/27035)) ([521063b](https://github.com/ionic-team/ionic/commit/521063bf241dc2c55bcd02a92ed8a418cfec6b1e)), closes [#26991](https://github.com/ionic-team/ionic/issues/26991)
* **item:** use thumbnail's size when present ([#27014](https://github.com/ionic-team/ionic/issues/27014)) ([6cecdf4](https://github.com/ionic-team/ionic/commit/6cecdf41451a5c7aa908494dfad9fab1496a0c6c)), closes [#22935](https://github.com/ionic-team/ionic/issues/22935)
* **radio-group:** radios participate in form submission ([#27018](https://github.com/ionic-team/ionic/issues/27018)) ([3b99c31](https://github.com/ionic-team/ionic/commit/3b99c31bab41bf7fcec340ac7159d3e8fce126c1)), closes [#27016](https://github.com/ionic-team/ionic/issues/27016)
* **select:** inherit white-space in select-text to allow text wrapping ([#26973](https://github.com/ionic-team/ionic/issues/26973)) ([19c1e25](https://github.com/ionic-team/ionic/commit/19c1e25399ca18c8e6a8dd39c0131979c0bb01e9)), closes [#19949](https://github.com/ionic-team/ionic/issues/19949)





# [7.0.0-rc.4](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.3...v7.0.0-rc.4) (2023-03-27)


### Bug Fixes

* **fab, tab-button:** rtl alignment in safari and firefox ([#26986](https://github.com/ionic-team/ionic/issues/26986)) ([e23fd9e](https://github.com/ionic-team/ionic/commit/e23fd9eceed289284eb047261c0d6bdab6ac5e8e)), closes [#22739](https://github.com/ionic-team/ionic/issues/22739)
* **many:** innerHTML is disabled by default ([#27029](https://github.com/ionic-team/ionic/issues/27029)) ([b7e4603](https://github.com/ionic-team/ionic/commit/b7e46038e0eee611bb9f5d83772804e83b19a63d))
* **radio-group:** radios participate in form submission ([#27018](https://github.com/ionic-team/ionic/issues/27018)) ([3b99c31](https://github.com/ionic-team/ionic/commit/3b99c31bab41bf7fcec340ac7159d3e8fce126c1)), closes [#27016](https://github.com/ionic-team/ionic/issues/27016)
* **segment:** change event fires when clicking ([#27010](https://github.com/ionic-team/ionic/issues/27010)) ([3e0a905](https://github.com/ionic-team/ionic/commit/3e0a905e81b2308450dcd2dc20489b7988f0e647)), closes [#27002](https://github.com/ionic-team/ionic/issues/27002)
* **select:** inherit white-space in select-text to allow text wrapping ([#26973](https://github.com/ionic-team/ionic/issues/26973)) ([19c1e25](https://github.com/ionic-team/ionic/commit/19c1e25399ca18c8e6a8dd39c0131979c0bb01e9)), closes [#19949](https://github.com/ionic-team/ionic/issues/19949)


### BREAKING CHANGES

* **many:** The `innerHTMLTemplatesEnabled` Ionic Config now defaults to `false`. Developers can set this option to `true` if they would like to continue to use custom HTML features in `ion-alert`, `ion-infinite-scroll-content`, `ion-loading`, `ion-refresher-content`, and `ion-toast`.





# [6.7.0](https://github.com/ionic-team/ionic/compare/v6.6.3...v6.7.0) (2023-03-23)


### Features

* **config:** add option to disable custom html functionality ([#26956](https://github.com/ionic-team/ionic/issues/26956)) ([3b0af7c](https://github.com/ionic-team/ionic/commit/3b0af7c55d4fa039be33d6605414761494d5af8f))





# [7.0.0-rc.3](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.2...v7.0.0-rc.3) (2023-03-22)
 
**Note:** Version bump only for package @ionic/core





## [6.6.3](https://github.com/ionic-team/ionic/compare/v6.6.2...v6.6.3) (2023-03-22)

### Bug Fixes

* **menu:** main content is not scrollable while swiping ([#26976](https://github.com/ionic-team/ionic/issues/26976)) ([88bd8a4](https://github.com/ionic-team/ionic/commit/88bd8a47c5e844d1d3a2b3b13621826faf776afb)), closes [#21193](https://github.com/ionic-team/ionic/issues/21193)





# [7.0.0-rc.2](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.1...v7.0.0-rc.2) (2023-03-15)


### Bug Fixes

* **input, select, textarea:** border color is set on host ([#26941](https://github.com/ionic-team/ionic/issues/26941)) ([4810e6f](https://github.com/ionic-team/ionic/commit/4810e6f2ac075cf5cd8065a1c10ad57db119beff))
* **input, textarea:** show error state after touch ([#26940](https://github.com/ionic-team/ionic/issues/26940)) ([ef33270](https://github.com/ionic-team/ionic/commit/ef33270b55122574e0fdb32187410d8d8a4fa1ae)), closes [#26939](https://github.com/ionic-team/ionic/issues/26939) [#21643](https://github.com/ionic-team/ionic/issues/21643)
* **many:** disabled control in item does not receive active/hover states ([#26867](https://github.com/ionic-team/ionic/issues/26867)) ([f829672](https://github.com/ionic-team/ionic/commit/f829672a6aa4477d1ce26f624f7316e6c5a1d514)), closes [#26706](https://github.com/ionic-team/ionic/issues/26706)
* **toggle:** label is announced once on ios ([#26937](https://github.com/ionic-team/ionic/issues/26937)) ([f71d9b1](https://github.com/ionic-team/ionic/commit/f71d9b1101786aa39016e458ca0da3f1e871d093))





## [6.6.2](https://github.com/ionic-team/ionic/compare/v6.6.1...v6.6.2) (2023-03-15)


### Bug Fixes

* **accordion:** include margins during expand animation ([#26390](https://github.com/ionic-team/ionic/issues/26390)) ([f809918](https://github.com/ionic-team/ionic/commit/f80991813ae8873d8ef6038b0aeb763d727f402e)), closes [#26381](https://github.com/ionic-team/ionic/issues/26381)
* **IonicSlides:** remove unnecessary autoplay option ([#26935](https://github.com/ionic-team/ionic/issues/26935)) ([b8f8937](https://github.com/ionic-team/ionic/commit/b8f893731471052df198824b7ece47606ffcc500))
* **radio:** checked state is updated when value changes ([#26936](https://github.com/ionic-team/ionic/issues/26936)) ([27a5356](https://github.com/ionic-team/ionic/commit/27a5356fa2b72073d565e9d6f527107869faa3ee))
* **react/vue:** properly switch ionicon based on the mode when ios/md is set ([#26924](https://github.com/ionic-team/ionic/issues/26924)) ([1eb9a08](https://github.com/ionic-team/ionic/commit/1eb9a085b2d69dfcfc71ff49b25d33347dd54aae)), closes [#26207](https://github.com/ionic-team/ionic/issues/26207)
* **textarea:** inherit tabindex to inner textarea ([#26945](https://github.com/ionic-team/ionic/issues/26945)) ([2c68d01](https://github.com/ionic-team/ionic/commit/2c68d01b898a2f879445b8b64014189afe1255d7)), closes [#26944](https://github.com/ionic-team/ionic/issues/26944)





# [7.0.0-rc.1](https://github.com/ionic-team/ionic/compare/v7.0.0-rc.0...v7.0.0-rc.1) (2023-03-08)


### Bug Fixes

* **input, textarea:** disabled state is applied when true ([#26892](https://github.com/ionic-team/ionic/issues/26892)) ([569401b](https://github.com/ionic-team/ionic/commit/569401b1c8959f236ab6931e7c58063d4681402a)), closes [#26881](https://github.com/ionic-team/ionic/issues/26881)
* **item:** prevent slotted form controls from taking whole width of item ([#26897](https://github.com/ionic-team/ionic/issues/26897)) ([78f5d96](https://github.com/ionic-team/ionic/commit/78f5d960cf4a056b52f65d4731a7ee0771031306))
* **many:** add aria-hidden to decorative icons ([#26922](https://github.com/ionic-team/ionic/issues/26922)) ([78303dc](https://github.com/ionic-team/ionic/commit/78303dccaa2b3e7e6fb107a5c0f0f213d8e39a7c))
* **select:** popover is full width when used with floating/stacked labels ([#26907](https://github.com/ionic-team/ionic/issues/26907)) ([7bc22f2](https://github.com/ionic-team/ionic/commit/7bc22f2bbfa1d170f05d66f44b53cd28c4038bc5)), closes [#26903](https://github.com/ionic-team/ionic/issues/26903)
* **vue:** input components update refs on ionInput ([#26876](https://github.com/ionic-team/ionic/issues/26876)) ([7d9ce74](https://github.com/ionic-team/ionic/commit/7d9ce7420a4c041a6d21041c15680e809cd55e8d)), closes [#26700](https://github.com/ionic-team/ionic/issues/26700)





## [6.6.1](https://github.com/ionic-team/ionic/compare/v6.6.0...v6.6.1) (2023-03-08)


### Bug Fixes

* **button:** show correct activated state for ios ([#26900](https://github.com/ionic-team/ionic/issues/26900)) ([67815cc](https://github.com/ionic-team/ionic/commit/67815ccbf4650ecbbc6c79d5063ab5ba50cb358c)), closes [#22468](https://github.com/ionic-team/ionic/issues/22468)
* **datetime-button:** time-only values are parsed ([#26852](https://github.com/ionic-team/ionic/issues/26852)) ([f54fc18](https://github.com/ionic-team/ionic/commit/f54fc188843af52e723e06402e01ef92717e541f)), closes [#26851](https://github.com/ionic-team/ionic/issues/26851)
* **datetime:** resolve import error in stencil apps ([#26909](https://github.com/ionic-team/ionic/issues/26909)) ([48c45af](https://github.com/ionic-team/ionic/commit/48c45afdb6ca7dad0a1f2a6d3ece6df8ba23eb69)), closes [#26908](https://github.com/ionic-team/ionic/issues/26908)
* **menu, split-pane:** ssr does not fail on null customElements check ([#26854](https://github.com/ionic-team/ionic/issues/26854)) ([451d220](https://github.com/ionic-team/ionic/commit/451d2204e79a4a10c1eb829ab0bd75c137b02475)), closes [#24714](https://github.com/ionic-team/ionic/issues/24714)
* **modal:** avoid chrome memory leak bug ([#26911](https://github.com/ionic-team/ionic/issues/26911)) ([a3f8e28](https://github.com/ionic-team/ionic/commit/a3f8e281721f6ef8c9479f5870198b7a009daabd))





# [7.0.0-rc.0](https://github.com/ionic-team/ionic/compare/v7.0.0-beta.6...v7.0.0-rc.0) (2023-03-01)

**Note:** Version bump only for package @ionic/core





# [7.0.0-beta.6](https://github.com/ionic-team/ionic/compare/v7.0.0-beta.5...v7.0.0-beta.6) (2023-03-01)


### Bug Fixes

* **button:** update for ios spec ([#26864](https://github.com/ionic-team/ionic/issues/26864)) ([df37357](https://github.com/ionic-team/ionic/commit/df3735765a7639d200a85834d8c3d72546e29791))
* **datetime:** aria-label for show/hide year picker ([#26848](https://github.com/ionic-team/ionic/issues/26848)) ([ac66215](https://github.com/ionic-team/ionic/commit/ac66215399954c972267b9d18bbd5aa5ef41a4c1))


### BREAKING CHANGES

* **button:** Button is updated to align with the design specification for iOS.

**Design tokens**

| Token                              | Previous Value | New Value |
| ---------------------------------- | -------------- | --------- |
| `$button-ios-letter-spacing`       | `-0.03em`      | `0`       |
| `$button-ios-clear-letter-spacing` | `0`            | Removed   |
| `$button-ios-height`               | `2.8em`        | `3.1em`   |
| `$button-ios-border-radius`        | `10px`         | `14px`    |
| `$button-ios-large-height`         | `2.8em`        | `3.1em`   |
| `$button-ios-large-border-radius`  | `12px`         | `16px`    |





# [6.6.0](https://github.com/ionic-team/ionic/compare/v6.5.7...v6.6.0) (2023-03-01)


### Bug Fixes

* **modal:** dialog styles work on old chrome versions ([#26746](https://github.com/ionic-team/ionic/issues/26746)) ([00d10f5](https://github.com/ionic-team/ionic/commit/00d10f5f6ad53850505bdad94b659b8801a3309d)), closes [#26745](https://github.com/ionic-team/ionic/issues/26745)


### Features

* **datetime:** add ability to specify custom colors for specific dates ([#26775](https://github.com/ionic-team/ionic/issues/26775)) ([2a761af](https://github.com/ionic-team/ionic/commit/2a761afd5a0e6d4e6f54096fdeb97b8bad1293de))
* **picker-column:** assign custom aria-labels to column options ([#26749](https://github.com/ionic-team/ionic/issues/26749)) ([daa89a2](https://github.com/ionic-team/ionic/commit/daa89a26ac8fa655c56c9447a8635e7c436e4f63))
* **toast:** add stacked buttons functionality ([#26790](https://github.com/ionic-team/ionic/issues/26790)) ([fc5fcc0](https://github.com/ionic-team/ionic/commit/fc5fcc064dec5256836e9622125b5e499ef00975))





## [6.5.7](https://github.com/ionic-team/ionic/compare/v6.5.6...v6.5.7) (2023-03-01)


### Bug Fixes

* **content:** fullscreen values are recomputed on visible content ([#26847](https://github.com/ionic-team/ionic/issues/26847)) ([6dcd98b](https://github.com/ionic-team/ionic/commit/6dcd98b26ab8fd3bf0092416d613bf051fbdeacf)), closes [#26844](https://github.com/ionic-team/ionic/issues/26844)
* **modal:** keyboard listener removed on dismiss ([#26856](https://github.com/ionic-team/ionic/issues/26856)) ([b4bcba3](https://github.com/ionic-team/ionic/commit/b4bcba353386b4d5d8d396e61ece421a15d42ff0))
* **overlays:** focus trap refs cleared on dismiss ([#26855](https://github.com/ionic-team/ionic/issues/26855)) ([8d1d0fa](https://github.com/ionic-team/ionic/commit/8d1d0fa0c7a42a3c21a471131ba454774b26c314))





# [7.0.0-beta.5](https://github.com/ionic-team/ionic/compare/v7.0.0-beta.4...v7.0.0-beta.5) (2023-02-27)


### Bug Fixes

* **content:** adjust transition shadow to match new iOS version ([#26839](https://github.com/ionic-team/ionic/issues/26839)) ([f006e4b](https://github.com/ionic-team/ionic/commit/f006e4bc09fcdcb5a34da4e17eb6037bf1e2445c))
* **form:** shadow components using aria-labelledby do not use modern syntax ([#26836](https://github.com/ionic-team/ionic/issues/26836)) ([fcfdd9e](https://github.com/ionic-team/ionic/commit/fcfdd9e9ba9969947d8b9dfefbea4522d08753ed)), closes [#26829](https://github.com/ionic-team/ionic/issues/26829)
* **scroll-padding:** correct padding is added ([#26810](https://github.com/ionic-team/ionic/issues/26810)) ([eefd17d](https://github.com/ionic-team/ionic/commit/eefd17d492f2fe24639cf20603fac04d6eb94e3f)), closes [#26803](https://github.com/ionic-team/ionic/issues/26803)


### Features

* **searchbar:** ionInput now emits value payload ([#26831](https://github.com/ionic-team/ionic/issues/26831)) ([865f8de](https://github.com/ionic-team/ionic/commit/865f8de9dc2d533b08730846f8d76bf165e8bc1d)), closes [#26828](https://github.com/ionic-team/ionic/issues/26828)


### BREAKING CHANGES

* **searchbar:** The `detail` payload for the `ionInput` event now on `ion-searchbar` contains an object with the current `value` as well as the native event that triggered `ionInput`.





# [7.0.0-beta.4](https://github.com/ionic-team/ionic-framework/compare/v7.0.0-beta.3..v7.0.0-beta.4) (2023-02-22)


### Bug Fixes

* **checkbox:** screen readers announce state correctly ([#26817](https://github.com/ionic-team/ionic-framework/issues/26817)) ([7312b06](https://github.com/ionic-team/ionic-framework/commit/7312b0696d6b9ceb2e4518cad2ab29d45d2eddbe)), closes [#25740](https://github.com/ionic-team/ionic-framework/issues/25740)
* **select:** emit single ionChange event for popover option selection ([#26796](https://github.com/ionic-team/ionic-framework/issues/26796)) ([7578aa3](https://github.com/ionic-team/ionic-framework/commit/7578aa3c598451b6df1cf1eca26ad288c0526121)), closes [#26789](https://github.com/ionic-team/ionic-framework/issues/26789)





## [6.5.6](https://github.com/ionic-team/ionic-framework/compare/v6.5.5...v6.5.6) (2023-02-22)


### Bug Fixes

* **card:** border radius does not overflow on paint in Safari ([#26539](https://github.com/ionic-team/ionic-framework/issues/26539)) ([df5c8e2](https://github.com/ionic-team/ionic-framework/commit/df5c8e231825b5e5b6923f322c94224a00d3b309)), closes [#26529](https://github.com/ionic-team/ionic-framework/issues/26529)





## [6.5.5](https://github.com/ionic-team/ionic-framework/compare/v6.5.4...v6.5.5) (2023-02-20)


### Bug Fixes

* **datetime:** days of week and spacing buttons are not announced by screen readers ([#26813](https://github.com/ionic-team/ionic-framework/issues/26813)) ([1a346b6](https://github.com/ionic-team/ionic-framework/commit/1a346b62068076d0b0cc6b2dea4136e0f06576b8)), closes [#26811](https://github.com/ionic-team/ionic-framework/issues/26811)
* **hide-caret:** blur listener correctly removed ([#26808](https://github.com/ionic-team/ionic-framework/issues/26808)) ([fef634f](https://github.com/ionic-team/ionic-framework/commit/fef634f7f055f1672af50b56610f84c76e626814)), closes [#26807](https://github.com/ionic-team/ionic-framework/issues/26807)
* **input:** compositionend event is removed on unmount ([#26806](https://github.com/ionic-team/ionic-framework/issues/26806)) ([caa8719](https://github.com/ionic-team/ionic-framework/commit/caa8719cea2f4b3b460551224a8c4a69bd29afeb)), closes [#26805](https://github.com/ionic-team/ionic-framework/issues/26805)
* **sanitizer:** improve reliability of sanitizer ([#26820](https://github.com/ionic-team/ionic-framework/issues/26820)) ([5e41391](https://github.com/ionic-team/ionic-framework/commit/5e41391ed2585072095f42f7a6d40497f0e129d2))
* **swipe-back:** gesture rtl setting is reactive ([#26795](https://github.com/ionic-team/ionic-framework/issues/26795)) ([3a64de4](https://github.com/ionic-team/ionic-framework/commit/3a64de49dbf470d470cb4516df2a5226ba751051)), closes [#26794](https://github.com/ionic-team/ionic-framework/issues/26794)





# [7.0.0-beta.3](https://github.com/ionic-team/ionic-framework/compare/v7.0.0-beta.2..v7.0.0-beta.3) (2023-02-15)


### Bug Fixes

* **checkbox, radio:** label is announced once on ios ([#26770](https://github.com/ionic-team/ionic-framework/issues/26770)) ([87bc749](https://github.com/ionic-team/ionic-framework/commit/87bc7490404b0406b511833a85b686f1db791f66)), closes [#26769](https://github.com/ionic-team/ionic-framework/issues/26769)
* **form:** legacy deprecation is logged correctly ([#26784](https://github.com/ionic-team/ionic-framework/issues/26784)) ([180ee63](https://github.com/ionic-team/ionic-framework/commit/180ee63ff7d93f8800756d732e565123a59bcd3a))
* **many:** resolve import errors with stencil apps ([#26781](https://github.com/ionic-team/ionic-framework/issues/26781)) ([1eea054](https://github.com/ionic-team/ionic-framework/commit/1eea054c127146999302888180fd1585e1021783)), closes [#26778](https://github.com/ionic-team/ionic-framework/issues/26778)
* **range:** allow overflow on range bar container ([#26751](https://github.com/ionic-team/ionic-framework/issues/26751)) ([edf696c](https://github.com/ionic-team/ionic-framework/commit/edf696cac9e4a35545750f99bcd49a87ec504905))


### Features

* **textarea:** add legacy prop ([#26783](https://github.com/ionic-team/ionic-framework/issues/26783)) ([f7f6f1d](https://github.com/ionic-team/ionic-framework/commit/f7f6f1d9f9ffd30afbdccfb558bd73f42b112715))





## [6.5.4](https://github.com/ionic-team/ionic-framework/compare/v6.5.3...v6.5.4) (2023-02-15)


### Bug Fixes

* **content:** fullscreen works when rotating device ([#26782](https://github.com/ionic-team/ionic-framework/issues/26782)) ([7b879fe](https://github.com/ionic-team/ionic-framework/commit/7b879fec3d30b61c00faad035698ff643afaa78e)), closes [#26743](https://github.com/ionic-team/ionic-framework/issues/26743)
* **deps:** update ionicons usage to v6.1.2 ([#26752](https://github.com/ionic-team/ionic-framework/issues/26752)) ([c07933c](https://github.com/ionic-team/ionic-framework/commit/c07933cb69b0c31d3e44263769a7a26ee81223f8))
* **deps:** update ionicons usage to v6.1.3 ([#26772](https://github.com/ionic-team/ionic-framework/issues/26772)) ([1c71983](https://github.com/ionic-team/ionic-framework/commit/1c719833292d4cfbdecadf9838d8c783785222ad))
* **tap-click:** instant activate does not use a setTimeout ([#26748](https://github.com/ionic-team/ionic-framework/issues/26748)) ([21c0806](https://github.com/ionic-team/ionic-framework/commit/21c0806bbd1417b1e6239bc56272e18b3ff38f2e))





# [7.0.0-beta.2](https://github.com/ionic-team/ionic-framework/compare/v7.0.0-beta.1...v7.0.0-beta.2) (2023-02-08)


### Bug Fixes

* **input, textarea:** bottom content is rendered correctly ([#26739](https://github.com/ionic-team/ionic-framework/issues/26739)) ([39009ac](https://github.com/ionic-team/ionic-framework/commit/39009ac6eff0e51707efc3ef3981e1b7614eb2e3)), closes [#26737](https://github.com/ionic-team/ionic-framework/issues/26737)
* **input:** update disabled opacity of md input ([#26514](https://github.com/ionic-team/ionic-framework/issues/26514)) ([90f4995](https://github.com/ionic-team/ionic-framework/commit/90f4995aa63c730d3feb1fc88582f034153c9b9c))
* **radio:** remove radio min-height sizing ([#26719](https://github.com/ionic-team/ionic-framework/issues/26719)) ([2a6bba0](https://github.com/ionic-team/ionic-framework/commit/2a6bba0cb60666a4a97da427fa7d179aab49f148))
* **range:** assign auto increment id by default ([#26740](https://github.com/ionic-team/ionic-framework/issues/26740)) ([92b06f2](https://github.com/ionic-team/ionic-framework/commit/92b06f2eb6f6980561c584193cb70157bedec12b))


### Performance Improvements

* **gesture:** reduce delay with adding and removing activated states ([#26741](https://github.com/ionic-team/ionic-framework/issues/26741)) ([4cff442](https://github.com/ionic-team/ionic-framework/commit/4cff442c4f25596e76a674f18e79d0531a464fbf)), closes [#23691](https://github.com/ionic-team/ionic-framework/issues/23691)


### BREAKING CHANGES

* **range:** The `name` property on `ion-range` defaults to `ion-r-${rangeIds++}` where `rangeIds` is a number that is incremented for every instance of the component.






## [6.5.3](https://github.com/ionic-team/ionic-framework/compare/v6.5.2...v6.5.3) (2023-02-08)


### Bug Fixes

* **button:** size and strong are respected in ion-buttons ([#26726](https://github.com/ionic-team/ionic-framework/issues/26726)) ([3759125](https://github.com/ionic-team/ionic-framework/commit/37591255b4ab3dde5ece6950024a3b66e7224364))
* **chip:** descenders are not clipped in label ([#26729](https://github.com/ionic-team/ionic-framework/issues/26729)) ([a9e000b](https://github.com/ionic-team/ionic-framework/commit/a9e000b4338f75c27e9284dbe9a6501ba3b213bc)), closes [#18313](https://github.com/ionic-team/ionic-framework/issues/18313)
* **refresher:** prevent clearing virtual scroll overflow styling ([#26613](https://github.com/ionic-team/ionic-framework/issues/26613)) ([9d6ec29](https://github.com/ionic-team/ionic-framework/commit/9d6ec2925cb2314d5379b864aef467b34afbb318)), closes [#26553](https://github.com/ionic-team/ionic-framework/issues/26553)



# [7.0.0-beta.1](https://github.com/ionic-team/ionic-framework/compare/v7.0.0-beta.0...v7.0.0-beta.1) (2023-02-01)


### Bug Fixes

* **input, textarea, select:** do not show highlight in item ([#26689](https://github.com/ionic-team/ionic-framework/issues/26689)) ([16b60a6](https://github.com/ionic-team/ionic-framework/commit/16b60a612c1c8053cec3509749ad9e9b185b93be)), closes [#26687](https://github.com/ionic-team/ionic-framework/issues/26687)
* **many:** legacy form control does not warn when using aria-labelledby ([#26699](https://github.com/ionic-team/ionic-framework/issues/26699)) ([63f8525](https://github.com/ionic-team/ionic-framework/commit/63f8525284abf2792305aebb27b9b439a8921bcf)), closes [#26698](https://github.com/ionic-team/ionic-framework/issues/26698)
* **textarea:** textarea wrapper inherits height ([#26707](https://github.com/ionic-team/ionic-framework/issues/26707)) ([e6c7c57](https://github.com/ionic-team/ionic-framework/commit/e6c7c574665897d8fd2184797bc4017f688a2b0e))


### Reverts

* revert base components feature ([#26692](https://github.com/ionic-team/ionic-framework/issues/26692)) ([b78b454](https://github.com/ionic-team/ionic-framework/commit/b78b454e089462afa866972b97bb06faa84bd319))




## [6.5.2](https://github.com/ionic-team/ionic-framework/compare/v6.5.1...v6.5.2) (2023-02-01)

### Bug Fixes

* **item:** inherit aria attributes before render ([#26546](https://github.com/ionic-team/ionic-framework/issues/26546)) ([95a3c69](https://github.com/ionic-team/ionic-framework/commit/95a3c69bbbe415cb5f14ac8e1faed287e91b4b40)), closes [#26538](https://github.com/ionic-team/ionic-framework/issues/26538)
* **popover:** popover opens on chrome 109 ([#26672](https://github.com/ionic-team/ionic-framework/issues/26672)) ([69d89ea](https://github.com/ionic-team/ionic-framework/commit/69d89eae940ccd8b0cca379a961166c4592f34c7)), closes [#26643](https://github.com/ionic-team/ionic-framework/issues/26643)
* **popover:** resolve import warning in stencil apps ([#26705](https://github.com/ionic-team/ionic-framework/issues/26705)) ([95f65a5](https://github.com/ionic-team/ionic-framework/commit/95f65a5a390eb600de8998c8be9dfd7c023d1eeb)), closes [#26704](https://github.com/ionic-team/ionic-framework/issues/26704)
* **select:** setting options async updates rendered text ([#26667](https://github.com/ionic-team/ionic-framework/issues/26667)) ([a687457](https://github.com/ionic-team/ionic-framework/commit/a6874579361db548d961fdee83299d664dd6541b)), closes [#19324](https://github.com/ionic-team/ionic-framework/issues/19324)
* **vue:** cache attached view reference ([#26694](https://github.com/ionic-team/ionic-framework/issues/26694)) ([7c00897](https://github.com/ionic-team/ionic-framework/commit/7c0089718afbbe3e19fecee4abbea00a6e618d95)), closes [#26695](https://github.com/ionic-team/ionic-framework/issues/26695)

# [7.0.0-beta.0](https://github.com/ionic-team/ionic-framework/compare/v6.5.1...v7.0.0-beta.0) (2023-01-25)


### Bug Fixes

* **accordion-group:** do not adjust incorrect values ([#26086](https://github.com/ionic-team/ionic-framework/issues/26086)) ([e2cbeeb](https://github.com/ionic-team/ionic-framework/commit/e2cbeeb8ace969d49e16ccdc496adc559e40b1f2))
* **action-sheet:** container animates in correctly ([#26347](https://github.com/ionic-team/ionic-framework/issues/26347)) ([1e855e7](https://github.com/ionic-team/ionic-framework/commit/1e855e7699a0b5c3792a9ef84e863df6fe552437)), closes [#25368](https://github.com/ionic-team/ionic-framework/issues/25368)
* **angular:** null values are not converted to falsy value ([#26341](https://github.com/ionic-team/ionic-framework/issues/26341)) ([ce2e37b](https://github.com/ionic-team/ionic-framework/commit/ce2e37b1a172722630953dcb9560f334048c5b72))
* **back-button:** update style for ios spec ([#26395](https://github.com/ionic-team/ionic-framework/issues/26395)) ([1a840c4](https://github.com/ionic-team/ionic-framework/commit/1a840c43e90a65a910877599f6a2d52ccc65db6b)), closes [#26393](https://github.com/ionic-team/ionic-framework/issues/26393)
* **breadcrumb:** add aria-label to collapsed indicator ([#26615](https://github.com/ionic-team/ionic-framework/issues/26615)) ([f8a2c79](https://github.com/ionic-team/ionic-framework/commit/f8a2c7948894e82b1bc41fa45e1716bc733b087c))
* **card-header:** reverse order of title and subtitle on ios ([#26084](https://github.com/ionic-team/ionic-framework/issues/26084)) ([2080890](https://github.com/ionic-team/ionic-framework/commit/2080890c11539938dd96c0f2ed08785100112587))
* **datetime:** do not report timezone in ionChange ([#26183](https://github.com/ionic-team/ionic-framework/issues/26183)) ([3fb4caf](https://github.com/ionic-team/ionic-framework/commit/3fb4caf21ffac12f765c4c80bf1850e05d211c6a)), closes [#25577](https://github.com/ionic-team/ionic-framework/issues/25577)
* **datetime:** haptics are enabled only on ios ([#26370](https://github.com/ionic-team/ionic-framework/issues/26370)) ([8eec197](https://github.com/ionic-team/ionic-framework/commit/8eec1974da3dd4820d29126f17d1e14b5132c9f4)), closes [#25508](https://github.com/ionic-team/ionic-framework/issues/25508)
* **input, searchbar, select, textarea:** placeholder has improved contrast ([#26486](https://github.com/ionic-team/ionic-framework/issues/26486)) ([6c82435](https://github.com/ionic-team/ionic-framework/commit/6c824350257fce45ce3b8c166a864efe6789c505))
* **input, textarea:** inputs now scroll into view when tapping labels ([#25848](https://github.com/ionic-team/ionic-framework/issues/25848)) ([cb265d6](https://github.com/ionic-team/ionic-framework/commit/cb265d6cc6d4890608d2873a5726f5d7d37adae6))
* **input, textarea:** padding is now added to content so inputs scroll above keyboard ([#25849](https://github.com/ionic-team/ionic-framework/issues/25849)) ([ba6b539](https://github.com/ionic-team/ionic-framework/commit/ba6b5396754151d884fa276a7227facd28a431df)), closes [#18532](https://github.com/ionic-team/ionic-framework/issues/18532)
* **input:** clearOnEdit clears input when user initially types ([#26005](https://github.com/ionic-team/ionic-framework/issues/26005)) ([bf5e118](https://github.com/ionic-team/ionic-framework/commit/bf5e1183135d1d56a7ba0f63723724521f9d51d0))
* **item:** align iOS font size to spec ([#26445](https://github.com/ionic-team/ionic-framework/issues/26445)) ([eea91bb](https://github.com/ionic-team/ionic-framework/commit/eea91bbbe1a4ccc4797742ee4e2c320dba6d9517))
* **item:** ios mode has correct padding ([#26511](https://github.com/ionic-team/ionic-framework/issues/26511)) ([96147ec](https://github.com/ionic-team/ionic-framework/commit/96147ec1b0fcfd31e48d450201fc32b58105dea7))
* **overlays:** dismiss on keydown to avoid chrome for windows and firefox bug ([#25811](https://github.com/ionic-team/ionic-framework/issues/25811)) ([a1ec9aa](https://github.com/ionic-team/ionic-framework/commit/a1ec9aabd806964206010000294b8781c516c4f3)), closes [#25802](https://github.com/ionic-team/ionic-framework/issues/25802)
* **overlays:** triggerController warns about missing triggers ([#26651](https://github.com/ionic-team/ionic-framework/issues/26651)) ([a7c2c55](https://github.com/ionic-team/ionic-framework/commit/a7c2c555f34795a3a9349987141eef929ad88807))
* **range:** range matches iOS design specification ([#25873](https://github.com/ionic-team/ionic-framework/issues/25873)) ([da05ffe](https://github.com/ionic-team/ionic-framework/commit/da05ffe462b36ce6fd6cdaeb25cf0f8f4b0e7ef2)), closes [#25872](https://github.com/ionic-team/ionic-framework/issues/25872)
* **segment:** click event triggers ionChange ([#26162](https://github.com/ionic-team/ionic-framework/issues/26162)) ([70781e4](https://github.com/ionic-team/ionic-framework/commit/70781e4c9f93e8e58917083da43536389ac5332e))
* **select:** chevron icon is now an ionicon ([#26484](https://github.com/ionic-team/ionic-framework/issues/26484)) ([0823c09](https://github.com/ionic-team/ionic-framework/commit/0823c09d9c5f4f07a847fecfd3d3c1915eeb1ddf))
* **select:** modern component takes up full line ([#26670](https://github.com/ionic-team/ionic-framework/issues/26670)) ([4d24b32](https://github.com/ionic-team/ionic-framework/commit/4d24b328e2021f0d14b278df7535c9bdb9851952))
* **textarea:** clearOnEdit clears textarea when user initially types ([#26006](https://github.com/ionic-team/ionic-framework/issues/26006)) ([f7176bb](https://github.com/ionic-team/ionic-framework/commit/f7176bbb44c230d6f20b023942c577236e676b02))
* **textarea:** render icon for clearing input ([3271ecf](https://github.com/ionic-team/ionic-framework/commit/3271ecf1dec4f9baf238ea94e4047f2c26835b4b))


### Code Refactoring

* **config:** remove stencil extras ([#26461](https://github.com/ionic-team/ionic-framework/issues/26461)) ([bd4027b](https://github.com/ionic-team/ionic-framework/commit/bd4027b0fa1494c58e4ab7c804acfa053c63113a))
* **core:** remove global hidden attribute ([#25829](https://github.com/ionic-team/ionic-framework/issues/25829)) ([f5a6b5a](https://github.com/ionic-team/ionic-framework/commit/f5a6b5a4c434167cafd9060911ccbfda2a89734c)), closes [#17583](https://github.com/ionic-team/ionic-framework/issues/17583)
* **modal:** remove swipeToClose in favor of canDismiss ([#26050](https://github.com/ionic-team/ionic-framework/issues/26050)) ([1f3ddf2](https://github.com/ionic-team/ionic-framework/commit/1f3ddf2370c29f0fd2dd96aa9b3927ef96bdc5ae))
* **picker:** remove refresh key ([#26340](https://github.com/ionic-team/ionic-framework/issues/26340)) ([0fbcc5b](https://github.com/ionic-team/ionic-framework/commit/0fbcc5b9a97861dc31742db80b187d077a0d6750))
* **react:** only ship es modules ([#26044](https://github.com/ionic-team/ionic-framework/issues/26044)) ([c946af2](https://github.com/ionic-team/ionic-framework/commit/c946af29d3d65e4e78c03f0bbcb2376fd9d8c469))
* **types:** remove overlay attribute interfaces ([#26181](https://github.com/ionic-team/ionic-framework/issues/26181)) ([322a1db](https://github.com/ionic-team/ionic-framework/commit/322a1dbcd00fc1f3db17fb9fb46ba91ba164acd3))
* **vue:** only ship es modules ([#26054](https://github.com/ionic-team/ionic-framework/issues/26054)) ([86bbed0](https://github.com/ionic-team/ionic-framework/commit/86bbed07fc51fa1e3771f0198211c5064606e5bb)), closes [#25104](https://github.com/ionic-team/ionic-framework/issues/25104)


### Features

* **accordion:** ionChange will only emit from user committed changes ([#25922](https://github.com/ionic-team/ionic-framework/issues/25922)) ([4eea9fa](https://github.com/ionic-team/ionic-framework/commit/4eea9fa5c07d2a48bf5d224cd9b9e63453125b77))
* **action-sheet:** use action sheet overlay inline ([#26172](https://github.com/ionic-team/ionic-framework/issues/26172)) ([92b763a](https://github.com/ionic-team/ionic-framework/commit/92b763a538f1c935e10d90c3f4af1debf1cab2c3)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **alert:** add ability to use alert inline ([#26316](https://github.com/ionic-team/ionic-framework/issues/26316)) ([08c0a55](https://github.com/ionic-team/ionic-framework/commit/08c0a5520a4f9be19d88644df26f4d38587985fa)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **base-components:** add ability to remove ios and md theme ([#26669](https://github.com/ionic-team/ionic-framework/issues/26669)) ([18f109c](https://github.com/ionic-team/ionic-framework/commit/18f109c7dae97d4e74bee9b72a341aeafd95b222))
* **checkbox:** component can be used outside ion-item ([#26518](https://github.com/ionic-team/ionic-framework/issues/26518)) ([9d52e70](https://github.com/ionic-team/ionic-framework/commit/9d52e703610d0211667f0152e6c2b90ec6f13198)), closes https://github.com/ionic-team/ionic-framework/issues/21513, https://github.com/ionic-team/ionic-framework/issues/23332, https://github.com/ionic-team/ionic-framework/issues/23289
* **checkbox:** ionChange fires on user interaction ([#25923](https://github.com/ionic-team/ionic-framework/issues/25923)) ([a6b2629](https://github.com/ionic-team/ionic-framework/commit/a6b2629ede9f2b0e16343b9afabf68eb53cacc17))
* **datetime:** ionChange will only emit from user committed changes ([#26083](https://github.com/ionic-team/ionic-framework/issues/26083)) ([cc2af20](https://github.com/ionic-team/ionic-framework/commit/cc2af202a95c049c9dd11ffd50c0dec3c84bf3c0)), closes [#20873](https://github.com/ionic-team/ionic-framework/issues/20873) [#24452](https://github.com/ionic-team/ionic-framework/issues/24452)
* **input, textarea:** change default debounce to undefined ([#26073](https://github.com/ionic-team/ionic-framework/issues/26073)) ([c45d054](https://github.com/ionic-team/ionic-framework/commit/c45d05476b34648b59dc8d407a8a1c9f8bd4f409))
* **input, textarea:** ionInput and ionChange pass event and value ([#26176](https://github.com/ionic-team/ionic-framework/issues/26176)) ([eea6ba9](https://github.com/ionic-team/ionic-framework/commit/eea6ba996ce0f71546f5a14109d0d279400a27e5))
* **input:** component can be used outside of ion-item ([#26283](https://github.com/ionic-team/ionic-framework/issues/26283)) ([44472ae](https://github.com/ionic-team/ionic-framework/commit/44472aeb9f12585d7b5d40b5721d4281b66b5004)), closes [#20153](https://github.com/ionic-team/ionic-framework/issues/20153) [#19084](https://github.com/ionic-team/ionic-framework/issues/19084) [#22736](https://github.com/ionic-team/ionic-framework/issues/22736), https://github.com/ionic-team/ionic-framework/issues/24312, https://github.com/ionic-team/ionic-framework/issues/24333, https://github.com/ionic-team/ionic-framework/issues/24639, https://github.com/ionic-team/ionic-framework/issues/26178, https://github.com/ionic-team/ionic-framework/issues/24966, https://github.com/ionic-team/ionic-framework/issues/23331, https://github.com/ionic-team/ionic-framework/issues/18037, https://github.com/ionic-team/ionic-framework/issues/23335
* **input:** debounce controls the timing to delay the ionInput event ([#25969](https://github.com/ionic-team/ionic-framework/issues/25969)) ([35041b2](https://github.com/ionic-team/ionic-framework/commit/35041b2f3c99135d292500a662b889bdaaec6876))
* **input:** ionChange will only emit from user committed changes  ([#25858](https://github.com/ionic-team/ionic-framework/issues/25858)) ([8732b7b](https://github.com/ionic-team/ionic-framework/commit/8732b7bdb76320d5eeba1121ac5f5eefa343526f)), closes [#20106](https://github.com/ionic-team/ionic-framework/issues/20106) [#20061](https://github.com/ionic-team/ionic-framework/issues/20061)
* **loading:** use loading overlay inline ([#26153](https://github.com/ionic-team/ionic-framework/issues/26153)) ([34ca337](https://github.com/ionic-team/ionic-framework/commit/34ca337b8af27b144fb44428c8ed8cf07fc79bfc)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **picker:** add ability to use picker inline ([#26336](https://github.com/ionic-team/ionic-framework/issues/26336)) ([c0a8501](https://github.com/ionic-team/ionic-framework/commit/c0a85016572956149ed4f01109f11154d7b5cb57)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **radio-group:** ionChange will only emit from user committed changes ([#26223](https://github.com/ionic-team/ionic-framework/issues/26223)) ([c299d36](https://github.com/ionic-team/ionic-framework/commit/c299d3666aae96d0e67ce4d2c70efbe95bee81da))
* **radio:** component can be used outside of ion-item ([#26582](https://github.com/ionic-team/ionic-framework/issues/26582)) ([9761b0a](https://github.com/ionic-team/ionic-framework/commit/9761b0a092e50ac4cc9176b6bcd5b9d29a5b22b3)), closes https://github.com/ionic-team/ionic-framework/issues/21513
* **range:** component can be used outside of ion-item ([#26479](https://github.com/ionic-team/ionic-framework/issues/26479)) ([49baad8](https://github.com/ionic-team/ionic-framework/commit/49baad8ee6cfe7e26068f4c9954d4a59d343b339))
* **range:** ionChange will only emit from user committed changes ([#26089](https://github.com/ionic-team/ionic-framework/issues/26089)) ([d1fb7b0](https://github.com/ionic-team/ionic-framework/commit/d1fb7b039b8e11e9d9ede850f90b977a46b52de8))
* **searchbar:** ionChange will only emit from user committed changes ([#26026](https://github.com/ionic-team/ionic-framework/issues/26026)) ([b052d3b](https://github.com/ionic-team/ionic-framework/commit/b052d3b2622b795cde102591f0191338e15b14a0))
* **segment:** ionChange will only emit from user committed changes ([#25934](https://github.com/ionic-team/ionic-framework/issues/25934)) ([a03c8af](https://github.com/ionic-team/ionic-framework/commit/a03c8afb3dc4e6672beae680c61c89477478f28b))
* **select:** component can be used outside ion-item ([#26572](https://github.com/ionic-team/ionic-framework/issues/26572)) ([02640b5](https://github.com/ionic-team/ionic-framework/commit/02640b5795c4fb8a46f0cdc8903f2a08abfa9135)), closes https://github.com/ionic-team/ionic-framework/issues/23540, https://github.com/ionic-team/ionic-framework/issues/24322, https://github.com/ionic-team/ionic-framework/issues/25449, https://github.com/ionic-team/ionic-framework/issues/25639, https://github.com/ionic-team/ionic-framework/issues/19936
* **select:** ionChange will only emit from user committed changes ([#26066](https://github.com/ionic-team/ionic-framework/issues/26066)) ([34c4137](https://github.com/ionic-team/ionic-framework/commit/34c41378682a202d4fab11aad171df7f55f4c243))
* **slides:** remove ion-slide, ion-slides, and IonicSwiper module ([#25868](https://github.com/ionic-team/ionic-framework/issues/25868)) ([d478e03](https://github.com/ionic-team/ionic-framework/commit/d478e03914fed15766c893738d6386d7623d066d))
* **textarea:** component can be used outside of ion-item ([#26674](https://github.com/ionic-team/ionic-framework/issues/26674)) ([8d3edd0](https://github.com/ionic-team/ionic-framework/commit/8d3edd049dfdb2a781d80da810a5bee3b490b7b6)), closes https://github.com/ionic-team/ionic-framework/issues/22269
* **textarea:** ionChange will only emit from user committed changes ([#25953](https://github.com/ionic-team/ionic-framework/issues/25953)) ([68bae80](https://github.com/ionic-team/ionic-framework/commit/68bae80a51dae70c4cd7e598c1f2eabb025f173e))
* **toast:** add ability to use toast inline ([#26215](https://github.com/ionic-team/ionic-framework/issues/26215)) ([003de44](https://github.com/ionic-team/ionic-framework/commit/003de44d9283d23ecfdf1ab5fada2b7a372a4ca9)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **toggle:** component can be used outside of ion-item ([#26357](https://github.com/ionic-team/ionic-framework/issues/26357)) ([c74901c](https://github.com/ionic-team/ionic-framework/commit/c74901c973c153ce1954646ef7944f7db193ea28)), closes [#25570](https://github.com/ionic-team/ionic-framework/issues/25570) [#23213](https://github.com/ionic-team/ionic-framework/issues/23213), closes https://github.com/ionic-team/ionic-framework/issues/23332, https://github.com/ionic-team/ionic-framework/issues/23213
* **toggle:** ionChange will only emit from user committed changes ([#26078](https://github.com/ionic-team/ionic-framework/issues/26078)) ([85d3bd9](https://github.com/ionic-team/ionic-framework/commit/85d3bd99be3ae0f33a480e256381f7125f3389fd))
* **virtual-scroll:** remove virtual scroll component ([#25808](https://github.com/ionic-team/ionic-framework/issues/25808)) ([1eb6fd0](https://github.com/ionic-team/ionic-framework/commit/1eb6fd04d7f8c7ccd7dac08d085dc90d9f6283cc))


### Performance Improvements

* **item:** remove delegatesFocus patch for iOS 13 ([#25822](https://github.com/ionic-team/ionic-framework/issues/25822)) ([ee3467c](https://github.com/ionic-team/ionic-framework/commit/ee3467c9f1aa415ff6bda19e460b5c3482b94efc)), closes https://github.com/ionic-team/ionic-framework/issues/25273
* **many:** reduce delay when performing overlay or page transitions ([#26189](https://github.com/ionic-team/ionic-framework/issues/26189)) ([30e3a14](https://github.com/ionic-team/ionic-framework/commit/30e3a1485d9bc94b31c297bdd05fa847b4bcfb56)), closes [#24346](https://github.com/ionic-team/ionic-framework/issues/24346)


### BREAKING CHANGES

* **config:** The supported version of Firefox for Ionic v7 has changed to Firefox v70+
* **input, searchbar, select, textarea:** The default value for the `--placeholder-opacity` CSS Variable on `ion-input`, `ion-searchbar`, `ion-select`, and `ion-textarea` has been updated to `0.6`.
* **select:** The `icon` CSS Shadow Part for `ion-select` now targets an `ion-icon` component.
* **datetime:** The haptics when swiping the wheel picker are now enabled only on iOS.
* **toggle:** The `--background` and `--background-checked` variables have been renamed to `--track-background` and `--track-background-checked`, respectively.
* **angular:** Datetime:

Passing the empty string to the `value` property will now error as it is not a valid ISO-8601 value.

Angular:

`null` values on form components will no longer be converted to the empty string (`''`) or `false`. This impacts `ion-checkbox`, `ion-datetime`, `ion-input`, `ion-radio`, `ion-radio-group`, ion-range`, `ion-searchbar`, `ion-segment`, `ion-select`, `ion-textarea`, and `ion-toggle`.
* **picker:** The `refresh` key has been removed from the `PickerColumn` interface. Developers should use the `columns` property to refresh the `ion-picker` view.
* **input, textarea:** The `detail` payload for the `ionInput` event on `ion-input` and `ion-textarea` now contains an object with the current `value` as well as the native event that triggered `ionInput`.
* **datetime:** Datetime no longer incorrectly reports the time zone when `value` is updated. Datetime does not manage time zones, so any time zone information provided is ignored.
* **types:** `ActionSheetAttributes`, `AlertAttributes`, `AlertTextareaAttributes`, `AlertInputAttributes`, `LoadingAttributes`, `ModalAttributes`, `PickerAttributes`, `PopoverAttributes`, and `ToastAttributes` have been removed. Developers should use `{ [key: string]: any }` instead.
* **card-header:** - The card header has ben changed to a flex container with direction set to `column` (top to bottom). In `ios` mode the direction is set to `column-reverse` which results in the subtitle displaying on top of the title.
* **accordion-group:** Accordion Group no longer automatically adjusts the `value` property when passed an array and `multiple="false"`. Developers should update their apps to ensure they are using the API correctly.
* **select:** `ionChange` is no longer emitted when the `value` of `ion-select` is modified externally. `ionChange` is only emitted from user committed changes, such as confirming a selected option in the select's overlay.
* **react:** `@ionic/react` and `@ionic/react-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.
* **vue:** `@ionic/vue` and `@ionic/vue-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.
* **modal:** - The `swipeToClose` property has been removed in favor of `canDismiss`.
- The `canDismiss` property now defaults to `true` and can no longer be set to `undefined`.
* **checkbox:** `ionChange` is no longer emitted when the `checked` property of `ion-checkbox` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the checkbox.
* **accordion:** `ionChange` is no longer emitted when the `value` of `ion-accordion-group` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the accordion header.
* **core:** The `[hidden]` attribute has been removed from Ionic's global stylesheet. The `[hidden]` attribute can continue to be used, but developers will get the [native `hidden` implementation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) instead. The main difference is that the native implementation is easier to override using `display` than Ionic's implementation.

Developers can add the following CSS to their global stylesheet if they need the old behavior:

```css
[hidden] {
  display: none !important;
}
```
* **overlays:** Ionic now listens on the `keydown` event instead of the `keyup` event when determining when to dismiss overlays via the "Escape" key. Any applications that were listening on `keyup` to suppress this behavior should listen on `keydown` instead. 





## [6.5.1](https://github.com/ionic-team/ionic-framework/compare/v6.5.0...v6.5.1) (2023-01-25)


### Bug Fixes

* **action-sheet:** button icons are not announced by screen readers ([#26640](https://github.com/ionic-team/ionic-framework/issues/26640)) ([22e9ff8](https://github.com/ionic-team/ionic-framework/commit/22e9ff866f8bd7e2e4ca82eae70969ea4f2658df))
* **fab-button:** icon is not announced by screen readers ([#26619](https://github.com/ionic-team/ionic-framework/issues/26619)) ([dd7cd8c](https://github.com/ionic-team/ionic-framework/commit/dd7cd8c0bfe652d293dc2c2b1bd2a36fd9cf0a0b)), closes [#22296](https://github.com/ionic-team/ionic-framework/issues/22296)
* **modal, popover:** warn if trigger element was not found ([#26650](https://github.com/ionic-team/ionic-framework/issues/26650)) ([1115203](https://github.com/ionic-team/ionic-framework/commit/11152031202a513121861486e50ea7942b9118d3))
* **picker-column:** cssClass is set on column ([#26658](https://github.com/ionic-team/ionic-framework/issues/26658)) ([c6620c7](https://github.com/ionic-team/ionic-framework/commit/c6620c7c74abe04c3041e8b256441af72ea12131)), closes [#26653](https://github.com/ionic-team/ionic-framework/issues/26653)
* **react:** hardware back button works in dev mode ([#26614](https://github.com/ionic-team/ionic-framework/issues/26614)) ([abcfe9f](https://github.com/ionic-team/ionic-framework/commit/abcfe9fe867730f29b9379c3736f86b3d20c5b0a)), closes [#26599](https://github.com/ionic-team/ionic-framework/issues/26599)
* **select:** focusing item works in firefox ([#26668](https://github.com/ionic-team/ionic-framework/issues/26668)) ([946807d](https://github.com/ionic-team/ionic-framework/commit/946807d67b972c41b52c23c8f00feca4c705b224))
* **toggle:** on-off icon is not announced by screen readers ([#26641](https://github.com/ionic-team/ionic-framework/issues/26641)) ([77ccac0](https://github.com/ionic-team/ionic-framework/commit/77ccac059091d5d9f7daf9c7fb01a9e855b86ce3))
* **vue:** unmount teleported components ([#26647](https://github.com/ionic-team/ionic-framework/issues/26647)) ([6b16a0c](https://github.com/ionic-team/ionic-framework/commit/6b16a0c020fc6afb6a5a6e6fa6f0758384f026b9)), closes [#26644](https://github.com/ionic-team/ionic-framework/issues/26644)





# [6.5.0](https://github.com/ionic-team/ionic-framework/compare/v6.4.3...v6.5.0) (2023-01-18)


### Features

* **deps:** update ionicons to 6.1.0 ([#26617](https://github.com/ionic-team/ionic-framework/issues/26617)) ([ccd2a92](https://github.com/ionic-team/ionic-framework/commit/ccd2a9224e018ad0d67903d44ec312934c3b35ec))
* **deps:** update ionicons to 6.1.1 ([#26626](https://github.com/ionic-team/ionic-framework/issues/26626)) ([90405eb](https://github.com/ionic-team/ionic-framework/commit/90405eb0af69ce04faf5855189449d0b7518288c))
* **router:** export hook interfaces ([#26551](https://github.com/ionic-team/ionic-framework/issues/26551)) ([2752702](https://github.com/ionic-team/ionic-framework/commit/27527025e4588f43f9f79640f0929e7c7d0618ee))





## [6.4.3](https://github.com/ionic-team/ionic-framework/compare/v6.4.2...v6.4.3) (2023-01-18)


### Bug Fixes

* **datetime:** allow header to render in all wheel picker presentations ([#26616](https://github.com/ionic-team/ionic-framework/issues/26616)) ([7b947b5](https://github.com/ionic-team/ionic-framework/commit/7b947b5d58ff51a3a6ac360fef6d4df073e1bfec))
* **input:** clear button uses contrast when setting color on item ([#26592](https://github.com/ionic-team/ionic-framework/issues/26592)) ([a31e1e5](https://github.com/ionic-team/ionic-framework/commit/a31e1e594d4ed7bbcf690b27eee143da232f2bdc)), closes [#26337](https://github.com/ionic-team/ionic-framework/issues/26337)
* **list:** inset lists render correctly ([#26586](https://github.com/ionic-team/ionic-framework/issues/26586)) ([911b1d4](https://github.com/ionic-team/ionic-framework/commit/911b1d496efe595ddbf8e980f052e505ce9716c2)), closes [#20819](https://github.com/ionic-team/ionic-framework/issues/20819)





## [6.4.2](https://github.com/ionic-team/ionic-framework/compare/v6.4.1...v6.4.2) (2023-01-11)


### Bug Fixes

* **datetime:** time wheel input mode is dismissed on user scroll ([#26567](https://github.com/ionic-team/ionic-framework/issues/26567)) ([d13a146](https://github.com/ionic-team/ionic-framework/commit/d13a14658df2723aff908a94181cb563cb1f5b43))
* **loading:** support custom aria-label ([#26581](https://github.com/ionic-team/ionic-framework/issues/26581)) ([2450a1e](https://github.com/ionic-team/ionic-framework/commit/2450a1e821d3901c8efb57ec256a10a951d22c8f)), closes [#24486](https://github.com/ionic-team/ionic-framework/issues/24486)
* **modal:** canDismiss type with data and role ([#26547](https://github.com/ionic-team/ionic-framework/issues/26547)) ([32c2622](https://github.com/ionic-team/ionic-framework/commit/32c2622ab04a70d00684e9a813d9bcef698d7551)), closes [#26544](https://github.com/ionic-team/ionic-framework/issues/26544)
* **picker-column-internal:** blurring picker does not throw error ([#26560](https://github.com/ionic-team/ionic-framework/issues/26560)) ([3e671b9](https://github.com/ionic-team/ionic-framework/commit/3e671b9c8ff62945a12eff431839ddae37d9d1a7)), closes [#26559](https://github.com/ionic-team/ionic-framework/issues/26559)
* **segment:** nested interactive is not rendered ([#26575](https://github.com/ionic-team/ionic-framework/issues/26575)) ([77ce9e0](https://github.com/ionic-team/ionic-framework/commit/77ce9e066e1ee71438ceac35479ea04e8df021f5))
* **tab-button:** nested interactives are not rendered ([#26576](https://github.com/ionic-team/ionic-framework/issues/26576)) ([df4882d](https://github.com/ionic-team/ionic-framework/commit/df4882d4d1c516038badfa647db484e070fbd099)), closes [#23332](https://github.com/ionic-team/ionic-framework/issues/23332)
* **vue:** unmount teleported user component ([#26543](https://github.com/ionic-team/ionic-framework/issues/26543)) ([c996384](https://github.com/ionic-team/ionic-framework/commit/c996384786257524842cc1dca8d0fb940699719b)), closes [#26542](https://github.com/ionic-team/ionic-framework/issues/26542)





## [6.4.1](https://github.com/ionic-team/ionic-framework/compare/v6.4.0...v6.4.1) (2022-12-14)


### Bug Fixes

* **breadcrumbs:** breadcrumbs are reactive ([#26427](https://github.com/ionic-team/ionic-framework/issues/26427)) ([0d8625b](https://github.com/ionic-team/ionic-framework/commit/0d8625b95537208c188b32a1707fa66050953281)), closes [#24041](https://github.com/ionic-team/ionic-framework/issues/24041)
* **datetime:** keyboard can select hour 00 ([#26423](https://github.com/ionic-team/ionic-framework/issues/26423)) ([2fc96b7](https://github.com/ionic-team/ionic-framework/commit/2fc96b771412d2deac6d19883bfc5abc74d0bdbd)), closes [#26409](https://github.com/ionic-team/ionic-framework/issues/26409)
* **modal:** compatibility with stencil libraries/apps ([#26448](https://github.com/ionic-team/ionic-framework/issues/26448)) ([1aa1068](https://github.com/ionic-team/ionic-framework/commit/1aa1068df7867a8b8a203052635da018014f5f1c))
* **normalize:** remove normalize styles for outdated browsers ([#26465](https://github.com/ionic-team/ionic-framework/issues/26465)) ([82d1d94](https://github.com/ionic-team/ionic-framework/commit/82d1d948ecd7725772eb1ffee495e7a5dcadb30b)), closes [#26464](https://github.com/ionic-team/ionic-framework/issues/26464)





# [6.4.0](https://github.com/ionic-team/ionic-framework/compare/v6.3.10...v6.4.0) (2022-12-07)


### Features

* **modal:** data and role are passed to canDismiss ([#26384](https://github.com/ionic-team/ionic-framework/issues/26384)) ([1b30fc9](https://github.com/ionic-team/ionic-framework/commit/1b30fc97d33e761866b4bcf7518efcdeb753032d)), closes [#26292](https://github.com/ionic-team/ionic-framework/issues/26292)
* **toast:** add global config toastDuration ([#26425](https://github.com/ionic-team/ionic-framework/issues/26425)) ([a67a827](https://github.com/ionic-team/ionic-framework/commit/a67a827fedc8adf44a35c786f615871facca60fc))
* **toggle:** add toggleOnOffLabels global config option ([#26087](https://github.com/ionic-team/ionic-framework/issues/26087)) ([43e2b39](https://github.com/ionic-team/ionic-framework/commit/43e2b3975d003e29b8060e5f5484bfb3daf457a2))





## [6.3.10](https://github.com/ionic-team/ionic-framework/compare/v6.3.9...v6.3.10) (2022-12-07)


### Bug Fixes

* **datetime:** add flipRTL to monthAndYear dropdown icon ([#26378](https://github.com/ionic-team/ionic-framework/issues/26378)) ([13fe669](https://github.com/ionic-team/ionic-framework/commit/13fe669dc14eb4c9feda8ee956fec42b994b0f96))
* **datetime:** md highlight does not clip at start or end of month ([#26366](https://github.com/ionic-team/ionic-framework/issues/26366)) ([fcfbcdb](https://github.com/ionic-team/ionic-framework/commit/fcfbcdbc200b1354b9128a691fbd9b68d50d8668)), closes [#24891](https://github.com/ionic-team/ionic-framework/issues/24891)
* **segment:** scrolling button into view is more consistent ([#26369](https://github.com/ionic-team/ionic-framework/issues/26369)) ([a2d570b](https://github.com/ionic-team/ionic-framework/commit/a2d570b7ad8b799b072ba6eb79d8fe4c6dd77cf0)), closes [#26368](https://github.com/ionic-team/ionic-framework/issues/26368)





## [6.3.9](https://github.com/ionic-team/ionic-framework/compare/v6.3.8...v6.3.9) (2022-11-30)


### Bug Fixes

* **button:** fill can be set to undefined ([#26339](https://github.com/ionic-team/ionic-framework/issues/26339)) ([2fe23d9](https://github.com/ionic-team/ionic-framework/commit/2fe23d9d46c3593843c781c57340332e5a86fd64)), closes [#25886](https://github.com/ionic-team/ionic-framework/issues/25886)
* **input:** clear icon can be styled ([#26354](https://github.com/ionic-team/ionic-framework/issues/26354)) ([ccaff8d](https://github.com/ionic-team/ionic-framework/commit/ccaff8d0dc66f8adc9cde838c084629391e4200d)), closes [#19178](https://github.com/ionic-team/ionic-framework/issues/19178) [#17168](https://github.com/ionic-team/ionic-framework/issues/17168)
* **reorder:** items animate once in firefox ([#26326](https://github.com/ionic-team/ionic-framework/issues/26326)) ([7ae8117](https://github.com/ionic-team/ionic-framework/commit/7ae81172844659d7f4581956ce17e5324f73beef)), closes [#21182](https://github.com/ionic-team/ionic-framework/issues/21182)
* **segment:** segment in toolbar uses correct contrast ([#26353](https://github.com/ionic-team/ionic-framework/issues/26353)) ([5a243cc](https://github.com/ionic-team/ionic-framework/commit/5a243ccebc8e27bef6eb1ed2f797a0c1166199bf)), closes [#26350](https://github.com/ionic-team/ionic-framework/issues/26350)





## [6.3.8](https://github.com/ionic-team/ionic-framework/compare/v6.3.7...v6.3.8) (2022-11-22)


### Bug Fixes

* **modal:** status bar style defaults to app settings ([#26291](https://github.com/ionic-team/ionic-framework/issues/26291)) ([a6c9e55](https://github.com/ionic-team/ionic-framework/commit/a6c9e55adcaa963f4829d6963b9b1a7b246cef4e)), closes [#26173](https://github.com/ionic-team/ionic-framework/issues/26173)
* **normalize:** normalize css resets button padding ([#26214](https://github.com/ionic-team/ionic-framework/issues/26214)) ([e14c947](https://github.com/ionic-team/ionic-framework/commit/e14c94722c2c8ec145d680f911b708a34f095cd3)), closes [#23928](https://github.com/ionic-team/ionic-framework/issues/23928)
* **popover:** popover positions correctly on all frameworks ([#26306](https://github.com/ionic-team/ionic-framework/issues/26306)) ([be9a399](https://github.com/ionic-team/ionic-framework/commit/be9a399eeed37ae4a67add78ac1283ba0c5e4b14)), closes [#25337](https://github.com/ionic-team/ionic-framework/issues/25337)
* **react:** useIonRouter hook has stable router reference ([#25000](https://github.com/ionic-team/ionic-framework/issues/25000)) ([89e3cd6](https://github.com/ionic-team/ionic-framework/commit/89e3cd67ce6d9cfc0607d6a89362483878a1820b)), closes [#24987](https://github.com/ionic-team/ionic-framework/issues/24987)
* **reorder-group:** support custom components ([#26289](https://github.com/ionic-team/ionic-framework/issues/26289)) ([8425734](https://github.com/ionic-team/ionic-framework/commit/842573477b1b498f2280badc8c7411832c1650a5)), closes [#19447](https://github.com/ionic-team/ionic-framework/issues/19447)
* **segment:** scrollable segments center button on click ([#26285](https://github.com/ionic-team/ionic-framework/issues/26285)) ([73ea64c](https://github.com/ionic-team/ionic-framework/commit/73ea64c02fff1d63651f6c98f03b43265ba5227a)), closes [#25367](https://github.com/ionic-team/ionic-framework/issues/25367)
* **toggle:** rtl layout renders correctly in safari ([#26315](https://github.com/ionic-team/ionic-framework/issues/26315)) ([0932f89](https://github.com/ionic-team/ionic-framework/commit/0932f89f5db63a1e6149f2f45de798d7485d72ee))





## [6.3.7](https://github.com/ionic-team/ionic-framework/compare/v6.3.6...v6.3.7) (2022-11-16)


### Bug Fixes

* **action-sheet:** icons are aligned on MD mode ([#26256](https://github.com/ionic-team/ionic-framework/issues/26256)) ([627d654](https://github.com/ionic-team/ionic-framework/commit/627d654d24f97e340e4004a03f07467619e60149)), closes [#26249](https://github.com/ionic-team/ionic-framework/issues/26249)
* **datetime:** clear button clears the selected date ([#26264](https://github.com/ionic-team/ionic-framework/issues/26264)) ([9216744](https://github.com/ionic-team/ionic-framework/commit/9216744205c1ecc0c3dd51490a25be102f27a91a)), closes [#26258](https://github.com/ionic-team/ionic-framework/issues/26258)
* **datetime:** fonts now render consistently ([#26281](https://github.com/ionic-team/ionic-framework/issues/26281)) ([f13ddca](https://github.com/ionic-team/ionic-framework/commit/f13ddcaf470fb3d070298819675812cebf5f5ceb))
* **datetime:** max and min works with showDefaultButtons ([#26257](https://github.com/ionic-team/ionic-framework/issues/26257)) ([e5cff9e](https://github.com/ionic-team/ionic-framework/commit/e5cff9ecf39c13912cf6e062e4a084fadc59c399)), closes [#26146](https://github.com/ionic-team/ionic-framework/issues/26146)
* **popover:** inline popover positioning with fit-content or auto width ([#26230](https://github.com/ionic-team/ionic-framework/issues/26230)) ([0a8a958](https://github.com/ionic-team/ionic-framework/commit/0a8a958cba02994ea0fefa265b17edddffe62e98)), closes [#24716](https://github.com/ionic-team/ionic-framework/issues/24716)
* **popover:** popover positioning for controller and inline ([#26274](https://github.com/ionic-team/ionic-framework/issues/26274)) ([31ab10d](https://github.com/ionic-team/ionic-framework/commit/31ab10de4e1c8e38582b985f19414f73337a63c8)), closes [#24716](https://github.com/ionic-team/ionic-framework/issues/24716)
* **textarea:** scrollbars are visible with overflow ([#26284](https://github.com/ionic-team/ionic-framework/issues/26284)) ([7a990ff](https://github.com/ionic-team/ionic-framework/commit/7a990ff403d7b7b80541c5d8f9cd05463c4fb593)), closes [#26278](https://github.com/ionic-team/ionic-framework/issues/26278)





## [6.3.6](https://github.com/ionic-team/ionic-framework/compare/v6.3.5...v6.3.6) (2022-11-10)


### Bug Fixes

* **datetime:** flip chevron icons when RTL is set on component directly ([#26195](https://github.com/ionic-team/ionic-framework/issues/26195)) ([dd98677](https://github.com/ionic-team/ionic-framework/commit/dd9867708b66543f5cbe978e0fa6ef34b37f9fc3))
* **react:** inline overlays display contents consistently ([#26255](https://github.com/ionic-team/ionic-framework/issues/26255)) ([d709ff6](https://github.com/ionic-team/ionic-framework/commit/d709ff64ae29a5197dc74cecb95cba602479683d)), closes [#26253](https://github.com/ionic-team/ionic-framework/issues/26253)





## [6.3.5](https://github.com/ionic-team/ionic-framework/compare/v6.3.4...v6.3.5) (2022-11-09)


### Bug Fixes

* **android:** account for chrome 108 resize ([#26244](https://github.com/ionic-team/ionic-framework/issues/26244)) ([1a0b9ed](https://github.com/ionic-team/ionic-framework/commit/1a0b9ed3bacffa9f602637c204f52cb3face5a3e))
* **datetime:** min/max correctly display available day periods ([#26241](https://github.com/ionic-team/ionic-framework/issues/26241)) ([526e411](https://github.com/ionic-team/ionic-framework/commit/526e4113d82d244e2574b24d72fda632bb2aa143)), closes [#26216](https://github.com/ionic-team/ionic-framework/issues/26216)
* **overlays:** presenting an overlay does not create nested elements ([#26154](https://github.com/ionic-team/ionic-framework/issues/26154)) ([bb00595](https://github.com/ionic-team/ionic-framework/commit/bb005956eaff7401cfe1d6befcbf512424ddd283)), closes [#26117](https://github.com/ionic-team/ionic-framework/issues/26117)
* **react:** loading layout is correct with no message ([#26222](https://github.com/ionic-team/ionic-framework/issues/26222)) ([57105d5](https://github.com/ionic-team/ionic-framework/commit/57105d54ea259fc9cd1a63e3d361ec8a57dd2971)), closes [#26219](https://github.com/ionic-team/ionic-framework/issues/26219)
* **vue:** generate web-types for components ([#26205](https://github.com/ionic-team/ionic-framework/issues/26205)) ([1f7fc8f](https://github.com/ionic-team/ionic-framework/commit/1f7fc8f05c03316560e0b58c3bf58db6b189d0e1)), closes [#26198](https://github.com/ionic-team/ionic-framework/issues/26198)





## [6.3.4](https://github.com/ionic-team/ionic-framework/compare/v6.3.3...v6.3.4) (2022-11-02)


### Bug Fixes

* **datetime:** account for allowed values when setting default date ([#26093](https://github.com/ionic-team/ionic-framework/issues/26093)) ([3745083](https://github.com/ionic-team/ionic-framework/commit/3745083b7cdf8651d1c7f5f1a0214b487ea286ca)), closes [#24722](https://github.com/ionic-team/ionic-framework/issues/24722)
* **modal, popover:** remove trigger click listeners when overlay is unmounted ([#26167](https://github.com/ionic-team/ionic-framework/issues/26167)) ([1320948](https://github.com/ionic-team/ionic-framework/commit/1320948b245be3defe8610b9f049e781a4903a6e))
* **modal:** buttons are highlighted with VoiceOver ([#26180](https://github.com/ionic-team/ionic-framework/issues/26180)) ([1504b88](https://github.com/ionic-team/ionic-framework/commit/1504b8888d6f79ea382935ed52b104b9f841d150)), closes [#26156](https://github.com/ionic-team/ionic-framework/issues/26156)





## [6.3.3](https://github.com/ionic-team/ionic-framework/compare/v6.3.2...v6.3.3) (2022-10-26)


### Bug Fixes

* **datetime:** empty string is treated as no value ([#26131](https://github.com/ionic-team/ionic-framework/issues/26131)) ([51ab5f6](https://github.com/ionic-team/ionic-framework/commit/51ab5f67b50013c0ed8ca3160d6dfc56bc269f2a)), closes [#26116](https://github.com/ionic-team/ionic-framework/issues/26116)
* **datetime:** preferWheel can now show title ([#26101](https://github.com/ionic-team/ionic-framework/issues/26101)) ([479d56b](https://github.com/ionic-team/ionic-framework/commit/479d56b3b26d45bfd03d4095458c37ed00485c54)), closes [#26095](https://github.com/ionic-team/ionic-framework/issues/26095)
* **datetime:** values are adjusted to be in bounds ([#26125](https://github.com/ionic-team/ionic-framework/issues/26125)) ([0548fe8](https://github.com/ionic-team/ionic-framework/commit/0548fe858854f0187e0dfe00efaec142cd5bb6cf)), closes [#25894](https://github.com/ionic-team/ionic-framework/issues/25894) [#25708](https://github.com/ionic-team/ionic-framework/issues/25708)
* **dependencies:** latest patch is installed ([#26148](https://github.com/ionic-team/ionic-framework/issues/26148)) ([74be79e](https://github.com/ionic-team/ionic-framework/commit/74be79e9d81fd5431ae2fc442fd6387cf37b2015)), closes [#26137](https://github.com/ionic-team/ionic-framework/issues/26137)
* **many:** haptics only fire on supported platforms ([#26130](https://github.com/ionic-team/ionic-framework/issues/26130)) ([d4d569a](https://github.com/ionic-team/ionic-framework/commit/d4d569ac09ab25ab5a490825cf1fc655fe97bb87)), closes [#26109](https://github.com/ionic-team/ionic-framework/issues/26109)
* **react:** inline overlays can be conditionally rendered  ([#26111](https://github.com/ionic-team/ionic-framework/issues/26111)) ([8ec350a](https://github.com/ionic-team/ionic-framework/commit/8ec350ae652095ae29e2f02a7f105cb709a72583)), closes [#25590](https://github.com/ionic-team/ionic-framework/issues/25590)





## [6.3.2](https://github.com/ionic-team/ionic-framework/compare/v6.3.1...v6.3.2) (2022-10-17)


### Bug Fixes

* **datetime:** header renders correct date ([#26120](https://github.com/ionic-team/ionic-framework/issues/26120)) ([04df45a](https://github.com/ionic-team/ionic-framework/commit/04df45a443e4faeea644daa76dc509fea0d24ca2)), closes [#26116](https://github.com/ionic-team/ionic-framework/issues/26116)
* **datetime:** selecting days updates value ([#26121](https://github.com/ionic-team/ionic-framework/issues/26121)) ([d76a24d](https://github.com/ionic-team/ionic-framework/commit/d76a24dd9e485a2f3cc517231bbb1dab51fa1fd3))
* **modal:** sheet modal dismisses correctly ([#26110](https://github.com/ionic-team/ionic-framework/issues/26110)) ([256b03f](https://github.com/ionic-team/ionic-framework/commit/256b03f12a57c2b5904d9017e4fa93b11eea8fc7)), closes [#26108](https://github.com/ionic-team/ionic-framework/issues/26108)
* **vue:** routing components define child components ([#26107](https://github.com/ionic-team/ionic-framework/issues/26107)) ([d60973b](https://github.com/ionic-team/ionic-framework/commit/d60973b2449b29a982b752a98b10d2b043ecff2f))





## [6.3.1](https://github.com/ionic-team/ionic-framework/compare/v6.3.0...v6.3.1) (2022-10-12)


### Bug Fixes

* **datetime:** setting date async updates calendar grid ([#26070](https://github.com/ionic-team/ionic-framework/issues/26070)) ([0aee328](https://github.com/ionic-team/ionic-framework/commit/0aee328b4b84d5668752e5ae0792334d0173c2bb)), closes [#25776](https://github.com/ionic-team/ionic-framework/issues/25776)
* **datetime:** setting max/min does not increase number of nodes rendered ([#26065](https://github.com/ionic-team/ionic-framework/issues/26065)) ([a5d178f](https://github.com/ionic-team/ionic-framework/commit/a5d178f4c03a0ad2501095afe1f75914b0462ae1)), closes [#26059](https://github.com/ionic-team/ionic-framework/issues/26059)
* **item, card:** aria-label is reflected to the inner button ([#26028](https://github.com/ionic-team/ionic-framework/issues/26028)) ([3c89ebe](https://github.com/ionic-team/ionic-framework/commit/3c89ebe7216b2a19580a4f1ed23d5d1d4c37919d)), closes [#25885](https://github.com/ionic-team/ionic-framework/issues/25885)
* **toolbar:** MD height only applies to MD segment ([#26042](https://github.com/ionic-team/ionic-framework/issues/26042)) ([ab89679](https://github.com/ionic-team/ionic-framework/commit/ab8967936c6bef5fc0a884cb8bf8f2deb7784c13)), closes [#18617](https://github.com/ionic-team/ionic-framework/issues/18617)





# [6.3.0](https://github.com/ionic-team/ionic-framework/compare/v6.2.9...v6.3.0) (2022-10-05)


### Bug Fixes

* **list:** remove extra border in md inset list items ([#25972](https://github.com/ionic-team/ionic-framework/issues/25972)) ([3eb3dd5](https://github.com/ionic-team/ionic-framework/commit/3eb3dd5afa02f7257e2594f56efe570be83719b6)), closes [#25278](https://github.com/ionic-team/ionic-framework/issues/25278)
* **range:** indication when range knob is focused ([#25827](https://github.com/ionic-team/ionic-framework/issues/25827)) ([2c815cf](https://github.com/ionic-team/ionic-framework/commit/2c815cff139a0061883d3eef47816aea8801dcf4))


### Features

* **alert:** accept Promise for button handler ([#25702](https://github.com/ionic-team/ionic-framework/issues/25702)) ([8e4783c](https://github.com/ionic-team/ionic-framework/commit/8e4783c17298e8f7654590108430e80f22ed6a7a)), closes [#25700](https://github.com/ionic-team/ionic-framework/issues/25700)
* **angular:** use standalone components with routing ([#25589](https://github.com/ionic-team/ionic-framework/issues/25589)) ([3c84d48](https://github.com/ionic-team/ionic-framework/commit/3c84d48cfa87810896364cb7ca16efcbdd7e8b07)), closes [#25404](https://github.com/ionic-team/ionic-framework/issues/25404)
* **button:** submit from outside of form ([#25913](https://github.com/ionic-team/ionic-framework/issues/25913)) ([b139838](https://github.com/ionic-team/ionic-framework/commit/b13983848c9ea7387062953412eaae744c001ec7)), closes [#21194](https://github.com/ionic-team/ionic-framework/issues/21194)
* **datetime-button:** support multiple date selection ([#25971](https://github.com/ionic-team/ionic-framework/issues/25971)) ([a56a4a9](https://github.com/ionic-team/ionic-framework/commit/a56a4a9c0528fe77859963f5b801a3d645be0b23))
* **datetime:** add header text to multiple selection; improve header consistency between modes ([#25817](https://github.com/ionic-team/ionic-framework/issues/25817)) ([8a1b3c5](https://github.com/ionic-team/ionic-framework/commit/8a1b3c5f300a1ec953d406b65601f84fa49aa807))





## [6.2.9](https://github.com/ionic-team/ionic-framework/compare/v6.2.8...v6.2.9) (2022-09-28)


### Bug Fixes

* **animation:** improve compatibility with ssr ([#25992](https://github.com/ionic-team/ionic-framework/issues/25992)) ([02234f6](https://github.com/ionic-team/ionic-framework/commit/02234f69e0333266b4d500f24b3bb002c099bda2)), closes [#25987](https://github.com/ionic-team/ionic-framework/issues/25987)
* **chip:** default color has contrast on dark mode ([#25998](https://github.com/ionic-team/ionic-framework/issues/25998)) ([ef78a12](https://github.com/ionic-team/ionic-framework/commit/ef78a123e553e27d9c41c2735bf44c21cbfa7ade)), closes [#25997](https://github.com/ionic-team/ionic-framework/issues/25997)
* **datetime:** expand/collapse icon is not announced to screen readers ([#26018](https://github.com/ionic-team/ionic-framework/issues/26018)) ([649d3cf](https://github.com/ionic-team/ionic-framework/commit/649d3cf688d44226f63783bf784f747d1a61476c))
* **datetime:** swiping wheel no longer dismisses card modal ([#25981](https://github.com/ionic-team/ionic-framework/issues/25981)) ([7543c84](https://github.com/ionic-team/ionic-framework/commit/7543c84445e6698d29cafe75b423c33115bc534c))
* **datetime:** switching month and year accounts for day ([#25996](https://github.com/ionic-team/ionic-framework/issues/25996)) ([11f44e9](https://github.com/ionic-team/ionic-framework/commit/11f44e94f4abe81892f33a057055e5f9b5092528)), closes [#25585](https://github.com/ionic-team/ionic-framework/issues/25585)
* **datetime:** time button is easier to access with screen readers ([#26019](https://github.com/ionic-team/ionic-framework/issues/26019)) ([5846b41](https://github.com/ionic-team/ionic-framework/commit/5846b418a7e0b2f0bd025c2dac1f248ecb2d17c2))
* **picker-internal:** fonts now render consistently ([#26020](https://github.com/ionic-team/ionic-framework/issues/26020)) ([54f99bd](https://github.com/ionic-team/ionic-framework/commit/54f99bd5b308386d43596677c9e9227dae822541))
* **react:** overlays now define internal ionic components ([#25967](https://github.com/ionic-team/ionic-framework/issues/25967)) ([21dc893](https://github.com/ionic-team/ionic-framework/commit/21dc893f90a56d14d69330367daae6788e32652e)), closes [#25962](https://github.com/ionic-team/ionic-framework/issues/25962)
* **vue:** back button handler only fires in routing context ([#26014](https://github.com/ionic-team/ionic-framework/issues/26014)) ([19f0fb7](https://github.com/ionic-team/ionic-framework/commit/19f0fb70452c8bd003743984a3d6522369eaa3b7))





## [6.2.8](https://github.com/ionic-team/ionic-framework/compare/v6.2.7...v6.2.8) (2022-09-21)


### Bug Fixes

* **datetime:** account for 12AM with min times and 12 hour format ([#25952](https://github.com/ionic-team/ionic-framework/issues/25952)) ([55ebd6c](https://github.com/ionic-team/ionic-framework/commit/55ebd6cdf39c01b401e876b76e755bfa04db8f65)), closes [#25183](https://github.com/ionic-team/ionic-framework/issues/25183)
* **item:** show the highlight on iOS when --highlight-height is set ([#25905](https://github.com/ionic-team/ionic-framework/issues/25905)) ([d7db133](https://github.com/ionic-team/ionic-framework/commit/d7db1333f13834ecb447b4b1da62cfffed9fb333))
* **overlays:** focus trapping no longer includes disabled elements ([#25949](https://github.com/ionic-team/ionic-framework/issues/25949)) ([6cb5827](https://github.com/ionic-team/ionic-framework/commit/6cb5827d069c255ab0a9a8c319aba9994a4c5196))
* **overlays:** focus trapping no longer includes hidden elements ([#25948](https://github.com/ionic-team/ionic-framework/issues/25948)) ([5c10f98](https://github.com/ionic-team/ionic-framework/commit/5c10f98ceb3ae42d3363b38ba786b9122676a59c))


### Performance Improvements

* **card:** avoid force compositing on ios ([#25942](https://github.com/ionic-team/ionic-framework/issues/25942)) ([174c3b3](https://github.com/ionic-team/ionic-framework/commit/174c3b30a0bce7e7ab13e5605348ec107af69dd6))





## [6.2.7](https://github.com/ionic-team/ionic-framework/compare/v6.2.6...v6.2.7) (2022-09-14)


### Bug Fixes

* **angular:** nav controller can pop views after leaving tabs outlet ([#25690](https://github.com/ionic-team/ionic-framework/issues/25690)) ([725b13f](https://github.com/ionic-team/ionic-framework/commit/725b13fa60775dc9f9c3491cb545c70a5a9162eb)), closes [#18593](https://github.com/ionic-team/ionic-framework/issues/18593)
* **datetime:** correct year is set in wheel picker ([#25896](https://github.com/ionic-team/ionic-framework/issues/25896)) ([fb653eb](https://github.com/ionic-team/ionic-framework/commit/fb653ebe67458a088adf0626741d190ceb2880a6)), closes [#25895](https://github.com/ionic-team/ionic-framework/issues/25895)
* **footer:** padding is added correctly with tabs ([#25921](https://github.com/ionic-team/ionic-framework/issues/25921)) ([edbb64c](https://github.com/ionic-team/ionic-framework/commit/edbb64c4b6de7ace7043675a85fd503da18304d7)), closes [#25918](https://github.com/ionic-team/ionic-framework/issues/25918)
* **input,textarea:** data-form-type attribute is assigned to inner input ([#25927](https://github.com/ionic-team/ionic-framework/issues/25927)) ([9451b28](https://github.com/ionic-team/ionic-framework/commit/9451b283e2cb30ac9087574461f6b9f4b6cc3e0f)), closes [#25908](https://github.com/ionic-team/ionic-framework/issues/25908)
* **modal:** sheet is easier to dismiss with swipe ([#25883](https://github.com/ionic-team/ionic-framework/issues/25883)) ([fa169d2](https://github.com/ionic-team/ionic-framework/commit/fa169d2dca649107342fe365ef6c7da892ebb8fd)), closes [#24296](https://github.com/ionic-team/ionic-framework/issues/24296)
* **react:** add correct type for CreateAnimation ([#25931](https://github.com/ionic-team/ionic-framework/issues/25931)) ([89d3e3c](https://github.com/ionic-team/ionic-framework/commit/89d3e3c819b282e4d7ce716b9099eaab82ab4de2))
* **tab-bar:** use correct import path ([#25898](https://github.com/ionic-team/ionic-framework/issues/25898)) ([ad46045](https://github.com/ionic-team/ionic-framework/commit/ad46045bcc251c9719ecf6621792f1a5b3c6afce)), closes [#25897](https://github.com/ionic-team/ionic-framework/issues/25897)
* **textarea:** auto grow textarea line wraps long contents ([#25928](https://github.com/ionic-team/ionic-framework/issues/25928)) ([777109a](https://github.com/ionic-team/ionic-framework/commit/777109a7e8625ed61a8cc09e52fc06e104b124ea)), closes [#25893](https://github.com/ionic-team/ionic-framework/issues/25893)





## [6.2.6](https://github.com/ionic-team/ionic-framework/compare/v6.2.5...v6.2.6) (2022-09-07)


### Bug Fixes

* **datetime:** calendar day and years are now localized ([#25847](https://github.com/ionic-team/ionic-framework/issues/25847)) ([cbd1268](https://github.com/ionic-team/ionic-framework/commit/cbd1268a03204f05314f2ba284ad433457a9cf33)), closes [#25843](https://github.com/ionic-team/ionic-framework/issues/25843)
* **datetime:** hourCycle formats hour correctly ([#25869](https://github.com/ionic-team/ionic-framework/issues/25869)) ([1a1491d](https://github.com/ionic-team/ionic-framework/commit/1a1491df0242da1cb3c9a7f128bbd4d5ce4dbf3e)), closes [#25862](https://github.com/ionic-team/ionic-framework/issues/25862)
* **datetime:** month grid no longer loops on ios ([#25857](https://github.com/ionic-team/ionic-framework/issues/25857)) ([c938054](https://github.com/ionic-team/ionic-framework/commit/c938054605dffb6c3002a64a3d8aaf36892c7a93)), closes [#25752](https://github.com/ionic-team/ionic-framework/issues/25752)
* **vue:** custom animation plays when replacing ([#25863](https://github.com/ionic-team/ionic-framework/issues/25863)) ([2d3661a](https://github.com/ionic-team/ionic-framework/commit/2d3661ae3894b98ac4b8b158594b8de0f0823073)), closes [#25831](https://github.com/ionic-team/ionic-framework/issues/25831)





## [6.2.5](https://github.com/ionic-team/ionic-framework/compare/v6.2.4...v6.2.5) (2022-08-31)


### Bug Fixes

* **action-sheet:** add aria-labelledby ([#25837](https://github.com/ionic-team/ionic-framework/issues/25837)) ([5270151](https://github.com/ionic-team/ionic-framework/commit/527015184e9413c1037277d3197bcaa33044c38c))
* **angular:** router outlet has mode property ([#25816](https://github.com/ionic-team/ionic-framework/issues/25816)) ([afd0bbc](https://github.com/ionic-team/ionic-framework/commit/afd0bbc60aa8f4edc88dc311d6484ac60117fce5)), closes [#25813](https://github.com/ionic-team/ionic-framework/issues/25813)
* **datetime:** next and previous buttons have correct labels ([#25845](https://github.com/ionic-team/ionic-framework/issues/25845)) ([41e3387](https://github.com/ionic-team/ionic-framework/commit/41e338730d32837fc9dd8a15477e37dea4cc76c9)), closes [#25844](https://github.com/ionic-team/ionic-framework/issues/25844)
* **datetime:** only log out of bounds warning if value set ([#25835](https://github.com/ionic-team/ionic-framework/issues/25835)) ([85af6ce](https://github.com/ionic-team/ionic-framework/commit/85af6ce436890eb922d2ba32053fb8b8bc7fd4ff)), closes [#25833](https://github.com/ionic-team/ionic-framework/issues/25833)
* **input:** clear button is not activated on swipe ([#25825](https://github.com/ionic-team/ionic-framework/issues/25825)) ([ff71ad4](https://github.com/ionic-team/ionic-framework/commit/ff71ad492d7671f8e550da7e08dbde30cb05ebf7)), closes [#24857](https://github.com/ionic-team/ionic-framework/issues/24857)
* **modal:** handleBehavior can be used with controller ([#25821](https://github.com/ionic-team/ionic-framework/issues/25821)) ([79ef1b5](https://github.com/ionic-team/ionic-framework/commit/79ef1b57dc74fd856ed7c2904d7400d283cc081e)), closes [#25820](https://github.com/ionic-team/ionic-framework/issues/25820)
* **searchbar:** clear button has focus indicator ([#25828](https://github.com/ionic-team/ionic-framework/issues/25828)) ([373b4ff](https://github.com/ionic-team/ionic-framework/commit/373b4ffe216ba584b92014cef501f64668e1f177))
* **searchbar:** keypress can activate clear button ([#25824](https://github.com/ionic-team/ionic-framework/issues/25824)) ([c270756](https://github.com/ionic-team/ionic-framework/commit/c270756356c7b23a1959ac5f4b8206a5cd1825c2))





## [6.2.4](https://github.com/ionic-team/ionic-framework/compare/v6.2.3...v6.2.4) (2022-08-24)


### Bug Fixes

* **alert:** add default aria-label ([#25800](https://github.com/ionic-team/ionic-framework/issues/25800)) ([d395a73](https://github.com/ionic-team/ionic-framework/commit/d395a73cb6c419e6c0072746b8e4768cd5f78ef3))
* **alert:** use aria-labelledby and aria-describedby instead of aria-label ([#25805](https://github.com/ionic-team/ionic-framework/issues/25805)) ([27318d7](https://github.com/ionic-team/ionic-framework/commit/27318d75df60dfce1a90f23ba31ea2b6636ba42f))
* **breadcrumb:** separator is not announced by narrators ([#25796](https://github.com/ionic-team/ionic-framework/issues/25796)) ([71fad38](https://github.com/ionic-team/ionic-framework/commit/71fad3884bc55b266067efb346500c848b856946))
* **datetime:** close month/year picker when hidden ([#25789](https://github.com/ionic-team/ionic-framework/issues/25789)) ([3b211b6](https://github.com/ionic-team/ionic-framework/commit/3b211b60fd9a88be6e232f839ecc4be090181530)), closes [#25787](https://github.com/ionic-team/ionic-framework/issues/25787)
* **modal:** role attribute can be customized ([#25804](https://github.com/ionic-team/ionic-framework/issues/25804)) ([037d579](https://github.com/ionic-team/ionic-framework/commit/037d579b2a3a660358f1e9c9b020c9510bb9c6b0))
* **react:** duplicate page transitions do not happen on react 18 ([#25798](https://github.com/ionic-team/ionic-framework/issues/25798)) ([a39d776](https://github.com/ionic-team/ionic-framework/commit/a39d776f087514b7fa744f44ce8ce2a04ed8aa43)), closes [#25797](https://github.com/ionic-team/ionic-framework/issues/25797)
* **refresher:** use componentOnReady utility for CE build ([#25783](https://github.com/ionic-team/ionic-framework/issues/25783)) ([bd715a5](https://github.com/ionic-team/ionic-framework/commit/bd715a52562f1f175d4bb6ea2dbfdd67a3e91db1)), closes [#25782](https://github.com/ionic-team/ionic-framework/issues/25782)
* **select:** compareWith passes params in correct order ([#25764](https://github.com/ionic-team/ionic-framework/issues/25764)) ([d631195](https://github.com/ionic-team/ionic-framework/commit/d6311951243fd9b867ae5d4a7a08c8d341f8eb7a)), closes [#25759](https://github.com/ionic-team/ionic-framework/issues/25759)
* **vue:** lifecycles now fire on tabs pages ([#25786](https://github.com/ionic-team/ionic-framework/issues/25786)) ([3020005](https://github.com/ionic-team/ionic-framework/commit/30200051bbab6ce57fd363668dafc49287c87c56)), closes [#25784](https://github.com/ionic-team/ionic-framework/issues/25784)





## [6.2.3](https://github.com/ionic-team/ionic-framework/compare/v6.2.2...v6.2.3) (2022-08-17)


### Bug Fixes

* **css:** preserve whitespace in selectors when minifying css ([#25767](https://github.com/ionic-team/ionic-framework/issues/25767)) ([bafa759](https://github.com/ionic-team/ionic-framework/commit/bafa759655a0f3ca206255ba429f21d319c37aed)), closes [#25766](https://github.com/ionic-team/ionic-framework/issues/25766)
* **datetime:** highlights now show above content in modal ([#25756](https://github.com/ionic-team/ionic-framework/issues/25756)) ([d711658](https://github.com/ionic-team/ionic-framework/commit/d7116581c8e92716f49877abc78d93dc39c34e1d)), closes [#25755](https://github.com/ionic-team/ionic-framework/issues/25755)
* **footer:** remove toolbar bottom padding if near bottom slot tabs or keyboard is open ([#25746](https://github.com/ionic-team/ionic-framework/issues/25746)) ([bb37446](https://github.com/ionic-team/ionic-framework/commit/bb374460320b0ba2ee03a5a0ecebb3e7a9f0728e))
* **header:** hide from screen readers when collapsed ([#25744](https://github.com/ionic-team/ionic-framework/issues/25744)) ([d0ba963](https://github.com/ionic-team/ionic-framework/commit/d0ba9635998f2157970156438c1bb74d6b9682f2))
* **input:** exclude date inputs from scroll assist ([#25749](https://github.com/ionic-team/ionic-framework/issues/25749)) ([abb56d2](https://github.com/ionic-team/ionic-framework/commit/abb56d22b4a81d1bc34c689de4ef7218e7503b20)), closes [#25745](https://github.com/ionic-team/ionic-framework/issues/25745)
* **item:** form validation caret color renders correctly ([#25725](https://github.com/ionic-team/ionic-framework/issues/25725)) ([de20541](https://github.com/ionic-team/ionic-framework/commit/de20541486bcf6e1d15f0ae5b0c5f177cce5eb38)), closes [#25719](https://github.com/ionic-team/ionic-framework/issues/25719)
* **refresher:** refresher is visible with multiple custom scroll targets ([#25750](https://github.com/ionic-team/ionic-framework/issues/25750)) ([e750e33](https://github.com/ionic-team/ionic-framework/commit/e750e336167397ed996d9833763286f4881e79b5)), closes [#25495](https://github.com/ionic-team/ionic-framework/issues/25495)





## [6.2.2](https://github.com/ionic-team/ionic-framework/compare/v6.2.1...v6.2.2) (2022-08-10)


### Bug Fixes

* **angular:** DatetimeButton is declared on IonicModule ([#25727](https://github.com/ionic-team/ionic-framework/issues/25727)) ([76ad1d1](https://github.com/ionic-team/ionic-framework/commit/76ad1d18c81272435db1994977aa9dd5d880504a))
* **datetime:** add correct null check when value changes ([#25716](https://github.com/ionic-team/ionic-framework/issues/25716)) ([36bea1c](https://github.com/ionic-team/ionic-framework/commit/36bea1ca2520c9eb9ee7705abb046607a52d198d)), closes [#25714](https://github.com/ionic-team/ionic-framework/issues/25714)
* **datetime:** preferWheel respects column ordering by locale ([#25726](https://github.com/ionic-team/ionic-framework/issues/25726)) ([dee0f51](https://github.com/ionic-team/ionic-framework/commit/dee0f513ee443c0c69ea8e38a292c900e9c70221)), closes [#25722](https://github.com/ionic-team/ionic-framework/issues/25722)
* **react:** outlet will not clear in react 18 with hot reload ([#25703](https://github.com/ionic-team/ionic-framework/issues/25703)) ([3878bf7](https://github.com/ionic-team/ionic-framework/commit/3878bf76523f2e1c26c147473fd7c07ee4d0e820)), closes [#25507](https://github.com/ionic-team/ionic-framework/issues/25507)
* **vue:** go back to correct view with memory history ([#25732](https://github.com/ionic-team/ionic-framework/issues/25732)) ([8327889](https://github.com/ionic-team/ionic-framework/commit/832788971a7098e52812f66563cbc0a63d3e5df7)), closes [#25705](https://github.com/ionic-team/ionic-framework/issues/25705)





## [6.2.1](https://github.com/ionic-team/ionic-framework/compare/v6.2.0...v6.2.1) (2022-08-03)


### Bug Fixes

* **datetime:** display time in user's timezone after selection ([#25694](https://github.com/ionic-team/ionic-framework/issues/25694)) ([11c69c8](https://github.com/ionic-team/ionic-framework/commit/11c69c8df50b75440c9e876b4d99d469d16e144f)), closes [#25693](https://github.com/ionic-team/ionic-framework/issues/25693)
* **datetime:** selecting today with multiple date select now works ([#25699](https://github.com/ionic-team/ionic-framework/issues/25699)) ([86b7000](https://github.com/ionic-team/ionic-framework/commit/86b7000bcd1b4519e8c20907050e15ba7c99bab0))
* **nav:** exclude nav from custom dialog ([#25689](https://github.com/ionic-team/ionic-framework/issues/25689)) ([d1e517b](https://github.com/ionic-team/ionic-framework/commit/d1e517bfef03b822dfa7651681013277762eda08)), closes [#25677](https://github.com/ionic-team/ionic-framework/issues/25677) [#25688](https://github.com/ionic-team/ionic-framework/issues/25688)
* **react:** IonNav apply properties to page components  ([#25603](https://github.com/ionic-team/ionic-framework/issues/25603)) ([61e4ffe](https://github.com/ionic-team/ionic-framework/commit/61e4ffe47f73034808b65ee37342f540ee5a6a97)), closes [#25602](https://github.com/ionic-team/ionic-framework/issues/25602)





# [6.2.0](https://github.com/ionic-team/ionic-framework/compare/v6.1.15...v6.2.0) (2022-07-27)


### Bug Fixes

* **datetime:** account for previous years with preferWheel ([#25656](https://github.com/ionic-team/ionic-framework/issues/25656)) ([3a7f5f1](https://github.com/ionic-team/ionic-framework/commit/3a7f5f166ee8d8d7e1861313e2bc6f4856e4fbe9))
* **datetime:** switching months in wheel picker now selected nearest neighbor ([#25559](https://github.com/ionic-team/ionic-framework/issues/25559)) ([dd256e1](https://github.com/ionic-team/ionic-framework/commit/dd256e1313fa1c307f30b0dbb7fd0d1da8c555f7))
* **datetime:** switching presentation closes month/year picker ([#25667](https://github.com/ionic-team/ionic-framework/issues/25667)) ([57a21ad](https://github.com/ionic-team/ionic-framework/commit/57a21adb38331ee5d74dacd1b0a2568f41a2d21e))
* **nav:** pop() will unmount views within a modal ([#25638](https://github.com/ionic-team/ionic-framework/issues/25638)) ([db28794](https://github.com/ionic-team/ionic-framework/commit/db28794f0b75f2824ae26c101a8c52af70f43ffd)), closes [#25637](https://github.com/ionic-team/ionic-framework/issues/25637) [#21831](https://github.com/ionic-team/ionic-framework/issues/21831)
* **picker-column-internal:** tabbing between columns works ([#25464](https://github.com/ionic-team/ionic-framework/issues/25464)) ([db02772](https://github.com/ionic-team/ionic-framework/commit/db027721ac299e7d23c42b52b0274be06b909f89))
* **textarea:** textarea with autogrow will size to its contents ([#24205](https://github.com/ionic-team/ionic-framework/issues/24205)) ([a9cf2ab](https://github.com/ionic-team/ionic-framework/commit/a9cf2ab87012cdb6360d10536a29213adda3f585)), closes [#24793](https://github.com/ionic-team/ionic-framework/issues/24793) [#21242](https://github.com/ionic-team/ionic-framework/issues/21242)
* **vue:** input v-model accepts numbers ([#25666](https://github.com/ionic-team/ionic-framework/issues/25666)) ([ab65e9a](https://github.com/ionic-team/ionic-framework/commit/ab65e9a7b51c3a3f8c59962d3e1faff1564ab801)), closes [#25575](https://github.com/ionic-team/ionic-framework/issues/25575)


### Features

* **angular, react, vue:** add support for autoMountComponent ([#25552](https://github.com/ionic-team/ionic-framework/issues/25552)) ([805dfa0](https://github.com/ionic-team/ionic-framework/commit/805dfa05663098ef9c02b0745a383b5e7555908b))
* **datetime-button:** add button for displaying datetime in overlays ([#25655](https://github.com/ionic-team/ionic-framework/issues/25655)) ([4997331](https://github.com/ionic-team/ionic-framework/commit/499733105e4be23405e8afeeb26fee5cd2afc25b)), closes [#24316](https://github.com/ionic-team/ionic-framework/issues/24316)
* **datetime:** add multiple date selection ([#25514](https://github.com/ionic-team/ionic-framework/issues/25514)) ([9d31608](https://github.com/ionic-team/ionic-framework/commit/9d31608f2d471f531eb253832c8558d1effaf68a))
* **datetime:** add wheel style picker for dates and times ([#25468](https://github.com/ionic-team/ionic-framework/issues/25468)) ([3d19771](https://github.com/ionic-team/ionic-framework/commit/3d19771185301870a2eb60f1ef4afd6f1c182494))
* **datetime:** localize am/pm labels in time picker ([#25389](https://github.com/ionic-team/ionic-framework/issues/25389)) ([6bc0acc](https://github.com/ionic-team/ionic-framework/commit/6bc0acc4279a18c3309b11eeec76676c5015419a)), closes [#16279](https://github.com/ionic-team/ionic-framework/issues/16279)
* **modal:** clicking handle advances to the next breakpoint ([#25540](https://github.com/ionic-team/ionic-framework/issues/25540)) ([7cdc388](https://github.com/ionic-team/ionic-framework/commit/7cdc388b7805cbf23c9e1e928aa977cd77ebc8c4)), closes [#24069](https://github.com/ionic-team/ionic-framework/issues/24069)
* **picker-column-internal:** add ability to disable items ([#25412](https://github.com/ionic-team/ionic-framework/issues/25412)) ([8b7c079](https://github.com/ionic-team/ionic-framework/commit/8b7c07968e1a60389a22e5af0e0cac62d31d397a))
* **range:** add reference point for start position of range slider ([#25598](https://github.com/ionic-team/ionic-framework/issues/25598)) ([c2781cc](https://github.com/ionic-team/ionic-framework/commit/c2781cc1c3b7e56a0e6f6c03cfa04fc2c82d6e8a)), closes [#24348](https://github.com/ionic-team/ionic-framework/issues/24348)
* **toggle:** on/off icons for toggle ([#25459](https://github.com/ionic-team/ionic-framework/issues/25459)) ([bc0bdc4](https://github.com/ionic-team/ionic-framework/commit/bc0bdc438ba72c695f9d961ddf837ec45e7816dd)), closes [#20524](https://github.com/ionic-team/ionic-framework/issues/20524)





## [6.1.15](https://github.com/ionic-team/ionic-framework/compare/v6.1.14...v6.1.15) (2022-07-20)


### Bug Fixes

* **datetime:** use scroll listener to detect month changes ([#25586](https://github.com/ionic-team/ionic-framework/issues/25586)) ([b7afcb0](https://github.com/ionic-team/ionic-framework/commit/b7afcb0f0c36d84f3b4d65844df28e6293bc1ea5)), closes [#25257](https://github.com/ionic-team/ionic-framework/issues/25257) [#25608](https://github.com/ionic-team/ionic-framework/issues/25608) [#24980](https://github.com/ionic-team/ionic-framework/issues/24980)
* **fab-button:** aria attributes are inherited ([#25635](https://github.com/ionic-team/ionic-framework/issues/25635)) ([64ae3d2](https://github.com/ionic-team/ionic-framework/commit/64ae3d2b9729c5c6be8644b1df6c8b3d40584d3b)), closes [#25633](https://github.com/ionic-team/ionic-framework/issues/25633)
* **modal:** allow for custom dialog implementations ([#25630](https://github.com/ionic-team/ionic-framework/issues/25630)) ([a6f3ae6](https://github.com/ionic-team/ionic-framework/commit/a6f3ae67ab91ab95408ad425156167edc3570978)), closes [#24080](https://github.com/ionic-team/ionic-framework/issues/24080)
* **react:** swipe to go back gesture works on ios ([#25563](https://github.com/ionic-team/ionic-framework/issues/25563)) ([7ec3683](https://github.com/ionic-team/ionic-framework/commit/7ec3683e94e5397022560ce8489532ff40d3f40c)), closes [#22342](https://github.com/ionic-team/ionic-framework/issues/22342)


### Performance Improvements

* **input:** passive event listener for touch start events ([#25610](https://github.com/ionic-team/ionic-framework/issues/25610)) ([2d1efdb](https://github.com/ionic-team/ionic-framework/commit/2d1efdbe6dd9436badab4684f2a484476489c166)), closes [#25599](https://github.com/ionic-team/ionic-framework/issues/25599)





## [6.1.14](https://github.com/ionic-team/ionic-framework/compare/v6.1.13...v6.1.14) (2022-07-13)


### Bug Fixes

* **datetime:** datetime works within stencil apps ([#25592](https://github.com/ionic-team/ionic-framework/issues/25592)) ([7b10fa6](https://github.com/ionic-team/ionic-framework/commit/7b10fa6476c2c2896c6810c57b3160f8c8896faa)), closes [#25591](https://github.com/ionic-team/ionic-framework/issues/25591)
* **react:** IonNav works with react ([#25565](https://github.com/ionic-team/ionic-framework/issues/25565)) ([420f9bb](https://github.com/ionic-team/ionic-framework/commit/420f9bbebd41f3eab6def795bcdd1933d5c5a47a)), closes [#24002](https://github.com/ionic-team/ionic-framework/issues/24002)





## [6.1.13](https://github.com/ionic-team/ionic-framework/compare/v6.1.12...v6.1.13) (2022-07-06)


### Bug Fixes

* **all:** long press now preserves activated state ([#25551](https://github.com/ionic-team/ionic-framework/issues/25551)) ([a8286f6](https://github.com/ionic-team/ionic-framework/commit/a8286f6e42f734a027416ac6cd659e3dce4edccb)), closes [#25544](https://github.com/ionic-team/ionic-framework/issues/25544)
* **datetime:** typing in time now updates value ([#25561](https://github.com/ionic-team/ionic-framework/issues/25561)) ([1b1b1a3](https://github.com/ionic-team/ionic-framework/commit/1b1b1a3800c4d044b4a3e7418f534e9271770ec6)), closes [#25560](https://github.com/ionic-team/ionic-framework/issues/25560)





## [6.1.12](https://github.com/ionic-team/ionic-framework/compare/v6.1.11...v6.1.12) (2022-06-29)


### Bug Fixes

* **angular:** warn devs that standalone components are not supported ([#25516](https://github.com/ionic-team/ionic-framework/issues/25516)) ([c53785c](https://github.com/ionic-team/ionic-framework/commit/c53785c0c786113f3516c09fa512687ecb84c717))
* **datetime:** add dev warnings when setting out of bounds value ([#25513](https://github.com/ionic-team/ionic-framework/issues/25513)) ([5dfaf63](https://github.com/ionic-team/ionic-framework/commit/5dfaf63c6582811b61339a6fa50cf551cd8724d0))





## [6.1.11](https://github.com/ionic-team/ionic-framework/compare/v6.1.10...v6.1.11) (2022-06-22)


### Bug Fixes

* **datetime:** closing time picker no longer changes month ([#25478](https://github.com/ionic-team/ionic-framework/issues/25478)) ([f9ab9b5](https://github.com/ionic-team/ionic-framework/commit/f9ab9b54ddb5a3004673e4aaa9cb62fd8e97ba07)), closes [#25438](https://github.com/ionic-team/ionic-framework/issues/25438)
* **item:** multiple input appearance when using datetime ([#25498](https://github.com/ionic-team/ionic-framework/issues/25498)) ([1a8d23d](https://github.com/ionic-team/ionic-framework/commit/1a8d23da8125d54c3119eacb51206f7541c9f410)), closes [#25484](https://github.com/ionic-team/ionic-framework/issues/25484) [#25483](https://github.com/ionic-team/ionic-framework/issues/25483)
* **overlays:** focus is not moved if active element is in overlay ([#25481](https://github.com/ionic-team/ionic-framework/issues/25481)) ([dcc2da2](https://github.com/ionic-team/ionic-framework/commit/dcc2da2800e69d938b4a62db436d9f07d9663dce)), closes [#24127](https://github.com/ionic-team/ionic-framework/issues/24127) [#24820](https://github.com/ionic-team/ionic-framework/issues/24820)
* **refresher:** quickly swiping down no longer causes duplicate refresh ([#25476](https://github.com/ionic-team/ionic-framework/issues/25476)) ([3abfa78](https://github.com/ionic-team/ionic-framework/commit/3abfa780ccb32484b4d9f1b509e7ab910dfb901a)), closes [#25418](https://github.com/ionic-team/ionic-framework/issues/25418)
* **vue:** adding class to IonPage no longer hides component ([#25490](https://github.com/ionic-team/ionic-framework/issues/25490)) ([cbaa971](https://github.com/ionic-team/ionic-framework/commit/cbaa9711f094975569e2fcb28060f8e456804073))
* **vue:** components have correct type definitions ([#25499](https://github.com/ionic-team/ionic-framework/issues/25499)) ([b1821e9](https://github.com/ionic-team/ionic-framework/commit/b1821e9d0a55f20f74696f119de724ab70647977)), closes [#25485](https://github.com/ionic-team/ionic-framework/issues/25485)





## [6.1.10](https://github.com/ionic-team/ionic-framework/compare/v6.1.9...v6.1.10) (2022-06-15)


### Bug Fixes

* **angular:** router compatibility with Angular 12/13 ([#25456](https://github.com/ionic-team/ionic-framework/issues/25456)) ([7b105a3](https://github.com/ionic-team/ionic-framework/commit/7b105a3471e5bc588ba63f820b707e131c878b6f)), closes [#25448](https://github.com/ionic-team/ionic-framework/issues/25448)
* **fab-button:** improve ripple effect behavior on click ([#25413](https://github.com/ionic-team/ionic-framework/issues/25413)) ([efdaf90](https://github.com/ionic-team/ionic-framework/commit/efdaf90c5a767211e0034bab7cce5bd463ff5aa0)), closes [#21772](https://github.com/ionic-team/ionic-framework/issues/21772)
* **modal:** backdrop animation when backdropBreakpoint is 1 ([#25430](https://github.com/ionic-team/ionic-framework/issues/25430)) ([c10df52](https://github.com/ionic-team/ionic-framework/commit/c10df52f39c527dd7e03176c56a2e6cb0ebe455f)), closes [#25402](https://github.com/ionic-team/ionic-framework/issues/25402)
* **modal:** status bar color now correct with sheet modal ([#25424](https://github.com/ionic-team/ionic-framework/issues/25424)) ([377c4f5](https://github.com/ionic-team/ionic-framework/commit/377c4f597b972818d90132017d50c33074ddadab)), closes [#20501](https://github.com/ionic-team/ionic-framework/issues/20501)
* **picker-column-internal:** switching off an input mode column preserves scroll ([#25467](https://github.com/ionic-team/ionic-framework/issues/25467)) ([989429d](https://github.com/ionic-team/ionic-framework/commit/989429d65cf57ef8fb69854639f8eac1a12369bc))
* **popover:** ensure popover does not go offscreen when adjusting top position ([#25350](https://github.com/ionic-team/ionic-framework/issues/25350)) ([6926538](https://github.com/ionic-team/ionic-framework/commit/692653842b43b5e36c51163f8261fde3b5bea40d)), closes [#25349](https://github.com/ionic-team/ionic-framework/issues/25349)





## [6.1.9](https://github.com/ionic-team/ionic-framework/compare/v6.1.8...v6.1.9) (2022-06-08)


### Bug Fixes

* **all:** ripple effect is no longer added when scrolling ([#25352](https://github.com/ionic-team/ionic-framework/issues/25352)) ([0b275af](https://github.com/ionic-team/ionic-framework/commit/0b275af5ac06f470b4d908b889f513956bf5d868)), closes [#22030](https://github.com/ionic-team/ionic-framework/issues/22030)
* **angular:** add support for Angular 14 ([#25403](https://github.com/ionic-team/ionic-framework/issues/25403)) ([122cdcc](https://github.com/ionic-team/ionic-framework/commit/122cdcc8253e46d9537105b11045fd7d9ccd8917)), closes [#25353](https://github.com/ionic-team/ionic-framework/issues/25353)
* **datetime:** emit ionChange for non-calendar picker presentation ([#25380](https://github.com/ionic-team/ionic-framework/issues/25380)) ([4e6a60b](https://github.com/ionic-team/ionic-framework/commit/4e6a60b6a42287e5091728aecb61f6097e131b83)), closes [#25375](https://github.com/ionic-team/ionic-framework/issues/25375)
* **datetime:** ensure that default month shown is always in bounds ([#25351](https://github.com/ionic-team/ionic-framework/issues/25351)) ([866d452](https://github.com/ionic-team/ionic-framework/commit/866d4528ad1b8ffa65258595d553ea934daa4add)), closes [#25320](https://github.com/ionic-team/ionic-framework/issues/25320)
* **label:** text contents will repaint on change ([#25395](https://github.com/ionic-team/ionic-framework/issues/25395)) ([52ec741](https://github.com/ionic-team/ionic-framework/commit/52ec74193b4e2478cb84a6dfea261cb2113dcbff))





## [6.1.8](https://github.com/ionic-team/ionic-framework/compare/v6.1.7...v6.1.8) (2022-06-01)


### Bug Fixes

* **all:** improve compatibility with vite ([#25381](https://github.com/ionic-team/ionic-framework/issues/25381)) ([d83bcd2](https://github.com/ionic-team/ionic-framework/commit/d83bcd2b7f9937550008f995ff91517777584373)), closes [#23823](https://github.com/ionic-team/ionic-framework/issues/23823)
* **item-sliding:** swiping inside of virtual scroller now prevents scrolling ([#25345](https://github.com/ionic-team/ionic-framework/issues/25345)) ([5a1a5f6](https://github.com/ionic-team/ionic-framework/commit/5a1a5f6b4c2ab4059158986e907fff45d03be753))
* **range:** dragging knob no longer scrolls page ([#25343](https://github.com/ionic-team/ionic-framework/issues/25343)) ([0b92dff](https://github.com/ionic-team/ionic-framework/commit/0b92dffa92c05705ff83518c10608e3dc3651d51)), closes [#19004](https://github.com/ionic-team/ionic-framework/issues/19004)
* **react:** present controller overlays in React 18 ([#25361](https://github.com/ionic-team/ionic-framework/issues/25361)) ([01c40ea](https://github.com/ionic-team/ionic-framework/commit/01c40eae5509f1c150d79269a7a75c05112fa343)), closes [#25247](https://github.com/ionic-team/ionic-framework/issues/25247)





## [6.1.7](https://github.com/ionic-team/ionic-framework/compare/v6.1.6...v6.1.7) (2022-05-26)


### Bug Fixes

* **accordion:** accordions expand when using binding ([#25322](https://github.com/ionic-team/ionic-framework/issues/25322)) ([61e571e](https://github.com/ionic-team/ionic-framework/commit/61e571e585ed8ad9b0ca2f98f57bb16616413ba6)), closes [#25307](https://github.com/ionic-team/ionic-framework/issues/25307)
* **datetime:** don't update value on confirm call if no date was selected ([#25338](https://github.com/ionic-team/ionic-framework/issues/25338)) ([9e5b10a](https://github.com/ionic-team/ionic-framework/commit/9e5b10a2155c6b9de565931da384e0e49aeca7b7))
* **item, list:** list aria roles are added ([#25336](https://github.com/ionic-team/ionic-framework/issues/25336)) ([311c634](https://github.com/ionic-team/ionic-framework/commit/311c634d20e9e597db676d6f54e4b79cfe742a61)), closes [#19939](https://github.com/ionic-team/ionic-framework/issues/19939)
* **menu:** rtl menu no longer disappears on ios 15 ([#25309](https://github.com/ionic-team/ionic-framework/issues/25309)) ([6005431](https://github.com/ionic-team/ionic-framework/commit/60054310afbab6151f6c29ff6e74666acd181a41)), closes [#25192](https://github.com/ionic-team/ionic-framework/issues/25192)
* **modal:** swipe to close on content blocks scroll in ion-nav ([#25300](https://github.com/ionic-team/ionic-framework/issues/25300)) ([fdc55c0](https://github.com/ionic-team/ionic-framework/commit/fdc55c072765c87ad7c783e6d8a238b007f5f3ff)), closes [#25298](https://github.com/ionic-team/ionic-framework/issues/25298)
* **nav:** swipe to go back works inside card modal ([#25333](https://github.com/ionic-team/ionic-framework/issues/25333)) ([0156be6](https://github.com/ionic-team/ionic-framework/commit/0156be61cbf73b25cb3c2cba1bd20adebbb3db4f)), closes [#25327](https://github.com/ionic-team/ionic-framework/issues/25327)
* **range:** interfaces are now correctly exported ([#25342](https://github.com/ionic-team/ionic-framework/issues/25342)) ([15f0c06](https://github.com/ionic-team/ionic-framework/commit/15f0c0669f7598386edf487f408462b90ed91a08)), closes [#25341](https://github.com/ionic-team/ionic-framework/issues/25341)
* **react:** add param types to useIonPopover dismiss function ([#25311](https://github.com/ionic-team/ionic-framework/issues/25311)) ([7111370](https://github.com/ionic-team/ionic-framework/commit/7111370dd787fdec78a1e3368679bc4c73570b98))
* **react:** IonTabButton will call custom onClick handlers ([#25313](https://github.com/ionic-team/ionic-framework/issues/25313)) ([6034418](https://github.com/ionic-team/ionic-framework/commit/6034418b33c32fdd682c470eaf61b9fcbe86c4bb)), closes [#22511](https://github.com/ionic-team/ionic-framework/issues/22511)
* **refresher:** attach scroll listener to custom scroll target ([#25335](https://github.com/ionic-team/ionic-framework/issues/25335)) ([8f5e4cd](https://github.com/ionic-team/ionic-framework/commit/8f5e4cd9350b10a98afb7c98353c6719eee918bb)), closes [#25318](https://github.com/ionic-team/ionic-framework/issues/25318)
* **types:** improve intellisense with colors ([#25347](https://github.com/ionic-team/ionic-framework/issues/25347)) ([97cfbbb](https://github.com/ionic-team/ionic-framework/commit/97cfbbb65d3e63c32d720e01c7368c68616bb531))
* **vue:** correct views are now unmounted in tabs ([#25270](https://github.com/ionic-team/ionic-framework/issues/25270)) ([5e23fb1](https://github.com/ionic-team/ionic-framework/commit/5e23fb1ce4e5b6e53828bde59268170f604167ba)), closes [#25255](https://github.com/ionic-team/ionic-framework/issues/25255)





## [6.1.6](https://github.com/ionic-team/ionic-framework/compare/v6.1.5...v6.1.6) (2022-05-18)


### Bug Fixes

* **loading:** spinner now respects —spinner-color ([#25261](https://github.com/ionic-team/ionic-framework/issues/25261)) ([65f4c74](https://github.com/ionic-team/ionic-framework/commit/65f4c742e7a5e5756f6f72dd853e38e885f90385)), closes [#25180](https://github.com/ionic-team/ionic-framework/issues/25180)
* **modal:** reset breakpoint to initial breakpoint on present ([#25246](https://github.com/ionic-team/ionic-framework/issues/25246)) ([2557bf3](https://github.com/ionic-team/ionic-framework/commit/2557bf3c3eed9e33e89e07a8d73489da8d81bee3)), closes [#25245](https://github.com/ionic-team/ionic-framework/issues/25245)
* **scroll-assist:** touch end events continue to bubble on inputs ([#25282](https://github.com/ionic-team/ionic-framework/issues/25282)) ([780f16d](https://github.com/ionic-team/ionic-framework/commit/780f16d9e04ee5aaaf91bb7c6ef15c72cc8aeb45)), closes [#25229](https://github.com/ionic-team/ionic-framework/issues/25229)





## [6.1.5](https://github.com/ionic-team/ionic-framework/compare/v6.1.4...v6.1.5) (2022-05-11)


### Bug Fixes

* **core:** @axe-core/playwright should be a devDependency ([#25244](https://github.com/ionic-team/ionic-framework/issues/25244)) ([617ec48](https://github.com/ionic-team/ionic-framework/commit/617ec48265157d1502c443395472c21ebdb2989e)), closes [#25242](https://github.com/ionic-team/ionic-framework/issues/25242)
* **item:** counter has appropriate contrast ([#25266](https://github.com/ionic-team/ionic-framework/issues/25266)) ([750be33](https://github.com/ionic-team/ionic-framework/commit/750be33772e9ba71a3cda35709d17b7912aa68e2)), closes [#25262](https://github.com/ionic-team/ionic-framework/issues/25262)
* **modal:** add canDismiss input binding for angular ([#25240](https://github.com/ionic-team/ionic-framework/issues/25240)) ([bdf0383](https://github.com/ionic-team/ionic-framework/commit/bdf0383b0c9ec4595129a2633760fd4f4788df90)), closes [#25239](https://github.com/ionic-team/ionic-framework/issues/25239)
* **spinner:** alignment is now correct in rtl ([#25260](https://github.com/ionic-team/ionic-framework/issues/25260)) ([e3c996d](https://github.com/ionic-team/ionic-framework/commit/e3c996dea878a8dd276a0ca99f59b330125f9b75))





## [6.1.4](https://github.com/ionic-team/ionic-framework/compare/v6.1.3...v6.1.4) (2022-05-04)


### Bug Fixes

* **datetime:** arrow navigation respects min/max values ([#25182](https://github.com/ionic-team/ionic-framework/issues/25182)) ([6946e09](https://github.com/ionic-team/ionic-framework/commit/6946e09815da605e37ff8e4d613a14288ea35fb0)), closes [#25073](https://github.com/ionic-team/ionic-framework/issues/25073)
* **datetime:** hide footer when month-year picker is open ([#25205](https://github.com/ionic-team/ionic-framework/issues/25205)) ([aa5e1b9](https://github.com/ionic-team/ionic-framework/commit/aa5e1b962150b9ed9629812ec566873784526c83))
* **modal:** card modal can now be swiped to close on the content ([#25185](https://github.com/ionic-team/ionic-framework/issues/25185)) ([7633ddb](https://github.com/ionic-team/ionic-framework/commit/7633ddbc845745dfe36b5c8025c54c22c083c2f4)), closes [#22046](https://github.com/ionic-team/ionic-framework/issues/22046)
* **modal:** card modal no longer dismisses from content with refresher ([#25227](https://github.com/ionic-team/ionic-framework/issues/25227)) ([c4f811f](https://github.com/ionic-team/ionic-framework/commit/c4f811f1dde0dcbcdaebaa3a4f5ef87e192b5cc5))
* **react:** useIonModal/useIonPopover dismiss accepts data and role ([#25209](https://github.com/ionic-team/ionic-framework/issues/25209)) ([68b2f8b](https://github.com/ionic-team/ionic-framework/commit/68b2f8bfe10946580b996e48c4ec1e2df94b8d49)), closes [#25208](https://github.com/ionic-team/ionic-framework/issues/25208)
* **vue:** switching between tabs and going back resolves to correct route ([#25206](https://github.com/ionic-team/ionic-framework/issues/25206)) ([b4ba70e](https://github.com/ionic-team/ionic-framework/commit/b4ba70ea148d4f8fc7475d3de798b485238470c8)), closes [#24303](https://github.com/ionic-team/ionic-framework/issues/24303)





## [6.1.3](https://github.com/ionic-team/ionic-framework/compare/v6.1.2...v6.1.3) (2022-04-27)


### Bug Fixes

* **core:** inherit aria attributes on host elements ([#25156](https://github.com/ionic-team/ionic-framework/issues/25156)) ([611832b](https://github.com/ionic-team/ionic-framework/commit/611832b0d51da295c1bf2897972c4e8baf6e23a3)), closes [#20127](https://github.com/ionic-team/ionic-framework/issues/20127)
* **datetime:** if no default value, don't highlight active day until one is selected ([#25151](https://github.com/ionic-team/ionic-framework/issues/25151)) ([9896939](https://github.com/ionic-team/ionic-framework/commit/98969395abd400cc44d2d3825581a63eb64a56e0))
* **picker-column-internal:** center active item when rapidly opened ([#25155](https://github.com/ionic-team/ionic-framework/issues/25155)) ([8e17fa9](https://github.com/ionic-team/ionic-framework/commit/8e17fa9d5f9b00139693e34bc93b1f9c718ea3cf)), closes [#25154](https://github.com/ionic-team/ionic-framework/issues/25154)
* **select:** avoid duplicate dialogs and backdrops when clicking ([#25175](https://github.com/ionic-team/ionic-framework/issues/25175)) ([70d2784](https://github.com/ionic-team/ionic-framework/commit/70d278414eb5124d17c5ffaba5231c6bfd285656)), closes [#25126](https://github.com/ionic-team/ionic-framework/issues/25126)
* **vue:** canDismiss definition is now exposed ([#25195](https://github.com/ionic-team/ionic-framework/issues/25195)) ([e5e0e24](https://github.com/ionic-team/ionic-framework/commit/e5e0e24f76c15c1a49f759b1a140e337f5393edd))
* **vue:** replacing routes across nested outlets preserves previous route info ([#25171](https://github.com/ionic-team/ionic-framework/issues/25171)) ([7b71607](https://github.com/ionic-team/ionic-framework/commit/7b716076b66fbb5bd4620ea8ba74318bbbc1b7e8)), closes [#25017](https://github.com/ionic-team/ionic-framework/issues/25017)





## [6.1.2](https://github.com/ionic-team/ionic-framework/compare/v6.1.1...v6.1.2) (2022-04-20)


### Bug Fixes

* **datetime:** time picker display matches dynamically set value ([#25010](https://github.com/ionic-team/ionic-framework/issues/25010)) ([11493a0](https://github.com/ionic-team/ionic-framework/commit/11493a086a4e3f2a4e9d3acdf5a9d49e810a5ef0)), closes [#24967](https://github.com/ionic-team/ionic-framework/issues/24967)
* **modal:** add canDismiss option to modal options ([#25144](https://github.com/ionic-team/ionic-framework/issues/25144)) ([2984ddf](https://github.com/ionic-team/ionic-framework/commit/2984ddf111b6acbd9e47ed90830b6522179b6cee)), closes [#25143](https://github.com/ionic-team/ionic-framework/issues/25143)





## [6.1.1](https://github.com/ionic-team/ionic-framework/compare/v6.1.0...v6.1.1) (2022-04-15)


### Bug Fixes

* **all:** import path is now correct when using ionic in a stencil app ([#25123](https://github.com/ionic-team/ionic-framework/issues/25123)) ([1b407ab](https://github.com/ionic-team/ionic-framework/commit/1b407abdf5d8a2a18b6a2b9daca2d58b7b0f782b)), closes [#25122](https://github.com/ionic-team/ionic-framework/issues/25122)
* **datetime:** account for 30 and 45 minute timezones when getting current date ([#25120](https://github.com/ionic-team/ionic-framework/issues/25120)) ([96b2003](https://github.com/ionic-team/ionic-framework/commit/96b2003b2bd5089d1faafe262e96c7445c5c3349)), closes [#25112](https://github.com/ionic-team/ionic-framework/issues/25112)
* **modal, popover:** do not dismiss when ionDismiss is emitted from select ([#25125](https://github.com/ionic-team/ionic-framework/issues/25125)) ([90115db](https://github.com/ionic-team/ionic-framework/commit/90115db98540a5fc67b611ac2742d1221b8e96ff)), closes [#25124](https://github.com/ionic-team/ionic-framework/issues/25124)





# [6.1.0 Vanadium](https://github.com/ionic-team/ionic-framework/compare/v6.0.16...v6.1.0) (2022-04-13)


### Bug Fixes

* **accordion-group:** only allow keyboard interaction if header is focused ([#25091](https://github.com/ionic-team/ionic-framework/issues/25091)) ([e1b555f](https://github.com/ionic-team/ionic-framework/commit/e1b555f286956574876924068304fc44a78c027c))
* **datetime:** resolve warnings when importing into Stencil app ([#25106](https://github.com/ionic-team/ionic-framework/issues/25106)) ([a61c004](https://github.com/ionic-team/ionic-framework/commit/a61c004fb0c10d9fb0eca0987edf798386251ec2))
* **menu:** preserve scroll position when focusing on open ([#25044](https://github.com/ionic-team/ionic-framework/issues/25044)) ([da89684](https://github.com/ionic-team/ionic-framework/commit/da896848776105ba1f7035c4412495786199bade))
* **popover:** only focus trap ion-item children ([#24990](https://github.com/ionic-team/ionic-framework/issues/24990)) ([0cd06a6](https://github.com/ionic-team/ionic-framework/commit/0cd06a675474e1893b4c0801fab8ab79813537c8)), closes [#24633](https://github.com/ionic-team/ionic-framework/issues/24633)
* **ripple-effect:** ripple displays on click or touch ([#25102](https://github.com/ionic-team/ionic-framework/issues/25102)) ([2a313e9](https://github.com/ionic-team/ionic-framework/commit/2a313e91179e19660a758470ed2218bbcf03e0bb)), closes [#25094](https://github.com/ionic-team/ionic-framework/issues/25094)
* **vue:** ensure that only tab pages get added to the tab navigation stack ([#25045](https://github.com/ionic-team/ionic-framework/issues/25045)) ([a0054a7](https://github.com/ionic-team/ionic-framework/commit/a0054a7cbd52def24c18fd2dadfd2e49a42b8980)), closes [#24859](https://github.com/ionic-team/ionic-framework/issues/24859)


### Features

* **content, reorder-group, header, footer, infinite-scroll, refresher:** add custom scroll target to improve compatibility with virtual scroll ([#24883](https://github.com/ionic-team/ionic-framework/issues/24883)) ([2a438da](https://github.com/ionic-team/ionic-framework/commit/2a438da010ddd4d4211e1879e27d7b28409daaa2)), closes [#23437](https://github.com/ionic-team/ionic-framework/issues/23437)
* **datetime:** isDateEnabled to enable/disable specific days  ([#24898](https://github.com/ionic-team/ionic-framework/issues/24898)) ([e932a04](https://github.com/ionic-team/ionic-framework/commit/e932a042237e6f44bf278bcbd895d8569fc17348)), closes [#24209](https://github.com/ionic-team/ionic-framework/issues/24209)
* **item:** counter formatter to customize counter text display ([#24336](https://github.com/ionic-team/ionic-framework/issues/24336)) ([171020e](https://github.com/ionic-team/ionic-framework/commit/171020e9d200ccfdef0f01c427b295bb50dd1fef)), closes [#24327](https://github.com/ionic-team/ionic-framework/issues/24327)
* **modal:** ability to programmatically set current sheet breakpoint ([#24648](https://github.com/ionic-team/ionic-framework/issues/24648)) ([3145c76](https://github.com/ionic-team/ionic-framework/commit/3145c76934ac711038f9dcba98a385dfbe754953)), closes [#23917](https://github.com/ionic-team/ionic-framework/issues/23917)
* **modal:** add canDismiss property to manage modal dismissing ([#24928](https://github.com/ionic-team/ionic-framework/issues/24928)) ([4b21958](https://github.com/ionic-team/ionic-framework/commit/4b21958ec57019afcde786598880e1f8edada2b1)), closes [#22297](https://github.com/ionic-team/ionic-framework/issues/22297)
* **range:** add knobMoveStart and knobMoveEnd events ([#25011](https://github.com/ionic-team/ionic-framework/issues/25011)) ([f5cb1f8](https://github.com/ionic-team/ionic-framework/commit/f5cb1f8444ba050042e788f9f9ec7b6309bf1b60))
* **select:** add event for when overlay is dismissed ([#24400](https://github.com/ionic-team/ionic-framework/issues/24400)) ([b835b7c](https://github.com/ionic-team/ionic-framework/commit/b835b7c0c7840f41c54f96743cc0a779ff474ab6))





## [6.0.16](https://github.com/ionic-team/ionic-framework/compare/v6.0.15...v6.0.16) (2022-04-08)


### Bug Fixes

* **angular:** button components now route correctly without reload ([#25071](https://github.com/ionic-team/ionic-framework/issues/25071)) ([fb994fa](https://github.com/ionic-team/ionic-framework/commit/fb994fa9a7721a3575fb8d123be34aea4bf076a4))





## [6.0.15](https://github.com/ionic-team/ionic-framework/compare/v6.0.14...v6.0.15) (2022-04-06)


### Bug Fixes

* **angular:** item styling when control has value ([#24932](https://github.com/ionic-team/ionic-framework/issues/24932)) ([eea25d0](https://github.com/ionic-team/ionic-framework/commit/eea25d091d7eb319d6ec1de8b793881d3a10949b)), closes [#23809](https://github.com/ionic-team/ionic-framework/issues/23809)
* **angular:** routerLink allows opening in a new tab for link elements ([#25014](https://github.com/ionic-team/ionic-framework/issues/25014)) ([b010f07](https://github.com/ionic-team/ionic-framework/commit/b010f077fe51992dd9dd8ced69769a8eb91ac055)), closes [#24413](https://github.com/ionic-team/ionic-framework/issues/24413)
* **datetime:** warn when parsing an invalid date value ([#25049](https://github.com/ionic-team/ionic-framework/issues/25049)) ([982dc85](https://github.com/ionic-team/ionic-framework/commit/982dc853befe8ccf54163a0b145e563da06f5dc1))
* **picker-column:** column renders correctly with selected value ([#24988](https://github.com/ionic-team/ionic-framework/issues/24988)) ([8318659](https://github.com/ionic-team/ionic-framework/commit/83186598ed6cf08b0f0421076c4afb3ab53e1e57)), closes [#17664](https://github.com/ionic-team/ionic-framework/issues/17664)
* **popover:** allow arrow on desktop ([#25056](https://github.com/ionic-team/ionic-framework/issues/25056)) ([bcd00c7](https://github.com/ionic-team/ionic-framework/commit/bcd00c7a6ebb6a00193f04458976ff8b86395215))





## [6.0.14](https://github.com/ionic-team/ionic-framework/compare/v6.0.13...v6.0.14) (2022-03-30)


### Bug Fixes

* **react:** treeshake ionic/core bundle ([#24989](https://github.com/ionic-team/ionic-framework/issues/24989)) ([a296ca8](https://github.com/ionic-team/ionic-framework/commit/a296ca875c18ec01bfc57972571e95a6d79f5678)), closes [#24497](https://github.com/ionic-team/ionic-framework/issues/24497)





## [6.0.13](https://github.com/ionic-team/ionic-framework/compare/v6.0.12...v6.0.13) (2022-03-23)


### Bug Fixes

* **angular:** ngOnDestroy runs inside angular zone ([#24949](https://github.com/ionic-team/ionic-framework/issues/24949)) ([a8fd2d9](https://github.com/ionic-team/ionic-framework/commit/a8fd2d9199ca92d62bce6abf8caccc7709fa5ca1)), closes [#22571](https://github.com/ionic-team/ionic-framework/issues/22571)
* **datetime:** presentation time emits ionChange once  ([#24968](https://github.com/ionic-team/ionic-framework/issues/24968)) ([2909b08](https://github.com/ionic-team/ionic-framework/commit/2909b080b7020299a4554c1459b4b190ff739085)), closes [#24967](https://github.com/ionic-team/ionic-framework/issues/24967)
* **popover:** dismissing nested popover via backdrop now works ([#24957](https://github.com/ionic-team/ionic-framework/issues/24957)) ([9e84ef7](https://github.com/ionic-team/ionic-framework/commit/9e84ef7f91d76ca5a1ecaffc7592287267d5368b)), closes [#24954](https://github.com/ionic-team/ionic-framework/issues/24954)





## [6.0.12](https://github.com/ionic-team/ionic-framework/compare/v6.0.11...v6.0.12) (2022-03-16)


### Bug Fixes

* **datetime:** reinit behavior on presentation change ([#24828](https://github.com/ionic-team/ionic-framework/issues/24828)) ([d46e1e8](https://github.com/ionic-team/ionic-framework/commit/d46e1e8506ca5095817b421e9edb37d41451e885))
* **tabs:** angular, fire willChange event before selected tab changes ([#24910](https://github.com/ionic-team/ionic-framework/issues/24910)) ([d5efa11](https://github.com/ionic-team/ionic-framework/commit/d5efa113317eaf874712134dc9b8e4502aa4760f))
* **toast:** screen readers now announce toasts when presented ([#24937](https://github.com/ionic-team/ionic-framework/issues/24937)) ([8a97f6b](https://github.com/ionic-team/ionic-framework/commit/8a97f6b5c9ca1e77c1790abd1e924955b6b6ea27)), closes [#22333](https://github.com/ionic-team/ionic-framework/issues/22333)
* **vue:** tapping the active tab button now correctly resets the tab stack ([#24935](https://github.com/ionic-team/ionic-framework/issues/24935)) ([4534c8b](https://github.com/ionic-team/ionic-framework/commit/4534c8bc0b2bca7ab6eecd9886243116e9a039b7)), closes [#24934](https://github.com/ionic-team/ionic-framework/issues/24934)





## [6.0.11](https://github.com/ionic-team/ionic-framework/compare/v6.0.10...v6.0.11) (2022-03-09)


### Bug Fixes

* **datetime:** time picker now scrolls to correct value ([#24879](https://github.com/ionic-team/ionic-framework/issues/24879)) ([331ce6d](https://github.com/ionic-team/ionic-framework/commit/331ce6d6769900e2aec9e30d35b52cfd40cbb889)), closes [#24878](https://github.com/ionic-team/ionic-framework/issues/24878)
* **ios:** swipe to go back now works in rtl mode ([#24866](https://github.com/ionic-team/ionic-framework/issues/24866)) ([2ac9105](https://github.com/ionic-team/ionic-framework/commit/2ac9105796a0765fabc48592b5b44ac58c568579)), closes [#19488](https://github.com/ionic-team/ionic-framework/issues/19488)


### Performance Improvements

* improve treeshaking functionality ([#24895](https://github.com/ionic-team/ionic-framework/issues/24895)) ([805907a](https://github.com/ionic-team/ionic-framework/commit/805907af4e78179f1acc9cb02263b1ea10d4e3df)), closes [#24280](https://github.com/ionic-team/ionic-framework/issues/24280)





## [6.0.10](https://github.com/ionic-team/ionic-framework/compare/v6.0.9...v6.0.10) (2022-03-02)


### Bug Fixes

* **datetime:** confirm method now uses selected date ([#24827](https://github.com/ionic-team/ionic-framework/issues/24827)) ([c35b898](https://github.com/ionic-team/ionic-framework/commit/c35b898f1dc0fb706446b6971982df48fd72fe6d)), closes [#24823](https://github.com/ionic-team/ionic-framework/issues/24823)
* **datetime:** persist minutes column on hour change ([#24829](https://github.com/ionic-team/ionic-framework/issues/24829)) ([aacb58a](https://github.com/ionic-team/ionic-framework/commit/aacb58a3224e3cc51c731d0c9aa52f52c9276692)), closes [#24821](https://github.com/ionic-team/ionic-framework/issues/24821)
* **item-sliding:** close() will maintain disabled state ([#24847](https://github.com/ionic-team/ionic-framework/issues/24847)) ([ea4a9bb](https://github.com/ionic-team/ionic-framework/commit/ea4a9bb69465f8e97746b36638f0b3a26e45da18)), closes [#24747](https://github.com/ionic-team/ionic-framework/issues/24747)
* **modal:** .ion-page element is now correctly added ([#24811](https://github.com/ionic-team/ionic-framework/issues/24811)) ([3d0f999](https://github.com/ionic-team/ionic-framework/commit/3d0f99904fe192fcb5f529780858a0f25f076af7)), closes [#24809](https://github.com/ionic-team/ionic-framework/issues/24809)
* **modal:** re-enable swipe gestures when modal is dismissed ([#24846](https://github.com/ionic-team/ionic-framework/issues/24846)) ([836c01c](https://github.com/ionic-team/ionic-framework/commit/836c01c73e42caab0101ac4988f0a9b27cf96a5b)), closes [#24817](https://github.com/ionic-team/ionic-framework/issues/24817)
* **modal:** sheet modal now allows input focusing when backdrop disabled ([#24840](https://github.com/ionic-team/ionic-framework/issues/24840)) ([e4ec572](https://github.com/ionic-team/ionic-framework/commit/e4ec572043e22bd2626dbcfd204fc22a7335282c)), closes [#24581](https://github.com/ionic-team/ionic-framework/issues/24581)





## [6.0.9](https://github.com/ionic-team/ionic-framework/compare/v6.0.8...v6.0.9) (2022-02-23)


### Bug Fixes

* **datetime:** improve datetime sizing in modals ([#24762](https://github.com/ionic-team/ionic-framework/issues/24762)) ([b0ac7de](https://github.com/ionic-team/ionic-framework/commit/b0ac7de168c353ba4899cb74a2b38e25fd0cc0f1)), closes [#23992](https://github.com/ionic-team/ionic-framework/issues/23992)
* **datetime:** month and year column order is now locale aware ([#24802](https://github.com/ionic-team/ionic-framework/issues/24802)) ([16647b2](https://github.com/ionic-team/ionic-framework/commit/16647b2c7290389755a4093145788f281c84b7e2)), closes [#24548](https://github.com/ionic-team/ionic-framework/issues/24548)
* **datetime:** month picker no longer gives duplicate months on ios 14 and older ([#24792](https://github.com/ionic-team/ionic-framework/issues/24792)) ([b6d7e1c](https://github.com/ionic-team/ionic-framework/commit/b6d7e1c75740a61dcd02c21692e4d4632fb8df5c)), closes [#24663](https://github.com/ionic-team/ionic-framework/issues/24663)
* **img:** draggable attribute is now inherited to inner img element ([#24781](https://github.com/ionic-team/ionic-framework/issues/24781)) ([19ac238](https://github.com/ionic-team/ionic-framework/commit/19ac2389eb0843173f51a12de41ac808cd8f0569)), closes [#21325](https://github.com/ionic-team/ionic-framework/issues/21325)
* **modal:** backdropBreakpoint allows interactivity behind sheet ([#24798](https://github.com/ionic-team/ionic-framework/issues/24798)) ([fca3f56](https://github.com/ionic-team/ionic-framework/commit/fca3f56ca4568e63fd493debda088263caa86c64)), closes [#24797](https://github.com/ionic-team/ionic-framework/issues/24797)
* **popover:** default alignment to 'center' for ios mode ([#24815](https://github.com/ionic-team/ionic-framework/issues/24815)) ([243f673](https://github.com/ionic-team/ionic-framework/commit/243f67362f25699bdb373be6b72cb9c14dc95a32))
* **react, vue:** scroll is no longer interrupted on ios ([#24791](https://github.com/ionic-team/ionic-framework/issues/24791)) ([99c91ef](https://github.com/ionic-team/ionic-framework/commit/99c91eff8764c9a1630adedab6a9765dd9754f7d)), closes [#24435](https://github.com/ionic-team/ionic-framework/issues/24435)
* **select:** interface components now show correctly ([#24810](https://github.com/ionic-team/ionic-framework/issues/24810)) ([2fc2de5](https://github.com/ionic-team/ionic-framework/commit/2fc2de51771f4a5c3f20c6071284096e5bf31ec8)), closes [#24807](https://github.com/ionic-team/ionic-framework/issues/24807)
* **toast:** toast is now correctly excluded from focus trapping ([#24816](https://github.com/ionic-team/ionic-framework/issues/24816)) ([8246112](https://github.com/ionic-team/ionic-framework/commit/8246112ca12f90edb98629ab82e27a792a1fafad)), closes [#24733](https://github.com/ionic-team/ionic-framework/issues/24733)





## [6.0.8](https://github.com/ionic-team/ionic-framework/compare/v6.0.7...v6.0.8) (2022-02-15)


### Bug Fixes

* **back-button, breadcrumb, item:** flip chevron icons on RTL ([#24705](https://github.com/ionic-team/ionic-framework/issues/24705)) ([a093544](https://github.com/ionic-team/ionic-framework/commit/a093544fdfc438ed03024285b2a35c5f645ea011))
* **datetime:** navigate to month within min range ([#24759](https://github.com/ionic-team/ionic-framework/issues/24759)) ([7b3838c](https://github.com/ionic-team/ionic-framework/commit/7b3838cc670de7845bb5937d204e86cdba93b6e6)), closes [#24757](https://github.com/ionic-team/ionic-framework/issues/24757)
* **input:** only set native input value if different ([#24758](https://github.com/ionic-team/ionic-framework/issues/24758)) ([fd031aa](https://github.com/ionic-team/ionic-framework/commit/fd031aa1c3f05b7bfa3e0a0ee2a4793e29e22df5)), closes [#24753](https://github.com/ionic-team/ionic-framework/issues/24753)
* **router-outlet:** getRouteId() returns the params set in setRouteId(). ([#24656](https://github.com/ionic-team/ionic-framework/issues/24656)) ([be2205e](https://github.com/ionic-team/ionic-framework/commit/be2205e5a2b2f8778bd1f7b4ea5cae0bf96f9ef3)), closes [#24652](https://github.com/ionic-team/ionic-framework/issues/24652)
* **router-outlet:** navigating to same route with different params now activates component ([#24760](https://github.com/ionic-team/ionic-framework/issues/24760)) ([abc36ae](https://github.com/ionic-team/ionic-framework/commit/abc36ae80b060a659f7557ad90efe98b78f5ead9)), closes [#24653](https://github.com/ionic-team/ionic-framework/issues/24653)
* **vue:** preserve custom classes on IonPage ([#24776](https://github.com/ionic-team/ionic-framework/issues/24776)) ([b401de1](https://github.com/ionic-team/ionic-framework/commit/b401de1ab3385c67cc476ff90971ce131cefcc3f)), closes [#24772](https://github.com/ionic-team/ionic-framework/issues/24772)





## [6.0.7](https://github.com/ionic-team/ionic-framework/compare/v6.0.6...v6.0.7) (2022-02-09)


### Bug Fixes

* **angular:** inline modals now add .ion-page class correctly ([#24751](https://github.com/ionic-team/ionic-framework/issues/24751)) ([ef46eaf](https://github.com/ionic-team/ionic-framework/commit/ef46eafc9476a85ea3369e542f528d01d3cca0a8)), closes [#24750](https://github.com/ionic-team/ionic-framework/issues/24750)





## [6.0.6](https://github.com/ionic-team/ionic-framework/compare/v6.0.5...v6.0.6) (2022-02-09)


### Bug Fixes

* **action-sheet:** background includes safe area margin ([#24700](https://github.com/ionic-team/ionic-framework/issues/24700)) ([8c22646](https://github.com/ionic-team/ionic-framework/commit/8c22646d66e2077fc88aaacf350330097733bb9b)), closes [#24699](https://github.com/ionic-team/ionic-framework/issues/24699)
* **angular-server:** publish only the dist directory to avoid import errors ([#24701](https://github.com/ionic-team/ionic-framework/issues/24701)) ([2a27bef](https://github.com/ionic-team/ionic-framework/commit/2a27befe463832b9ca7709ba22421abbdaa4cfa4)), closes [#24605](https://github.com/ionic-team/ionic-framework/issues/24605)
* **angular, react,  vue:** overlays no longer throw errors when used inside tests ([#24681](https://github.com/ionic-team/ionic-framework/issues/24681)) ([897ae4a](https://github.com/ionic-team/ionic-framework/commit/897ae4a4546ac0dd811125d5513ef23d133a1589)), closes [#24549](https://github.com/ionic-team/ionic-framework/issues/24549) [#24590](https://github.com/ionic-team/ionic-framework/issues/24590)
* **datetime:** disable intersection observer during month update ([#24713](https://github.com/ionic-team/ionic-framework/issues/24713)) ([aab4d30](https://github.com/ionic-team/ionic-framework/commit/aab4d306f80851bfd8a02a6361e26d60faeaadb4)), closes [#24712](https://github.com/ionic-team/ionic-framework/issues/24712)
* **datetime:** minutes only filtered when max hour matches current hour ([#24710](https://github.com/ionic-team/ionic-framework/issues/24710)) ([231d6df](https://github.com/ionic-team/ionic-framework/commit/231d6df622c1f5dd9ecdff6fed8f61a4bff332df)), closes [#24702](https://github.com/ionic-team/ionic-framework/issues/24702)
* **input:** cursor position does not jump to end ([#24736](https://github.com/ionic-team/ionic-framework/issues/24736)) ([4ff9524](https://github.com/ionic-team/ionic-framework/commit/4ff9524e1057aa487069b5982c5f1ecdf51d982b)), closes [#24727](https://github.com/ionic-team/ionic-framework/issues/24727)
* **input:** IME composition mode ([#24735](https://github.com/ionic-team/ionic-framework/issues/24735)) ([c6381ce](https://github.com/ionic-team/ionic-framework/commit/c6381ce4f90707774d1c8662bba874f7b306bd1c)), closes [#24669](https://github.com/ionic-team/ionic-framework/issues/24669)
* **modal, popover:** quickly opening modal/popover no longer presents duplicates ([#24697](https://github.com/ionic-team/ionic-framework/issues/24697)) ([928c5fb](https://github.com/ionic-team/ionic-framework/commit/928c5fbfcbf3ef1b2c3074464fc20dcf1fe143ae))
* **modal:** inline modals inherit ion-page styling ([#24723](https://github.com/ionic-team/ionic-framework/issues/24723)) ([596aad4](https://github.com/ionic-team/ionic-framework/commit/596aad435b5102307da89dd626ca4682b78db452)), closes [#24706](https://github.com/ionic-team/ionic-framework/issues/24706)
* **popover:** use alignment with popover options ([#24711](https://github.com/ionic-team/ionic-framework/issues/24711)) ([f5c5c3c](https://github.com/ionic-team/ionic-framework/commit/f5c5c3cffa4f34046b0e9471a9f193db3772180e)), closes [#24709](https://github.com/ionic-team/ionic-framework/issues/24709)
* **router:** router push with relative path ([#24719](https://github.com/ionic-team/ionic-framework/issues/24719)) ([d40c0c3](https://github.com/ionic-team/ionic-framework/commit/d40c0c3a0993eaefbe5107e98958c6b0699a62c2)), closes [#24718](https://github.com/ionic-team/ionic-framework/issues/24718)
* **select:** value is selected when given array ([#24687](https://github.com/ionic-team/ionic-framework/issues/24687)) ([6ee7d15](https://github.com/ionic-team/ionic-framework/commit/6ee7d159ecfff3382fadb524c5c430172d40c267)), closes [#24742](https://github.com/ionic-team/ionic-framework/issues/24742)
* **vue:** replacing routes now updates location state correctly ([#24721](https://github.com/ionic-team/ionic-framework/issues/24721)) ([721a461](https://github.com/ionic-team/ionic-framework/commit/721a461073bbd8e7218cd5ce02965d673f5a03e8)), closes [#24432](https://github.com/ionic-team/ionic-framework/issues/24432)
* **vue:** routing history is correctly replaced when overwriting browser history ([#24670](https://github.com/ionic-team/ionic-framework/issues/24670)) ([0b18260](https://github.com/ionic-team/ionic-framework/commit/0b18260da64334d8211c5a0cd806f7416274fc5e)), closes [#23873](https://github.com/ionic-team/ionic-framework/issues/23873)





## [6.0.5](https://github.com/ionic-team/ionic-framework/compare/v6.0.4...v6.0.5) (2022-02-02)


### Bug Fixes

* **datetime:** prevent navigating to disabled months ([#24421](https://github.com/ionic-team/ionic-framework/issues/24421)) ([b40fc46](https://github.com/ionic-team/ionic-framework/commit/b40fc4632efcdc01f1062d9bcec826afff5cf4ea)), closes [#24208](https://github.com/ionic-team/ionic-framework/issues/24208) [#24482](https://github.com/ionic-team/ionic-framework/issues/24482)
* **input:** min/max compatibility with react-hook-form ([#24657](https://github.com/ionic-team/ionic-framework/issues/24657)) ([1f91883](https://github.com/ionic-team/ionic-framework/commit/1f918835f437a59f7a70fc59d9305647aa9c298d)), closes [#24489](https://github.com/ionic-team/ionic-framework/issues/24489)
* **react-router:** remove page transition flicker on outlet mounting ([#24667](https://github.com/ionic-team/ionic-framework/issues/24667)) ([bdb5c42](https://github.com/ionic-team/ionic-framework/commit/bdb5c421d2d1f72c123c254e50c6d31b3c1a8f42)), closes [#24666](https://github.com/ionic-team/ionic-framework/issues/24666)
* **react:** nested router outlets will not reanimate entered views ([#24672](https://github.com/ionic-team/ionic-framework/issues/24672)) ([43aa6c1](https://github.com/ionic-team/ionic-framework/commit/43aa6c11f42fd5cf455c50419d5f5fbb327b2901)), closes [#24107](https://github.com/ionic-team/ionic-framework/issues/24107)
* **vue:** going back to a tabs outlet no loger causes classList error ([#24665](https://github.com/ionic-team/ionic-framework/issues/24665)) ([6d7b144](https://github.com/ionic-team/ionic-framework/commit/6d7b1444b63cca03158789fcd41b33a527f6abac)), closes [#24654](https://github.com/ionic-team/ionic-framework/issues/24654)


### Performance Improvements

* **various:** don't use lazy-loaded icon names in components ([#24671](https://github.com/ionic-team/ionic-framework/issues/24671)) ([484de50](https://github.com/ionic-team/ionic-framework/commit/484de5074de212dffb4bf4f73bade7acec103fe8))





## [6.0.4](https://github.com/ionic-team/ionic-framework/compare/v6.0.3...v6.0.4) (2022-01-26)


### Bug Fixes

* **accordion:** items inside of the content now correct display borders ([#24618](https://github.com/ionic-team/ionic-framework/issues/24618)) ([d3311df](https://github.com/ionic-team/ionic-framework/commit/d3311df96765948d0a395e4ba99fb9117b44adcb)), closes [#24613](https://github.com/ionic-team/ionic-framework/issues/24613)
* **angular:** routerLink with null value works with Angular 13 ([#24622](https://github.com/ionic-team/ionic-framework/issues/24622)) ([90a9a9c](https://github.com/ionic-team/ionic-framework/commit/90a9a9c3e813c8db0a9d6b3b25c152929bea80fe)), closes [#24586](https://github.com/ionic-team/ionic-framework/issues/24586)
* **col:** col no longer errors when running in non-browser environment ([#24603](https://github.com/ionic-team/ionic-framework/issues/24603)) ([af0135c](https://github.com/ionic-team/ionic-framework/commit/af0135ce7dbe737b2df46094fd3dc8a41bdb60ae)), closes [#24446](https://github.com/ionic-team/ionic-framework/issues/24446)
* **datetime:** datetime locale with h23 will respect max time range ([#24610](https://github.com/ionic-team/ionic-framework/issues/24610)) ([5925e76](https://github.com/ionic-team/ionic-framework/commit/5925e7608ef04f8877e4dd8a80b2c8bdc1cfd4bd)), closes [#24588](https://github.com/ionic-team/ionic-framework/issues/24588)
* **datetime:** timepicker popover will position relative to click target ([#24616](https://github.com/ionic-team/ionic-framework/issues/24616)) ([378c632](https://github.com/ionic-team/ionic-framework/commit/378c63264366964e6ea11e1a2ff8791a40f182d4)), closes [#24531](https://github.com/ionic-team/ionic-framework/issues/24531) [#24415](https://github.com/ionic-team/ionic-framework/issues/24415)
* **input:** ion-input accepts any string value ([#24606](https://github.com/ionic-team/ionic-framework/issues/24606)) ([43c5977](https://github.com/ionic-team/ionic-framework/commit/43c5977d48cb12331c1d3107eb73f29b92c5e049)), closes [#19884](https://github.com/ionic-team/ionic-framework/issues/19884)
* **item:** label text aligns with input text ([#24620](https://github.com/ionic-team/ionic-framework/issues/24620)) ([94d033c](https://github.com/ionic-team/ionic-framework/commit/94d033c4216ae9978aed6346c1c0ea2aec4d375b)), closes [#24404](https://github.com/ionic-team/ionic-framework/issues/24404)
* **item:** match material design character counter ([#24335](https://github.com/ionic-team/ionic-framework/issues/24335)) ([54db1a1](https://github.com/ionic-team/ionic-framework/commit/54db1a1e7c71c78e843370848fc768582768333e)), closes [#24334](https://github.com/ionic-team/ionic-framework/issues/24334)
* **menu:** focus trapping with menu and overlays no longer results in errors ([#24611](https://github.com/ionic-team/ionic-framework/issues/24611)) ([632dafc](https://github.com/ionic-team/ionic-framework/commit/632dafcd57de5086deebdc7d586b01710aa1a3ce)), closes [#24361](https://github.com/ionic-team/ionic-framework/issues/24361) [#24481](https://github.com/ionic-team/ionic-framework/issues/24481)
* **modal:** native keyboard will dismiss when bottom sheet is dragged ([#24642](https://github.com/ionic-team/ionic-framework/issues/24642)) ([525f01f](https://github.com/ionic-team/ionic-framework/commit/525f01f086ebf95ab62af0162b876a25f50a3d4b)), closes [#23878](https://github.com/ionic-team/ionic-framework/issues/23878)
* **range:** setting dir on ion-range to enable rtl mode now supported ([#24597](https://github.com/ionic-team/ionic-framework/issues/24597)) ([5dba4e5](https://github.com/ionic-team/ionic-framework/commit/5dba4e5ce0a07f69a08f2b427e8010b311910f88)), closes [#20201](https://github.com/ionic-team/ionic-framework/issues/20201)
* **react:** setupIonicReact no longer crashes in SSR environment ([#24604](https://github.com/ionic-team/ionic-framework/issues/24604)) ([360643d](https://github.com/ionic-team/ionic-framework/commit/360643d96a03b345c83b88c9ff06e9aa254dee81))
* **searchbar:** setting dir on ion-searchbar to enable rtl mode now supported ([#24602](https://github.com/ionic-team/ionic-framework/issues/24602)) ([35e5235](https://github.com/ionic-team/ionic-framework/commit/35e523564561c0f3323efa761c4654016b97ef69))
* **segment:** setting dir on ion-segment to enable rtl mode now supported ([#24601](https://github.com/ionic-team/ionic-framework/issues/24601)) ([2940e73](https://github.com/ionic-team/ionic-framework/commit/2940e73a4504247eecb0de6c433104f529530850)), closes [#23978](https://github.com/ionic-team/ionic-framework/issues/23978)
* **spinner:** ensure transform doesn't overwrite circular animation ([#24643](https://github.com/ionic-team/ionic-framework/issues/24643)) ([88ce010](https://github.com/ionic-team/ionic-framework/commit/88ce010418eaca38786b51720c696860b417ab6d))
* **toast:** allow input focus while toast is visible ([#24572](https://github.com/ionic-team/ionic-framework/issues/24572)) ([29f1140](https://github.com/ionic-team/ionic-framework/commit/29f1140384ae7e1402b09c3760e168cf79833619)), closes [#24571](https://github.com/ionic-team/ionic-framework/issues/24571)
* **toggle:** setting dir on ion-toggle to enable rtl mode now supported ([#24600](https://github.com/ionic-team/ionic-framework/issues/24600)) ([353dbc0](https://github.com/ionic-team/ionic-framework/commit/353dbc0537ef3b46b9ba13a365ebc5da269de4c7))





## [6.0.3](https://github.com/ionic-team/ionic-framework/compare/v6.0.2...v6.0.3) (2022-01-19)


### Bug Fixes

* **angular-server:** use correct @ionic/angular dependency version ([#24593](https://github.com/ionic-team/ionic-framework/issues/24593)) ([be022f7](https://github.com/ionic-team/ionic-framework/commit/be022f7de8df85ae842b0e111722b03448d60387)), closes [#24592](https://github.com/ionic-team/ionic-framework/issues/24592)
* **angular:** apply touch, dirty and pristine form control classes ([#24558](https://github.com/ionic-team/ionic-framework/issues/24558)) ([273ae2c](https://github.com/ionic-team/ionic-framework/commit/273ae2cc087b2a5a30fb50a1b0eaeb0a221900fc)), closes [#24483](https://github.com/ionic-team/ionic-framework/issues/24483)
* **datetime:** showing calendar grid no longer causes month to switch on ios 15 ([#24554](https://github.com/ionic-team/ionic-framework/issues/24554)) ([3d20959](https://github.com/ionic-team/ionic-framework/commit/3d2095922147ea3763e977412977edd9586fec5d)), closes [#24405](https://github.com/ionic-team/ionic-framework/issues/24405)
* **item:** error slot visible in Safari ([#24579](https://github.com/ionic-team/ionic-framework/issues/24579)) ([af01a8b](https://github.com/ionic-team/ionic-framework/commit/af01a8b3073dce784cc042923d712b9492638d32)), closes [#24575](https://github.com/ionic-team/ionic-framework/issues/24575)
* **menu:** remove main attribute that was supposed to removed in v5 ([#24565](https://github.com/ionic-team/ionic-framework/issues/24565)) ([7704ac3](https://github.com/ionic-team/ionic-framework/commit/7704ac3a3710396248590daecb945b76825a0539)), closes [#24563](https://github.com/ionic-team/ionic-framework/issues/24563)
* **modal:** life cycle events for controller modals ([#24508](https://github.com/ionic-team/ionic-framework/issues/24508)) ([9a15753](https://github.com/ionic-team/ionic-framework/commit/9a15753fd95e32155abdeb490ec57cb72385ad1a)), closes [#24460](https://github.com/ionic-team/ionic-framework/issues/24460)
* **overlays:** getTop now returns the top-most presented overlay ([#24547](https://github.com/ionic-team/ionic-framework/issues/24547)) ([f5b4382](https://github.com/ionic-team/ionic-framework/commit/f5b4382fd5728365e4badf39bc1dd0c149b45c2c)), closes [#19111](https://github.com/ionic-team/ionic-framework/issues/19111)
* **react:** add useRef wrapper to useIonOverlay state to avoid stale references ([#24553](https://github.com/ionic-team/ionic-framework/issues/24553)) ([bce849c](https://github.com/ionic-team/ionic-framework/commit/bce849c5f324522002eff7f8a5e5023150e9201c))
* **react:** prevent errors when dismissing inline popover after containing element is removed ([#24569](https://github.com/ionic-team/ionic-framework/issues/24569)) ([c8a392a](https://github.com/ionic-team/ionic-framework/commit/c8a392aef5fbf25f59a573897d970c41abac04d2))





## [6.0.2](https://github.com/ionic-team/ionic-framework/compare/v6.0.1...v6.0.2) (2022-01-11)


### Bug Fixes

* **angular:** attach change detector ref for inline overlays ([#24521](https://github.com/ionic-team/ionic-framework/issues/24521)) ([5c54593](https://github.com/ionic-team/ionic-framework/commit/5c54593dde64ae61347568405ebf74502cfff370)), closes [#24502](https://github.com/ionic-team/ionic-framework/issues/24502)
* **angular:** popover will respect side attribute value ([#24470](https://github.com/ionic-team/ionic-framework/issues/24470)) ([e6955a2](https://github.com/ionic-team/ionic-framework/commit/e6955a26b92fc536c5c73b60b5943881c7d58ee1)), closes [#24466](https://github.com/ionic-team/ionic-framework/issues/24466)
* **breadcrumb:** support routerLink on breadcrumb ([#24509](https://github.com/ionic-team/ionic-framework/issues/24509)) ([5bb1414](https://github.com/ionic-team/ionic-framework/commit/5bb1414f7fa04ea07954cb3f68883ee2f162586a)), closes [#24493](https://github.com/ionic-team/ionic-framework/issues/24493)
* **css:** inline css source in source maps ([#24514](https://github.com/ionic-team/ionic-framework/issues/24514)) ([987d46c](https://github.com/ionic-team/ionic-framework/commit/987d46cfa6e48a932330f04f2e8eb7054b11baf8)), closes [#24441](https://github.com/ionic-team/ionic-framework/issues/24441)
* **datetime:** add top padding to MD calendar month grid ([#24522](https://github.com/ionic-team/ionic-framework/issues/24522)) ([bd82b5d](https://github.com/ionic-team/ionic-framework/commit/bd82b5dc1d06ba22a5410858802d57735fdcf450)), closes [#24408](https://github.com/ionic-team/ionic-framework/issues/24408)
* **datetime:** RTL will no longer infinitely scroll ([#24475](https://github.com/ionic-team/ionic-framework/issues/24475)) ([8f00008](https://github.com/ionic-team/ionic-framework/commit/8f000089c2986f292147c7f501f23c8c7d1df457)), closes [#24472](https://github.com/ionic-team/ionic-framework/issues/24472)
* **datetime:** time picker format with hourCycle h23 ([#24476](https://github.com/ionic-team/ionic-framework/issues/24476)) ([a3724e6](https://github.com/ionic-team/ionic-framework/commit/a3724e6a5662c5bc1b724d80540530472827506e)), closes [#24474](https://github.com/ionic-team/ionic-framework/issues/24474)
* **datetime:** update active day styling when day is selected ([#24454](https://github.com/ionic-team/ionic-framework/issues/24454)) ([4304391](https://github.com/ionic-team/ionic-framework/commit/430439191dba824c11290d7f8622fea10ced6c40)), closes [#24414](https://github.com/ionic-team/ionic-framework/issues/24414) [#24451](https://github.com/ionic-team/ionic-framework/issues/24451)
* **datetime:** wheel picker shows correct column order in rtl ([#24546](https://github.com/ionic-team/ionic-framework/issues/24546)) ([c90ce31](https://github.com/ionic-team/ionic-framework/commit/c90ce311a86ccb7c06b1cde91a4659f6682df04d)), closes [#24378](https://github.com/ionic-team/ionic-framework/issues/24378)
* **overlays:** define custom element children ([#24439](https://github.com/ionic-team/ionic-framework/issues/24439)) ([4715b83](https://github.com/ionic-team/ionic-framework/commit/4715b83abb30ec5930710d16e5bfe8fc88a940ce)), closes [#24393](https://github.com/ionic-team/ionic-framework/issues/24393)
* **popover:** allow arrow configuration with controller approach ([#24512](https://github.com/ionic-team/ionic-framework/issues/24512)) ([b39003a](https://github.com/ionic-team/ionic-framework/commit/b39003a4c67cd7e01d09be012c9e12d99ca1730a)), closes [#24487](https://github.com/ionic-team/ionic-framework/issues/24487)
* **radio:** fix radio not showing checked state when not in a group ([#24423](https://github.com/ionic-team/ionic-framework/issues/24423)) ([94a781c](https://github.com/ionic-team/ionic-framework/commit/94a781cb6a3d92c5e6cab1a7603bfe25826a753c))
* **react,vue:** backdrop for inline modal/popover overlay ([#24453](https://github.com/ionic-team/ionic-framework/issues/24453)) ([77f8412](https://github.com/ionic-team/ionic-framework/commit/77f8412b746222793cd9d17f12f50d512ab5e886)), closes [#24449](https://github.com/ionic-team/ionic-framework/issues/24449)
* **react:** building app for production now works correctly with vite ([#24515](https://github.com/ionic-team/ionic-framework/issues/24515)) ([32fad3d](https://github.com/ionic-team/ionic-framework/commit/32fad3d02cb6b012a772de03eafe3e3a6b1300e0)), closes [#24229](https://github.com/ionic-team/ionic-framework/issues/24229)
* **react:** scrolling to bottom of modal contents ([#24510](https://github.com/ionic-team/ionic-framework/issues/24510)) ([1462cef](https://github.com/ionic-team/ionic-framework/commit/1462cef69225e20582e2f9a0b8fd655ca2066b79)), closes [#24478](https://github.com/ionic-team/ionic-framework/issues/24478)
* **refresher:** import icons to avoid errors in react and vue ([#24525](https://github.com/ionic-team/ionic-framework/issues/24525)) ([388622f](https://github.com/ionic-team/ionic-framework/commit/388622f9734b7b832bca3ede99820a7124faa618)), closes [#24480](https://github.com/ionic-team/ionic-framework/issues/24480)
* **vue:** correct route is replaced when using router.replace ([#24533](https://github.com/ionic-team/ionic-framework/issues/24533)) ([90458da](https://github.com/ionic-team/ionic-framework/commit/90458da406e2f7a6675be185409ea78595a35128)), closes [#24226](https://github.com/ionic-team/ionic-framework/issues/24226)





## [6.0.1](https://github.com/ionic-team/ionic/compare/v6.0.0...v6.0.1) (2021-12-15)


### Bug Fixes

* **datetime:** datetime now appears correctly when presented in modal ([#24385](https://github.com/ionic-team/ionic/issues/24385)) ([e7d0674](https://github.com/ionic-team/ionic/commit/e7d06743ae2e09864510940bf8a97bc312ef1cf8)), closes [#24112](https://github.com/ionic-team/ionic-framework/issues/24112)
* **item:** remove empty padding space for item bottom ([#24323](https://github.com/ionic-team/ionic/issues/24323)) ([500985c](https://github.com/ionic-team/ionic/commit/500985ce04783f502a1f5c50fbd8b4c5e93294d7)), closes [#23892](https://github.com/ionic-team/ionic/issues/23892)
* **modal:** fix timing issue when rapidly closing and opening controller modal ([#24380](https://github.com/ionic-team/ionic/issues/24380)) ([732f8e1](https://github.com/ionic-team/ionic/commit/732f8e10ce604f1a3e98518ae9c3a4afd7803e9a)), closes [#24230](https://github.com/ionic-team/ionic-framework/issues/24230)
* **overlays:** define children custom elements for picker ([#24372](https://github.com/ionic-team/ionic/issues/24372)) ([7c700b4](https://github.com/ionic-team/ionic/commit/7c700b4caa35d7eb50c877d794f9db9fad6ed88b)), closes [#24366](https://github.com/ionic-team/ionic/issues/24366)
* **vue:** improve query params handling in tabs ([#24355](https://github.com/ionic-team/ionic/issues/24355)) ([6309d5d](https://github.com/ionic-team/ionic/commit/6309d5ddbaa7da5e37eda4e19866baf380069578)), closes [#24353](https://github.com/ionic-team/ionic/issues/24353)
* **vue:** strongly typed controller methods ([#24388](https://github.com/ionic-team/ionic/issues/24388)) ([a5d56b3](https://github.com/ionic-team/ionic/commit/a5d56b3d5a0a64fd4c62f4beab69a3a1681c0b70)), closes [#24387](https://github.com/ionic-team/ionic/issues/24387)
* **vue:** tabs no longer get unmounted when navigating back to a tabs context ([#24337](https://github.com/ionic-team/ionic/issues/24337)) ([bf8e436](https://github.com/ionic-team/ionic/commit/bf8e436ee3f7441ebbc7eaf53ec8d04545dab476)), closes [#24332](https://github.com/ionic-team/ionic/issues/24332)


### Performance Improvements

* **content:** remove global click listener to improve interaction performance ([#24360](https://github.com/ionic-team/ionic/issues/24360)) ([1bfac52](https://github.com/ionic-team/ionic/commit/1bfac52331d3f296e5721b2a6c3fd94a97450a1d)), closes [#24359](https://github.com/ionic-team/ionic/issues/24359)






# [6.0.0 Titanium](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.4...v6.0.0) (2021-12-08)

Enjoy! 🚀

> We recommend updating to version `5.9.2` before updating to version `6.0.0` in order to see deprecation warnings related to your app [in the developer console](https://javascript.info/devtools).

Please see the [Ionic 6 Upgrade Guide](https://ionicframework.com/docs/next/intro/upgrading-to-ionic-6) for a step-by-step list of what you need to do to get started with Ionic 6.

# [6.0.0-rc.4](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.3...v6.0.0-rc.4) (2021-12-07)


### Bug Fixes

* **accordion:** improve functionality with nested accordions ([#24302](https://github.com/ionic-team/ionic/issues/24302)) ([0920797](https://github.com/ionic-team/ionic/commit/0920797612a5ee3aac1c38d8bffe4fd1e80b6987))
* **content:** ensure scrollEl is always available in scroll methods ([#24255](https://github.com/ionic-team/ionic/issues/24255)) ([36a096c](https://github.com/ionic-team/ionic/commit/36a096c9b60bd6b3b086f2c966a1cd40dbc54473)), closes [#24168](https://github.com/ionic-team/ionic-framework/issues/24168)
* **datetime:** keyboard navigation now works in time picker ([#24251](https://github.com/ionic-team/ionic/issues/24251)) ([8bdcd3c](https://github.com/ionic-team/ionic/commit/8bdcd3c6c99d84a0a46b0f08dceca6b6929fd8f8)), closes [#24070](https://github.com/ionic-team/ionic-framework/issues/24070)
* **datetime:** prevent multiple items from being highlighted at once in month/year and time pickers ([#24268](https://github.com/ionic-team/ionic/issues/24268)) ([c2bef8d](https://github.com/ionic-team/ionic/commit/c2bef8df14111dc00c382a3ab36c27a08a92f0b7)), closes [#24067](https://github.com/ionic-team/ionic-framework/issues/24067)
* **datetime:** update active calendar display when value changes ([#24244](https://github.com/ionic-team/ionic/issues/24244)) ([ec3bc52](https://github.com/ionic-team/ionic/commit/ec3bc52ff194f1e4db4ce49548c1418c259b8795)), closes [#24241](https://github.com/ionic-team/ionic-framework/issues/24241)
* **item:** counter property now defaults to false to make upgrade easier ([#24263](https://github.com/ionic-team/ionic/issues/24263)) ([f61f356](https://github.com/ionic-team/ionic/commit/f61f35600072c5df069a24c3b24eb8f283d586f8))
* **react, vue:** remove side effects to improve treeshaking ([#24313](https://github.com/ionic-team/ionic/issues/24313)) ([13d4418](https://github.com/ionic-team/ionic/commit/13d4418588b98d301b05ebd94e0eac670163a553)), closes [#24280](https://github.com/ionic-team/ionic-framework/issues/24280)


### Features

* **react:** add setupIonicReact function ([#24254](https://github.com/ionic-team/ionic/issues/24254)) ([55db38d](https://github.com/ionic-team/ionic/commit/55db38ddc541c2632c7d3e4e4c9400ff5b5dfe8c)), closes [#24139](https://github.com/ionic-team/ionic/issues/24139)





# [6.0.0-rc.3](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.2...v6.0.0-rc.3) (2021-11-17)


### Bug Fixes

* **all:** Ionic components that use child Ionic components are now correctly defined ([#24191](https://github.com/ionic-team/ionic/issues/24191)) ([5a2a335](https://github.com/ionic-team/ionic/commit/5a2a335784aab581cda90448193e48f687df6b15)), closes [#23571](https://github.com/ionic-team/ionic/issues/23571) [#24116](https://github.com/ionic-team/ionic/issues/24116) [#24129](https://github.com/ionic-team/ionic/issues/24129)
* **angular:** prevent duplicate event emissions ([#24200](https://github.com/ionic-team/ionic/issues/24200)) ([fc1eae9](https://github.com/ionic-team/ionic/commit/fc1eae982d7493f5b69fb18829f9c796f05a0d47))
* **icon:** update to ionicons 6 to resolve typescript 4.4 errors ([#24185](https://github.com/ionic-team/ionic/issues/24185)) ([118c606](https://github.com/ionic-team/ionic/commit/118c606703f792f830d92f1148882b5daa3f180f))
* **input:** date type in ion-input now aligns correctly on iOS 15 ([#24213](https://github.com/ionic-team/ionic/issues/24213)) ([9cf7c89](https://github.com/ionic-team/ionic/commit/9cf7c897043854a9d0db81d18ad6c016eb964de8))
* **input:** ionInput event emits with type of InputEvent ([#24111](https://github.com/ionic-team/ionic/issues/24111)) ([52cd5d0](https://github.com/ionic-team/ionic/commit/52cd5d0ccedb8013c860198fc69f6bc0d4e6d386))
* **item:** allow click targets inside of label ([#24225](https://github.com/ionic-team/ionic/issues/24225)) ([3949a94](https://github.com/ionic-team/ionic/commit/3949a949dfe112668c69a36d64e5f01a5aef1435))
* **label:** apply error appearance when control is touched ([#24072](https://github.com/ionic-team/ionic/issues/24072)) ([009dff5](https://github.com/ionic-team/ionic/commit/009dff5584fea6398bb99aa55760d25dafd7fbcc))
* **modal, popover:** opening modal and popover now works even if overlay was added to ion-app directly ([#24174](https://github.com/ionic-team/ionic/issues/24174)) ([da339a8](https://github.com/ionic-team/ionic/commit/da339a8a743548f9bde8b5a22f1a9d6b191f6e7b)), closes [#23728](https://github.com/ionic-team/ionic/issues/23728)
* **modal:** border radius is now correctly applied to card modals ([#24204](https://github.com/ionic-team/ionic/issues/24204)) ([1f4f8eb](https://github.com/ionic-team/ionic/commit/1f4f8eb6ca2b8adb543ade83c309177ac7f2044d))
* **modal:** card modal shadow now shows up correctly on ipad ([#24203](https://github.com/ionic-team/ionic/issues/24203)) ([5d4f5af](https://github.com/ionic-team/ionic/commit/5d4f5af36083eafcf7de91b22749ff307701087f))
* **overlays:** declarative modals now work properly with the hardware back button ([#24165](https://github.com/ionic-team/ionic/issues/24165)) ([b3759ae](https://github.com/ionic-team/ionic/commit/b3759aed5bd1ec6a7c744af03d0dac9c8055c5af))
* **react:** improve component compatibility with preact ([#24132](https://github.com/ionic-team/ionic/issues/24132)) ([15fc293](https://github.com/ionic-team/ionic/commit/15fc293d75aa21426616459c2596b46e2d460f49)), closes [#23516](https://github.com/ionic-team/ionic/issues/23516)
* **textarea:** floating label layout is correct with autogrow textareas ([#24202](https://github.com/ionic-team/ionic/issues/24202)) ([713f0f5](https://github.com/ionic-team/ionic/commit/713f0f55261205d3f7e25874939cb1f998f38d4a))



# [6.0.0-rc.2](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.1...v6.0.0-rc.2) (2021-11-03)


### Bug Fixes

* **datetime:** resolve month and year jumping issue on ios ([#24142](https://github.com/ionic-team/ionic/issues/24142)) ([27aef93](https://github.com/ionic-team/ionic/commit/27aef9343cada9a83adec8fe00e8bc3bafa8e049)), closes [#23910](https://github.com/ionic-team/ionic/issues/23910)



# [6.0.0-rc.1](https://github.com/ionic-team/ionic/compare/v5.8.5...v6.0.0-rc.1) (2021-10-27)


### Bug Fixes

* **accordion-group:** ionChange is now fired properly in vue ([#24063](https://github.com/ionic-team/ionic/issues/24063)) ([61b99d1](https://github.com/ionic-team/ionic/commit/61b99d13bfab5c57617cbcdc7e54e43f88885f66)), closes [#23762](https://github.com/ionic-team/ionic/issues/23762)
* **datetime:** clear button is now rendered even if showDefaultButtons is false ([#24075](https://github.com/ionic-team/ionic/issues/24075)) ([e3996cf](https://github.com/ionic-team/ionic/commit/e3996cfbd50f5e9ae54ffcbe2594124e3b9969b0))
* **datetime:** default sizing preserves shape of datetime ([#24104](https://github.com/ionic-team/ionic/issues/24104)) ([71fab0f](https://github.com/ionic-team/ionic/commit/71fab0fa124254f8cdc3b513627aa7b045993f4e))
* **infinite-scroll:** infinite scroll event now fired with custom elements build ([#24043](https://github.com/ionic-team/ionic/issues/24043)) ([8a86cfb](https://github.com/ionic-team/ionic/commit/8a86cfb7050989e914fa85ccc1ea755d73f58c90)), closes [#24034](https://github.com/ionic-team/ionic/issues/24034)
* **modal:** fix backdrop animation for sheets with off-center backdropBreakpoint ([#24061](https://github.com/ionic-team/ionic/issues/24061)) ([49db6d0](https://github.com/ionic-team/ionic/commit/49db6d02883b11b5f179300e2eaa298002a381e8))
* **react:** overlays shown with useIonModal and useIonPopover no longer render outside of main react tree ([f3e492c](https://github.com/ionic-team/ionic/commit/f3e492c897c8cda2b98050156f130654f4d7014a)), closes [#23516](https://github.com/ionic-team/ionic/issues/23516) [#23516](https://github.com/ionic-team/ionic/issues/23516)


### Features

* **angular:** build for angular 12.0 ([#23970](https://github.com/ionic-team/ionic/issues/23970)) ([3451a34](https://github.com/ionic-team/ionic/commit/3451a34ad0c893be0b6c17dc91ac9a75d2b9b52c))



# [6.0.0-rc.0](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.7...v6.0.0-rc.0) (2021-10-07)


### Bug Fixes

* **angular:** setup config properly ([#24028](https://github.com/ionic-team/ionic/issues/24028)) ([907996c](https://github.com/ionic-team/ionic/commit/907996ce16446d0dc12939da325b7b5dae09ebd9))



# [6.0.0-beta.7](https://github.com/ionic-team/ionic/compare/v5.8.2...v6.0.0-beta.7) (2021-10-06)


### Bug Fixes

* **datetime:** add ionBlur/ionFocus events to whole component ([#23980](https://github.com/ionic-team/ionic/issues/23980)) ([86a77bd](https://github.com/ionic-team/ionic/commit/86a77bd379c6dca57d5feb9694d18afe6d82934d))
* **datetime:** change now emitted when picker is typed into ([#24018](https://github.com/ionic-team/ionic/issues/24018)) ([0320164](https://github.com/ionic-team/ionic/commit/03201643ba9ae34fa969c1542742d9cd95298c81))
* **datetime:** ionChange is no longer called for out of range dates ([#23940](https://github.com/ionic-team/ionic/issues/23940)) ([ea39c6e](https://github.com/ionic-team/ionic/commit/ea39c6e5b3781ceb4c87277cf4a5e0be9c75bc20)), closes [#23939](https://github.com/ionic-team/ionic/issues/23939)
* **datetime:** time picker uses new iOS 15 style ([#23996](https://github.com/ionic-team/ionic/issues/23996)) ([0ab37b5](https://github.com/ionic-team/ionic/commit/0ab37b5061728bd60fd42781645b96add130a79f)), closes [#23768](https://github.com/ionic-team/ionic/issues/23768)
* **modal:** backdropBreakpoint is now an exclusive value ([#23954](https://github.com/ionic-team/ionic/issues/23954)) ([ed455ab](https://github.com/ionic-team/ionic/commit/ed455ab4c6df73f801a3c941da21261c205c9634))
* **react:** ensure inline modal content is visible ([#23968](https://github.com/ionic-team/ionic/issues/23968)) ([285a371](https://github.com/ionic-team/ionic/commit/285a371101e714e74d6df68701cbee9dfe23605e))
* **reorder-group:** wait for content to render before getting scroll position ([#24007](https://github.com/ionic-team/ionic/issues/24007)) ([225a278](https://github.com/ionic-team/ionic/commit/225a2787407c5ce68a953ee3448647d00af26517)), closes [#23875](https://github.com/ionic-team/ionic/issues/23875)
* **select:** ensure popover options with number values are searched for correctly ([#23998](https://github.com/ionic-team/ionic/issues/23998)) ([c204083](https://github.com/ionic-team/ionic/commit/c20408369bd332b5e225a3d50ec94978f6f5ec97))
* **select:** focus selected item in popovers ([#23991](https://github.com/ionic-team/ionic/issues/23991)) ([2497a53](https://github.com/ionic-team/ionic/commit/2497a53255dc43052755bba842dfcf556d930dcd))


### Features

* **all:** add CustomEvents types to components that emit events ([#23956](https://github.com/ionic-team/ionic/issues/23956)) ([8708095](https://github.com/ionic-team/ionic/commit/87080951112a409893a4bac2def1deca06642b16)), closes [#22925](https://github.com/ionic-team/ionic/issues/22925)
* **header, footer:** add ios fading header style ([#24011](https://github.com/ionic-team/ionic/issues/24011)) ([7ce3959](https://github.com/ionic-team/ionic/commit/7ce3959b66a08e980c7dac3bb7d7df6bf0ae874e))


### BREAKING CHANGES

* **all:** The `RadioChangeEventDetail` interface has been removed in favor of `RadioGroupChangeEventDetail`.



# [6.0.0-beta.6](https://github.com/ionic-team/ionic/compare/v5.8.0...v6.0.0-beta.6) (2021-09-15)


### Bug Fixes

* **modal:** add sheet modal properties for angular ([#23899](https://github.com/ionic-team/ionic/issues/23899)) ([d1763fc](https://github.com/ionic-team/ionic/commit/d1763fc8b56c8cb5272224ae0faaebfe3e516fdb))
* **modal:** expose breakpoint props in ModalOptions interface ([#23867](https://github.com/ionic-team/ionic/issues/23867)) ([5fd80fd](https://github.com/ionic-team/ionic/commit/5fd80fd43885a5d0cd65f0eef4e0ff15e82c4fe0)), closes [#23866](https://github.com/ionic-team/ionic/issues/23866)
* **modal:** handle on sheet modal can now be turned off ([#23900](https://github.com/ionic-team/ionic/issues/23900)) ([e2d2ad6](https://github.com/ionic-team/ionic/commit/e2d2ad6f8eaf798c6f4b4a69f2b8176f0ac22d32))
* **modal:** modal displays in middle of screen on desktop ([#23911](https://github.com/ionic-team/ionic/issues/23911)) ([9d87028](https://github.com/ionic-team/ionic/commit/9d87028e81723a0f1498c8cf231319676078eda0))
* **modal:** sheet animation works correctly if breakpoints value does not include 1 ([#23927](https://github.com/ionic-team/ionic/issues/23927)) ([414f246](https://github.com/ionic-team/ionic/commit/414f24685cbc67a7fff142b7786d33ce1cd67a0c))
* **modal:** sheet modal handle is now positioned correctly ([#23901](https://github.com/ionic-team/ionic/issues/23901)) ([58a4ba2](https://github.com/ionic-team/ionic/commit/58a4ba285389e45276df49a0b4a3412daa95e92c))
* **modal:** sheet modal now accounts for safe area ([#23884](https://github.com/ionic-team/ionic/issues/23884)) ([195d817](https://github.com/ionic-team/ionic/commit/195d8179676155315f8532636b6371dd2a63e4b9)), closes [#23874](https://github.com/ionic-team/ionic/issues/23874)


### Features

* **datetime:** add ability to select only month, year, or month and year ([#23913](https://github.com/ionic-team/ionic/issues/23913)) ([4ae44b7](https://github.com/ionic-team/ionic/commit/4ae44b7a236004738d593406d7b1236600bc6d95))
* **datetime:** add clear button ([#23920](https://github.com/ionic-team/ionic/issues/23920)) ([18765e7](https://github.com/ionic-team/ionic/commit/18765e7e39b9f205f47f394d26d6ecc4b53e17ef)), closes [#17482](https://github.com/ionic-team/ionic/issues/17482)
* **menu:** add console error for incorrect usage of contentId ([#23871](https://github.com/ionic-team/ionic/issues/23871)) ([879ab8e](https://github.com/ionic-team/ionic/commit/879ab8ebdacc1468ed206701c00b60100dbab9e4)), closes [#23810](https://github.com/ionic-team/ionic/issues/23810)
* **platform:** add ability to override platform detection methods ([#23915](https://github.com/ionic-team/ionic/issues/23915)) ([45cabae](https://github.com/ionic-team/ionic/commit/45cabae04bf9236cd069793fbf2ac8f68c372cc3)), closes [#19737](https://github.com/ionic-team/ionic/issues/19737)
* **react:** add custom elements bundle ([#23896](https://github.com/ionic-team/ionic/issues/23896)) ([c50d895](https://github.com/ionic-team/ionic/commit/c50d895370a56d0809019dc59fe32ec840b72f03))



# [6.0.0-beta.5](https://github.com/ionic-team/ionic/compare/v5.7.0...v6.0.0-beta.5) (2021-09-01)


### Bug Fixes

* **angular:** overlay interfaces are now properly exported ([#23847](https://github.com/ionic-team/ionic/issues/23847)) ([c925274](https://github.com/ionic-team/ionic/commit/c925274c3bb22532a323b2a07771d7448f7de542)), closes [#23846](https://github.com/ionic-team/ionic/issues/23846)
* **datetime:** prevent vertical page scroll on interaction ([#23780](https://github.com/ionic-team/ionic/issues/23780)) ([950350a](https://github.com/ionic-team/ionic/commit/950350a948320f889589a0c9d2ec9045637215e5)), closes [#23554](https://github.com/ionic-team/ionic/issues/23554)
* **item:** form validation states are now properly shown ([#23853](https://github.com/ionic-team/ionic/issues/23853)) ([5ca2ce9](https://github.com/ionic-team/ionic/commit/5ca2ce91971408218d7bdc52509ce61a6ebb46aa)), closes [#23733](https://github.com/ionic-team/ionic/issues/23733) [#23850](https://github.com/ionic-team/ionic/issues/23850)
* **overlays:** thrown errors are no longer suppressed ([#23831](https://github.com/ionic-team/ionic/issues/23831)) ([a212eb5](https://github.com/ionic-team/ionic/commit/a212eb52599e35d3706e2d3cef751e490e3a7259)), closes [#22724](https://github.com/ionic-team/ionic/issues/22724)


### Features

* **modal:** add bottom sheet functionality ([#23828](https://github.com/ionic-team/ionic/issues/23828)) ([12216d3](https://github.com/ionic-team/ionic/commit/12216d378df091e16fd77d271b107e819278481c)), closes [#21039](https://github.com/ionic-team/ionic/issues/21039)
* **popover:** add ability to pass event to present method ([#23827](https://github.com/ionic-team/ionic/issues/23827)) ([1d2ee92](https://github.com/ionic-team/ionic/commit/1d2ee92ca01b77bcf87c7783b50d59efcf0a402a)), closes [#23813](https://github.com/ionic-team/ionic/issues/23813)



# [6.0.0-beta.4](https://github.com/ionic-team/ionic/compare/v5.6.14...v6.0.0-beta.4) (2021-08-18)


### Bug Fixes

* **datetime:** reduce time presentation min height ([#23771](https://github.com/ionic-team/ionic/issues/23771)) ([bc4e826](https://github.com/ionic-team/ionic/commit/bc4e8267aa00e7f162cd01579d8d3adbf3cd7a83)), closes [#23690](https://github.com/ionic-team/ionic/issues/23690)
* **datetime:** text color on ios mode now accounts for color contrast ([#23729](https://github.com/ionic-team/ionic/issues/23729)) ([5980db4](https://github.com/ionic-team/ionic/commit/5980db44e5a765d15e681471325e916d566eca8d)), closes [#23723](https://github.com/ionic-team/ionic/issues/23723)
* **item:** highlight now appears above helper/error text ([#23763](https://github.com/ionic-team/ionic/issues/23763)) ([2995e33](https://github.com/ionic-team/ionic/commit/2995e337c8b4612a87eb7111224ec702494fd1d7)), closes [#23510](https://github.com/ionic-team/ionic/issues/23510)
* **toast:** ToastOptions interface now contains icon prop ([#23737](https://github.com/ionic-team/ionic/issues/23737)) ([fbd32ff](https://github.com/ionic-team/ionic/commit/fbd32ffb2633b17d71a34a8760386a319f2e2bca)), closes [#23736](https://github.com/ionic-team/ionic/issues/23736)
* **vue:** custom element internal properties are no longer overridden in vue 3.1.0 ([#23738](https://github.com/ionic-team/ionic/issues/23738)) ([ea39c70](https://github.com/ionic-team/ionic/commit/ea39c70b3ec78b2ea5ef64263e8528b543378784)), closes [#23539](https://github.com/ionic-team/ionic/issues/23539)
* **vue:** modal and popover components now correctly pass properties ([#23761](https://github.com/ionic-team/ionic/issues/23761)) ([578b906](https://github.com/ionic-team/ionic/commit/578b9062dd793c8526b80a769d94aa7aad8fe368)), closes [#23698](https://github.com/ionic-team/ionic/issues/23698)


### Features

* **action-sheet:** add data property to ActionSheetButton ([#23744](https://github.com/ionic-team/ionic/issues/23744)) ([30f8508](https://github.com/ionic-team/ionic/commit/30f8508296cfc8f8b1c03d04b24abfa184624200)), closes [#23700](https://github.com/ionic-team/ionic/issues/23700)
* **datetime:** add firstDayOfWeek property ([#23692](https://github.com/ionic-team/ionic/issues/23692)) ([ea348f0](https://github.com/ionic-team/ionic/commit/ea348f005aef7b2fda581a99338139f6fefcda63)), closes [#23556](https://github.com/ionic-team/ionic/issues/23556)
* **datetime:** add hourCycle property ([#23686](https://github.com/ionic-team/ionic/issues/23686)) ([6342fde](https://github.com/ionic-team/ionic/commit/6342fde56c7687703edd212b8383536c8b9a6400)), closes [#23661](https://github.com/ionic-team/ionic/issues/23661)



# [6.0.0-beta.3](https://github.com/ionic-team/ionic/compare/v5.6.13...v6.0.0-beta.3) (2021-08-04)


### Bug Fixes

* **list:** change inset border radius to match iOS 15 ([#23711](https://github.com/ionic-team/ionic/issues/23711)) ([fe2810b](https://github.com/ionic-team/ionic/commit/fe2810b227abc482e663b210cd89f29b76119ff5))
* **popover:** fix keyboard arrow navigation ([#23709](https://github.com/ionic-team/ionic/issues/23709)) ([f2e7a26](https://github.com/ionic-team/ionic/commit/f2e7a267973a06b50a0f6dcbba0a204930bccf69)), closes [#23512](https://github.com/ionic-team/ionic/issues/23512)
* **vue:** popover positioning is now correct with custom elements build ([#23680](https://github.com/ionic-team/ionic/issues/23680)) ([3a1a9cb](https://github.com/ionic-team/ionic/commit/3a1a9cbce45ad128c9ba87940535dabfa167fb9e))


### Features

* **toast:** add icon property to show icon at start of toast content ([#23596](https://github.com/ionic-team/ionic/issues/23596)) ([df24c8c](https://github.com/ionic-team/ionic/commit/df24c8c5ae0b493841c07c05e0d620fa4a90c05a)), closes [#23524](https://github.com/ionic-team/ionic/issues/23524)



# [6.0.0-beta.2](https://github.com/ionic-team/ionic/compare/v5.6.12...v6.0.0-beta.2) (2021-07-21)


### Bug Fixes

* **accordion:** value can now be set as string when using multiple is true ([#23581](https://github.com/ionic-team/ionic/issues/23581)) ([8f172de](https://github.com/ionic-team/ionic/commit/8f172de355bc7c910d600ce4d8446b04a6212545)), closes [#23550](https://github.com/ionic-team/ionic/issues/23550)
* **angular:** modal and popover now have correct props defined on angular component ([#23565](https://github.com/ionic-team/ionic/issues/23565)) ([e5a7b34](https://github.com/ionic-team/ionic/commit/e5a7b342623b159d41cc83e0a418fb3984ceb3a7))
* **datetime:** add keyboard year navigation ([#23585](https://github.com/ionic-team/ionic/issues/23585)) ([55bd1f7](https://github.com/ionic-team/ionic/commit/55bd1f749bac01cc691e16283728c42e755cc706)), closes [#21553](https://github.com/ionic-team/ionic/issues/21553) [#18122](https://github.com/ionic-team/ionic/issues/18122)
* **datetime:** selecting time now works correctly on firefox ([#23583](https://github.com/ionic-team/ionic/issues/23583)) ([4188964](https://github.com/ionic-team/ionic/commit/4188964dc8da2c46494245b81864ca6e305611f5)), closes [#23545](https://github.com/ionic-team/ionic/issues/23545)
* **datetime:** years displayed now more consistent with v5 datetime, max and min are now accounted for in MD mode ([#23616](https://github.com/ionic-team/ionic/issues/23616)) ([be219a2](https://github.com/ionic-team/ionic/commit/be219a2814800927e6328ff105616713003340b7)), closes [#23615](https://github.com/ionic-team/ionic/issues/23615)


### Features

* **breadcrumbs:** ionCollapsedClick event payload now contains references to collapsed breadcrumb elements ([#23611](https://github.com/ionic-team/ionic/issues/23611)) ([9ce57d2](https://github.com/ionic-team/ionic/commit/9ce57d2efb84130895a37e22e0fd7e5d713a9fa5)), closes [#23552](https://github.com/ionic-team/ionic/issues/23552)
* **datetime:** add showDefaultTimeLabel property and time-label slot ([#23577](https://github.com/ionic-team/ionic/issues/23577)) ([7ac0109](https://github.com/ionic-team/ionic/commit/7ac010943b2c9ad42a1833153ea16ccffd169b91)), closes [#23555](https://github.com/ionic-team/ionic/issues/23555)
* **datetime:** add size property ([#23649](https://github.com/ionic-team/ionic/issues/23649)) ([321341d](https://github.com/ionic-team/ionic/commit/321341d97dff98b76b69a1efce58923a80e92bc4)), closes [#23518](https://github.com/ionic-team/ionic/issues/23518)
* **range:** add support for customizing pin format ([#22972](https://github.com/ionic-team/ionic/issues/22972)) ([8f2c4f7](https://github.com/ionic-team/ionic/commit/8f2c4f73db167503cdf60222f42bcaadf905b401))
* **segment:** add keyboard navigation, add selectOnFocus property to control selection follow focus behavior ([#23590](https://github.com/ionic-team/ionic/issues/23590)) ([b6c53e5](https://github.com/ionic-team/ionic/commit/b6c53e539b0855fa95b0fe02e5fa74ce403b68b8)), closes [#23520](https://github.com/ionic-team/ionic/issues/23520)
* **select:** update popover interface to match MD spec on desktop, allow multiple values in popover interface ([#23474](https://github.com/ionic-team/ionic/issues/23474)) ([2c07a15](https://github.com/ionic-team/ionic/commit/2c07a1566b6f8570f7e12a55ca8f86d8fb8a968e)), closes [#23657](https://github.com/ionic-team/ionic/issues/23657) [#15500](https://github.com/ionic-team/ionic/issues/15500) [#12310](https://github.com/ionic-team/ionic/issues/12310)


### Performance Improvements

* remove shims for legacy browsers no longer supported in v6 ([#23592](https://github.com/ionic-team/ionic/issues/23592)) ([259b135](https://github.com/ionic-team/ionic/commit/259b1359dbd20d4f85036ae46901a051cd8fc98b))



# [6.0.0-beta.1](https://github.com/ionic-team/ionic/compare/v5.6.11...v6.0.0-beta.1) (2021-07-01)


### Bug Fixes

* **accordion:** improved reliability of accordion animations ([#23531](https://github.com/ionic-team/ionic/issues/23531)) ([6fbd60b](https://github.com/ionic-team/ionic/commit/6fbd60b0df56dc927226474a1ffa322d979c563e)), closes [#23504](https://github.com/ionic-team/ionic/issues/23504)
* **content:** add touch-action manipulation for a11y zoom and pan ([#23534](https://github.com/ionic-team/ionic/issues/23534)) ([6ca1780](https://github.com/ionic-team/ionic/commit/6ca17805b8b1ea38d7fc16d091324da16a4193c6)), closes [#22805](https://github.com/ionic-team/ionic/issues/22805)
* **datetime:** scroll position no longer gets reset when using datetime in overlay ([#23543](https://github.com/ionic-team/ionic/issues/23543)) ([b735b58](https://github.com/ionic-team/ionic/commit/b735b587cda777ac481bb580c883d9734145f31e))
* **input, select, textarea:** change type of placeholder prop to string only ([#23500](https://github.com/ionic-team/ionic/issues/23500)) ([f3ae431](https://github.com/ionic-team/ionic/commit/f3ae4319bb64debab304973856a33e422ac910a1)), closes [#22976](https://github.com/ionic-team/ionic/issues/22976)
* **popover:** size property now works when providing only event ([#23532](https://github.com/ionic-team/ionic/issues/23532)) ([bdc1f23](https://github.com/ionic-team/ionic/commit/bdc1f2360d7795472cc242a86eb4376d05fa0bb7)), closes [#23528](https://github.com/ionic-team/ionic/issues/23528)
* **popover:** update animation to better match MD spec ([#23541](https://github.com/ionic-team/ionic/issues/23541)) ([bdb95b7](https://github.com/ionic-team/ionic/commit/bdb95b7b6dd798cbc6d1786ae54fa95ac1dfd096))
* **react:** export accordion and accordion group components ([#23497](https://github.com/ionic-team/ionic/issues/23497)) ([a664d42](https://github.com/ionic-team/ionic/commit/a664d4268dea8e84ab9e3b150043ac8f87fb53c7))
* **vue:** navigating between parameterized pages now results in page transition ([#23525](https://github.com/ionic-team/ionic/issues/23525)) ([e30b17c](https://github.com/ionic-team/ionic/commit/e30b17c5bbd1af6936a8d7a98d1f7a115073e029)), closes [#22662](https://github.com/ionic-team/ionic/issues/22662)


### Features

* **accordion-group:** add animated property to disable animations ([#23530](https://github.com/ionic-team/ionic/issues/23530)) ([9a60dd0](https://github.com/ionic-team/ionic/commit/9a60dd0ea7c55acf0fdd1161433e5b4ed40778f2))
* **action-sheet, alert:** add id to AlertButton and ActionSheetButton ([#18992](https://github.com/ionic-team/ionic/issues/18992)) ([9e24a0b](https://github.com/ionic-team/ionic/commit/9e24a0b49357a3a39ca89f026ff23271a365d935)), closes [#22959](https://github.com/ionic-team/ionic/issues/22959)
* **vue:** extend useIonRouter hook for programmatic navigation with animation control  ([#23499](https://github.com/ionic-team/ionic/issues/23499)) ([fc9e1b4](https://github.com/ionic-team/ionic/commit/fc9e1b4b361938e5644683c395a565be2de1eab9)), closes [#23450](https://github.com/ionic-team/ionic/issues/23450)


### BREAKING CHANGES

* **input, select, textarea:** Updated the `placeholder` property on `ion-input`, `ion-textarea`, and `ion-select` to have a type of `string | undefined`.



# [6.0.0-beta.0](https://github.com/ionic-team/ionic/compare/v5.6.10...v6.0.0-beta.0) (2021-06-23)


### Bug Fixes

* **accordion:** toggle icon now shows up in vue and react ([#23426](https://github.com/ionic-team/ionic/issues/23426)) ([c716617](https://github.com/ionic-team/ionic/commit/c7166179457a8e2c7e1702c5761bc6368dbd156f))
* **datetime:** changing time emits ionChange ([#23463](https://github.com/ionic-team/ionic/issues/23463)) ([b0cce36](https://github.com/ionic-team/ionic/commit/b0cce360c83ac564e053523cc31b32d1deaeda0c))
* **modal, popover:** overlays now automatically determine if they are inline ([#23434](https://github.com/ionic-team/ionic/issues/23434)) ([8dbe8ba](https://github.com/ionic-team/ionic/commit/8dbe8ba7bc26792c5024f81cf4752f5b78317492))
* **modal:** add additional padding to toolbars in iOS modal ([#23262](https://github.com/ionic-team/ionic/issues/23262)) ([a037b65](https://github.com/ionic-team/ionic/commit/a037b65aad5cfc0477322a8f36105b9009366ec2)), closes [#22778](https://github.com/ionic-team/ionic/issues/22778)
* **modal:** border radius is correctly set on card style modal ([#23461](https://github.com/ionic-team/ionic/issues/23461)) ([bccb8ad](https://github.com/ionic-team/ionic/commit/bccb8ad5fb5ec7f98a6cbfa62a403ecaca7fbdb6))
* **popover:** shadow parts now correctly added ([#23446](https://github.com/ionic-team/ionic/issues/23446)) ([e1a9613](https://github.com/ionic-team/ionic/commit/e1a96130ebab1e481e880f0f3876f421976f08d5))
* **popover:** update prop defaults, use correct delegate ([#23340](https://github.com/ionic-team/ionic/issues/23340)) ([960778a](https://github.com/ionic-team/ionic/commit/960778a36f6eb6318cc740c4f7a255107723b8fd))
* **searchbar:** showClearButton now defaults to 'always' for improved usability with screen readers ([#23475](https://github.com/ionic-team/ionic/issues/23475)) ([80f181d](https://github.com/ionic-team/ionic/commit/80f181d4846507ee6bd4150bb568fca9b6660428))
* **vue:** ensure webpack does not eliminate core css ([#23465](https://github.com/ionic-team/ionic/issues/23465)) ([ee3a00f](https://github.com/ionic-team/ionic/commit/ee3a00fde61b4d1d3168d34b3d23bb97dd154154))


### Code Refactoring

* **all:** update required browser, framework, and mobile platform versions for v6 ([#23443](https://github.com/ionic-team/ionic/issues/23443)) ([c842dd8](https://github.com/ionic-team/ionic/commit/c842dd88c98888b2afab08ac5e8bc57c2a4c2fbd))
* **angular:** remove Config.set() method ([#22918](https://github.com/ionic-team/ionic/issues/22918)) ([9e05891](https://github.com/ionic-team/ionic/commit/9e0589173607b3c0eff7794079123354c2eeaa1a))
* **header:** removed border from last toolbar when using collapsible large title ([#22891](https://github.com/ionic-team/ionic/issues/22891)) ([c72bc5d](https://github.com/ionic-team/ionic/commit/c72bc5dbd76cd3ce622a4b3cedcb7446a2819384)), closes [#22777](https://github.com/ionic-team/ionic/issues/22777)
* **ios:** update toolbar and tabbar default background colors ([#22852](https://github.com/ionic-team/ionic/issues/22852)) ([3d615cb](https://github.com/ionic-team/ionic/commit/3d615cb3c7b233b08b9da6ac04096e16bbb60bfc)), closes [#22780](https://github.com/ionic-team/ionic/issues/22780)
* **toast:** whitespace variable now defaults to normal ([#22866](https://github.com/ionic-team/ionic/issues/22866)) ([9b78689](https://github.com/ionic-team/ionic/commit/9b786899e550c391b9395c669f9bba8f39ac98aa))
* **vue:** drop support for "on" prefixed overlay events and bump minimum required version of vue to 3.0.6 ([#23229](https://github.com/ionic-team/ionic/issues/23229)) ([6fcb3a6](https://github.com/ionic-team/ionic/commit/6fcb3a62b1b12c5ded11179e83854592d4309bdf))
* **vue:** remove support for child routes nested inside of tabs ([#22919](https://github.com/ionic-team/ionic/issues/22919)) ([75458ac](https://github.com/ionic-team/ionic/commit/75458ac7fb95f56a6ec460f85cf7d7720ce0c070))


### Features

* **accordion:** add accordion and accordion-group components ([#22865](https://github.com/ionic-team/ionic/issues/22865)) ([073883a](https://github.com/ionic-team/ionic/commit/073883a0987149e9f6258ca43c46f5ed4bce0dc5)), closes [#17094](https://github.com/ionic-team/ionic/issues/17094)
* **breadcrumbs:** add breadcrumbs component ([#22701](https://github.com/ionic-team/ionic/issues/22701)) ([2f6b1e4](https://github.com/ionic-team/ionic/commit/2f6b1e4eea307c6f14345704e5824378ef079acb)), closes [#22770](https://github.com/ionic-team/ionic/issues/22770)
* **datetime:** add calendar picker ([#23416](https://github.com/ionic-team/ionic/issues/23416)) ([932d3ca](https://github.com/ionic-team/ionic/commit/932d3ca62f3e3ef08acb065ce6ec46faa3811f96)), closes [#19423](https://github.com/ionic-team/ionic/issues/19423)
* **item:** add helper text, error text, counter, shape, and fill mode ([#23354](https://github.com/ionic-team/ionic/issues/23354)) ([faefe97](https://github.com/ionic-team/ionic/commit/faefe97da6a9d5beff1183d10efd0df9c4e3ebd7)), closes [#19619](https://github.com/ionic-team/ionic/issues/19619)
* **modal:** modals can now be used inline ([#23341](https://github.com/ionic-team/ionic/issues/23341)) ([3be1c3d](https://github.com/ionic-team/ionic/commit/3be1c3dcd73e6039a89b19b409e63877cda37f6e)), closes [#20117](https://github.com/ionic-team/ionic/issues/20117) [#20263](https://github.com/ionic-team/ionic/issues/20263)
* **popover:** account for ionShadowTarget elements ([#23436](https://github.com/ionic-team/ionic/issues/23436)) ([0e38d42](https://github.com/ionic-team/ionic/commit/0e38d4276110dcd94db5adc3b6aee3b5b0befc5c))
* **popover:** add desktop support ([#23258](https://github.com/ionic-team/ionic/issues/23258)) ([a67a0fa](https://github.com/ionic-team/ionic/commit/a67a0fabb8249685bbe93ed862839e2b2e76cd5a)), closes [#21599](https://github.com/ionic-team/ionic/issues/21599)
* **popover:** popover can now be used inline ([#23231](https://github.com/ionic-team/ionic/issues/23231)) ([308fa1c](https://github.com/ionic-team/ionic/commit/308fa1c0dd054cfc2ea54d2edc99e7a4b549f6f0))
* **slides:** add IonicSwiper modules, deprecate ion-slides, and add link to migration ([#23447](https://github.com/ionic-team/ionic/issues/23447)) ([623c84a](https://github.com/ionic-team/ionic/commit/623c84ab082668a996c654e18ffc9768f68b85dd))
* **spinner:** add lines-sharp, lines-sharp-small, update styles for ios 14 ([#22397](https://github.com/ionic-team/ionic/issues/22397)) ([2a5b272](https://github.com/ionic-team/ionic/commit/2a5b272a329bbad1ca07705f84f0fd06e3ef32ad))
* **vue:** add custom elements bundle ([#23458](https://github.com/ionic-team/ionic/issues/23458)) ([dc48a9f](https://github.com/ionic-team/ionic/commit/dc48a9f1a2dff8a2d644112bbe1df8b0b6811848))


### BREAKING CHANGES

* **searchbar:** The `showClearButton` property on `ion-searchbar` now defaults to `'always'`.
* **datetime:** The `ion-datetime` component has been revamped to use a new calendar style. As a result, some APIs have been removed. See https://github.com/ionic-team/ionic-framework/blob/master/BREAKING.md for more details.
* **all:** Browser, JS Framework, and mobile platform minimum required versions have been updated.
* **popover:** Converted `ion-popover` to use the Shadow DOM.
* **vue:** - Dropped support for prefixed overlay events in favor of non prefixed events (I.e. `@onDidDismiss` becomes `@didDismiss`).
- Minimum required version of Vue is now Vue v3.0.6 or newer.
* **vue:** Support for child routes nested inside of tabs has been removed to better conform to Vue Router's best practices. Additional routes should be written as sibling routes with the parent tab as the path prefix.
* **angular:** The `Config.set()` method has been removed. See https://ionicframework.com/docs/angular/config for examples on how to set config globally, per-component, and per-platform.
* **ios:** The tab bar and toolbar default background colors have been updated to better reflect the latest iOS styles.
* **header:** The last toolbar in the header with a collapsible large title no longer has a border.
* **toast:** The `--white-space` CSS Variable now defaults to `normal`.





# [6.0.0-rc.2](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.1...v6.0.0-rc.2) (2021-11-03)


### Bug Fixes

* **all:** resolve compilation issues with Stencil 2.10 ([#24152](https://github.com/ionic-team/ionic/issues/24152)) ([8b940e5](https://github.com/ionic-team/ionic-framework/commit/8b940e505e79bdf5da829850ed949847d5df8b90)), closes [#24153](https://github.com/ionic-team/ionic-framework/issues/24153)
* **datetime:** resolve month and year jumping issue on ios ([#24142](https://github.com/ionic-team/ionic/issues/24142)) ([27aef93](https://github.com/ionic-team/ionic/commit/27aef9343cada9a83adec8fe00e8bc3bafa8e049)), closes [#23910](https://github.com/ionic-team/ionic/issues/23910)



# [6.0.0-rc.1](https://github.com/ionic-team/ionic/compare/v6.0.0-rc.0...v6.0.0-rc.1) (2021-10-27)


### Bug Fixes

* **accordion-group:** ionChange is now fired properly in vue ([#24063](https://github.com/ionic-team/ionic/issues/24063)) ([61b99d1](https://github.com/ionic-team/ionic/commit/61b99d13bfab5c57617cbcdc7e54e43f88885f66)), closes [#23762](https://github.com/ionic-team/ionic/issues/23762)
* **angular:** resolve issues with ng add on angular 12 ([#23970](https://github.com/ionic-team/ionic/issues/23970)) ([3451a34](https://github.com/ionic-team/ionic/commit/3451a34ad0c893be0b6c17dc91ac9a75d2b9b52c))
* **datetime:** clear button is now rendered even if showDefaultButtons is false ([#24075](https://github.com/ionic-team/ionic/issues/24075)) ([e3996cf](https://github.com/ionic-team/ionic/commit/e3996cfbd50f5e9ae54ffcbe2594124e3b9969b0))
* **datetime:** default sizing preserves shape of datetime ([#24104](https://github.com/ionic-team/ionic/issues/24104)) ([71fab0f](https://github.com/ionic-team/ionic/commit/71fab0fa124254f8cdc3b513627aa7b045993f4e))
* **infinite-scroll:** infinite scroll event now fired with custom elements build ([#24043](https://github.com/ionic-team/ionic/issues/24043)) ([8a86cfb](https://github.com/ionic-team/ionic/commit/8a86cfb7050989e914fa85ccc1ea755d73f58c90)), closes [#24034](https://github.com/ionic-team/ionic/issues/24034)
* **modal:** fix backdrop animation for sheets with off-center backdropBreakpoint ([#24061](https://github.com/ionic-team/ionic/issues/24061)) ([49db6d0](https://github.com/ionic-team/ionic/commit/49db6d02883b11b5f179300e2eaa298002a381e8))
* **react:** overlays shown with useIonModal and useIonPopover no longer render outside of main react tree ([f3e492c](https://github.com/ionic-team/ionic/commit/f3e492c897c8cda2b98050156f130654f4d7014a)), closes [#23516](https://github.com/ionic-team/ionic/issues/23516) [#23516](https://github.com/ionic-team/ionic/issues/23516)





# [6.0.0-rc.0](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.7...v6.0.0-rc.0) (2021-10-07)


### Bug Fixes

* **angular:** setup config properly ([#24028](https://github.com/ionic-team/ionic/issues/24028)) ([907996c](https://github.com/ionic-team/ionic/commit/907996ce16446d0dc12939da325b7b5dae09ebd9))





# [6.0.0-beta.7](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.6...v6.0.0-beta.7) (2021-10-06)


### Bug Fixes

* **datetime:** ionBlur and ionFocus now fires correctly ([#23980](https://github.com/ionic-team/ionic/issues/23980)) ([86a77bd](https://github.com/ionic-team/ionic/commit/86a77bd379c6dca57d5feb9694d18afe6d82934d))
* **datetime:** ionChange is no longer called for out of range dates ([#23940](https://github.com/ionic-team/ionic/issues/23940)) ([ea39c6e](https://github.com/ionic-team/ionic/commit/ea39c6e5b3781ceb4c87277cf4a5e0be9c75bc20)), closes [#23939](https://github.com/ionic-team/ionic/issues/23939)
* **datetime:** time picker uses new iOS 15 style ([#23996](https://github.com/ionic-team/ionic/issues/23996)) ([0ab37b5](https://github.com/ionic-team/ionic/commit/0ab37b5061728bd60fd42781645b96add130a79f)), closes [#23768](https://github.com/ionic-team/ionic/issues/23768)
* **modal:** backdropBreakpoint is now an exclusive value ([#23954](https://github.com/ionic-team/ionic/issues/23954)) ([ed455ab](https://github.com/ionic-team/ionic/commit/ed455ab4c6df73f801a3c941da21261c205c9634))
* **react:** ensure inline modal content is visible ([#23968](https://github.com/ionic-team/ionic/issues/23968)) ([285a371](https://github.com/ionic-team/ionic/commit/285a371101e714e74d6df68701cbee9dfe23605e))
* **reorder-group:** wait for content to render before getting scroll position ([#24007](https://github.com/ionic-team/ionic/issues/24007)) ([225a278](https://github.com/ionic-team/ionic/commit/225a2787407c5ce68a953ee3448647d00af26517)), closes [#23875](https://github.com/ionic-team/ionic/issues/23875)
* **select:** ensure popover options with number values are searched for correctly ([#23998](https://github.com/ionic-team/ionic/issues/23998)) ([c204083](https://github.com/ionic-team/ionic/commit/c20408369bd332b5e225a3d50ec94978f6f5ec97))
* **select:** focus selected item in popovers ([#23991](https://github.com/ionic-team/ionic/issues/23991)) ([2497a53](https://github.com/ionic-team/ionic/commit/2497a53255dc43052755bba842dfcf556d930dcd))


### Features

* **all:** add CustomEvents types to components that emit events ([#23956](https://github.com/ionic-team/ionic/issues/23956)) ([8708095](https://github.com/ionic-team/ionic/commit/87080951112a409893a4bac2def1deca06642b16)), closes [#22925](https://github.com/ionic-team/ionic/issues/22925)
* **header, footer:** add ios fading header style ([#24011](https://github.com/ionic-team/ionic/issues/24011)) ([7ce3959](https://github.com/ionic-team/ionic/commit/7ce3959b66a08e980c7dac3bb7d7df6bf0ae874e))


### BREAKING CHANGES

* **radio:** The `RadioChangeEventDetail` interface has been removed in favor of `RadioGroupChangeEventDetail`.






# [6.0.0-beta.6](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.5...v6.0.0-beta.6) (2021-09-15)


### Bug Fixes

* **menu:** add console error for incorrect usage of contentId ([#23871](https://github.com/ionic-team/ionic/issues/23871)) ([879ab8e](https://github.com/ionic-team/ionic/commit/879ab8ebdacc1468ed206701c00b60100dbab9e4)), closes [#23810](https://github.com/ionic-team/ionic/issues/23810)
* **modal:** add sheet modal properties for angular ([#23899](https://github.com/ionic-team/ionic/issues/23899)) ([d1763fc](https://github.com/ionic-team/ionic/commit/d1763fc8b56c8cb5272224ae0faaebfe3e516fdb))
* **modal:** expose breakpoint props in ModalOptions interface ([#23867](https://github.com/ionic-team/ionic/issues/23867)) ([5fd80fd](https://github.com/ionic-team/ionic/commit/5fd80fd43885a5d0cd65f0eef4e0ff15e82c4fe0)), closes [#23866](https://github.com/ionic-team/ionic/issues/23866)
* **modal:** handle on sheet modal can now be turned off ([#23900](https://github.com/ionic-team/ionic/issues/23900)) ([e2d2ad6](https://github.com/ionic-team/ionic/commit/e2d2ad6f8eaf798c6f4b4a69f2b8176f0ac22d32))
* **modal:** modal displays in middle of screen on desktop ([#23911](https://github.com/ionic-team/ionic/issues/23911)) ([9d87028](https://github.com/ionic-team/ionic/commit/9d87028e81723a0f1498c8cf231319676078eda0))
* **modal:** sheet animation works correctly if breakpoints value does not include 1 ([#23927](https://github.com/ionic-team/ionic/issues/23927)) ([414f246](https://github.com/ionic-team/ionic/commit/414f24685cbc67a7fff142b7786d33ce1cd67a0c))
* **modal:** sheet modal handle is now positioned correctly ([#23901](https://github.com/ionic-team/ionic/issues/23901)) ([58a4ba2](https://github.com/ionic-team/ionic/commit/58a4ba285389e45276df49a0b4a3412daa95e92c))
* **modal:** sheet modal now accounts for safe area ([#23884](https://github.com/ionic-team/ionic/issues/23884)) ([195d817](https://github.com/ionic-team/ionic/commit/195d8179676155315f8532636b6371dd2a63e4b9)), closes [#23874](https://github.com/ionic-team/ionic/issues/23874)


### Features

* **datetime:** add ability to select only month, year, or month and year ([#23913](https://github.com/ionic-team/ionic/issues/23913)) ([4ae44b7](https://github.com/ionic-team/ionic/commit/4ae44b7a236004738d593406d7b1236600bc6d95))
* **datetime:** add clear button ([#23920](https://github.com/ionic-team/ionic/issues/23920)) ([18765e7](https://github.com/ionic-team/ionic/commit/18765e7e39b9f205f47f394d26d6ecc4b53e17ef)), closes [#17482](https://github.com/ionic-team/ionic/issues/17482)
* **platform:** add ability to override platform detection methods ([#23915](https://github.com/ionic-team/ionic/issues/23915)) ([45cabae](https://github.com/ionic-team/ionic/commit/45cabae04bf9236cd069793fbf2ac8f68c372cc3)), closes [#19737](https://github.com/ionic-team/ionic/issues/19737)
* **react:** add custom elements bundle ([#23896](https://github.com/ionic-team/ionic/issues/23896)) ([c50d895](https://github.com/ionic-team/ionic/commit/c50d895370a56d0809019dc59fe32ec840b72f03))





# [6.0.0-beta.5](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.4...v6.0.0-beta.5) (2021-09-01)


### Bug Fixes

* **angular:** overlay interfaces are now properly exported ([#23847](https://github.com/ionic-team/ionic/issues/23847)) ([c925274](https://github.com/ionic-team/ionic/commit/c925274c3bb22532a323b2a07771d7448f7de542)), closes [#23846](https://github.com/ionic-team/ionic/issues/23846)
* **datetime:** prevent vertical page scroll on interaction ([#23780](https://github.com/ionic-team/ionic/issues/23780)) ([950350a](https://github.com/ionic-team/ionic/commit/950350a948320f889589a0c9d2ec9045637215e5)), closes [#23554](https://github.com/ionic-team/ionic/issues/23554)
* **item:** form validation states are now properly shown ([#23853](https://github.com/ionic-team/ionic/issues/23853)) ([5ca2ce9](https://github.com/ionic-team/ionic/commit/5ca2ce91971408218d7bdc52509ce61a6ebb46aa)), closes [#23733](https://github.com/ionic-team/ionic/issues/23733) [#23850](https://github.com/ionic-team/ionic/issues/23850)
* **overlays:** thrown errors are no longer suppressed ([#23831](https://github.com/ionic-team/ionic/issues/23831)) ([a212eb5](https://github.com/ionic-team/ionic/commit/a212eb52599e35d3706e2d3cef751e490e3a7259)), closes [#22724](https://github.com/ionic-team/ionic/issues/22724)


### Features

* **modal:** add bottom sheet functionality ([#23828](https://github.com/ionic-team/ionic/issues/23828)) ([12216d3](https://github.com/ionic-team/ionic/commit/12216d378df091e16fd77d271b107e819278481c)), closes [#21039](https://github.com/ionic-team/ionic/issues/21039)
* **popover:** add ability to pass event to present method ([#23827](https://github.com/ionic-team/ionic/issues/23827)) ([1d2ee92](https://github.com/ionic-team/ionic/commit/1d2ee92ca01b77bcf87c7783b50d59efcf0a402a)), closes [#23813](https://github.com/ionic-team/ionic/issues/23813)





# [6.0.0-beta.4](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.3...v6.0.0-beta.4) (2021-08-18)


### Bug Fixes

* **datetime:** reduce time presentation min height ([#23771](https://github.com/ionic-team/ionic/issues/23771)) ([bc4e826](https://github.com/ionic-team/ionic/commit/bc4e8267aa00e7f162cd01579d8d3adbf3cd7a83)), closes [#23690](https://github.com/ionic-team/ionic/issues/23690)
* **datetime:** text color on ios mode now accounts for color contrast ([#23729](https://github.com/ionic-team/ionic/issues/23729)) ([5980db4](https://github.com/ionic-team/ionic/commit/5980db44e5a765d15e681471325e916d566eca8d)), closes [#23723](https://github.com/ionic-team/ionic/issues/23723)
* **item:** highlight now appears above helper/error text ([#23763](https://github.com/ionic-team/ionic/issues/23763)) ([2995e33](https://github.com/ionic-team/ionic/commit/2995e337c8b4612a87eb7111224ec702494fd1d7)), closes [#23510](https://github.com/ionic-team/ionic/issues/23510)
* **toast:** ToastOptions interface now contains icon prop ([#23737](https://github.com/ionic-team/ionic/issues/23737)) ([fbd32ff](https://github.com/ionic-team/ionic/commit/fbd32ffb2633b17d71a34a8760386a319f2e2bca)), closes [#23736](https://github.com/ionic-team/ionic/issues/23736)
* **vue:** custom element internal properties are no longer overridden in vue 3.1.0 ([#23738](https://github.com/ionic-team/ionic/issues/23738)) ([ea39c70](https://github.com/ionic-team/ionic/commit/ea39c70b3ec78b2ea5ef64263e8528b543378784)), closes [#23539](https://github.com/ionic-team/ionic/issues/23539)
* **vue:** modal and popover components now correctly pass properties ([#23761](https://github.com/ionic-team/ionic/issues/23761)) ([578b906](https://github.com/ionic-team/ionic/commit/578b9062dd793c8526b80a769d94aa7aad8fe368)), closes [#23698](https://github.com/ionic-team/ionic/issues/23698)


### Features

* **action-sheet:** add data property to ActionSheetButton ([#23744](https://github.com/ionic-team/ionic/issues/23744)) ([30f8508](https://github.com/ionic-team/ionic/commit/30f8508296cfc8f8b1c03d04b24abfa184624200)), closes [#23700](https://github.com/ionic-team/ionic/issues/23700)
* **datetime:** add firstDayOfWeek property ([#23692](https://github.com/ionic-team/ionic/issues/23692)) ([ea348f0](https://github.com/ionic-team/ionic/commit/ea348f005aef7b2fda581a99338139f6fefcda63)), closes [#23556](https://github.com/ionic-team/ionic/issues/23556)
* **datetime:** add hourCycle property ([#23686](https://github.com/ionic-team/ionic/issues/23686)) ([6342fde](https://github.com/ionic-team/ionic/commit/6342fde56c7687703edd212b8383536c8b9a6400)), closes [#23661](https://github.com/ionic-team/ionic/issues/23661)





# [6.0.0-beta.3](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.2...v6.0.0-beta.3) (2021-08-04)


### Bug Fixes

* **list:** change inset border radius to match iOS 15 ([#23711](https://github.com/ionic-team/ionic/issues/23711)) ([fe2810b](https://github.com/ionic-team/ionic/commit/fe2810b227abc482e663b210cd89f29b76119ff5))
* **popover:** fix keyboard arrow navigation ([#23709](https://github.com/ionic-team/ionic/issues/23709)) ([f2e7a26](https://github.com/ionic-team/ionic/commit/f2e7a267973a06b50a0f6dcbba0a204930bccf69)), closes [#23512](https://github.com/ionic-team/ionic/issues/23512)
* **vue:** popover positioning is now correct with custom elements build ([#23680](https://github.com/ionic-team/ionic/issues/23680)) ([3a1a9cb](https://github.com/ionic-team/ionic/commit/3a1a9cbce45ad128c9ba87940535dabfa167fb9e))


### Features

* **toast:** add icon property to show icon at start of toast content ([#23596](https://github.com/ionic-team/ionic/issues/23596)) ([df24c8c](https://github.com/ionic-team/ionic/commit/df24c8c5ae0b493841c07c05e0d620fa4a90c05a)), closes [#23524](https://github.com/ionic-team/ionic/issues/23524)





# [6.0.0-beta.2](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.1...v6.0.0-beta.2) (2021-07-21)


### Bug Fixes

* **accordion:** value can now be set as string when using multiple is true ([#23581](https://github.com/ionic-team/ionic/issues/23581)) ([8f172de](https://github.com/ionic-team/ionic/commit/8f172de355bc7c910d600ce4d8446b04a6212545)), closes [#23550](https://github.com/ionic-team/ionic/issues/23550)
* **angular:** modal and popover now have correct props defined on angular component ([#23565](https://github.com/ionic-team/ionic/issues/23565)) ([e5a7b34](https://github.com/ionic-team/ionic/commit/e5a7b342623b159d41cc83e0a418fb3984ceb3a7))
* **datetime:** add keyboard year navigation ([#23585](https://github.com/ionic-team/ionic/issues/23585)) ([55bd1f7](https://github.com/ionic-team/ionic/commit/55bd1f749bac01cc691e16283728c42e755cc706)), closes [#21553](https://github.com/ionic-team/ionic/issues/21553) [#18122](https://github.com/ionic-team/ionic/issues/18122)
* **datetime:** selecting time now works correctly on firefox ([#23583](https://github.com/ionic-team/ionic/issues/23583)) ([4188964](https://github.com/ionic-team/ionic/commit/4188964dc8da2c46494245b81864ca6e305611f5)), closes [#23545](https://github.com/ionic-team/ionic/issues/23545)
* **datetime:** years displayed now more consistent with v5 datetime, max and min are now accounted for in MD mode ([#23616](https://github.com/ionic-team/ionic/issues/23616)) ([be219a2](https://github.com/ionic-team/ionic/commit/be219a2814800927e6328ff105616713003340b7)), closes [#23615](https://github.com/ionic-team/ionic/issues/23615)


### Features

* **breadcrumbs:** ionCollapsedClick event payload now contains references to collapsed breadcrumb elements ([#23611](https://github.com/ionic-team/ionic/issues/23611)) ([9ce57d2](https://github.com/ionic-team/ionic/commit/9ce57d2efb84130895a37e22e0fd7e5d713a9fa5)), closes [#23552](https://github.com/ionic-team/ionic/issues/23552)
* **datetime:** add showDefaultTimeLabel property and time-label slot ([#23577](https://github.com/ionic-team/ionic/issues/23577)) ([7ac0109](https://github.com/ionic-team/ionic/commit/7ac010943b2c9ad42a1833153ea16ccffd169b91)), closes [#23555](https://github.com/ionic-team/ionic/issues/23555)
* **datetime:** add size property ([#23649](https://github.com/ionic-team/ionic/issues/23649)) ([321341d](https://github.com/ionic-team/ionic/commit/321341d97dff98b76b69a1efce58923a80e92bc4)), closes [#23518](https://github.com/ionic-team/ionic/issues/23518)
* **range:** add support for customizing pin format ([#22972](https://github.com/ionic-team/ionic/issues/22972)) ([8f2c4f7](https://github.com/ionic-team/ionic/commit/8f2c4f73db167503cdf60222f42bcaadf905b401))
* **segment:** add keyboard navigation, add selectOnFocus property to control selection follow focus behavior ([#23590](https://github.com/ionic-team/ionic/issues/23590)) ([b6c53e5](https://github.com/ionic-team/ionic/commit/b6c53e539b0855fa95b0fe02e5fa74ce403b68b8)), closes [#23520](https://github.com/ionic-team/ionic/issues/23520)
* **select:** update popover interface to match MD spec on desktop, allow multiple values in popover interface ([#23474](https://github.com/ionic-team/ionic/issues/23474)) ([2c07a15](https://github.com/ionic-team/ionic/commit/2c07a1566b6f8570f7e12a55ca8f86d8fb8a968e)), closes [#23657](https://github.com/ionic-team/ionic/issues/23657) [#15500](https://github.com/ionic-team/ionic/issues/15500) [#12310](https://github.com/ionic-team/ionic/issues/12310)


### Performance Improvements

* remove shims for legacy browsers no longer supported in v6 ([#23592](https://github.com/ionic-team/ionic/issues/23592)) ([259b135](https://github.com/ionic-team/ionic/commit/259b1359dbd20d4f85036ae46901a051cd8fc98b))





# [6.0.0-beta.1](https://github.com/ionic-team/ionic/compare/v6.0.0-beta.0...v6.0.0-beta.1) (2021-07-01)


### Bug Fixes

* **accordion:** improved reliability of accordion animations ([#23531](https://github.com/ionic-team/ionic/issues/23531)) ([6fbd60b](https://github.com/ionic-team/ionic/commit/6fbd60b0df56dc927226474a1ffa322d979c563e)), closes [#23504](https://github.com/ionic-team/ionic/issues/23504)
* **content:** add touch-action manipulation for a11y zoom and pan ([#23534](https://github.com/ionic-team/ionic/issues/23534)) ([6ca1780](https://github.com/ionic-team/ionic/commit/6ca17805b8b1ea38d7fc16d091324da16a4193c6)), closes [#22805](https://github.com/ionic-team/ionic/issues/22805)
* **datetime:** scroll position no longer gets reset when using datetime in overlay ([#23543](https://github.com/ionic-team/ionic/issues/23543)) ([b735b58](https://github.com/ionic-team/ionic/commit/b735b587cda777ac481bb580c883d9734145f31e))
* **input, select, textarea:** change type of placeholder prop to string only ([#23500](https://github.com/ionic-team/ionic/issues/23500)) ([f3ae431](https://github.com/ionic-team/ionic/commit/f3ae4319bb64debab304973856a33e422ac910a1)), closes [#22976](https://github.com/ionic-team/ionic/issues/22976)
* **popover:** size property now works when providing only event ([#23532](https://github.com/ionic-team/ionic/issues/23532)) ([bdc1f23](https://github.com/ionic-team/ionic/commit/bdc1f2360d7795472cc242a86eb4376d05fa0bb7)), closes [#23528](https://github.com/ionic-team/ionic/issues/23528)
* **popover:** update animation to better match MD spec ([#23541](https://github.com/ionic-team/ionic/issues/23541)) ([bdb95b7](https://github.com/ionic-team/ionic/commit/bdb95b7b6dd798cbc6d1786ae54fa95ac1dfd096))
* **react:** export accordion and accordion group components ([#23497](https://github.com/ionic-team/ionic/issues/23497)) ([a664d42](https://github.com/ionic-team/ionic/commit/a664d4268dea8e84ab9e3b150043ac8f87fb53c7))
* **vue:** navigating between parameterized pages now results in page transition ([#23525](https://github.com/ionic-team/ionic/issues/23525)) ([e30b17c](https://github.com/ionic-team/ionic/commit/e30b17c5bbd1af6936a8d7a98d1f7a115073e029)), closes [#22662](https://github.com/ionic-team/ionic/issues/22662)


### Features

* **accordion-group:** add animated property to disable animations ([#23530](https://github.com/ionic-team/ionic/issues/23530)) ([9a60dd0](https://github.com/ionic-team/ionic/commit/9a60dd0ea7c55acf0fdd1161433e5b4ed40778f2))
* **action-sheet, alert:** add id to AlertButton and ActionSheetButton ([#18992](https://github.com/ionic-team/ionic/issues/18992)) ([9e24a0b](https://github.com/ionic-team/ionic/commit/9e24a0b49357a3a39ca89f026ff23271a365d935)), closes [#22959](https://github.com/ionic-team/ionic/issues/22959)
* **vue:** extend useIonRouter hook for programmatic navigation with animation control  ([#23499](https://github.com/ionic-team/ionic/issues/23499)) ([fc9e1b4](https://github.com/ionic-team/ionic/commit/fc9e1b4b361938e5644683c395a565be2de1eab9)), closes [#23450](https://github.com/ionic-team/ionic/issues/23450)


### BREAKING CHANGES

* **input, select, textarea:** Updated the `placeholder` property on `ion-input`, `ion-textarea`, and `ion-select` to have a type of `string | undefined`.





# [6.0.0-beta.0](https://github.com/ionic-team/ionic/compare/v5.6.10...v6.0.0-beta.0) (2021-06-23)


### Bug Fixes

* **accordion:** toggle icon now shows up in vue and react ([#23426](https://github.com/ionic-team/ionic/issues/23426)) ([c716617](https://github.com/ionic-team/ionic/commit/c7166179457a8e2c7e1702c5761bc6368dbd156f))
* **datetime:** changing time emits ionChange ([#23463](https://github.com/ionic-team/ionic/issues/23463)) ([b0cce36](https://github.com/ionic-team/ionic/commit/b0cce360c83ac564e053523cc31b32d1deaeda0c))
* **modal:** add additional padding to toolbars in iOS modal ([#23262](https://github.com/ionic-team/ionic/issues/23262)) ([a037b65](https://github.com/ionic-team/ionic/commit/a037b65aad5cfc0477322a8f36105b9009366ec2)), closes [#22778](https://github.com/ionic-team/ionic/issues/22778)
* **modal:** border radius is correctly set on card style modal ([#23461](https://github.com/ionic-team/ionic/issues/23461)) ([bccb8ad](https://github.com/ionic-team/ionic/commit/bccb8ad5fb5ec7f98a6cbfa62a403ecaca7fbdb6))
* **modal, popover:** overlays now automatically determine if they are inline ([#23434](https://github.com/ionic-team/ionic/issues/23434)) ([8dbe8ba](https://github.com/ionic-team/ionic/commit/8dbe8ba7bc26792c5024f81cf4752f5b78317492))
* **popover:** shadow parts now correctly added ([#23446](https://github.com/ionic-team/ionic/issues/23446)) ([e1a9613](https://github.com/ionic-team/ionic/commit/e1a96130ebab1e481e880f0f3876f421976f08d5))
* **popover:** update prop defaults, use correct delegate ([#23340](https://github.com/ionic-team/ionic/issues/23340)) ([960778a](https://github.com/ionic-team/ionic/commit/960778a36f6eb6318cc740c4f7a255107723b8fd))
* **searchbar:** showClearButton now defaults to 'always' for improved usability with screen readers ([#23475](https://github.com/ionic-team/ionic/issues/23475)) ([80f181d](https://github.com/ionic-team/ionic/commit/80f181d4846507ee6bd4150bb568fca9b6660428))
* **vue:** ensure webpack does not eliminate core css ([#23465](https://github.com/ionic-team/ionic/issues/23465)) ([ee3a00f](https://github.com/ionic-team/ionic/commit/ee3a00fde61b4d1d3168d34b3d23bb97dd154154))


### Code Refactoring

* **all:** update required browser, framework, and mobile platform versions for v6 ([#23443](https://github.com/ionic-team/ionic/issues/23443)) ([c842dd8](https://github.com/ionic-team/ionic/commit/c842dd88c98888b2afab08ac5e8bc57c2a4c2fbd))
* **angular:** remove Config.set() method ([#22918](https://github.com/ionic-team/ionic/issues/22918)) ([9e05891](https://github.com/ionic-team/ionic/commit/9e0589173607b3c0eff7794079123354c2eeaa1a))
* **header:** removed border from last toolbar when using collapsible large title ([#22891](https://github.com/ionic-team/ionic/issues/22891)) ([c72bc5d](https://github.com/ionic-team/ionic/commit/c72bc5dbd76cd3ce622a4b3cedcb7446a2819384)), closes [#22777](https://github.com/ionic-team/ionic/issues/22777)
* **ios:** update toolbar and tabbar default background colors ([#22852](https://github.com/ionic-team/ionic/issues/22852)) ([3d615cb](https://github.com/ionic-team/ionic/commit/3d615cb3c7b233b08b9da6ac04096e16bbb60bfc)), closes [#22780](https://github.com/ionic-team/ionic/issues/22780)
* **toast:** whitespace variable now defaults to normal ([#22866](https://github.com/ionic-team/ionic/issues/22866)) ([9b78689](https://github.com/ionic-team/ionic/commit/9b786899e550c391b9395c669f9bba8f39ac98aa))
* **vue:** drop support for "on" prefixed overlay events and bump minimum required version of vue to 3.0.6 ([#23229](https://github.com/ionic-team/ionic/issues/23229)) ([6fcb3a6](https://github.com/ionic-team/ionic/commit/6fcb3a62b1b12c5ded11179e83854592d4309bdf))
* **vue:** remove support for child routes nested inside of tabs ([#22919](https://github.com/ionic-team/ionic/issues/22919)) ([75458ac](https://github.com/ionic-team/ionic/commit/75458ac7fb95f56a6ec460f85cf7d7720ce0c070))


### Features

* **accordion:** add accordion and accordion-group components ([#22865](https://github.com/ionic-team/ionic/issues/22865)) ([073883a](https://github.com/ionic-team/ionic/commit/073883a0987149e9f6258ca43c46f5ed4bce0dc5)), closes [#17094](https://github.com/ionic-team/ionic/issues/17094)
* **breadcrumbs:** add breadcrumbs component ([#22701](https://github.com/ionic-team/ionic/issues/22701)) ([2f6b1e4](https://github.com/ionic-team/ionic/commit/2f6b1e4eea307c6f14345704e5824378ef079acb)), closes [#22770](https://github.com/ionic-team/ionic/issues/22770)
* **datetime:** add calendar picker ([#23416](https://github.com/ionic-team/ionic/issues/23416)) ([932d3ca](https://github.com/ionic-team/ionic/commit/932d3ca62f3e3ef08acb065ce6ec46faa3811f96)), closes [#19423](https://github.com/ionic-team/ionic/issues/19423)
* **item:** add helper text, error text, counter, shape, and fill mode ([#23354](https://github.com/ionic-team/ionic/issues/23354)) ([faefe97](https://github.com/ionic-team/ionic/commit/faefe97da6a9d5beff1183d10efd0df9c4e3ebd7)), closes [#19619](https://github.com/ionic-team/ionic/issues/19619)
* **modal:** modals can now be used inline ([#23341](https://github.com/ionic-team/ionic/issues/23341)) ([3be1c3d](https://github.com/ionic-team/ionic/commit/3be1c3dcd73e6039a89b19b409e63877cda37f6e)), closes [#20117](https://github.com/ionic-team/ionic/issues/20117) [#20263](https://github.com/ionic-team/ionic/issues/20263)
* **popover:** account for ionShadowTarget elements ([#23436](https://github.com/ionic-team/ionic/issues/23436)) ([0e38d42](https://github.com/ionic-team/ionic/commit/0e38d4276110dcd94db5adc3b6aee3b5b0befc5c))
* **popover:** add desktop support ([#23258](https://github.com/ionic-team/ionic/issues/23258)) ([a67a0fa](https://github.com/ionic-team/ionic/commit/a67a0fabb8249685bbe93ed862839e2b2e76cd5a)), closes [#21599](https://github.com/ionic-team/ionic/issues/21599)
* **popover:** popover can now be used inline ([#23231](https://github.com/ionic-team/ionic/issues/23231)) ([308fa1c](https://github.com/ionic-team/ionic/commit/308fa1c0dd054cfc2ea54d2edc99e7a4b549f6f0))
* **slides:** add IonicSwiper modules, deprecate ion-slides, and add link to migration ([#23447](https://github.com/ionic-team/ionic/issues/23447)) ([623c84a](https://github.com/ionic-team/ionic/commit/623c84ab082668a996c654e18ffc9768f68b85dd))
* **spinner:** add lines-sharp, lines-sharp-small, update styles for ios 14 ([#22397](https://github.com/ionic-team/ionic/issues/22397)) ([2a5b272](https://github.com/ionic-team/ionic/commit/2a5b272a329bbad1ca07705f84f0fd06e3ef32ad))
* **vue:** add custom elements bundle ([#23458](https://github.com/ionic-team/ionic/issues/23458)) ([dc48a9f](https://github.com/ionic-team/ionic/commit/dc48a9f1a2dff8a2d644112bbe1df8b0b6811848))


### BREAKING CHANGES

* **searchbar:** The `showClearButton` property on `ion-searchbar` now defaults to `'always'`.
* **datetime:** The `ion-datetime` component has been revamped to use a new calendar style. As a result, some APIs have been removed. See https://github.com/ionic-team/ionic-framework/blob/master/BREAKING.md for more details.
* **all:** Browser, JS Framework, and mobile platform minimum required versions have been updated.
* **popover:** Converted `ion-popover` to use the Shadow DOM.
* **vue:** - Dropped support for prefixed overlay events in favor of non prefixed events (I.e. `@onDidDismiss` becomes `@didDismiss`).
- Minimum required version of Vue is now Vue v3.0.6 or newer.
* **vue:** Support for child routes nested inside of tabs has been removed to better conform to Vue Router's best practices. Additional routes should be written as sibling routes with the parent tab as the path prefix.
* **angular:** The `Config.set()` method has been removed. See https://ionicframework.com/docs/angular/config for examples on how to set config globally, per-component, and per-platform.
* **ios:** The tab bar and toolbar default background colors have been updated to better reflect the latest iOS styles.
* **header:** The last toolbar in the header with a collapsible large title no longer has a border.
* **toast:** The `--white-space` CSS Variable now defaults to `normal`.
