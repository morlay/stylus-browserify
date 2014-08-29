## Stylus Browserify


[![Build Status](https://travis-ci.org/morlay/stylus-browserify.svg?branch=master)](https://travis-ci.org/morlay/stylus-browserify)
[![Dependencies](https://david-dm.org/morlay/stylus-browserify.png)](https://david-dm.org/morlay/stylus-browserify)

Use for [browserify plugin](https://github.com/substack/node-browserify#plugins) and stream to a single css file.

## Usage

    var browserify = require('browserify');
    var stylusBrowserify = require('stylus-browserify')

    var b = browserify('/path/to/entry.js').plugin(stylusBrowserify, OPTIONS);

    var stream = b.bundle();

    stream.pipe(); // pipe to main.js must pipe first
    stream.css.pipe(); // pipe to main.css

## Plugin Options

[stylus api](http://learnboost.github.io/stylus/docs/js.html) can be used, but

    {
      include: [ path ],
      import: [ path ],
      use: [ fn ],
      set: [
        [ setting, value ]
      ],
      define: [
        [ name, node ]
        [ name, fn ]
      ]
    }
