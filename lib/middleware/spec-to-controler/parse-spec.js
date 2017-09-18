'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPTION_QUERY = exports.OPTION_RESP = exports.OPTION_METHOD = exports.OPTION_RULE = exports.METHOD_ALL = exports.registerPipeline = exports.createHandles = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Pipeline = require('./pipes/Pipeline');

var _Pipeline2 = _interopRequireDefault(_Pipeline);

var _Interpolation = require('./pipes/Interpolation');

var _Interpolation2 = _interopRequireDefault(_Interpolation);

var _Assign = require('./pipes/Assign');

var _Assign2 = _interopRequireDefault(_Assign);

var _Sequence = require('./pipes/Sequence');

var _Sequence2 = _interopRequireDefault(_Sequence);

var _JsonSchema = require('./pipes/JsonSchema');

var _JsonSchema2 = _interopRequireDefault(_JsonSchema);

var _RespSimple = require('./pipes/RespSimple');

var _RespSimple2 = _interopRequireDefault(_RespSimple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var METHOD_ALL = '$$method_all';
var RULE_DEFAULT = '$$rule_default';

var OPTION_RULE = '@rule';
var OPTION_METHOD = '@method';
var OPTION_RESP = '@resp';
var OPTION_QUERY = '@query';

var prePipes = [{
  Pipe: _Interpolation2.default
}];
var pipelineRegisty = {};

function registerPipeline(name, handler) {
  pipelineRegisty[name] = handler;
}

registerPipeline('assign', _Assign2.default);
registerPipeline('sequence', _Sequence2.default);
registerPipeline('json-schema', _JsonSchema2.default);
registerPipeline('resp-simple', _RespSimple2.default);
registerPipeline(RULE_DEFAULT, _Pipeline2.default);

function createHandle(pipes, resp) {
  var _this = this;

  var context = new _Context2.default();
  var pipeInstanceList = pipes.reduceRight(function (list, pipe) {
    var pipeInstance = new pipe.Pipe(pipe.option);
    list.push(pipeInstance);
    return list;
  }, []);

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
      var data, index, pipe;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              data = {
                context: context.getContext(),
                content: resp,
                req: req
              };

              // return pipeInstanceList.reduce(async (output, pipe) => {
              //   const result = await pipe.value(output);
              //   return result;
              // }, data);

              index = 0;

            case 2:
              if (!(index < pipeInstanceList.length)) {
                _context.next = 10;
                break;
              }

              pipe = pipeInstanceList[index];
              _context.next = 6;
              return pipe.value(data);

            case 6:
              data = _context.sent;

            case 7:
              index += 1;
              _context.next = 2;
              break;

            case 10:
              return _context.abrupt('return', data);

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

function normalizeRule(rule) {
  if (typeof rule === 'string') {
    return {
      name: rule.toLocaleLowerCase()
    };
  }

  return _extends({}, rule, {
    name: rule.name.toLocaleLowerCase()
  });
}

function getPipeline(rule) {
  var normalizedRule = normalizeRule(rule);
  var pipelineName = normalizedRule.name;
  return _extends({}, normalizedRule, {
    Pipe: pipelineRegisty[pipelineName]
  });
}

function normalizeSpec(spec) {
  var normalized = Object.assign({}, spec);
  normalized[OPTION_METHOD] = normalized[OPTION_METHOD] !== undefined ? normalized[OPTION_METHOD].toLowerCase() : METHOD_ALL;
  normalized[OPTION_RULE] = normalized[OPTION_RULE] !== undefined ? normalized[OPTION_RULE] : RULE_DEFAULT;
  normalized[OPTION_RESP] = normalized[OPTION_RESP] !== undefined ? normalized[OPTION_RESP] : spec;

  return normalized;
}

function getPipelines(spec) {
  var rule = spec[OPTION_RULE];
  var userPipes = [].concat(rule).map(getPipeline);
  var pipes = prePipes.concat(userPipes);
  return pipes;
}

function createHandles(specifications) {
  return specifications.reduce(function (result, item) {
    var spec = normalizeSpec(item);
    var method = spec[OPTION_METHOD];
    var pipes = getPipelines(spec);
    var response = spec[OPTION_RESP];

    result[method] = createHandle(pipes, response);
    return result;
  }, {});
}

exports.createHandles = createHandles;
exports.registerPipeline = registerPipeline;
exports.METHOD_ALL = METHOD_ALL;
exports.OPTION_RULE = OPTION_RULE;
exports.OPTION_METHOD = OPTION_METHOD;
exports.OPTION_RESP = OPTION_RESP;
exports.OPTION_QUERY = OPTION_QUERY;