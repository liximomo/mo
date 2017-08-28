const jsf = require('json-schema-faker');
const Pipeline = require('./Pipeline');

class JsonSchema extends Pipeline {
  async valueGen(data) {
    const { content } = data;
    const sample = await jsf.resolve(content); 

    return {
      ...data,
      content: sample,
    };
  }
}

module.exports = JsonSchema;
