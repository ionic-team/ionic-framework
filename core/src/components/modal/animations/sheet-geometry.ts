import { getIonMode } from '@global/ionic-global';
import { getElementRoot } from '@utils/helpers';

// The enter animation keeps its fill until dismissal. Explicitly override only
// properties this feature previously owned when a responsive inset becomes zero.
const insetSheets = new WeakSet<HTMLElement>();

/**
 * Keep the visible sheet edge and its hit area together throughout a gesture.
 * The full-height wrapper still defines Ionic's breakpoint/drag coordinate space.
 * Only its presentation is scaled and clipped; content scrolling keeps its existing
 * expandToScroll contract.
 */
export const getSheetWrapperKeyframes = (baseEl: HTMLElement, from: number, to: number) => {
  const wrapper = getElementRoot(baseEl).querySelector<HTMLElement>('.modal-wrapper');
  const value = getComputedStyle(baseEl).getPropertyValue('--sheet-inset').trim();
  let inset = 0;
  if (getIonMode(baseEl) === 'ios' && value) {
    // Resolve calc()/relative lengths the same way as modal safe-area values.
    const probe = baseEl.ownerDocument.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;padding-top:var(--sheet-inset,0px)';
    baseEl.appendChild(probe);
    inset = parseFloat(getComputedStyle(probe).paddingTop) || 0;
    probe.remove();
  }
  const width = wrapper?.clientWidth ?? 0;
  const height = wrapper?.clientHeight ?? 0;
  const points = [from, to];
  const plainFrames = () =>
    points.map((point, offset) => ({
      offset,
      transform: `translateY(${(1 - point) * 100}%)`,
      ...(insetSheets.has(baseEl) ? { clipPath: 'none', transformOrigin: 'center top' } : {}),
    }));

  if (getIonMode(baseEl) !== 'ios' || !Number.isFinite(inset) || inset <= 0 || width <= inset * 2 || height <= 0) {
    return plainFrames();
  }

  insetSheets.add(baseEl);
  const breakpoints = (baseEl as HTMLIonModalElement).breakpoints ?? [];
  const lastPartial = Math.max(0, ...breakpoints.filter((point) => point > 0 && point < 1));
  // Preserve the inset at every partial detent; remove it over the final stretch to 1.
  const hasFullDetent = breakpoints.includes(1);
  if (hasFullDetent && lastPartial > Math.min(from, to) && lastPartial < Math.max(from, to)) {
    points.splice(1, 0, lastPartial);
  }

  return points.map((point, index) => {
    const fraction = hasFullDetent ? Math.min(1, Math.max(0, (1 - point) / (1 - lastPartial))) : 1;
    const edge = inset * fraction;
    const scale = 1 - (edge * 2) / width;
    // Scaling around the visible top shortens the sheet. Compensate to keep its
    // visible bottom exactly `edge` pixels above its original bottom edge.
    const y = (1 - point) * height + point * height * (1 - scale) - edge;
    const bottomRadius = `calc(var(--border-radius, 0px) * ${fraction})`;
    return {
      offset: from === to ? index : (point - from) / (to - from),
      transform: `translateY(${y}px) scale(${scale})`,
      transformOrigin: 'center top',
      clipPath: `inset(0px 0px ${
        (1 - point) * 100
      }% 0px round var(--border-radius, 0px) var(--border-radius, 0px) ${bottomRadius} ${bottomRadius})`,
    };
  });
};
