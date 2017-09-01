import fs from 'fs';
import getJsonSchema from '../doc-to-json-schema';

import {
  OPTION_RULE,
  OPTION_METHOD,
  OPTION_RESP,
  OPTION_QUERY,
} from '../../middleware/spec-to-controler';

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

export default async function generateSpecFile(url, filename) {
  const schemas = await getJsonSchema(url);
  const spec = schemaToApiSpec(schemas);
  fs.writeFile(filename, JSON.stringify(spec, null, 4), (error) => {
    if (error) {
      console.error(error);
    }

    console.log('generate api-spec success');
  });
}