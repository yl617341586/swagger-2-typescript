export default (openapi: string) => {
  if (!/^3\.0\.\d(-.+)?$/g.test(openapi)) throw new Error(`Open API version must be 3.0.x`);
};
