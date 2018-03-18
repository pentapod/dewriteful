const {stripIndent} = require('common-tags');
const {toMDASTParser} = require('../../lib/processor');

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
  }, {
    type: 'heading',
    depth: 2,
    data: {
      id: 'headings',
      hProperties: { id: 'headings' },
    },
    children: [{
      type: 'text',
      value: 'Headings',
    }],
  }],
], [
  'make header attribute',
  stripIndent`
    ---
    headerAttribute: true
    ---
    ### with class ###### {.foo}

    foo ## {#a}
    -----------
  `,
  [{
    type: 'yaml',
    value: 'headerAttribute: true',
  }, {
    type: 'heading',
    depth: 3,
    data: {
      id: 'with-class',
      class: ['foo'],
      hProperties: { id: 'with-class', class: ['foo'] },
    },
    children: [{
      type: 'text',
      value: 'with class ',
    }],
  }, {
    type: 'heading',
    depth: 2,
    data: {
      id: 'a',
      class: [],
      hProperties: { id: 'a', class: [] },
    },
    children: [{
      type: 'text',
      value: 'foo ## ',
    }],
  }],
], [
  'make unique header id',
  stripIndent`
    ---
    headerAttribute: true
    ---
    # unique

    ## unique

    ### with attribute {#unique}

    #### unique
  `,
  [{
    type: 'yaml',
    value: 'headerAttribute: true',
  }, {
    type: 'heading',
    depth: 1,
    data: {
      id: 'unique',
      hProperties: { id: 'unique' },
    },
    children: [{
      type: 'text',
      value: 'unique',
    }],
  }, {
    type: 'heading',
    depth: 2,
    data: {
      id: 'unique-1',
      hProperties: { id: 'unique-1' },
    },
    children: [{
      type: 'text',
      value: 'unique',
    }],
  }, {
    type: 'heading',
    depth: 3,
    data: {
      id: 'unique',
      hProperties: { id: 'unique' },
    },
    children: [{
      type: 'text',
      value: 'with attribute ',
    }],
  }, {
    type: 'heading',
    depth: 4,
    data: {
      id: 'unique-3',
      hProperties: { id: 'unique-3' },
    },
    children: [{
      type: 'text',
      value: 'unique',
    }],
  }, ],
], [
  'deal with ATX trailing hash',
  stripIndent`
    ---
    headerAttribute: true
    ---
    # hello#world ## #{.cls}

    ## ### {.cls #id}#

    ### x#y#z#{.cls} ###

    #### a b c ## {.cls} yo
  `,
  [{
    type: 'yaml',
    value: 'headerAttribute: true',
  }, {
    type: 'heading',
    depth: 1,
    data: {
      id: 'helloworld',
      class: ['cls'],
      hProperties: { id: 'helloworld', class: ['cls'] },
    },
    children: [{
      type: 'text',
      value: 'hello#world ',
    }],
  }, {
    type: 'heading',
    depth: 2,
    data: {
      id: 'id',
      class: ['cls'],
      hProperties: { id: 'id', class: ['cls'] },
    },
    children: [{
      type: 'text',
      value: '',
    }],
  }, {
    type: 'heading',
    depth: 3,
    data: {
      id: 'xyz',
      class: ['cls'],
      hProperties: { id: 'xyz', class: ['cls'] },
    },
    children: [{
      type: 'text',
      value: 'x#y#z',
    }],
  }, {
    type: 'heading',
    depth: 4,
    data: {
      id: 'a-b-c--cls-yo',
      class: [],
      hProperties: { id: 'a-b-c--cls-yo', class: [] },
    },
    children: [{
      type: 'text',
      value: 'a b c ## {.cls} yo',
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
