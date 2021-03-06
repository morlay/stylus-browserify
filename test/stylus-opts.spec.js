var browserify = require('browserify');
var through = require('through');
var stylus = require('stylus');
var path = require('path');
var fs = require('fs');

var compiler = require('../lib/compiler');
var stylusPlugin = require('../.');

var nib = require('nib');
var autoprefix = require('autoprefixer-stylus');

var assert = require('assert');

describe('stylus opts', function () {

  it('stylus with define simple bundle', function (done) {

    function add(a, b) {
      return a.operate('+', b);
    }

    var opts = {
      define: [
        ['add' , add]
      ]
    };

    var stylString = String(fs.readFileSync(path.join(__dirname, 'src/component-define/index.styl')));
    var cssString = compiler(stylString, opts).render();

    var b = browserify(path.join(__dirname, 'define.js'))
      .plugin(stylusPlugin, opts);

    var stream = b.bundle();

    // stream must emit `end` before then css stream start
    stream
      .pipe(getDataAndEnd());

    stream.css
      .pipe(getDataAndEnd(function (data) {
        console.log(data);
        assert.equal(data, cssString)
      }))
      .on('end', done);
  });


  it('stylus with nib simple bundle', function (done) {

    var opts = {
      use: [nib()],
      import: ['nib']
    };

    var stylString = String(fs.readFileSync(path.join(__dirname, 'src/component-nib/index.styl')));
    var cssString = compiler(stylString, opts).render();

    var b = browserify(path.join(__dirname, 'nib.js'))
      .plugin(stylusPlugin, opts);

    var stream = b.bundle();

    // stream must emit `end` before then css stream start
    stream
      .pipe(getDataAndEnd());

    stream.css
      .pipe(getDataAndEnd(function (data) {
        console.log(data);
        assert.equal(data, cssString)
      }))
      .on('end', done);
  });


  it('stylus with autoprefix simple bundle', function (done) {

    var opts = {
      use: [autoprefix()]
    };

    var stylString = String(fs.readFileSync(path.join(__dirname, 'src/component-autoprefix/index.styl')));
    var cssString = compiler(stylString, opts).render();

    var b = browserify(path.join(__dirname, 'autoprefix.js'))
      .plugin(stylusPlugin, opts);

    var stream = b.bundle();

    // stream must emit `end` before then css stream start
    stream
      .pipe(getDataAndEnd());

    stream.css
      .pipe(getDataAndEnd(function (data) {
        console.log(data);
        assert.equal(data, cssString)
      }))
      .on('end', done);
  })


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