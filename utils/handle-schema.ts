import { OpenAPIV3 as OA3 } from 'openapi-types';
import handleRef from './handle-ref';
export default (schema: OA3.SchemaObject | OA3.ReferenceObject) => {
  const { isRef, name: refName } = handleRef(schema);
  const generateComment = (schema: OA3.SchemaObject): string => {
    const comments: string[] = [];
    const allowList: (keyof OA3.SchemaObject)[] = ['description', 'format'];
    allowList.forEach(key => {
      if (schema[key]) {
        const _key = `@${key}`.replaceAll('@description', '');
        comments.push(`${_key} ${schema[key]}\n`);
      }
    });
    return comments.length ? `/**\n ${comments.join('')} */\n` : '';
  };
  const hasAllOf = Object.prototype.hasOwnProperty.call(schema, 'allOf');
  const isArray = Object.prototype.hasOwnProperty.call(schema, 'items');
  const hasAdditionalProperties = Object.prototype.hasOwnProperty.call(
    schema,
    'additionalProperties',
  );

  return {
    isRef,
    isArray,
    refName,
    comment: isRef ? '' : generateComment(<OA3.SchemaObject>schema),
    hasAllOf,
    hasAdditionalProperties,
  };
};
