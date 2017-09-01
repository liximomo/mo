'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PATH_CWD = process.cwd();

function getAbsolutePath(filename) {
  return _path2.default.isAbsolute(filename) ? filename : _path2.default.join(PATH_CWD, filename);
}

exports.default = getAbsolutePath;