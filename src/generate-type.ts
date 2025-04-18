import { OpenAPIV3 as OA3 } from 'openapi-types';
import {
  openapiVersionValidate,
  generateExport,
  handleSchema,
  openapiOriginDataFormat,
  stringifyProperties,
} from '../utils';

export default (data: OA3.Document | string): string => {
  const exportTypes: string[] = [];
  try {
    // format the incoming parameters to JSON object
    const openapiData = openapiOriginDataFormat(data);
    // validate the openapi JSON version
    openapiVersionValidate(openapiData.openapi);

    if (!openapiData.components?.schemas) return exportTypes.join('');
    const rootNames: string[] = [];
    const schemaStack: [boolean, string, OA3.ReferenceObject | OA3.SchemaObject, number][] = [];
    let lastDepth = 0;
    Object.entries(openapiData.components.schemas).forEach(entry => {
      rootNames.push(entry[0]);
      schemaStack.push([true, ...entry, 0]);
    });
    while (schemaStack.length) {
      const [isRoot, key, schema, depth] = schemaStack.shift()!;
      const { isRef, refName, hasAllOf, isArray } = handleSchema(schema);
      const properties = (<OA3.SchemaObject>schema).properties;
      const { ref, allOf, baseObject, complexObject } = generateExport(isRoot);
      const generateFn = isArray ? complexObject : baseObject;
      if (lastDepth < depth) exportTypes.push('{\n');
      if (lastDepth > depth && depth) exportTypes.push('}\n');
      if (!depth && lastDepth) exportTypes.push('}\n'.repeat(lastDepth));
      lastDepth = depth;
      if (properties) {
        const arr = Object.entries(properties);
        for (let i = arr.length - 1; i >= 0; i--) {
          const [_key, property] = arr[i];
          schemaStack.unshift([false, _key, property, depth + 1]);
        }
      }
      if (isRef) exportTypes.push(ref(key, refName, depth));
      else {
        if (hasAllOf) {
          console.log(key, schema);
        } else exportTypes.push(generateFn(key, <OA3.SchemaObject>schema, depth));
      }
      if (!schemaStack.length) exportTypes.push('}\n'.repeat(lastDepth));
    }
    // console.log(exportTypes.join(''));
  } catch (e: unknown) {
    console.error(`[Swagger2TSFile]: ${e}`);
  }
  return exportTypes.join('');
};
