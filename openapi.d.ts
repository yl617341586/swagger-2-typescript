export interface OpenApi {
  openapi: string;
  info: Info;
  paths: Paths;
  servers?: Server[];
  components?: Components;
  // security?: SecurityRequirement[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
}

export interface Info {
  version: string;
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
}

export interface Paths {
  [path: string]: PathItem;
}

export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  servers?: Server[];
  // parameters?: (Parameter | Reference)[];
}

export interface Operation {
  responses: Responses;
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  parameters?: (Parameter | Reference)[];
  requestBody?: RequestBody | Reference;
  callbacks?: { [callback: string]: Callback | Reference };
  deprecated?: boolean;
  // security?: SecurityRequirement[];
  servers?: Server[];
}

export interface Reference {
  $ref: string;
}

export interface Parameter {
  /**参数的名称。参数名是区分大小写。 */
  name: string;
  /**参数的位置 */
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  /**标明此参数是否是必选参数。如果 参数位置 的值是 path，那么这个参数一定是 必选 的因此这里的值必须是true。其他的则视情况而定。此字段的默认值是false。 */
  required?: boolean;
  /**标明一个参数是被弃用的而且应该尽快移除对它的使用。 */
  deprecated?: boolean;
  /**设置是否允许传递空参数，这只在参数值为query时有效，默认值是false。如果同时指定了style属性且值为n/a（无法被序列化）,那么此字段 allowEmptyValue应该被忽略。 */
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema | Reference;
  example?: any;
  examples?: { [media: string]: Example | Reference };
  content?: { [media: string]: MediaType };
}

export interface Schema {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | 'enum';
  allOf?: (Schema | Reference)[];
  oneOf?: (Schema | Reference)[];
  items?: Schema | Reference;
  properties?: { [name: string]: Schema | Reference };
  additionalProperties?: boolean | Schema | Reference;
  description?: string;
  format?: string;
  default?: any;
  nullable?: boolean;
  discriminator?: Discriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XML;
  externalDocs?: ExternalDocumentation;
  example?: any;
  deprecated?: boolean;
}

export interface RequestBody {
  description?: string;
  content: { [media: string]: MediaType };
  required?: boolean;
}

export interface MediaType {
  schema?: Schema | Reference;
  example?: any;
  examples?: { [media: string]: Example | Reference };
  encoding?: { [media: string]: Encoding };
}

export interface Encoding {
  contentType?: string;
  headers?: { [header: string]: Header | Reference };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface Responses {
  default?: Response | Reference;
  [statuscode: string]: Response | Reference;
}

export interface Response {
  description: string;
  headers?: { [header: string]: Header | Reference };
  content?: { [media: string]: MediaType };
  links?: { [link: string]: Link | Reference };
}

export interface Callback {
  [url: string]: PathItem;
}

export interface Example {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface Link {
  operationRef?: string;
  operationId?: string;
  parameters?: { [parameter: string]: any };
  requestBody?: any;
  description?: string;
  server?: Server;
}

export interface Header {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema | Reference;
  example?: any;
  examples?: { [media: string]: Example | Reference };
  content?: { [media: string]: MediaType };
}

export interface Components {
  schemas?: { [key: string]: Schema | Reference };
  // responses?: { [key: string]: Response | Reference };
  // parameters?: { [key: string]: Parameter | Reference };
  // examples?: { [key: string]: Example | Reference };
  // requestBodies?: { [key: string]: RequestBody | Reference };
  // headers?: { [key: string]: Header | Reference };
  // securitySchemes?: { [key: string]: SecurityScheme | Reference };
  // links?: { [key: string]: Link | Reference };
  // callbacks?: { [key: string]: Callback | Reference };
}

export interface Contact {
  name?: string;
  email?: string;
  url?: string;
}

export interface License {
  name: string;
  url?: string;
}

export interface Server {
  url: string;
  description?: string;
}

export interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}

export interface ExternalDocumentation {
  url: string;
  description?: string;
}
