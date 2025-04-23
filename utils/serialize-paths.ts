import { OpenAPIV3 as OA3 } from 'openapi-types';
import handlePath from './handle-path';
export default (paths: OA3.PathsObject) => {
  const schemas: OA3.ComponentsObject['schemas'] = {};
  Object.entries(paths).forEach(([key, value]) => {
    const pathSchemas = handlePath(key, <OA3.PathItemObject>value);
    pathSchemas
      .entries()
      .forEach(([pathKey, schema]) => Object.assign(schemas, { [pathKey]: schema }));
  });
  return schemas;
};
