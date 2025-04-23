import { OpenAPIV3 as OA3 } from 'openapi-types';
import handleSchema from './handle-schema';
const methodsMaptoProperty = (method: OA3.HttpMethods) => {
  switch (method) {
    case 'get':
      return 'parameters';
    case 'put':
      return 'requestBody';
    case 'post':
      return 'requestBody';
    case 'delete':
      return 'parameters';
    case 'options':
      return 'parameters';
    case 'head':
      return 'parameters';
    case 'patch':
      return 'requestBody';
    case 'trace':
      return 'parameters';
  }
};
const upperCaseLetter = (str: string) => str.replace(/\/\w/g, c => c[1].toUpperCase());
const handleCurlyBraces = (str: string) =>
  str.replace(
    /\{([^}]+)\}/g,
    (_, capture) => `by${capture.charAt(0).toUpperCase()}${capture.slice(1)}`,
  );

export default (key: string, path: OA3.PathItemObject) => {
  const pathMap = new Map<string, { [key: string]: OA3.SchemaObject }>();
  Object.entries(path).forEach(([_key, value]) => {
    const requsetProprety = methodsMaptoProperty(<OA3.HttpMethods>_key);
    if (!requsetProprety) return;
    const _value = <OA3.OperationObject>value;
    const mapName = requsetProprety.replace(/^\w/, c => c.toUpperCase());
    if ('requestBody' in _value) {
      const schemas: { [key: string]: OA3.SchemaObject } = {};
      const { content } = <OA3.RequestBodyObject>_value['requestBody'];
      const { isRef, isArray } = handleSchema(content?.['application/json']?.schema ?? {});
      if (!isRef && content && !isArray)
        pathMap.set(
          `${upperCaseLetter(_key)}${upperCaseLetter(handleCurlyBraces(key))}${mapName}`,
          schemas,
        );
    }
    if ('parameters' in _value && _value['parameters']?.length) {
      const schemas: { [key: string]: OA3.SchemaObject } = {};
      const properties: OA3.SchemaObject['properties'] = {};
      (<OA3.ParameterObject[]>_value['parameters'])?.forEach(
        ({ name, schema, description, required }) =>
          Object.assign(properties, { [name]: { ...schema, description, required } }, {}),
      );
      Object.assign(schemas, { properties });
      pathMap.set(
        `${upperCaseLetter(_key)}${upperCaseLetter(handleCurlyBraces(key))}${mapName}`,
        schemas,
      );
    }
    if ('responses' in _value) {
      const schemas: { [key: string]: OA3.SchemaObject } = {};
      Object.entries(_value['responses']).forEach(([code, response]) => {
        const { content } = <OA3.ResponseObject>response;
        const schema = content?.['application/json']?.schema ?? {};
        const { isRef, isArray, hasAdditionalProperties } = handleSchema(schema);
        if (
          !isRef &&
          content &&
          !isArray &&
          !hasAdditionalProperties &&
          (<OA3.SchemaObject>schema).type === 'object'
        ) {
          Object.assign(schemas, content?.['application/json']?.schema);
          if (new RegExp(/^[2]\d{2}$/).test(code)) {
            pathMap.set(
              `${upperCaseLetter(_key)}${upperCaseLetter(handleCurlyBraces(key))}Responses`,
              schemas,
            );
          } else if (new RegExp(/^[4]\d{2}$/).test(code)) {
            pathMap.set(
              `${upperCaseLetter(_key)}${upperCaseLetter(handleCurlyBraces(key))}ResponsesError`,
              schemas,
            );
          }
        }
      });
    }
  });
  return pathMap;
};
