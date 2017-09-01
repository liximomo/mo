var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Pipeline from './Pipeline';

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

    const result = JSON.parse(interpolate(content, _extends({}, context, {
      time: context.time.getTime()
    })));

    return _extends({}, data, {
      content: result
    });
  }
}

export default Interpolation;