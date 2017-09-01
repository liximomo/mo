import jsf from 'json-schema-faker';
import Pipeline from './Pipeline';

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

export default JsonSchema;
