function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import fs from 'fs';
import getJsonSchema from '../doc-to-json-schema';

import { OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY } from '../../middleware/spec-to-controler';

function schemaToApiSpec(schemas) {
  return schemas.reduce(function (result, schema) {
    var _spec;

    var spec = (_spec = {}, _defineProperty(_spec, OPTION_RULE, 'json-schema'), _defineProperty(_spec, OPTION_METHOD, schema.method), _defineProperty(_spec, OPTION_RESP, schema.respond), _spec);

    if (schema.query) {
      spec[OPTION_QUERY] = schema.query;
    }

    result[schema.api] = spec;
    return result;
  }, {});
}

export default (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, filename) {
    var schemas, spec;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getJsonSchema(url);

          case 2:
            schemas = _context.sent;
            spec = schemaToApiSpec(schemas);

            fs.writeFile(filename, JSON.stringify(spec, null, 4), function (error) {
              if (error) {
                console.error(error);
              }

              console.log('generate api-spec success');
            });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function generateSpecFile(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return generateSpecFile;
})();