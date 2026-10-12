export type PrimitiveTypeLiteral =
  'string' | 'number' | 'bigint' | 'boolean' | 'symbol';

export type PrimitiveType<TypeLiteral extends PrimitiveTypeLiteral> =
  TypeLiteral extends 'string'
    ? string
    : TypeLiteral extends 'number'
      ? number
      : TypeLiteral extends 'bigint'
        ? bigint
        : TypeLiteral extends 'boolean'
          ? boolean
          : TypeLiteral extends 'symbol'
            ? symbol
            : never;
