const variablesPrefix = 'ionic';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function generateShadowValue(shadow) {
  return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
}

function generateFontFamilyValue(prop, variableType = 'css') {
  const propName = prop.name.split('-').slice(0, -1).join('-');
  return variableType === 'scss'
    ? `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, "${prop.value}", sans-serif);`
    : `--${variablesPrefix}-${propName}: "${prop.value}", sans-serif;`;
}

function generateTypographyValue(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  return `
  $${variablesPrefix}-${prop.name}: (
    font-family: $ionic-font-family,
    font-size: $ionic-font-size-${fontSizeMap[typography.fontSize]},
    font-weight: $ionic-font-weight-${fontWeightMap[typography.fontWeight]},
    letter-spacing: $ionic-letter-spacing-${letterSpacingMap[typography.letterSpacing] || 0},
    line-height: $ionic-line-height-${lineHeightMap[typography.lineHeight]},
    text-transform: ${typography.textTransform},
    text-decoration: ${typography.textDecoration}
  );
  `;
}

function createTypeMap(dictionary, type) {
  return Object.fromEntries(
    Object.entries(dictionary.properties[type]).map(([key, token]) => [token.value, token.attributes.type])
  );
}

function generateRgbValue(prop) {
  const rgb = hexToRgb(prop.value);
  return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${prop.value});${
    rgb
      ? `\n$${variablesPrefix}-${prop.name}-rgb: var(--${variablesPrefix}-${prop.name}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`
      : ``
  }`;
}

function generateTypographyUtilityClass(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  return `
  .${variablesPrefix}-${prop.name} {
    font-family: $ionic-font-family;
    font-size: $ionic-font-size-${fontSizeMap[typography.fontSize]};
    font-weight: $ionic-font-weight-${fontWeightMap[typography.fontWeight]};
    letter-spacing: $ionic-letter-spacing-${letterSpacingMap[typography.letterSpacing] || 0};
    line-height: $ionic-line-height-${lineHeightMap[typography.lineHeight]};
    text-transform: ${typography.textTransform};
    text-decoration: ${typography.textDecoration};
  };
  `;
}

function generateColorUtilityClasses(prop, className) {
  return `.${variablesPrefix}-${className} {\n  color: $ionic-${prop.name};\n}
  .${variablesPrefix}-background-${className} {\n  background-color: $ionic-${prop.name};\n}`;
}

function generateFontUtilityClass(prop, className) {
  let fontAttribute;
  switch (prop.attributes.type) {
    case 'size':
      fontAttribute = 'font-size';
      break;
    case 'weight':
      fontAttribute = 'font-weight';
      break;
    case 'line-height':
      fontAttribute = 'line-height';
      break;
    case 'letter-spacing':
      fontAttribute = 'letter-spacing';
      break;
  }
  return `.${variablesPrefix}-${className} {\n  ${fontAttribute}: $ionic-${prop.name};\n}`;
}

function generateSpaceUtilityClasses(prop, className) {
  return `.${variablesPrefix}-margin-${className} {\n  --margin-start: #{$ionic-${prop.name}};\n  --margin-end: #{$ionic-${prop.name}};\n  --margin-top: #{$ionic-${prop.name}};\n  --margin-bottom: #{$ionic-${prop.name}};\n\n  @include margin($ionic-${prop.name});\n};\n
  .${variablesPrefix}-padding-${className} {\n  --padding-start: #{$ionic-${prop.name}};\n  --padding-end: #{$ionic-${prop.name}};\n  --padding-top: #{$ionic-${prop.name}};\n  --padding-bottom: #{$ionic-${prop.name}};\n\n  @include padding($ionic-${prop.name});\n};\n`;
}

module.exports = {
  variablesPrefix,
  hexToRgb,
  generateShadowValue,
  generateFontFamilyValue,
  generateTypographyValue,
  generateRgbValue,
  generateColorUtilityClasses,
  generateFontUtilityClass,
  generateSpaceUtilityClasses,
  generateTypographyUtilityClass,
};
