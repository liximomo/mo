import chokidar from 'chokidar';
import getAbsolutePath from '../../utils/getAbsolutePath';
import debounce from '../../utils/debounce';

var nullFunc = function nullFunc() {
  return null;
};

var deltaSet = new Set();

var doApply = debounce(function (cb) {
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

  var watcher = chokidar.watch(target, {
    ignored: /(^|[/\\])\../,
    cwd: process.cwd()
  });

  watcher.on('add', function (path) {
    var fullPath = getAbsolutePath(path);
    deltaSet.add(fullPath);
    // console.log(`File ${fullPath} has been added`);
    doApply(onNewSpec);
  }).on('change', function (path) {
    var fullPath = getAbsolutePath(path);
    deltaSet.add(fullPath);
    // console.log(`File ${fullPath} has been changed`);
    doApply(onChangeSpec);
  });
}

export default watchSpec;