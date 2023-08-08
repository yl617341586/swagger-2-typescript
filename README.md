# swagger-2-typescript &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yl617341586/swagger-2-typescript/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/swagger-2-ts-file.svg?style=flat)](https://www.npmjs.com/package/swagger-2-ts-file)
swagger-2-typescript是一个将swagger json 转译成Typescript类型的库

- 多样性：swagger-2-typescript分别提供了生成文件和生成数据的方法，可以自由的操作转译的数据。
- 时效性：支持openapi 3.0.x，后续根据版本更新。
- 易用性：只需要两行代码即可生成ts文件。

## 安装

`npm i -D swagger-2-ts-file`

## 示例

```javascript
const { generateTypeFile, generateType } = require('swagger-2-ts-file');
// 通过远程获取或者本地导入均可，只要是满足openapi 3.0.x规范的json对象即可。
generateTypeFile(swaggerJson);

```

## 贡献

### Issues

点击[这里](https://github.com/yl617341586/swagger-2-typescript/issues/new)提交一个issues，帮助我完善此包。每一个issues我都会认真阅读并切回复。

### License

[MIT licensed](./LICENSE).