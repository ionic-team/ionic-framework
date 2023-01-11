"native" refers to this sample: https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-manual

### Tabbing to Segment Button

|                          | native                                           | Ionic                                            |
| ------------------------ | ------------------------------------------------ | ------------------------------------------------ |
| VoiceOver macOS - Chrome | BOOKMARKS, tab, 1 of 3, Tab Options, tab group   | BOOKMARKS, tab, 1 of 1, Tab Options, tab group   |
| VoiceOver macOS - Safari | BOOKMARKS, tab, 1 of 3, Tab Options, tab group   | BOOKMARKS, tab, 1 of 3, Tab Options, tab group   |
| VoiceOver iOS            | Bookmarks, tab, 1 of 3                           | Bookmarks, tab, 1 of 3                           |
| Android TalkBack         | Bookmarks, tab                                   | Bookmarks, tab                                   |
| Windows NVDA             | Tab Options, tab control, BOOKMARKS, tab, 1 of 3 | Tab Options, tab control, BOOKMARKS, tab, 1 of 3 |

### Selecting Segment Button

|                          | native                                                   | Ionic                    |
| ------------------------ | -------------------------------------------------------- | ------------------------ |
| VoiceOver macOS - Chrome | BOOKMARKS, selected, tab, 1 of 3, Tab Options, tab group | BOOKMARKS, selected, tab, 1 of 1, Tab Options, tab group |
| VoiceOver macOS - Safari | BOOKMARKS, selected, tab, 1 of 3, Tab Options, tab group | BOOKMARKS, selected, tab, 1 of 3, Tab Options, tab group |
| VoiceOver iOS            | selected, Bookmarks, tab, 1 of 3                         | selected, Bookmarks, tab, 1 of 3 |
| Android TalkBack         | selected                                                 | selected                       |
| Windows NVDA             | BOOKMARKS, tab, 1 of 3, selected                         | BOOKMARKS, tab, 1 of 3, selected                       |

Note: The `aria-label` for tablist is typically only read on the first interaction.

VoiceOver + Chrome announces the wrong tab count due to the `role="tab"` being in the Shadow DOM: https://bugs.chromium.org/p/chromium/issues/detail?id=1405462
