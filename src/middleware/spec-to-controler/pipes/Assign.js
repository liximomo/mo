import Pipeline from './Pipeline';

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

export default Assign;
