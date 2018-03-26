'use strict';

const slugs = require('github-slugger')();
const visit = require('unist-util-visit');
const toString = require('mdast-util-to-string');
const { parseAttributeNotation } = require('../../util');

const ATTR_START = '{';
const ATTR_END = '}';
const C_TAB = '\t';
const C_SPACE = ' ';
const C_HASH = '#';

module.exports = attacher;

function attacher() {
  const { Parser } = this;
  const parser = Parser && Parser.prototype.blockTokenizers;

  if (parser && parser.atxHeading) {
    parser.atxHeading = factory(parser.atxHeading);
  }

  return transformer;

  function transformer(tree, file) {
    slugs.reset();

    // 'parserOptions' may be derived from remark-dewriteful-config
    const options = tree.parserOptions;
    if (typeof options !== 'undefined') {
      if (!options.headerAttribute) {
        return;
      }
    }

    visit(tree, 'heading', function(node) {
      let id = null;
      let cls = [];
      const headingAttr = parseAttribute(node);
      if (headingAttr) {
        // register id to slugger
        if (headingAttr.id) {
          slugs.slug(headingAttr.id);
        }
        id = headingAttr.id;
        cls = headingAttr.class;
      }
      if (!id) {
        id = slugs.slug(toString(node));
      }

      if (!node.data) {
        node.data = {};
      }

      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }

      node.data.id = id;
      node.data.hProperties.id = id;
      if (cls.length > 0) {
        node.data.className = cls;
        node.data.hProperties.className = cls;
      }
    });
  }

  function parseAttribute(node) {
    if (!node.children || node.children.length === 0) {
      return null;
    }

    const lastChildNode = node.children[node.children.length - 1];
    if (lastChildNode.type !== 'text') {
      return null;
    }

    const trimmedText = lastChildNode.value.trim();
    const startIndex = trimmedText.indexOf(ATTR_START);
    if (
      startIndex < 0 ||
      trimmedText.lastIndexOf(ATTR_END) !== trimmedText.length - 1
    ) {
      return null;
    }

    try {
      const attr = trimmedText.slice(startIndex + 1, -1);
      const ret = parseAttributeNotation(attr);

      const i = lastChildNode.value.indexOf(ATTR_START);
      lastChildNode.value = lastChildNode.value.slice(0, i);
      return ret;
    } catch (e) {
      return null;
    }
  }
}

/*
  * Override defualt atxHeading Tokenizer
  * If the value '## heading #### {.class}' is given,
  * original tokenizer yields...
  *  { type: 'heading',
  *    depth: 2,
  *    children: {type: 'text', value: 'heading #### {.class}'},
  *  }
  * but this tokenizer yields...
  *  { type: 'heading',
  *    depth: 2,
  *    children: {type: 'text', value: 'heading {.class}'},
  *  }
  */
function factory(original) {
  atxHeadingTokenizer.locator = original.locator;
  return atxHeadingTokenizer;

  function atxHeadingTokenizer(eat, value, silent) {
    const result = original.apply(this, arguments);

    if (
      !this.options.headerAttribute ||
      silent ||
      !result ||
      result.children.length === 0 ||
      result.children[result.children.length - 1].type !== 'text'
    ) {
      return result;
    }

    const lastChildText = result.children[result.children.length - 1].value;
    let character;
    let index = -1;
    let content = '';
    let queue = '';
    let attributeQueue = '';
    let inAttribute = false;
    while (++index < lastChildText.length) {
      character = lastChildText.charAt(index);

      if (inAttribute) {
        attributeQueue += character;
        if (character === ATTR_END) {
          inAttribute = false;
        }
      } else {
        if (character === ATTR_START) {
          attributeQueue += character;
          inAttribute = true;
          continue;
        } else if (character !== C_HASH) {
          content += queue + attributeQueue + character;
          queue = '';
          attributeQueue = '';
          continue;
        }

        while (
          character === C_SPACE ||
          character === C_TAB ||
          character === C_HASH
        ) {
          queue += character;
          character = lastChildText.charAt(++index);
        }
        index--;
      }
    }
    content += attributeQueue;
    result.children[result.children.length - 1].value = content;
    return result;
  }
}
