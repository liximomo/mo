var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Pipeline from './Pipeline';

class RespSimple extends Pipeline {
  valueGen(data) {
    const { content } = data;

    const source = _extends({
      code: 200,
      msg: 'ok'
    }, this.option);

    const {
      code,
      msg
    } = source;

    let output;
    if (content.code !== undefined && content.msg !== undefined && content.data !== undefined) {
      output = _extends({}, content.data, {
        code,
        msg
      });
    }

    output = {
      data: content,
      code,
      msg
    };

    return _extends({}, data, {
      content: output
    });
  }
}

export default RespSimple;