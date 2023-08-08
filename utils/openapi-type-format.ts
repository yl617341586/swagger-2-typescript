import { Schema } from '../openapi';
export default (type: Schema['type']): string => {
  switch (type) {
    case 'integer':
      return 'number';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';
    default:
      return 'any';
  }
};
