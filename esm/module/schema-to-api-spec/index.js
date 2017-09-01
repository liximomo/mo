function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import fs from 'fs';
import getJsonSchema from '../doc-to-json-schema';

import { OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY } from '../../middleware/spec-to-controler';

function schemaToApiSpec(schemas) {
  return schemas.reduce((result, schema) => {
    const spec = {
      [OPTION_RULE]: 'json-schema',
      [OPTION_METHOD]: schema.method,
      [OPTION_RESP]: schema.respond
    };

    if (schema.query) {
      spec[OPTION_QUERY] = schema.query;
    }

    result[schema.api] = spec;
    return result;
  }, {});
}

export default (() => {
  var _ref = _asyncToGenerator(function* (url, filename) {
    const schemas = yield getJsonSchema(url);
    const spec = schemaToApiSpec(schemas);
    fs.writeFile(filename, JSON.stringify(spec, null, 4), function (error) {
      if (error) {
        console.error(error);
      }

      console.log('generate api-spec success');
    });
  });

  function generateSpecFile(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return generateSpecFile;
})();