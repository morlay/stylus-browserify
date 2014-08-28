"use strict";

var fs = require('fs');
var through = require('through');
var compiler = require('./lib/compiler');

var isStylusFile = /\.(styl|css)$/;

function stylusPlugin(browserify, options) {

  options = options || {};

  var output = options.output || options.o;
  var filenames = [];

  browserify.transform(function (filename) {
    if (!isStylusFile.exec(filename)) return through();

    filenames.push(filename);

    return through(
      function () {
      },
      function () {
        this.queue('');
        this.queue(null);
      });
  });

  var bundle = browserify.bundle;

  browserify.bundle = function (opts, cb) {

    if (browserify._pending) {

      var tr = through();
      tr.css = through();

      browserify.on('_ready', function () {
        var b = browserify.bundle(opts, cb);

        b.on('transform', tr.emit.bind(tr, 'transform'));

        if (!cb) b.on('error', tr.emit.bind(tr, 'error'));

        b.pipe(tr);
        b.css.pipe(tr.css);
      });

      return tr;
    }

    var stream = bundle.apply(browserify, arguments);

    stream.css = through();

    stream.on('end', function () {

      var styl = compiler(composeStylesheet(filenames), options);

      filenames = [];

      if (output !== undefined) {
        stream.css.pipe(fs.createWriteStream(output));
      }

      try {
        var css = styl.render();
        stream.css.queue(css);
        stream.css.queue(null);
      } catch (err) {
        stream.emit('error', err);
        stream.css.emit('error', err);
      }

    });

    return stream;

  };

  return browserify;
}

function composeStylesheet(filenames) {
  return filenames.map(function (filename) {
    return '@import "' + filename.replace('.css', '.styl') + '";';
  }).join('\n');
}

module.exports = stylusPlugin;
