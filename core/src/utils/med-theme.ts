import { Color, CssClassMap } from '../interface';

/**
 *  Generates the color classes for the component.
 */
export const generateMedColor = (
  color: Color | undefined | null,
  cssClassMap: CssClassMap): CssClassMap => {

  if (typeof color === 'string' && color.length > 0) {
    const colorIdentifier = color.split('-');

    if (colorIdentifier[0] === 'neutral') {
      return {
        'med-color-neutral': true,
        [`med-color-${color}`]: true,
        ...cssClassMap
      }
    } else if (colorIdentifier[0] === 'fb') {
      return {
        'med-color-feedback': true,
        [`med-color-${color}`]: true,
        ...cssClassMap
      }
    } else {
      return {
        'med-color': true,
        [`med-color-${color}`]: true,
        ...cssClassMap
      }
    }
  } else {
    return cssClassMap;
  }
};
