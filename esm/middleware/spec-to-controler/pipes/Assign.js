var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Pipeline from './Pipeline';

class Assign extends Pipeline {
  valueGen(data) {
    const { content } = data;

    const source = this.option || {};

    return _extends({}, data, {
      content: _extends({}, content, source)
    });
  }
}

export default Assign;