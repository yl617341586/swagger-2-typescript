import type { DefinitionsItem, PropertiesItem, Swagger, SwaggerRef } from '../swagger';
const checkIsRefType = (items: PropertiesItem['items']): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(items, '$ref');
const checkIsEnumType = (items: PropertiesItem['items'] | PropertiesItem): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'enum');
const generateArrayType = (items: PropertiesItem['items']) => {
  if (checkIsRefType(items)) {
    return `Array<${generateRefType(items as SwaggerRef)}>`;
  } else if (checkIsEnumType(items)) {
    const arrStr = JSON.stringify(items?.enum).replace(/,/g, ' | ');
    return `Array<${arrStr.substring(1, arrStr.length - 1)}>`;
  }
  return `Array<${items?.type}>`;
};
const generateStrType = (item: PropertiesItem, key: string) => {
  if (checkIsEnumType(item)) {
    const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
    const enumItem = String(arrStr.substring(1, arrStr.length - 1));
    return enumItem;
  }
  return item?.type;
};
const generateNumberType = (item: PropertiesItem) => {
  if (checkIsEnumType(item)) {
    const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
    return String(arrStr.substring(1, arrStr.length - 1));
  }
  return 'number';
};
const generateBooleanType = (item: PropertiesItem) => {
  if (checkIsEnumType(item)) {
    const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
    return String(arrStr.substring(1, arrStr.length - 1));
  }
  return item?.type;
};
const generateRefType = (item: SwaggerRef) => {
  if (item.originalRef) return item.originalRef?.replace(/\«|\»/g, '');
  else if (item.$ref)
    return item.$ref?.substring(item.$ref.lastIndexOf('/') + 1).replace(/\«|\»/g, '');
};
const handleAttributes = (item: PropertiesItem & SwaggerRef, key: string) => {
  if (item.type)
    switch (item.type) {
      case 'string':
        return generateStrType(item, key);
      case 'boolean':
        return generateBooleanType(item);
      case 'integer':
        return generateNumberType(item);
      case 'array':
        return generateArrayType(item.items);
    }
  else if (checkIsRefType(item)) return generateRefType(item);
};

const handleItem = (key: string, item: DefinitionsItem) => {
  return `
  export interface ${key.replace(/\«|\»/g, '')} {
  ${Object.keys(item.properties)
    .map(
      inlineKey => `${
        item.properties[inlineKey].description
          ? `/**${item.properties[inlineKey].description} ${
              item.properties[inlineKey].maxLength
                ? `minLength: ${item.properties[inlineKey].minLength}`
                : ''
            } ${
              item.properties[inlineKey].maxLength
                ? `maxLength: ${item.properties[inlineKey].maxLength}`
                : ''
            } */`
          : ''
      }
      ${inlineKey}: ${handleAttributes(item.properties[inlineKey], inlineKey)};
      `,
    )
    .join('')}
    }
  `;
};

export default (json: Swagger) => {
  let typeData = '';
  for (const key in json.definitions) {
    const item = json.definitions[key];
    typeData += handleItem(key, item);
  }
  return typeData;
};
