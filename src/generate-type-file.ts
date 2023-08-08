import generateType from './generate-type';
import { writeFileSync, access, constants, mkdirSync, accessSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
import { OpenApi } from '../openapi';
export default async (json: OpenApi, output = resolve(cwd(), 'type.ts')) => {
  const data = await generateType(json);
  const write = () => {
    writeFileSync(output, data, { encoding: 'utf-8' });
    console.log(`[Swagger2TSFile]: 文件生成路路径 ${output}`);
  };
  try {
    accessSync(output, constants.F_OK);
    write();
  } catch (e: any) {
    if (e.code === 'ENOENT') return write();
    console.error(`[Swagger2TSFile]: ${e}`);
  }
};
