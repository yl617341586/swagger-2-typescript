import { writeFileSync, constants, accessSync, mkdirSync } from 'fs';
import { cwd } from 'process';
import { resolve, dirname } from 'path';
import generateType from './generate-type';
import { OpenApi } from '../openapi';
export default async (json: OpenApi, output = resolve(cwd(), 'type.ts')) => {
  const path = dirname(output);
  const data = await generateType(json);
  const write = () => {
    writeFileSync(output, data, { encoding: 'utf-8' });
    console.log(`[Swagger2TSFile]: 文件生成路路径 ${output}`);
  };
  try {
    accessSync(path, constants.F_OK);
  } catch (e: any) {
    if (e.code === 'ENOENT') mkdirSync(path, { recursive: true });
    else return console.error(`[Swagger2TSFile]: ${e}`);
  }
  try {
    accessSync(output, constants.F_OK);
    write();
  } catch (e: any) {
    if (e.code === 'ENOENT') write();
    else return console.error(`[Swagger2TSFile]: ${e}`);
  }
};
