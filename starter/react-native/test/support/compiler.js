/* eslint-disable prefer-arrow-callback */

var fs = require('fs');
var path = require('path');
var babel = require('babel-core');

var basePath = path.join(__dirname, '../..');
var mocksPath = path.join(__dirname, 'mocks');

var MOCKS = {
  'react-native/Libraries/react-native/react-native.js': 'react-native.js',
};

MOCKS = Object.keys(MOCKS).reduce(function(result, key) {
  var srcPath = path.join(basePath, 'node_modules', key);
  var dstPath = path.join(mocksPath, MOCKS[key]);
  result[srcPath] = dstPath;
  return result;
}, {});

var originalLoader = require.extensions['.js'];
require.extensions['.js'] = function(module, fileName) {
  if (MOCKS.hasOwnProperty(fileName)) {
    fileName = MOCKS[fileName];
  }
  if (fileName.indexOf('node_modules/') !== -1) {
    return originalLoader(module, fileName);
  }
  var src = fs.readFileSync(fileName, 'utf8');
  var output = babel.transform(src, {
    filename: fileName,
    sourceFileName: fileName,
  });
  return module._compile(output.code, fileName);
};
