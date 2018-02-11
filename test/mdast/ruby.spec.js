const {toMDASTParser} = require('../../lib/processor');

const specTemplates = [[
  'parse ruby applying kanji',
  'とある魔術の禁書目録<<インデックス>>',
  [{
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
  '|Underworld<<アンダーワールド>>',
  [{
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
  'testcase |foo<<bar',
  [{
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'testcase |foo<<bar',
    }],
  }],
], [
  'parse invalid ruby format (2)',
  'test|case>>foo<<bar',
  [{
    type: 'paragraph',
    children: [{
      type: 'text',
      value: 'test|case>>foo<<bar',
    }],
  }],
], [
  'parse ruby with strong word',
  '単語を|**強調**<<きょうちょう>>する',
  [{
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
  'Java+You\n|download\ntoday<<right now>>',
  [{
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
  '|abc|def<<ghi>><<jkl>>',
  [{
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
]];

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    const mdast = toMDASTParser.parse(tmpl[1]);
    const converted = toMDASTParser.runSync(mdast);
    expect(converted.children).toMatchObject(tmpl[2]);
  });
});
