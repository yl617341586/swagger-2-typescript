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
const upperCaseFirstLetter = (str: string) => str.replace(/^\w/, c => c.toUpperCase());
const deleteFirstSlash = (str: string) => str.slice(1);
const handleContent = (content: { [media: string]: OA3.MediaTypeObject }) => {
  const { isRef } = handleSchema(content['application/json']?.schema ?? {});
  return {
    isRef,
  };
};
export default (key: string, path: OA3.PathItemObject) => {
  const pathMap = new Map<string, { [key: string]: OA3.SchemaObject }>();
  Object.entries(path).forEach(([_key, value]) => {
    const requsetProprety = methodsMaptoProperty(<OA3.HttpMethods>_key);
    let mapName = '';
    if (requsetProprety) {
      const _value = <OA3.OperationObject>value;
      mapName = requsetProprety.replace(/^\w/, c => c.toUpperCase());
      if (requsetProprety in _value) {
        const schemas: { [key: string]: OA3.SchemaObject } = {};
        if ('parameters' in _value) {
          (<OA3.ParameterObject[]>_value['parameters'])?.forEach(
            ({ name, schema, description, required }) =>
              Object.assign(schemas, { [name]: { ...schema, description, required } }, {}),
          );
          pathMap.set(
            `${upperCaseFirstLetter(_key)}${upperCaseFirstLetter(deleteFirstSlash(key))}${mapName}`,
            schemas,
          );
        } else if ('requestBody' in _value) {
          const { content } = <OA3.RequestBodyObject>_value['requestBody'];
          const { isRef } = handleContent(content);
          if (isRef)
            pathMap.set(
              `${upperCaseFirstLetter(_key)}${upperCaseFirstLetter(deleteFirstSlash(key))}${mapName}`,
              schemas,
            );
        }
      }
      if ('responses' in _value) {
        Object.entries(_value['responses']).forEach(([code, response]) => {
          const { content } = <OA3.ResponseObject>response;
          const { isRef } = handleContent(content ?? {});
          if (isRef) {
            if (new RegExp(/^[2]\d{2}$/).test(code)) {
              pathMap.set(
                `${upperCaseFirstLetter(_key)}${upperCaseFirstLetter(deleteFirstSlash(key))}Responses`,
                {},
              );
            } else if (new RegExp(/^[4]\d{2}$/).test(code)) {
              pathMap.set(
                `${upperCaseFirstLetter(_key)}${upperCaseFirstLetter(deleteFirstSlash(key))}ResponsesError`,
                {},
              );
            }
          }
        });
      }
    }
  });
  return pathMap;
};
