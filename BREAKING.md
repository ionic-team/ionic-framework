# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 8.x](#version-8x)
- [Version 7.x](./BREAKING_ARCHIVE/v7.md)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 8.x

- [Browser and Platform Support](#version-8x-browser-platform-support)
- [Components](#version-8x-components)
  - [Content](#version-8x-content)
  - [Datetime](#version-8x-datetime)

<h2 id="version-8x-browser-platform-support">Browser and Platform Support</h2>

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic 8.

**Minimum Browser Versions**
| Desktop Browser | Supported Versions |
| --------------- | ----------------- |
| Chrome          | 89+               |
| Safari          | 15+               |
| Firefox         | 75+               |
| Edge            | 89+               |

**Minimum JavaScript Framework Versions**
| Framework | Supported Version     |
| --------- | --------------------- |
| Angular   | 16+                   |
| React     | 17+                   |
| Vue       | 3.0.6+                |

**Minimum Mobile Platform Versions**
| Platform | Supported Version      |
| -------- | ---------------------- |
| iOS      | 15+                    |
| Android  | 5.1+ with Chromium 89+ |

<h2 id="version-8x-components">Components</h2>

<h4 id="version-8x-content">Content</h4>

- Content no longer sets the `--background` custom property when the `.outer-content` class is set on the host.

<h4 id="version-8x-content">Datetime</h4>

- The CSS shadow part for `month-year-button` has been changed to target a `button` element instead of `ion-item`. Developers should verify their UI renders as expected for the month/year toggle button inside of `ion-datetime`.
   - Developers using the CSS variables available on `ion-item` will need to migrate their CSS to use CSS properties. For example:
      ```diff
      ion-datetime::part(month-year-button) {
      -  --background: red;

      +  background: red;
      }
      ```