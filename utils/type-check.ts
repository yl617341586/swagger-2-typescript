import type { PropertiesItem } from '../swagger';
export const checkIsRefType = (items: PropertiesItem['items']): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(items, '$ref');
export const checkIsEnumType = (items: PropertiesItem['items'] | PropertiesItem): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'enum');
