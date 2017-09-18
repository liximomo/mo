import watcher from'./watcher';
import requireUncached from '../../utils/requireUncached';

import {
  METHOD_ALL,
  OPTION_RULE,
  OPTION_METHOD,
  OPTION_RESP,
  OPTION_QUERY,
  createHandles,
} from './parse-spec';

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
  } catch(error) {
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
    onChangeSpec: addHandles,
  });

  return async (req, res, next) => {
    
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
      result = await handle(req);
    } catch(error) {
      console.log(error);
    }
   
    return res.send(result.content);
  };
}

export {
  OPTION_RULE,
  OPTION_METHOD,
  OPTION_RESP,
  OPTION_QUERY,
}

// const configGlobPattern = `/**/${vscodeFolder}/${configFileName}`;
