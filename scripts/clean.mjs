import { rmdirSync, existsSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
if (existsSync()) rmdirSync(resolve(cwd(), 'lib'), { recursive: true });
