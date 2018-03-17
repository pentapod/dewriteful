'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const frontmatter = require('remark-frontmatter');
const format = require('rehype-format');
const stringify = require('rehype-stringify');
const config = require('./packages/remark-dewriteful-config');
const slugger = require('./packages/remark-dewriteful-slugger');
const footnote = require('./packages/remark-footnote-in-place');
const ruby = require('./packages/remark-ruby');
const footnoteHandler = require('./mdast2hast-handlers/footnote-in-place');
const rubyHandler = require('./mdast2hast-handlers/ruby');

const parseOptions = {
  footnotes: true,
};

const mark2hypeOptions = {
  handlers: {
    footnote: footnoteHandler,
    ruby: rubyHandler,
  },
};

const toMDASTParser = unified()
  .use(parse, parseOptions)
  .use(frontmatter, ['yaml', 'toml'])
  .use(config)
  .use(slugger)
  .use(footnote)
  .use(ruby)
  .freeze();

const toHASTParser = unified()
  .use(parse, parseOptions)
  .use(frontmatter, ['yaml', 'toml'])
  .use(config)
  .use(slugger)
  .use(footnote)
  .use(ruby)
  .use(mark2hype, mark2hypeOptions)
  .use(format)
  .freeze();

const processor = unified()
  .use(parse, parseOptions)
  .use(frontmatter, ['yaml', 'toml'])
  .use(config)
  .use(slugger)
  .use(footnote)
  .use(ruby)
  .use(mark2hype, mark2hypeOptions)
  .use(format)
  .use(stringify)
  .freeze();

module.exports = {
  processor,
  toMDASTParser,
  toHASTParser,
  parseOptions,
  mark2hypeOptions,
};
