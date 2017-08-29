const Pipeline = require('./Pipeline');

class RespSimple extends Pipeline {
  valueGen(data) {
    const { content } = data;

    const source = {
      code: 200,
      msg: 'ok',
      ...this.option,
    };

    const {
      code,
      msg,
    } = source;

    let output;
    if (content.code !== undefined && content.msg !== undefined && content.data !== undefined ) {
      output = {
        ...content.data,
        code,
        msg,
      };
    }

    output = {
      data: content,
      code,
      msg,
    };

    return {
      ...data,
      content: output,
    };
  }
}

module.exports = RespSimple;
