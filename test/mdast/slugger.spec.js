const {stripIndent} = require('common-tags');
const {toMDASTParser} = require('../../lib/processor');

const specTemplates = [[
  'make slugger from heading text',
  stripIndent`
    ---
    headerAttribute: true
    ---
    # Slug Slug
  `,
  [{
    type: 'yaml',
    value: 'headerAttribute: true',
  }, {
    type: 'heading',
    depth: 1,
    data: {
      id: 'slug-slug',
      hProperties: { id: 'slug-slug' },
    },
    children: [{
      type: 'text',
      value: 'Slug Slug',
    }],
  }],
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = toMDASTParser.parse(tmpl[1]);
    const converted = toMDASTParser.runSync(mdast);
    expect(converted.children).toMatchObject(tmpl[2]);
  });
});
