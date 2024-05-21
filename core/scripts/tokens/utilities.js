const variablesPrefix = 'ionic'; // varuable that holds the prefix used on all css and scss variables generated

// Method to translate an hex color value to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Method to generated a valid box-shadow value from a shadow Design Token structure
function generateShadowValue(shadow) {
  return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
}

// Method to generated a valid font-family value from a font-family Design Token structure
function generateFontFamilyValue(prop, variableType = 'css') {
  // Remove the last word from the token, as it contains the name of the font, which we don't want to be included on the generated variables
  const propName = prop.name.split('-').slice(0, -1).join('-');
  return variableType === 'scss'
    ? `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, "${prop.value}", sans-serif);`
    : `--${variablesPrefix}-${propName}: "${prop.value}", sans-serif;`;
}

// Method to generated a typography based scss map from a typography Design Token structure
function generateTypographyValue(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  // This exact format is needed so that it compiles the tokens with the expected lint rules
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

// Method to be reused on the others methods of this file, to abstract the need to loop across all tokens from a given type
function createTypeMap(dictionary, type) {
  return Object.fromEntries(
    Object.entries(dictionary.properties[type]).map(([key, token]) => [token.value, token.attributes.type])
  );
}

// Method to generate a rgb color value, based on a color Design Token
function generateRgbValue(prop) {
  const rgb = hexToRgb(prop.value);
  let rgbDeclaration = '';

  // If the token is color, also add a rgb variable using the same color
  if (rgb) {
    rgbDeclaration = `\n$${variablesPrefix}-${prop.name}-rgb: var(--${variablesPrefix}-${prop.name}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`;
  }

  return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${prop.value});${rgbDeclaration}`;
}

// Method to generated a typography based css utility-class from a typography Design Token structure
function generateTypographyUtilityClass(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  // This exact format is needed so that it compiles the tokens with the expected lint rules
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

// Method to generated a color based css utility-class from a color Design Token structure
function generateColorUtilityClasses(prop, className) {
  return `.${variablesPrefix}-${className} {\n  color: $ionic-${prop.name};\n}
  .${variablesPrefix}-background-${className} {\n  background-color: $ionic-${prop.name};\n}`;
}

// Method to generated a font based css utility-class from a font Design Token structure
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

// Method to generate a margin or padding based css utility-class from a space Design Token structure
function generateSpaceUtilityClasses(prop, className) {
  // This exact format is needed so that it compiles the tokens with the expected lint rules
  const marginPaddingTemplate = (type) => `
.${variablesPrefix}-${type}-${className} {
  --${type}-start: #{$ionic-${prop.name}};
  --${type}-end: #{$ionic-${prop.name}};
  --${type}-top: #{$ionic-${prop.name}};
  --${type}-bottom: #{$ionic-${prop.name}};

  @include ${type}($ionic-${prop.name});
};`;

  return `${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
}

// Export all methods to be used on the tokens.js script
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
