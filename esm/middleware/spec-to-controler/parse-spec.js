var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import Context from './Context';
import DefaultPipeline from './pipes/Pipeline';
import Interpolation from './pipes/Interpolation';
import Assign from './pipes/Assign';
import Sequence from './pipes/Sequence';
import JsonSchema from './pipes/JsonSchema';
import RespSimple from './pipes/RespSimple';

var METHOD_ALL = '$$method_all';
var RULE_DEFAULT = '$$rule_default';

var OPTION_RULE = '@rule';
var OPTION_METHOD = '@method';
var OPTION_RESP = '@resp';
var OPTION_QUERY = '@query';

var prePipes = [{
  Pipe: Interpolation
}];
var pipelineRegisty = {};

function registerPipeline(name, handler) {
  pipelineRegisty[name] = handler;
}

registerPipeline('assign', Assign);
registerPipeline('sequence', Sequence);
registerPipeline('json-schema', JsonSchema);
registerPipeline('resp-simple', RespSimple);
registerPipeline(RULE_DEFAULT, DefaultPipeline);

function createHandle(pipes, resp) {
  var _this = this;

  var context = new Context();
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

export { createHandles, registerPipeline, METHOD_ALL, OPTION_RULE, OPTION_METHOD, OPTION_RESP, OPTION_QUERY };