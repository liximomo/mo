const Pipeline = require('./Pipeline');

function supplant(string, props) {
  return string.replace(/{([^{}]*)}/g, (match, expr) => {
    const value = props[expr];
    return typeof value === 'string' || typeof value === 'number' ? value : match;
  });
}

function interpolate(obj, props) {
  const str = JSON.stringify(obj);
  return supplant(str, props);
}

class Interpolation extends Pipeline {
  valueGen(data) {
    const { context, content } = data;

    const result = JSON.parse(interpolate(content, {
      ...context,
      time: context.time.getTime(),
    }));

    return {
      ...data,
      content: result,
    };
  }
}

module.exports = Interpolation;
