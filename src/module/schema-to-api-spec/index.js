const fs = require('fs');
const getJsonSchema = require('../doc-to-json-schema');

const {
  OPTION_RULE,
  OPTION_METHOD,
  OPTION_RESP,
  OPTION_QUERY,
} = require('../../middleware/spec-to-controler');

function schemaToApiSpec(schemas) {
  return schemas.reduce((result, schema) => {
    const spec = {
      [OPTION_RULE]: 'json-schema',
      [OPTION_METHOD]: schema.method,
      [OPTION_RESP]: schema.respond,
    };

    if (schema.query) {
      spec[OPTION_QUERY] = schema.query;
    }

    result[schema.api] = spec;
    return result;
  }, {});
}

async function generateSpecFile(url, filename) {
  const schemas = await getJsonSchema(url);
  const spec = schemaToApiSpec(schemas);
  fs.writeFile(filename, JSON.stringify(spec, null, 4), (error) => {
    if (error) {
      console.error(error);
    }

    console.log('generate api-spec success');
  });
}

module.exports = {
  generateSpecFile,
}