const {stripIndent} = require('common-tags');
const {toMDASTParser} = require('../../lib/processor');

const specTemplates = [[
  'parse ruby applying kanji',
  stripIndent`
    ---
    ruby: true
    ---
    とある魔術の禁書目録<<インデックス>>
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'とある魔術の',
    }, {
      type: 'ruby',
      rubyText: 'インデックス',
      children: [{
        type: 'text',
        value: '禁書目録',
      }],
    }],
  }],
], [
  'parse ruby starts with vertical bar',
  stripIndent`
    ---
    ruby: true
    ---
    |Underworld<<アンダーワールド>>
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'ruby',
      rubyText: 'アンダーワールド',
      children: [{
        type: 'text',
        value: 'Underworld',
      }],
    }],
  }],
], [
  'parse invalid ruby format (1)',
  stripIndent`
    ---
    ruby: true
    ---
    testcase |foo<<bar
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'testcase |foo<<bar',
    }],
  }],
], [
  'parse invalid ruby format (2)',
  stripIndent`
    ---
    ruby: true
    ---
    test|case>>foo<<bar
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'test|case>>foo<<bar',
    }],
  }],
], [
  'parse ruby with strong word',
  stripIndent`
    ---
    ruby: true
    ---
    単語を|**強調**<<きょうちょう>>する
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: '単語を',
    }, {
      type: 'ruby',
      rubyText: 'きょうちょう',
      children: [{
        type: 'strong',
        children: [{
          type: 'text',
          value: '強調',
        }],
      }],
    }, {
      type: 'text',
      value: 'する',
    }],
  }],
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
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'Java+You\n|download\ntoday<',
    }, {
      // It's ok!?!?
      type: 'html',
      value: '<right now>'
    }, {
      type: 'text',
      value: '>',
    }],
  }],
], [
  'parse combined ruby',
  stripIndent`
    ---
    ruby: true
    ---
    |abc|def<<ghi>><<jkl>>
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: '|abc'
    }, {
      type: 'ruby',
      rubyText: 'ghi',
      children: [{
        type: 'text',
        value: 'def',
      }],
    }, {
      type: 'text',
      value: '<',
    }, {
      type: 'html',
      value: '<jkl>',
    }, {
      type: 'text',
      value: '>',
    }],
  }],
], [
  'cancel ruby',
  stripIndent`
    ---
    ruby: true
    ---
    |<<abc*def*>>**ghi**

    empty|<<>>
  `,
  [{
    type: 'yaml',
    value: 'ruby: true',
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: '<<',
    }, {
      type: 'text',
      value: 'abc',
    }, {
      type: 'emphasis',
      children: [{
        type: 'text',
        value: 'def',
      }],
    }, {
      type: 'text',
      value: '>>',
    }, {
      type: 'strong',
      children: [{
        type: 'text',
        value: 'ghi',
      }],
    }],
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'empty',
    }, {
      type: 'text',
      value: '<<',
    }, {
      type: 'text',
      value: '>>',
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
