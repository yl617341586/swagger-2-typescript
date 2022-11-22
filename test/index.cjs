const { generateTypeFile } = require('../lib');
const swaggerJson = require('./swagger.json');
generateTypeFile(swaggerJson);
