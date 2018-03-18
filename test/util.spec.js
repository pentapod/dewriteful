const {parseAttributeNotation} = require('../lib/util');

describe('Assertion of parseAttributeNotation()', () => {
  it('deal with simple attribute', () => {
    const ret = parseAttributeNotation('#aa .bb #cc#dd .ee.ff123');
    expect(ret).toMatchObject({
      id: 'cc#dd',
      class: ['bb', 'ee.ff123'],
    });
  });

  it('deal with non-ascii character', () => {
    const ret = parseAttributeNotation(' .あ\t#安 ');
    expect(ret).toMatchObject({
      id: '安',
      class: ['あ'],
    });
  });

  it('throw if it includes invalid format', () => {
    expect(() => {
      parseAttributeNotation('.foo"/>');
    }).toThrow();

    expect(() => {
      parseAttributeNotation('test');
    }).toThrow();

    expect(() => {
      parseAttributeNotation('.');
    }).toThrow();

    expect(() => {
      parseAttributeNotation('#');
    }).toThrow();
  });
});
