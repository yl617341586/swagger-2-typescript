import { OpenAPIV3 as OA3 } from 'openapi-types';
import { handleRef } from '.';
export default (schema: OA3.SchemaObject | OA3.ReferenceObject) => {
  const { isRef } = handleRef(schema);
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
  const isAllOf = Object.prototype.hasOwnProperty.call(schema, 'allOf');
  return {
    isRef,
    comment: isRef ? '' : generateComment(<OA3.SchemaObject>schema),
    isAllOf,
  };
};
