// Media Query Functions
// -----------------------------------------------------

export const SIZE_TO_MEDIA: any = {
  'xs': '(min-width: 0px)',
  'sm': '(min-width: 576px)',
  'md': '(min-width: 768px)',
  'lg': '(min-width: 992px)',
  'xl': '(min-width: 1200px)',
};

// Check if the window matches the media query
// at the breakpoint passed
// e.g. isMatch('sm') => true if screen width exceeds 576px
export function isMatch(breakpoint: string | undefined) {
  if (!breakpoint) {
    return true;
  }
  const mediaQuery = SIZE_TO_MEDIA[breakpoint];
  if (mediaQuery && matchMedia(mediaQuery)) {
    const media = matchMedia(mediaQuery);
    return media.matches;
  }
  return false;
}
