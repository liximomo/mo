function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import watcher from './watcher';
import requireUncached from '../../utils/requireUncached';

import { METHOD_ALL, OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY, createHandles } from './parse-spec';

let handleMap = {};

function addHandles(specFile) {
  try {
    const specFiles = [].concat(specFile);
    const specs = Object.assign.apply({}, [].concat(specFiles.map(file => requireUncached(file))));

    Object.keys(specs).reduce((result, apiName) => {
      const definitions = [].concat(specs[apiName]);
      result[apiName] = createHandles(definitions);
      return result;
    }, handleMap);

    console.log(`process spec files success:\n  ${specFile.join('\n  ')} `);
  } catch (error) {
    console.log(error);
    console.log(`parse spec file ${specFile} error`);
  }
}

export default function createMiddleWare(specFolder) {
  const specFilePattern = `${specFolder}/**/*.json`;
  // const specfiles = glob.sync(
  //   specFilePattern,
  //   {
  //     absolute: true,
  //     nodir: true,
  //   });

  // addHandles(specfiles);
  // run watcher
  watcher(specFilePattern, {
    onNewSpec: addHandles,
    onChangeSpec: addHandles
  });

  return (() => {
    var _ref = _asyncToGenerator(function* (req, res, next) {

      const apiName = req.path;
      const method = req.method.toLowerCase();
      const methodMap = handleMap[apiName];
      console.log(`request ${req.path} method: ${method}`);
      if (methodMap === undefined) {
        next(new Error('未注册的 api'));
        return;
      }

      let handle = methodMap[method];
      if (handle === undefined) {
        handle = methodMap[METHOD_ALL];
      }

      let result = {};
      try {
        result = yield handle();
      } catch (error) {
        console.log(error);
      }

      return res.send(result.content);
    });

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })();
}

export { OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY };

// const configGlobPattern = `/**/${vscodeFolder}/${configFileName}`;