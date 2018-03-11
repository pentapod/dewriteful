const {stripIndent} = require('common-tags');
const h = require('hastscript');
const {toHASTParser} = require('../../lib/processor');

const specTemplates = [[
  'parse ruby applying kanji',
  stripIndent`
    ---
    ruby: true
    ---
    とある魔術の禁書目録<<インデックス>>
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      'とある魔術の',
      h('ruby', [
        '禁書目録',
        h('rt', 'インデックス'),
      ]),
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse ruby starts with vertical bar',
  stripIndent`
    ---
    ruby: true
    ---
    |Underworld<<アンダーワールド>>
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      h('ruby', [
        'Underworld',
        h('rt', 'アンダーワールド'),
      ]),
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse invalid ruby format (1)',
  stripIndent`
    ---
    ruby: true
    ---
    testcase |foo<<bar
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      'testcase |foo<<bar',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse invalid ruby format (2)',
  stripIndent`
    ---
    ruby: true
    ---
    test|case>>foo<<bar
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      'test|case>>foo<<bar',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse ruby with strong word',
  stripIndent`
    ---
    ruby: true
    ---
    単語を|**強調**<<きょうちょう>>する
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      '単語を',
      h('ruby', [
        h('strong', '強調'),
        h('rt',　'きょうちょう'),
      ]),
      'する',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse ruby splitted by new line',
  stripIndent`
    ---
    ruby: true
    ---
    Java+You
    |download
    today<<right now>>
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      '\n  ',
      'Java+You\n  |download\n  today<',
      '>',
      '\n',
    ]),
    {type: 'text', value: '\n'},
  ],
], [
  'parse combined ruby',
  stripIndent`
    ---
    ruby: true
    ---
    |abc|def<<ghi>><<jkl>>
  `,
  [
    {type: 'text', value: '\n'},
    h('p', [
      '|abc',
      h('ruby', [
        'def',
        h('rt', 'ghi'),
      ]),
      '<',
      '>',
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
