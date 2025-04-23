import { OpenAPIV3 as OA3 } from 'openapi-types';
import {
  openapiVersionValidate,
  generateExport,
  handleSchema,
  openapiOriginDataFormat,
  serializePaths,
} from '../utils';

const exportSchemas = (schemas: OA3.ComponentsObject['schemas']) => {
  const exportSchemaTypes: string[] = [];

  if (!schemas) return exportSchemaTypes.join('');
  let lastDepth = 0;
  const rootNames: string[] = [];
  const schemaStack: [boolean, string, OA3.ReferenceObject | OA3.SchemaObject, number][] = [];
  const matchCurlyBraces = (depth: number) => {
    if (lastDepth < depth) exportSchemaTypes.push('{\n');
    if (lastDepth > depth && depth) exportSchemaTypes.push('}\n');
    if (!depth && lastDepth) exportSchemaTypes.push('}\n'.repeat(lastDepth));
    lastDepth = depth;
  };
  Object.entries(schemas).forEach(entry => {
    rootNames.push(entry[0]);
    schemaStack.push([true, ...entry, 0]);
  });
  while (schemaStack.length) {
    const [isRoot, key, schema, depth] = schemaStack.shift()!;
    const { isRef, refName, hasAllOf, isArray } = handleSchema(schema);
    const { ref, allOf, baseObject, complexObject } = generateExport.schema(isRoot);
    const properties = (<OA3.SchemaObject>schema).properties;
    const generateFn = isArray ? complexObject : baseObject;
    matchCurlyBraces(depth);
    if (properties) {
      const arr = Object.entries(properties);
      for (let i = arr.length - 1; i >= 0; i--) {
        const [_key, property] = arr[i];
        schemaStack.unshift([false, _key, property, depth + 1]);
      }
    }
    if (isRef) exportSchemaTypes.push(ref(key, refName, depth));
    else {
      exportSchemaTypes.push(generateExport.comment(<OA3.SchemaObject>schema));
      if (hasAllOf)
        exportSchemaTypes.push(allOf(key, (<OA3.SchemaObject>schema).allOf ?? [], depth));
      else exportSchemaTypes.push(generateFn(key, <OA3.SchemaObject>schema, depth));
    }
    if (!schemaStack.length) exportSchemaTypes.push('}\n'.repeat(lastDepth));
  }
  return exportSchemaTypes.join('');
};

export default (data: OA3.Document | string): string => {
  const exportTypes: string[] = [];

  try {
    // format the incoming parameters to JSON object
    const openapiData = openapiOriginDataFormat(data);
    // validate the openapi JSON version
    openapiVersionValidate(openapiData.openapi);

    const pathsTypes = exportSchemas(serializePaths(openapiData.paths));
    const schemasTypes = exportSchemas(openapiData.components?.schemas);
    exportTypes.push(...[pathsTypes, schemasTypes]);
  } catch (e: unknown) {
    console.error(`[Swagger2TSFile]: ${e}`);
  }
  return exportTypes.join('');
};
