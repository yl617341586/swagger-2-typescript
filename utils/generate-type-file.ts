import { Swagger } from '../swagger';
import generateType from './generate-type';
import { writeFileSync, access, constants, mkdirSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
export default (json: Swagger, output?: string) =>
  new Promise<string>(res => {
    const path = output ? output : resolve(cwd(), 'type.ts');
    access(path, constants.F_OK, err => {
      if (err) {
        path.split('/').forEach(name => {
          const _path = `${path.substring(0, path.indexOf(`/${name}`))}/${name}`;
          access(_path, constants.F_OK, err => {
            if (err && _path === path) {
              const data = generateType(json);
              if (data) {
                writeFileSync(path, generateType(json), {
                  encoding: 'utf-8',
                });
                console.log(`[Swagger2TSFile]: 文件生成路路径 ${path}`);
                res(path);
              }
            } else if (err) mkdirSync(_path);
          });
        });
      } else {
        const data = generateType(json);
        if (data) {
          writeFileSync(path, generateType(json), {
            encoding: 'utf-8',
          });
          console.log(`[Swagger2TSFile]: 文件生成路路径 ${path}`);
          res(path);
        }
      }
    });
  });
