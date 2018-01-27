'use strict';

const visit = require('unist-util-visit');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    const references = [];
    const definitions = {};

    visit(tree, 'footnoteReference', (node, index, parent) => {
      references.push(node);
    });
    visit(tree, 'footnoteDefinition', (node, index, parent) => {
      if (node.identifier in definitions) {
        return;
      }
      definitions[node.identifier] = {node, index, parent};
    });

    const delParentNodes = [];
    for (let i=0; i < references.length; i++) {
      const refNode = references[i];
      const key = refNode.identifier;
      if (!(key in definitions)) {
        continue;
      }
      const defNode = definitions[key].node;
      const defIndex = definitions[key].index;
      const defParent = definitions[key].parent;
      refNode.type = 'footnote';
      delete refNode.identifier;

      if (defNode.children.length === 1 && defNode.children[0].type === 'paragraph') {
        // remove top paragraph
        refNode.children = defNode.children[0].children;
      }
      else {
        refNode.children = defNode.children;
      }

      const parents = delParentNodes.filter(n => n === defParent);
      if (parents.length > 0) {
        parents[0].delIndices.push(defIndex);
      }
      else {
        defParent.delIndices = [defIndex];
        delParentNodes.push(defParent);
      }
    }

    for (let i=0; i < delParentNodes.length; i++) {
      const parent = delParentNodes[i];
      const filtered = parent.children.filter((n, i) => parent.delIndices.indexOf(i) < 0);
      parent.children = filtered;
      delete parent.delIndices;
    }
  }
}
