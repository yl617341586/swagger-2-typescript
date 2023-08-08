import { Reference, Schema } from '../openapi';
export default (schema: Schema | Reference) => {
  const isRef = Object.prototype.hasOwnProperty.call(schema, '$ref');
  const name = isRef ? (schema as Reference)?.$ref.replace('#/components/schemas/', '') : null;
  return { name };
};
