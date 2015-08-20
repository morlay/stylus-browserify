var browserify = require('browserify');
var through = require('through');
var stylus = require('stylus');
var path = require('path');
var fs = require('fs');

var compiler = require('../lib/compiler');
var stylusPlugin = require('../.');

var assert = require('assert');

describe('stylus error', function () {

  it('stylus error should console', function (done) {

    var opts = {};

    var b = browserify(path.join(__dirname, 'error.js'))
      .plugin(stylusPlugin, opts);

    var stream = b.bundle();

    // stream must emit `end` before then css stream start
    stream
      .on('error', function (err) {
        console.log(err)
        assert.equal(err.name, 'ParseError');
        done()
      })
      .pipe(getDataAndEnd());

    stream.css
      .pipe(getDataAndEnd())
      .on('end', done);
  });

});


function getDataAndEnd(cb) {
  var data = '';
  return through(write, end);

  function write(buf) {
    data += buf;
  }

  function end() {
    this.emit('end');
    if (typeof cb == 'function') {
      cb(data);
    }
  }
}