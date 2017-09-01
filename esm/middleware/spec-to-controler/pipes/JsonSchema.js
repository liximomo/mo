var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import jsf from 'json-schema-faker';
import Pipeline from './Pipeline';

class JsonSchema extends Pipeline {
  valueGen(data) {
    return _asyncToGenerator(function* () {
      const { content } = data;
      const sample = yield jsf.resolve(content);

      return _extends({}, data, {
        content: sample
      });
    })();
  }
}

export default JsonSchema;