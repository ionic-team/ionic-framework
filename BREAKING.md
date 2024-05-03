# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 9.x](#version-9x)
- [Version 8.x](./BREAKING_ARCHIVE/v8.md)
- [Version 7.x](./BREAKING_ARCHIVE/v7.md)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 9.x

- [Components](#version-9x-components)
  - [Button](#version-9x-button)
  - [Card](#version-9x-card)
  - [Chip](#version-9x-chip)

<h2 id="version-9x-components">Components</h2>

<h4 id="version-9x-button">Button</h4>

- The `border-radius` of the `ios` and `md` button now defaults to `6px` and `999px` instead of `14px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"` for `md` and override the `--border-radius` CSS variable for `ios` to `14px`, or set it to a different value entirely.

<h4 id="version-9x-card">Card</h4>

- The `border-radius` of the `ios` and `md` card now defaults to `14px` and `12px` instead of `8px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"`, or override the `--border-radius` CSS variable to specify a different value.

<h4 id="version-9x-chip">Chip</h4>

- The `border-radius` of the `ios` and `md` chip now defaults to `10px` and `8px`, respectively, instead of `16px` in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"round"`, or override the `--border-radius` CSS variable to specify a different value.
