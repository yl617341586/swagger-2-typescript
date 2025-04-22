import { OpenAPIV3 as OA3 } from 'openapi-types';
import {
  openapiVersionValidate,
  generateExport,
  handleSchema,
  handlePath,
  openapiOriginDataFormat,
} from '../utils';

const exportPathsParameters = (paths: OA3.PathsObject) => {
  const exportPathTypes: string[] = [];
  let lastDepth = 0;
  const rootNames: string[] = [];
  const schemaStack: [boolean, string, OA3.ReferenceObject | OA3.SchemaObject, number][] = [];
  const matchCurlyBraces = (depth: number) => {
    if (lastDepth < depth) exportPathTypes.push('{\n');
    if (lastDepth > depth && depth) exportPathTypes.push('}\n');
    if (!depth && lastDepth) exportPathTypes.push('}\n'.repeat(lastDepth));
    lastDepth = depth;
  };

  Object.entries(paths).forEach(entry => {
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
    if (isRef) exportPathTypes.push(ref(key, refName, depth));
    else {
      if (hasAllOf) exportPathTypes.push(allOf(key, (<OA3.SchemaObject>schema).allOf ?? [], depth));
      else exportPathTypes.push(generateFn(key, <OA3.SchemaObject>schema, depth));
    }
    if (!schemaStack.length) exportPathTypes.push('}\n'.repeat(lastDepth));
  }

  return exportPathTypes.join('');
};

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
    Object.entries(openapiData.paths).forEach(([key, path]) => console.log(handlePath(key, path)));
    exportPathsParameters(openapiData.paths);
    // const schemasTypes = exportSchemas(openapiData.components?.schemas);
    // console.log(schemasTypes);
  } catch (e: unknown) {
    console.error(`[Swagger2TSFile]: ${e}`);
  }
  return exportTypes.join('');
};
