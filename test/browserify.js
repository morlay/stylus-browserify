var fs = require('fs');
var browserify = require('browserify');
var stylusPlugin = require('../.');
var path = require('path');

var b = browserify(
    path.join(__dirname, '../example', 'src/index.js')
).plugin(stylusPlugin);

require('mkdirp')(path.join(__dirname, '../example', 'dest'));

var stream = b.bundle();

stream.pipe(fs.createWriteStream(
    path.join(__dirname, '../example', 'dest/bundle.js')));
stream.css.pipe(fs.createWriteStream(
    path.join(__dirname, '../example', 'dest/bundle.css')));
