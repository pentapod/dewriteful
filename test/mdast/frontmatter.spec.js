const {stripIndent} = require('common-tags');
const {toMDASTParser} = require('../../lib/processor');

const specTemplates = [[
  'parse simple YAML frontmatter',
  stripIndent`
    ---
    foo: bar
    ---
    # test
  `,
  [{
    type: 'yaml',
    value: 'foo: bar',
  }, {
    type: 'heading',
    depth: 1,
    children: [{
      type: 'text',
      value: 'test',
    }],
  }],
], [
  'parse simple TOML frontmatter',
  stripIndent`
    +++
    foo = "bar"
    +++
    # test
  `,
  [{
    type: 'toml',
    value: 'foo = "bar"',
  }, {
    type: 'heading',
    depth: 1,
    children: [{
      type: 'text',
      value: 'test',
    }],
  }],
]];

const abnormalSpecTemplates = [[
  'raise YAML parse error',
  stripIndent`
    ---
    foo: duplicated
    foo: key
    ---
  `,
  /duplicated mapping key/,
], [
  'raise TOML parse error',
  stripIndent`
    +++
    foo = [1, 'bar'] # data type mismatch
    +++
  `,
  /Cannot add value of type String to array of type Integer/,
]]

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = toMDASTParser.parse(tmpl[1]);
    const converted = toMDASTParser.runSync(mdast);
    expect(converted.children).toMatchObject(tmpl[2]);
  });
});

abnormalSpecTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    expect(() => {
      const mdast = toMDASTParser.parse(tmpl[1]);
      toMDASTParser.runSync(mdast);
    }).toThrow(tmpl[2]);
  });
})
