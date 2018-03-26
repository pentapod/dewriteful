'use strict';

/*
 * id and class of HTML5 can use any character excepting space characters.
 * However, it defines some characters as invalid and does not parse them to avoid confusion.
 * List of invalid character is derived from github-slugger.
 * https://github.com/Flet/github-slugger/blob/master/index.js
 */
function parseAttributeNotation(text) {
  const invalidRe = /[\u2000-\u206F\u2E00-\u2E7F\\'!"$%&()*+,/;<=>?@[\]^`{|}~]/;

  if (typeof text !== 'string') {
    throw new Error('Parsing text is not a string.');
  }
  if (text.match(invalidRe)) {
    throw new Error(`Parsing text includes invalid format: ${text}`);
  }

  const ret = {
    id: null,
    class: [],
  };
  for (let frag of text.trim().split(/\s+/)) {
    if (frag[0] === '#' && frag.length > 1) {
      ret.id = frag.slice(1);
    } else if (frag[0] === '.' && frag.length > 1) {
      const cls = frag.slice(1);
      if (ret.class.indexOf(cls) < 0) {
        ret.class.push(cls);
      }
    } else {
      throw new Error(`Parsing text includes invalid format: ${text}`);
    }
  }
  return ret;
}

module.exports = {
  parseAttributeNotation,
};
