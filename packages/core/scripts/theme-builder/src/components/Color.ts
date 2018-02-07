interface RGB {
  r: number,
  g: number,
  b: number
}

interface HSL {
  h: number,
  s: number,
  l: number
}


export declare interface ColorStep {
  id: string,
  color: Color
}

export declare interface ColorStepDefinition {
  color?: Color,
  increments: number[]
}

function componentToHex (c) {
  const hex = c.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
}

function expandHex (hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
    return r + r + g + g + b + b;
  });

  return `#${hex.replace('#', '')}`;
}

function hexToRGB (hex: string): RGB {
  hex = expandHex(hex);
  hex = hex.replace('#', '');
  const intValue: number = parseInt(hex, 16);

  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };
}

function hslToRGB ({h, s, l}: HSL): RGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  if (s == 0) {
    return {
      r: l,
      g: l,
      b: l
    };
  }

  const hue2rgb = function hue2rgb (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    },
    q = l < 0.5 ? l * (1 + s) : l + s - l * s,
    p = 2 * l - q,
    r = hue2rgb(p, q, h + (1 / 3)),
    g = hue2rgb(p, q, h),
    b = hue2rgb(p, q, h - (1 / 3));

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function mixColors (color: Color, mixColor: Color, weight: number = .5): RGB {
  const colorRGB: RGB = color.rgb,
    mixColorRGB: RGB = mixColor.rgb,
    mixColorWeight = 1 - weight;

  return {
    r: Math.round(weight * mixColorRGB.r + mixColorWeight * colorRGB.r),
    g: Math.round(weight * mixColorRGB.g + mixColorWeight * colorRGB.g),
    b: Math.round(weight * mixColorRGB.b + mixColorWeight * colorRGB.b)
  };
}

function rgbToHex ({r, g, b}: RGB) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbToHSL ({r, g, b}: RGB): HSL {
  r = Math.max(Math.min(r / 255, 1), 0);
  g = Math.max(Math.min(g / 255, 1), 0);
  b = Math.max(Math.min(b / 255, 1), 0);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2;
  let d, h, s;

  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = h / 6;
  } else {
    h = s = 0;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToYIQ ({r, g, b}: RGB): number {
  return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

export class Color {
  readonly hex: string;
  readonly rgb: RGB;
  readonly hsl: HSL;
  readonly yiq: number;

  public static isColor (value: string): Boolean {
    if (/rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/.test(value)) return true;

    return /(^#[0-9a-fA-F]+)/.test(value.trim());
  }

  constructor (value: string | RGB | HSL) {
    if (typeof(value) === 'string' && /rgb\(/.test(value)) {
      const matches = /rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/.exec(value);
      value = {r: parseInt(matches[0]), g: parseInt(matches[1]), b: parseInt(matches[2])};
    } else if (typeof(value) === 'string' && /hsl\(/.test(value)) {
      const matches = /hsl\((\d{1,3}), ?(\d{1,3}%), ?(\d{1,3}%)\)/.exec(value);
      value = {h: parseInt(matches[0]), s: parseInt(matches[1]), l: parseInt(matches[2])};
    }


    if (typeof(value) === 'string') {
      value = value.replace(/\s/g, '');
      this.hex = expandHex(value);
      this.rgb = hexToRGB(this.hex);
      this.hsl = rgbToHSL(this.rgb);
    } else if ('r' in value && 'g' in value && 'b' in value) {
      this.rgb = <RGB>value;
      this.hex = rgbToHex(this.rgb);
      this.hsl = rgbToHSL(this.rgb);
    } else if ('h' in value && 's' in value && 'l' in value) {
      this.hsl = <HSL>value;
      this.rgb = hslToRGB(this.hsl);
      this.hex = rgbToHex(this.rgb);
    } else {
      return null;
    }

    this.yiq = rgbToYIQ(this.rgb);
  }

  contrast (threshold: number = 128): Color {
    return new Color((this.yiq >= threshold ? '#000' : '#fff'));
  }

  shiftLightness (percent: number): Color {
    const hsl: HSL = Object.assign({}, this.hsl, {
      l: this.hsl.l * percent
    });

    return new Color(hsl);
  }

  tint (percent: number = .1): Color {
    percent = 1 + percent;
    return this.shiftLightness(percent);
  }

  shade (percent: number = .1): Color {
    percent = 1 - percent;
    return this.shiftLightness(percent);
  }

  steps (from: ColorStepDefinition = {increments: [.2, .3, .5, .75]}): ColorStep[] {
    const steps: ColorStep[] = [],
      mixColor: Color = from.color || new Color((this.yiq > 128 ? '#000' : '#fff'));

    for (let i = 1; i <= from.increments.length; i++) {
      const {r, g, b} = mixColors(this, mixColor, from.increments[i - 1]);
      steps.push({
        id: (i * 100).toString(),
        color: new Color({r,g,b})
      });
    }

    return steps;
  }

  toList (): string {
    const {r, g, b}: RGB = this.rgb;
    return `${r},${g},${b}`;
  }
}
