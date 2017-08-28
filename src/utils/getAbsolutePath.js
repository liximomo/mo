const path = require('path');
const PATH_CWD = process.cwd();

function getAbsolutePath(filename) {
  return path.isAbsolute(filename) ? filename : path.join(PATH_CWD, filename);
}

module.exports = getAbsolutePath;