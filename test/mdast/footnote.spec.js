const unified = require('unified');
const parse = require('remark-parse');
const {parseOptions} = require('../../lib/processor');

const parser = unified()
  .use(parse, parseOptions)
  .freeze();

const specTemplates = [[
  'parse footnote and definition',
  '[^foo]\n\n[^foo]: see also [document](http://example.com)',
  [{
    type: 'paragraph',
    children: [{
      type: 'footnoteReference',
      identifier: 'foo',
    }],
  }, {
    type: 'footnoteDefinition',
    identifier: 'foo',
    children: [{
      type: 'paragraph',
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
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = parser.parse(tmpl[1]);
    expect(mdast.children).toMatchObject(tmpl[2]);
  });
});
