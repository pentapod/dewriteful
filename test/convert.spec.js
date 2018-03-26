const dewriteful = require('../lib');
const specTemplates = require('./convert-templates');

specTemplates.forEach(tmpl => {
  it(tmpl[0], () => {
    return dewriteful(tmpl[1]).then(html => {
      expect(html.trim()).toEqual(tmpl[2]);
    });
  });
});
