'use strict';

const { processor } = require('./processor');

module.exports = function(...args) {
  if (args.length === 0) {
    throw new Error('Argument is not defined.');
  } else if (args.length === 1) {
    return convert(args[0]);
  } else {
    convert(args[0])
      .then(result => {
        args[1](undefined, result);
      })
      .catch(error => {
        args[1](error, undefined);
      });
  }
};

function convert(doc) {
  return new Promise((res, rej) => {
    processor.process(doc, (err, file) => {
      if (err) rej(err);
      else res(String(file));
    });
  });
}
