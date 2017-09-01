'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _getAbsolutePath = require('../../utils/getAbsolutePath');

var _getAbsolutePath2 = _interopRequireDefault(_getAbsolutePath);

var _debounce = require('../../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nullFunc = function nullFunc() {
  return null;
};

var deltaSet = new Set();

var doApply = (0, _debounce2.default)(function (cb) {
  cb(Array.from(deltaSet));
  deltaSet.clear();
}, 500, {
  leading: false
});

function watchSpec(target) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$onNewSpec = _ref.onNewSpec,
      onNewSpec = _ref$onNewSpec === undefined ? nullFunc : _ref$onNewSpec,
      _ref$onChangeSpec = _ref.onChangeSpec,
      onChangeSpec = _ref$onChangeSpec === undefined ? nullFunc : _ref$onChangeSpec;

  var watcher = _chokidar2.default.watch(target, {
    ignored: /(^|[/\\])\../,
    cwd: process.cwd()
  });

  watcher.on('add', function (path) {
    var fullPath = (0, _getAbsolutePath2.default)(path);
    deltaSet.add(fullPath);
    // console.log(`File ${fullPath} has been added`);
    doApply(onNewSpec);
  }).on('change', function (path) {
    var fullPath = (0, _getAbsolutePath2.default)(path);
    deltaSet.add(fullPath);
    // console.log(`File ${fullPath} has been changed`);
    doApply(onChangeSpec);
  });
}

exports.default = watchSpec;