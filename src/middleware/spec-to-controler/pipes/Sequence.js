const Pipeline = require('./Pipeline');

class Sequence extends Pipeline {
  valueGen(data) {
    const { context, content } = data;
    let {
      index,
    } = context;

    index = index % content.length;
    const value = content[index];

    return {
      ...data,
      content: value,
    };
  }
}

module.exports = Sequence;
