import { icons } from '@phosphor-icons/core';
import { h } from '@stencil/core';

/**
 * Returns the Unicode glyph character for a Phosphor icon class name.
 * e.g. 'ph-caret-left' → the character at codepoint 0xe138
 *
 * @phosphor-icons/core exposes a stable `codepoint` field (since v2.1.0).
 * Using String.fromCodePoint avoids CSS class selectors entirely, which means
 * glyphs render correctly inside shadow DOM without needing to pierce it.
 */
const getPhosphorChar = (ionicIconClass: string): string => {
  const name = ionicIconClass.replace(/^ph-/, '');
  const entry = icons.find((i) => i.name === name);
  return entry ? String.fromCodePoint(entry.codepoint) : '';
};

/**
 * Renders a Phosphor icon font glyph for the ionic theme, or delegates to
 * ion-icon (SVG) for ios/md themes.
 *
 * Passing `null` for `ionicIconClass` forces SVG for that specific icon regardless
 * of the theme — use this when the caller has supplied a custom SVG that must not
 * be replaced by a glyph.
 *
 * The ionic theme renders an <i> element with:
 *   - font-family: "Phosphor" as an inline style (works inside shadow DOM)
 *   - the glyph Unicode character as text content (no ::before CSS needed)
 *
 * Usage:
 *   renderIcon(theme, 'ph-caret-left', caretLeftSvg, { part: 'icon', flipRtl: true })
 *   renderIcon(theme, null, customSvg, { part: 'icon' }) // always SVG
 */
export const renderIcon = (
  theme: string,
  /** Phosphor CSS class name e.g. 'ph-caret-left', or null to force SVG. */
  ionicIconClass: string | null,
  /** SVG src / ionicons icon object used when theme is not 'ionic'. */
  svgIcon: string,
  props: {
    part?: string;
    class?: Record<string, boolean>;
    flipRtl?: boolean;
    lazy?: boolean;
  } = {}
) => {
  const { part, class: cls, flipRtl = false, lazy = false } = props;
  console.log('renderIcon theme:', theme);

  if (ionicIconClass !== null && theme === 'ionic') {
    return (
      <i
        style={{ fontFamily: 'Phosphor', fontStyle: 'normal' }}
        class={{
          ...(cls || {}),
          'flip-rtl': flipRtl,
        }}
        part={part}
        aria-hidden="true"
      >
        {getPhosphorChar(ionicIconClass)}
      </i>
    );
  }

  return (
    <ion-icon
      icon={svgIcon}
      part={part}
      class={cls}
      aria-hidden="true"
      lazy={lazy}
      flip-rtl={flipRtl}
    />
  );
};
