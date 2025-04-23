/*
 * @author: Lew
 * @e-mail: yl617341586@163.com
 * @date: 2025/04/18 11:26:05
 * @description: generate export string
 */
import { OpenAPIV3 as OA3 } from 'openapi-types';
import { handleSchema, openapiTypeFormat } from '.';

const schema = (isRoot: boolean) => {
  const ref = (key: string, name: string, depth: number) => {
    return isRoot ? `export type ${key} = ${name}\n` : `${'  '.repeat(depth)}${key}: ${name}\n`;
  };
  const allOf = (key: string, allOf: (OA3.SchemaObject | OA3.ReferenceObject)[], depth: number) => {
    const names = allOf.map(_schema => handleSchema(_schema).refName);
    return isRoot
      ? `export interface ${key} extends ${String(names)}\n`
      : `${'  '.repeat(depth)}${key}: ${names.concat(['']).join(' & ')}`;
  };
  const baseObject = (key: string, schema: OA3.SchemaObject, depth: number) => {
    return isRoot
      ? `export interface ${key} \n`
      : `${'  '.repeat(depth)}${key}: ${openapiTypeFormat(schema)}\n`;
  };
  const complexObject = (key: string, schema: OA3.SchemaObject, depth: number) => {
    return isRoot
      ? `export type ${key} = ${openapiTypeFormat(schema)}\n`
      : `${'  '.repeat(depth)}${key}: ${openapiTypeFormat(schema)}\n`;
  };
  return {
    ref,
    allOf,
    baseObject,
    complexObject,
  };
};
const comment = (schema: OA3.SchemaObject): string => {
  const comments: string[] = [];
  const allowList: (keyof OA3.SchemaObject)[] = [
    'description',
    'format',
    'maxLength',
    'minLength',
    'example',
  ];
  allowList.forEach(key => {
    if (key in schema) {
      const _key = `@${key} `.replaceAll('@description ', '');
      comments.push(`${_key}${schema[key]} `);
    }
  });
  return comments.length ? `/** ${comments.join('')}*/\n` : '';
};
export default {
  schema,
  comment,
};
