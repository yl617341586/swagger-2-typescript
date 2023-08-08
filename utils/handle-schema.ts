import { openapiTypeFormat } from '.';
import { Schema } from '../openapi';
import handleRef from './handle-ref';
export default () => {
  const compositeType = () => {
    const isAllOf = (schema: Schema) => Object.prototype.hasOwnProperty.call(schema, 'allOf');
    const isOneOf = (schema: Schema) => Object.prototype.hasOwnProperty.call(schema, 'oneOf');
    const runAllOf = (schema: Schema) =>
      schema.allOf
        ?.map(item => {
          const { name } = handleRef(item);
          if (name) return name;
          else return `{${handleSchemaObject(item as Schema)}}`;
        })
        .join(' & ');
    const runOneOf = (schema: Schema) => {};
    return { isAllOf, isOneOf, runAllOf };
  };
  /**
   * 合并type为object的schema
   * @param schema scchema可迭代对象
   */
  const objectAssign = (...schema: Array<Schema>) => {
    const baseSchema = Object.assign({}, schema.shift());
    if (baseSchema?.type !== 'object') throw new Error('只能合并type为object的schema');
    schema.forEach(item => {
      if (item.type !== 'object') throw new Error('只能合并type为object的schema');
      baseSchema.required = Array.from(
        new Set([...(baseSchema.required ?? []), ...(item.required ?? [])]),
      );
      baseSchema.properties = {
        ...baseSchema.properties,
        ...item.properties,
      };
    });
    return baseSchema;
  };

  /**
   * 处理schema中的type为object的情况
   */
  const handleSchemaObject = (schema: Schema) => {
    const { isEnum, run: handleEnum } = handleSchemaEnum();
    const { isArray, run: handleArray } = handleSchemaArray();
    const { isAllOf, runAllOf } = compositeType();
    const handleObject = (schema: Schema) => {
      let result = '';
      Object.entries(schema.properties ?? {}).forEach(([key, item]) => {
        const { name } = handleRef(item);

        const required = schema.required?.includes(key) || (item as Schema).required ? '' : '?';
        // 给属性添加注释
        result += handleAttributesMeta(item as Schema);
        // 引用类型直接把引用类型的名称作为属性类型
        if (name) result += `${key}${required}: ${name}\n`;
        // 如何是对象就继续递归
        else if ((item as Schema).type === 'object')
          result += `${key}${required}: {\n${handleObject(item as Schema)}}\n`;
        // 如果是枚举就把枚举的值作为属性类型
        else if (isEnum(item as Schema))
          result += `${key}${required}: ${handleEnum(item as Schema)}\n`;
        // 如果是数组就把数组的值作为属性类型
        else if (isArray(item as Schema))
          result += `${key}${required}: ${handleArray(item as Schema)}\n`;
        else if (isAllOf(item as Schema))
          result += `${key}${required}: ${runAllOf(item as Schema)}\n`;
        // 其他类型直接输出
        else result += `${key}${required}: ${openapiTypeFormat((item as Schema).type)}\n`;
      });
      return result;
    };
    return handleObject(schema);
  };

  /**
   * 处理schema中的type为enum的情况
   */
  const handleSchemaEnum = () => {
    const isEnum = (schema: Schema) => Object.prototype.hasOwnProperty.call(schema, 'enum');
    const run = (schema: Schema) =>
      schema.enum
        ?.map(item => {
          switch (typeof item) {
            case 'string':
              return `"${item}"`;
            case 'object': {
              throw new Error('暂不支持复杂类型的enum，如果需要请提issue');
            }
            default:
              return item;
          }
        })
        .join(' | ');
    return { run, isEnum };
  };

  /**
   * 处理schema中的type为array的情况
   */
  const handleSchemaArray = () => {
    const { isEnum, run: handleEnum } = handleSchemaEnum();
    const isArray = (schema: Schema) => Object.prototype.hasOwnProperty.call(schema, 'items');
    const run = (schema: Schema) => {
      const { name } = handleRef(schema.items as Schema);
      if (name) return `Array<${name}>`;
      else if (isEnum(schema.items as Schema))
        return `Array<${handleEnum(schema.items as Schema)}>`;
      else return `Array<${openapiTypeFormat((schema.items as Schema).type)}>`;
    };
    return { isArray, run };
  };

  /**
   * 处理schema中的描述性属性，输出到interface的注释中
   */
  const handleAttributesMeta = (schema: Schema) => {
    const { description, example, maxLength, minLength, maximum, minimum } = schema;
    const meta = [
      description,
      maxLength && `maxLength: ${maxLength}`,
      minLength && `minLength: ${minLength}`,
      maximum && `maximum: ${maximum}`,
      minimum && `minimum: ${minimum}`,
      example && `example: ${example}`,
    ].filter(Boolean);
    if (!meta.length) return '';
    return `/**${meta.join(' ')} */\n`;
  };

  return { objectAssign, compositeType, handleSchemaObject };
};
