const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const format = require('rehype-format');
const stringify = require('rehype-stringify');
const h = require('hastscript');
const footnote = require('../../lib/packages/remark-footnote-in-place');
const {parseOptions, mark2hypeOptions} = require('../../lib/processor');

const parser = unified()
  .use(parse, parseOptions)
  .use(footnote)
  .use(mark2hype, mark2hypeOptions)
  .use(stringify)
  .freeze();

const specTemplates = [[
  'parse footnote and definition',
  '[^foo]\n\n[^foo]: see also [document](http://example.com)',
  [
    h('p', [
      h('div.footnote', [
        'see also ',
        h('a', {href: 'http://example.com'}, 'document'),
      ]),
    ]),
  ],
], [
  'parse inline footnote',
  'footnote[^lorem ipsum]',
  [
    h('p', [
      'footnote',
      h('div.footnote', [
        'lorem ipsum',
      ]),
    ]),
  ],
], [
  'parse multi footnote references',
  '[^foo]\n[^foo]\n\n[^foo]: footnote',
  [
    h('p', [
      h('div.footnote', [
        'footnote',
      ]),
      '\n',
      h('div.footnote', [
        'footnote',
      ]),
    ]),
  ],
], [
  'parse multi footnote definition',
  '[^foo]\n\n[^foo]: one definition\n[^foo]: another definition',
  [
    h('p', [
      h('div.footnote', [
        'one definition',
      ]),
    ]),
    {type: 'text', value: '\n'},
    h('div.footnotes', [
      '\n',
      h('hr'),
      '\n',
      h('ol', [
        '\n',
        h('li#fn-foo', [
          '\n',
          h('p', [
            'another definition',
          ]),
          '\n',
          h('a.footnote-backref', {href: '#fnref-foo'}, '↩'),
          '\n',
        ]),
        '\n',
      ]),
      '\n',
    ]),
  ]
], [
  'parse undefined footnote reference',
  '[^foo]',
  [
    h('p', [
      h('sup#fnref-foo', [
        h('a.footnote-ref', {href: '#fn-foo'}, [
          'foo',
        ]),
      ]),
    ]),
  ],
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = parser.parse(tmpl[1]);
    const hast = parser.runSync(mdast);
    expect(hast.children).toMatchObject(tmpl[2]);
  });
});
