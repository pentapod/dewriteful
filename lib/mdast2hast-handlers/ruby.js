'use strict';

const all = require('mdast-util-to-hast/lib/all');
const wrap = require('mdast-util-to-hast/lib/wrap');
const u = require('unist-builder');

module.exports = handler;

function handler(h, node) {
  const rtStart =
    node.children.length > 0
      ? node.children[node.children.length - 1].position.end
      : node.position.start;
  const rtNode = h(
    {
      start: rtStart,
      end: node.position.end,
    },
    'rt',
    {},
    [u('text', node.rubyText)]
  );
  return h(node, 'ruby', wrap([].concat(all(h, node), [rtNode]), true));
}
