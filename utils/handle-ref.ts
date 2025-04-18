import { OpenAPIV3 as OA3 } from 'openapi-types';

export default (schema: OA3.SchemaObject | OA3.ReferenceObject) => {
  const isRef = Object.prototype.hasOwnProperty.call(schema, '$ref');
  const regex = /[^/]+$/;
  const name = isRef ? ((<OA3.ReferenceObject>schema).$ref.match(regex)?.[0] ?? '') : '';
  return { isRef, name };
};
