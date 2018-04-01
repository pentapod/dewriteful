'use strict';

const C_RT_START = '<<';
const C_RT_END = '>>';
const C_DELIMITER = '|';
const L_RT_START = C_RT_START.length;
const L_RT_END = C_RT_END.length;
const L_DELIMITER = C_DELIMITER.length;

// ref: https://github.com/WaniKani/WanaKana
const KANJI_START = 0x4e00;
const KANJI_END = 0x9faf;

module.exports = attacher;

function isKanji(char) {
  if (!char) {
    return false;
  }
  const code = char.charCodeAt(0);
  return KANJI_START <= code && code <= KANJI_END;
}

function attacher() {
  const { Parser } = this;
  if (!Parser) {
    return;
  }
  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods;

  _inlineTokenizer.locator = _locator;
  inlineTokenizers.ruby = _inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ruby');

  function _inlineTokenizer(eat, value, silent) {
    if (!this.options.ruby) {
      return;
    }

    const self = this;
    const rtStartIndex = value.indexOf(C_RT_START);
    if (rtStartIndex <= 0) {
      return;
    }
    const rtEndIndex = value.indexOf(C_RT_END, rtStartIndex);
    if (rtEndIndex < 0) {
      return;
    }

    const hasDelimiter = value.indexOf(C_DELIMITER) === 0;
    if (hasDelimiter) {
      if (value.lastIndexOf(C_DELIMITER, rtStartIndex) > 0) {
        // text starts with delimiter, but another delimiter contains before rtStart
        return false;
      }
    }

    let i = (hasDelimiter ? L_DELIMITER : 0) - 1;
    let rubyRef = '';
    while (++i < rtStartIndex) {
      const char = value.charAt(i);
      if (char === '\n' || (!hasDelimiter && !isKanji(char))) {
        return;
      }
      rubyRef += char;
    }

    let rubyText = '';
    i += L_RT_START - 1;
    while (++i < rtEndIndex) {
      const char = value.charAt(i);
      if (char === '\n') {
        return;
      }
      rubyText += char;
    }

    if (rubyRef.length === 0) {
      // cancel ruby when rtStart is placed next to delimiter
      const now = eat.now();
      now.column += L_DELIMITER + L_RT_START;
      now.offset += L_DELIMITER + L_RT_START;
      let children = self.tokenizeInline(rubyText, now);
      if (silent) {
        return children;
      }

      let pos = rtStartIndex + L_RT_START;
      eat(value.slice(0, pos))({
        type: 'text',
        value: C_RT_START,
      });
      children.forEach(c => {
        const { start, end } = c.position;
        eat(value.slice(pos, pos + (end.offset - start.offset)))(c);
        pos += end.offset - start.offset;
      });
      return eat(value.slice(rtEndIndex, rtEndIndex + L_RT_END))({
        type: 'text',
        value: C_RT_END,
      });
    }

    if (silent) {
      return true;
    }
    const now = eat.now();
    now.column += hasDelimiter ? L_DELIMITER : 0;
    now.offset += hasDelimiter ? L_DELIMITER : 0;
    return eat(value.slice(0, rtEndIndex + L_RT_END))({
      type: 'ruby',
      rubyText,
      children: self.tokenizeInline(rubyRef, now),
      data: {
        hName: 'ruby',
      },
    });
  }

  function _locator(value, fromIndex) {
    if (!this.options.ruby) {
      return;
    }

    let startIndex = -1;
    let inKanji = false;

    let rtStartIndex = value.indexOf(C_RT_START, fromIndex);
    if (rtStartIndex < 0) {
      return -1;
    }
    let delimiterIndex = value.indexOf(C_DELIMITER, fromIndex);
    for (let i = fromIndex; i < value.length; i++) {
      const char = value.charAt(i);
      if (i === rtStartIndex) {
        if (delimiterIndex >= 0 && delimiterIndex < i) {
          return delimiterIndex;
        } else if (inKanji) {
          return startIndex;
        } else {
          rtStartIndex = value.indexOf(C_RT_START, i + 1);
          if (rtStartIndex < 0) {
            return -1;
          }
          const idx = value.indexOf(C_DELIMITER, i + 1);
          if (idx >= 0 && idx < rtStartIndex) {
            delimiterIndex = idx;
          }
        }
      } else if (i === delimiterIndex) {
        const idx = value.indexOf(C_DELIMITER, i + 1);
        if (idx >= 0 && idx < rtStartIndex) {
          delimiterIndex = idx;
        }
      }

      if (isKanji(char)) {
        startIndex = startIndex < 0 ? i : startIndex;
        inKanji = true;
      } else {
        startIndex = -1;
        inKanji = false;
      }
    }
    return -1;
  }
}
