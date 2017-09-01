import path from 'path';
var PATH_CWD = process.cwd();

function getAbsolutePath(filename) {
  return path.isAbsolute(filename) ? filename : path.join(PATH_CWD, filename);
}

export default getAbsolutePath;