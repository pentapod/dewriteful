const {stripIndent} = require('common-tags');
const h = require('hastscript');
const {toHASTParser} = require('../../lib/processor');

const specTemplates = [[
  'make slugger from heading text',
  stripIndent`
    ---
    headerAttribute: true
    ---
    # Slug Slug #

    Headings
    --------
  `,
  [
    {type: 'text', value: '\n'},
    h('h1#slug-slug', [
      'Slug Slug',
    ]),
    {type: 'text', value: '\n'},
    h('h2#headings', [
      'Headings',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'make header attribute',
  stripIndent`
    ---
    headerAttribute: true
    ---
    ### with class ###### {.foo .bar}

    foo ## {#a .b}
    -----------
  `,
  [
    {type: 'text', value: '\n'},
    h('h3#with-class.foo.bar', [
      'with class',
    ]),
    {type: 'text', value: '\n'},
    h('h2#a.b', [
      'foo ##',
    ]),
    {type: 'text', value: '\n'},
  ],
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = toHASTParser.parse(tmpl[1]);
    const converted = toHASTParser.runSync(mdast);
    expect(converted.children).toMatchObject(tmpl[2]);
  });
});
