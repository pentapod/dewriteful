const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const format = require('rehype-format');
const stringify = require('rehype-stringify');
const h = require('hastscript');
const footnote = require('../../lib/packages/remark-footnote-in-place');
const {parseOptions} = require('../../lib/processor');

const parser = unified()
  .use(parse, parseOptions)
  .use(footnote)
  .use(mark2hype)
  .use(stringify)
  .freeze();

const specTemplates = [[
  'parse footnote and definition',
  '[^foo]\n\n[^foo]: see also [document](http://example.com)',
  [
    h('p', [
      h('sup#fnref-1', [
        h('a.footnote-ref', {href: '#fn-1'}, '1'),
      ]),
    ]),
    {type: 'text', value: '\n'},
    h('div.footnotes', [
      '\n',
      h('hr'),
      '\n',
      h('ol', [
        '\n',
        h('li#fn-1', [
          '\n',
          h('p', [
            'see also ',
            h('a', {href: 'http://example.com'}, 'document'),
          ]),
          '\n',
          h('a.footnote-backref', {href: '#fnref-1'},'↩'),
          '\n',
        ]),
        '\n',
      ]),
      '\n'
    ]),
  ],
], [
  'parse inline footnote',
  'footnote[^lorem ipsum]',
  [
    h('p', [
      'footnote',
      h('sup#fnref-1', [
        h('a.footnote-ref', {href: '#fn-1'}, '1'),
      ]),
    ]),
    {type: 'text', value: '\n'},
    h('div.footnotes', [
      '\n',
      h('hr'),
      '\n',
      h('ol', [
        '\n',
        h('li#fn-1', [
          '\n',
          h('p', [
            'lorem ipsum',
          ]),
          '\n',
          h('a.footnote-backref', {href: '#fnref-1'}, '↩'),
          '\n',
        ]),
        '\n',
      ]),
      '\n',
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
