const unified = require('unified');
const parse = require('remark-parse');
const footnote = require('../../lib/packages/remark-footnote-in-place');
const ruby = require('../../lib/packages/remark-ruby');
const {parseOptions} = require('../../lib/processor');

const parser = unified()
  .use(parse, parseOptions)
  .use(footnote)
  .use(ruby)
  .freeze();

const specTemplates = [[
  'parse footnote and definition',
  '[^foo]\n\n[^foo]: see also [document](http://example.com)',
  [{
    type: 'paragraph',
    children: [{
      type: 'footnote',
      children: [{
        type: 'text',
        value: 'see also ',
      }, {
        type: 'link',
        url: 'http://example.com',
        children: [{
          type: 'text',
          value: 'document',
        }],
      }],
    }],
  }],
], [
  'parse inline footnote',
  'footnote[^lorem ipsum]',
  [{
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'footnote',
    }, {
      type: 'footnote',
      children: [{
        type: 'text',
        value: 'lorem ipsum',
      }],
    }],
  }],
], [
  'parse multi footnote references',
  '[^foo]\n[^foo]\n\n[^foo]: footnote',
  [{
    type: 'paragraph',
    children: [{
      type: 'footnote',
      children: [{
        type: 'text',
        value: 'footnote',
      }],
    }, {
      type: 'text',
      value: '\n',
    }, {
      type: 'footnote',
      children: [{
        type: 'text',
        value: 'footnote',
      }],
    }],
  }],
], [
  'parse multi footnote definition',
  '[^foo]\n\n[^foo]: one definition\n[^foo]: another definition',
  [{
    type: 'paragraph',
    children: [{
      type: 'footnote',
      children: [{
        type: 'text',
        value: 'one definition',
      }],
    }],
  }, {
    type: 'footnoteDefinition',
    identifier: 'foo',
    children: [{
      type: 'paragraph',
      children: [{
        type: 'text',
        value: 'another definition',
      }],
    }],
  }],
], [
  'parse undefined footnote reference',
  '[^foo]',
  [{
    type: 'paragraph',
    children: [{
      type: 'footnoteReference',
      identifier: 'foo',
    }],
  }],
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = parser.parse(tmpl[1]);
    const converted = parser.runSync(mdast);
    expect(converted.children).toMatchObject(tmpl[2]);
  });
});
