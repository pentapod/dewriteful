const dewriteful = require('../lib');

it('works with primitive markdown', async () => {
  const html = await dewriteful('# Foo');
  expect(html.trim()).toEqual('<h1>Foo</h1>');
});
