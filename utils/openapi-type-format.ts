import { OpenAPIV3 as OA3 } from 'openapi-types';
import { handleSchema } from '.';
export default (schema: OA3.SchemaObject): string => {
  switch (schema.type) {
    case 'integer':
      return 'number';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';
    case 'array': {
      const _schema = <OA3.ArraySchemaObject>schema;
      const { isRef, refName } = handleSchema(_schema.items);
      return `${isRef ? refName : ((<OA3.SchemaObject>schema.items).type ?? 'unknown')}[]`;
    }
    case 'object': {
      return '';
    }
    default:
      return 'unknown';
  }
};
