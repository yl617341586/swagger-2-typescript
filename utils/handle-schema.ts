import { OpenAPIV3 as OA3 } from 'openapi-types';
import handleRef from './handle-ref';
export default (schema: OA3.SchemaObject | OA3.ReferenceObject) => {
  const { isRef, name: refName } = handleRef(schema);

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
    hasAllOf,
    hasAdditionalProperties,
  };
};
