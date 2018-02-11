const h = require('hastscript');
const {toHASTParser} = require('../../lib/processor');

const specTemplates = [[
  'parse footnote and definition',
  '[^foo]\n\n[^foo]: see also [document](http://example.com)',
  [
    {type: 'text', value: '\n'},
    h('p', [
      '\n  ',
      h('div.footnote', [
        'see also ',
        h('a', {href: 'http://example.com'}, 'document'),
      ]),
      '\n',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse inline footnote',
  'footnote[^lorem ipsum]',
  [
    {type: 'text', value: '\n'},
    h('p', [
      'footnote',
      '\n  ',
      h('div.footnote', [
        'lorem ipsum',
      ]),
      '\n',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse multi footnote references',
  '[^foo]\n[^foo]\n\n[^foo]: footnote',
  [
    {type: 'text', value: '\n'},
    h('p', [
      '\n  ',
      h('div.footnote', [
        'footnote',
      ]),
      '\n  ',
      h('div.footnote', [
        'footnote',
      ]),
      '\n',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse multi footnote definition',
  '[^foo]\n\n[^foo]: one definition\n[^foo]: another definition',
  [
    {type: 'text', value: '\n'},
    h('p', [
      '\n  ',
      h('div.footnote', [
        'one definition',
      ]),
      '\n',
    ]),
    {type: 'text', value: '\n'},
    h('div.footnotes', [
      '\n  ',
      h('hr'),
      '\n  ',
      h('ol', [
        '\n    ',
        h('li#fn-foo', [
          '\n      ',
          h('p', [
            'another definition',
          ]),
          h('a.footnote-backref', {href: '#fnref-foo'}, '↩'),
        ]),
        '\n  ',
      ]),
      '\n',
    ]),
    {type: 'text', value: '\n'},
  ]
], [
  'parse undefined footnote reference',
  '[^foo]',
  [
    {type: 'text', value: '\n'},
    h('p', [
      h('sup#fnref-foo', [
        h('a.footnote-ref', {href: '#fn-foo'}, [
          'foo',
        ]),
      ]),
    ]),
    {type: 'text', value: '\n'},
  ],
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = toHASTParser.parse(tmpl[1]);
    const hast = toHASTParser.runSync(mdast);
    expect(hast.children).toMatchObject(tmpl[2]);
  });
});
