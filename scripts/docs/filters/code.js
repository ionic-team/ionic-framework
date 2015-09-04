var encoder = new require('node-html-encoder').Encoder();

function code(str, inline, lang) {
  // Encode any HTML entities in the code string
  str = encoder.htmlEncode(str, true);

  // If a language is provided then attach a CSS class to the code element
  lang = lang ? ' class="lang-' + lang + '"' : '';

  str = '<code' + lang + '>' + str + '</code>';

  // If not inline then wrap the code element in a pre element
  if ( !inline ) {
    str = '<pre>' + str + '</pre>';
  }

  return str;
};

module.exports = {
  name: 'code',
  process: function(str, lang) {
    return code(str, true, lang);
  }
};
