const Pipeline = require('./Pipeline');

class Assign extends Pipeline {
  valueGen(data) {
    const { content } = data;

    const source = this.option || {};

    return {
      ...data,
      content: {
        ...content,
        ...source,
      },
    };
  }
}

module.exports = Assign;
