'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const format = require('rehype-format');
const stringify = require('rehype-stringify');

const parseOptions = {
  footnotes: true,
};

const processor = unified()
  .use(parse, parseOptions)
  .use(mark2hype)
  .use(format)
  .use(stringify)
  .freeze();

module.exports = {
  processor,
  parseOptions,
};
