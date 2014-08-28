var stylus = require('stylus');

module.exports = function (codeString, options) {

  var styl = stylus(codeString, options);

  [
    'set',
    'define',
    'use',
    'include',
    'import'
  ].forEach(function (method) {
      if (!options[method]) return;
      [].concat(options[method]).forEach(function (args) {
        styl[method].apply(styl, [].concat(args));
      });
    });

  return styl;

};