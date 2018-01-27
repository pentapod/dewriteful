const dewriteful = require('../lib');
const specTemplates = require('./convert-templates');

specTemplates.forEach(async tmpl => {
  it(tmpl[0], async() => {
    const html = await dewriteful(tmpl[1]);
    expect(html.trim()).toEqual(tmpl[2]);
  });
});
