import chokidar from 'chokidar';
import getAbsolutePath from '../../utils/getAbsolutePath';
import debounce from '../../utils/debounce';

const nullFunc = () => null;

const deltaSet = new Set();

const doApply = debounce((cb) => {
  cb(Array.from(deltaSet));
  deltaSet.clear();
}, 500, {
  leading: false,
});

function watchSpec(target, {
  onNewSpec = nullFunc,
  onChangeSpec = nullFunc,
} = {}) {
  const watcher = chokidar.watch(target, {
    ignored: /(^|[/\\])\../,
    cwd: process.cwd(),
  });

  watcher
    .on('add', (path) => {
      const fullPath = getAbsolutePath(path);
      deltaSet.add(fullPath);
      // console.log(`File ${fullPath} has been added`);
      doApply(onNewSpec);
    })
    .on('change', (path) => {
      const fullPath = getAbsolutePath(path);
      deltaSet.add(fullPath);
      // console.log(`File ${fullPath} has been changed`);
      doApply(onChangeSpec);
    });
}

export default watchSpec;