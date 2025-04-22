/*
 * @author: Lew
 * @e-mail: yl617341586@163.com
 * @date: 2025/04/18 11:26:05
 * @description: generate export string
 */
import { OpenAPIV3 as OA3 } from 'openapi-types';
import { openapiTypeFormat } from '.';
export default (isRoot: boolean) => {
  const ref = (key: string, name: string, depth: number) => {
    return isRoot ? `export type ${key} = ${name};\n` : `${'  '.repeat(depth)}${key}: ${name}\n`;
  };
  const allOf = (key: string, schema: OA3.ReferenceObject | OA3.SchemaObject) => {
    return `export interface ${key} extends ${schema} {};\n`;
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
