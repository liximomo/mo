function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import watcher from './watcher';
import requireUncached from '../../utils/requireUncached';

import { METHOD_ALL, OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY, createHandles } from './parse-spec';

var handleMap = {};

function addHandles(specFile) {
  try {
    var specFiles = [].concat(specFile);
    var specs = Object.assign.apply({}, [].concat(specFiles.map(function (file) {
      return requireUncached(file);
    })));

    Object.keys(specs).reduce(function (result, apiName) {
      var definitions = [].concat(specs[apiName]);
      result[apiName] = createHandles(definitions);
      return result;
    }, handleMap);

    console.log('process spec files success:\n  ' + specFile.join('\n  ') + ' ');
  } catch (error) {
    console.log(error);
    console.log('parse spec file ' + specFile + ' error');
  }
}

export default function createMiddleWare(specFolder) {
  var _this = this;

  var specFilePattern = specFolder + '/**/*.json';
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

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      var apiName, method, methodMap, handle, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              apiName = req.path;
              method = req.method.toLowerCase();
              methodMap = handleMap[apiName];

              console.log('request ' + req.path + ' method: ' + method);

              if (!(methodMap === undefined)) {
                _context.next = 7;
                break;
              }

              next(new Error('未注册的 api'));
              return _context.abrupt('return');

            case 7:
              handle = methodMap[method];

              if (handle === undefined) {
                handle = methodMap[METHOD_ALL];
              }

              result = {};
              _context.prev = 10;
              _context.next = 13;
              return handle(req);

            case 13:
              result = _context.sent;
              _context.next = 19;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context['catch'](10);

              console.log(_context.t0);

            case 19:
              return _context.abrupt('return', res.send(result.content));

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[10, 16]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

export { OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY };

// const configGlobPattern = `/**/${vscodeFolder}/${configFileName}`;