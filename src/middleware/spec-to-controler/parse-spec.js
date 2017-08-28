const Context = require('./Context');
const DefaultPipeline = require('./pipes/Pipeline');
const Interpolation = require('./pipes/Interpolation');
const Sequence = require('./pipes/Sequence');
const JsonSchema = require('./pipes/JsonSchema');

const METHOD_ALL = '$$method_all';
const RULE_DEFAULT = '$$rule_default';

const OPTION_RULE = '@rule';
const OPTION_METHOD = '@method';
const OPTION_RESP = '@resp';

const prePipes = [{
  pipe: Interpolation,
}];
const pipelineRegisty = {};

function registerPipeline(name, handler) {
  pipelineRegisty[name] = handler;
}

registerPipeline('sequence', Sequence);
registerPipeline('json-schema', JsonSchema);
registerPipeline(RULE_DEFAULT, DefaultPipeline);

function createHandle(pipes, resp) {
  const context = new Context();

  return async () => {
    let data = {
      context: context.getContext(),
      content: resp,
    };

    for (let index = pipes.length - 1; index >= 0; index -= 1) {
      const rule = pipes[index];
      const pipeInstance = new rule.pipe(rule.option);
      data = await pipeInstance.value(data);
    }
    return data;
  };
}

function normalizeRule(rule) {
  if (typeof rule === 'string') {
    return {
      pipe: rule,
    };
  }

  return rule;
}

function getPipeline(rule) {
  const normalizedRule = normalizeRule(rule);
  const pipelineName = normalizedRule.pipe;
  return {
    ...normalizedRule,
    pipe: pipelineRegisty[pipelineName],
  };
}

function normalizeSpec(spec) {
  const normalized = Object.assign({}, spec);
  normalized[OPTION_METHOD] =
    normalized[OPTION_METHOD] !== undefined ? normalized[OPTION_METHOD].toLowerCase() : METHOD_ALL;
  normalized[OPTION_RULE] =
    normalized[OPTION_RULE] !== undefined ? normalized[OPTION_RULE].toLowerCase() : RULE_DEFAULT;
  normalized[OPTION_RESP] =
    normalized[OPTION_RESP] !== undefined ? normalized[OPTION_RESP] : spec;

  return normalized;
}

function getPipelines(spec) {
  const rule = spec[OPTION_RULE];
  const userPipes = [].concat(rule).map(getPipeline);
  const pipes = prePipes.concat(userPipes);
  return pipes;
}

function createHandles(specifications) {
  return specifications.reduce((result, item) => {
    const spec = normalizeSpec(item);
    const method = spec[OPTION_METHOD];
    const pipes = getPipelines(spec);
    const response = spec[OPTION_RESP];

    result[method] = createHandle(pipes, response);
    return result;
  }, {});
}

module.exports = {
  createHandles,
  registerPipeline,
  METHOD_ALL,
  OPTION_RULE,
  OPTION_METHOD,
  OPTION_RESP,
};
