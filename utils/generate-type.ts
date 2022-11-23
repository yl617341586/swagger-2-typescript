import { DefinitionsItem, PropertiesItem, Swagger, SwaggerRef } from '../swagger';
const checkIsRefType = (items: PropertiesItem['items']): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'originalRef');
const checkIsEnumType = (items: PropertiesItem['items']): boolean =>
  Object.prototype.hasOwnProperty.call(items, 'enum');
const generateArrayType = (items: PropertiesItem['items']) => {
  if (checkIsRefType(items)) return `Array<${items?.originalRef?.replace(/\«|\»/g, '')}>`;
  else if (checkIsEnumType(items)) {
    const arrStr = JSON.stringify(items?.enum).replace(/,/g, ' | ');
    return `Array<${arrStr.substring(1, arrStr.length - 1)}>`;
  }
  return `Array<${items?.type}>`;
};
const handleAttributes = (item: PropertiesItem & SwaggerRef) => {
  if (item.type)
    switch (item.type) {
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'integer':
        return 'number';
      case 'array':
        return generateArrayType(item.items);
    }
  else if (checkIsRefType(item)) return item.originalRef?.replace(/\«|\»/g, '');
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
          ${inlineKey}: ${handleAttributes(item.properties[inlineKey])};
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
