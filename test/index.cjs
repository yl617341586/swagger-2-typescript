const { generateTypeFile, generateType } = require('../lib');
const swaggerJson = require('./swagger.json');
const { resolve } = require('path');
const { cwd } = require('process');
// generateTypeFile(swaggerJson);
generateTypeFile(swaggerJson, resolve(cwd(), 'api', 'test.ts'));
