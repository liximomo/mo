var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Pipeline from './Pipeline';

class Sequence extends Pipeline {
  valueGen(data) {
    const { context, content } = data;
    let {
      index
    } = context;

    index = index % content.length;
    const value = content[index];

    return _extends({}, data, {
      content: value
    });
  }
}

export default Sequence;