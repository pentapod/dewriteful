'use strict';

const YAML = require('js-yaml');
const TOML = require('toml');

module.exports = attacher;

function attacher() {
  const { Parser, Compiler } = this;
  const parser = Parser && Parser.prototype.blockTokenizers;
  const compiler = Compiler && Compiler.prototype.visitors;

  if (Parser && Parser.prototype.parse) {
    // Transmit remark-parse options to other transformer plugins
    const parseFunc = Parser.prototype.parse;

    Parser.prototype.parse = function() {
      const self = this;
      const result = parseFunc.apply(self);
      result['parserOptions'] = self.options;
      return result;
    };
  }

  if (parser && parser.yamlFrontMatter) {
    parser.yamlFrontMatter = factory(parser.yamlFrontMatter, 'yaml');
  }
  if (parser && parser.tomlFrontMatter) {
    parser.tomlFrontMatter = factory(parser.tomlFrontMatter, 'toml');
  }

  if (compiler && compiler.yaml) {
    compiler.yaml = factory(compiler.yaml, 'yaml');
  }
  if (compiler && compiler.toml) {
    compiler.toml = factory(compiler.toml, 'toml');
  }
}

function factory(original, format) {
  replacement.locator = original.locator;
  return replacement;

  function replacement(node) {
    const self = this;
    const result = original.apply(self, arguments);
    const marker = result && result.type ? result : node;

    if (typeof marker.value !== 'string') {
      return result;
    }

    try {
      let data = null;
      if (format === 'yaml') {
        data = YAML.safeLoad(marker.value);
      } else if (format === 'toml') {
        data = TOML.parse(marker.value);
      }
      if (data) {
        self.setOptions(data);
      }
    } catch (err) {
      self.file.fail(err.message, marker);
    }
    return result;
  }
}
