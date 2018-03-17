'use strict';

const slugs = require('github-slugger')();
const visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

module.exports = attacher;

function attacher() {

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

    visit(tree, 'heading', function (node) {
      var id = slugs.slug(toString(node));

      if (!node.data) {
        node.data = {};
      }

      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }

      node.data.id = id;
      node.data.hProperties.id = id;
    });
  }
}
