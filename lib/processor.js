'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const format = require('rehype-format');
const stringify = require('rehype-stringify');
const footnote = require('./packages/remark-footnote-in-place');
const ruby = require('./packages/remark-ruby');
const footnoteHandler = require('./mdast2hast-handlers/footnote-in-place');

const parseOptions = {
  footnotes: true,
};

const mark2hypeOptions = {
  handlers: {
    footnote: footnoteHandler,
  },
};

const processor = unified()
  .use(parse, parseOptions)
  .use(footnote)
  .use(ruby)
  .use(mark2hype, mark2hypeOptions)
  .use(format)
  .use(stringify)
  .freeze();

module.exports = {
  processor,
  parseOptions,
  mark2hypeOptions,
};
