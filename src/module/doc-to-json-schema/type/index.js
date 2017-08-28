const TYPE_INTEGER = 'integer';
const TYPE_NUMBER = 'number';
const TYPE_STRING = 'string';
const TYPE_BOOLEAN = 'boolean';
const TYPE_ARRAY = 'array';
const TYPE_OBJECT = 'object';

function arrayEnHance(typeInfo, typeStr) {
  const subTypeStr = typeStr.match(/([a-zA-Z[\]]+)\[\]$/i);
  return typeInfo.items = parseType(subTypeStr || TYPE_STRING);
}

const rules = [{
  test: /(integer|int)/i,
  type: TYPE_INTEGER,
}, {
  test: /(number|decimal)/i,
  type: TYPE_NUMBER,
}, {
  test: /(string|date)/i,
  type: TYPE_STRING,
}, {
  test: /array/i,
  type: TYPE_ARRAY,
  enhance: arrayEnHance,
}, {
  test: /[a-zA-Z[\]]+\[\]$/i,
  type: TYPE_ARRAY,
  enhance: arrayEnHance,
}, {
  test: /object$/i,
  type: TYPE_OBJECT,
}, {
  test: /(dict|dic)$/i,
  type: TYPE_OBJECT,
}];

function parseType(typeString) {
  const match = rules.find(rule => {
    return rule.test.test(typeString);
  });

  if (match === undefined) {
    console.log(typeString);
  }

  const typeInfo = {};
  typeInfo.type = match.type;
  typeInfo.meta = {
    required: true,
  };
  if (match.enhance) {
    match.enhance(typeInfo, typeString);
  }
  return typeInfo;
};

function typeToJsonSchema(keyInfo) {
  let result = {};

  delete keyInfo.meta;
  delete keyInfo.level;
  result.type = keyInfo.type;
  if (result.type === TYPE_OBJECT) {
    const properties = keyInfo.properties;
    if (properties !== undefined) {
      result.required = [];
      result.properties = {};
      Object.keys(properties).forEach(propertyName => {
        const propertyInfo = properties[propertyName];
        if (propertyInfo.meta.required) {
          result.required.push(propertyName);
        }
  
        result.properties[propertyName] = typeToJsonSchema(properties[propertyName]);
      });

      if (result.required.length <= 0) {
        delete result.required;
      }
    }
  } else if (result.type === TYPE_ARRAY) {
    result.items = typeToJsonSchema({
      ...keyInfo.items,
      properties: keyInfo.properties,
    });
  } else {
    // do nothing
  }

  return result;
};

module.exports = {
  TYPE_INTEGER,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_ARRAY,
  TYPE_OBJECT,
  parseType,
  typeToJsonSchema,
};