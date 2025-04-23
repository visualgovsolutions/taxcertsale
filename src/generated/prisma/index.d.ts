
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model County
 * 
 */
export type County = $Result.DefaultSelection<Prisma.$CountyPayload>
/**
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model Auction
 * 
 */
export type Auction = $Result.DefaultSelection<Prisma.$AuctionPayload>
/**
 * Model Certificate
 * 
 */
export type Certificate = $Result.DefaultSelection<Prisma.$CertificatePayload>
/**
 * Model Bid
 * 
 */
export type Bid = $Result.DefaultSelection<Prisma.$BidPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.county`: Exposes CRUD operations for the **County** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Counties
    * const counties = await prisma.county.findMany()
    * ```
    */
  get county(): Prisma.CountyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auction`: Exposes CRUD operations for the **Auction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auctions
    * const auctions = await prisma.auction.findMany()
    * ```
    */
  get auction(): Prisma.AuctionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.certificate`: Exposes CRUD operations for the **Certificate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Certificates
    * const certificates = await prisma.certificate.findMany()
    * ```
    */
  get certificate(): Prisma.CertificateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bid`: Exposes CRUD operations for the **Bid** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bids
    * const bids = await prisma.bid.findMany()
    * ```
    */
  get bid(): Prisma.BidDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    County: 'County',
    Property: 'Property',
    Auction: 'Auction',
    Certificate: 'Certificate',
    Bid: 'Bid'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "county" | "property" | "auction" | "certificate" | "bid"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      County: {
        payload: Prisma.$CountyPayload<ExtArgs>
        fields: Prisma.CountyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CountyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CountyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          findFirst: {
            args: Prisma.CountyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CountyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          findMany: {
            args: Prisma.CountyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>[]
          }
          create: {
            args: Prisma.CountyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          createMany: {
            args: Prisma.CountyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CountyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>[]
          }
          delete: {
            args: Prisma.CountyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          update: {
            args: Prisma.CountyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          deleteMany: {
            args: Prisma.CountyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CountyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CountyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>[]
          }
          upsert: {
            args: Prisma.CountyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountyPayload>
          }
          aggregate: {
            args: Prisma.CountyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCounty>
          }
          groupBy: {
            args: Prisma.CountyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CountyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CountyCountArgs<ExtArgs>
            result: $Utils.Optional<CountyCountAggregateOutputType> | number
          }
        }
      }
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      Auction: {
        payload: Prisma.$AuctionPayload<ExtArgs>
        fields: Prisma.AuctionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          findFirst: {
            args: Prisma.AuctionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          findMany: {
            args: Prisma.AuctionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          create: {
            args: Prisma.AuctionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          createMany: {
            args: Prisma.AuctionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          delete: {
            args: Prisma.AuctionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          update: {
            args: Prisma.AuctionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          deleteMany: {
            args: Prisma.AuctionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          upsert: {
            args: Prisma.AuctionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          aggregate: {
            args: Prisma.AuctionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuction>
          }
          groupBy: {
            args: Prisma.AuctionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionCountAggregateOutputType> | number
          }
        }
      }
      Certificate: {
        payload: Prisma.$CertificatePayload<ExtArgs>
        fields: Prisma.CertificateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CertificateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CertificateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          findFirst: {
            args: Prisma.CertificateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CertificateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          findMany: {
            args: Prisma.CertificateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          create: {
            args: Prisma.CertificateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          createMany: {
            args: Prisma.CertificateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CertificateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          delete: {
            args: Prisma.CertificateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          update: {
            args: Prisma.CertificateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          deleteMany: {
            args: Prisma.CertificateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CertificateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CertificateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          upsert: {
            args: Prisma.CertificateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          aggregate: {
            args: Prisma.CertificateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCertificate>
          }
          groupBy: {
            args: Prisma.CertificateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CertificateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CertificateCountArgs<ExtArgs>
            result: $Utils.Optional<CertificateCountAggregateOutputType> | number
          }
        }
      }
      Bid: {
        payload: Prisma.$BidPayload<ExtArgs>
        fields: Prisma.BidFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BidFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BidFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          findFirst: {
            args: Prisma.BidFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BidFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          findMany: {
            args: Prisma.BidFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>[]
          }
          create: {
            args: Prisma.BidCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          createMany: {
            args: Prisma.BidCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BidCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>[]
          }
          delete: {
            args: Prisma.BidDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          update: {
            args: Prisma.BidUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          deleteMany: {
            args: Prisma.BidDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BidUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BidUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>[]
          }
          upsert: {
            args: Prisma.BidUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidPayload>
          }
          aggregate: {
            args: Prisma.BidAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBid>
          }
          groupBy: {
            args: Prisma.BidGroupByArgs<ExtArgs>
            result: $Utils.Optional<BidGroupByOutputType>[]
          }
          count: {
            args: Prisma.BidCountArgs<ExtArgs>
            result: $Utils.Optional<BidCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    county?: CountyOmit
    property?: PropertyOmit
    auction?: AuctionOmit
    certificate?: CertificateOmit
    bid?: BidOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bids: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bids?: boolean | UserCountOutputTypeCountBidsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidWhereInput
  }


  /**
   * Count Type CountyCountOutputType
   */

  export type CountyCountOutputType = {
    properties: number
    auctions: number
    certificates: number
  }

  export type CountyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | CountyCountOutputTypeCountPropertiesArgs
    auctions?: boolean | CountyCountOutputTypeCountAuctionsArgs
    certificates?: boolean | CountyCountOutputTypeCountCertificatesArgs
  }

  // Custom InputTypes
  /**
   * CountyCountOutputType without action
   */
  export type CountyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CountyCountOutputType
     */
    select?: CountyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CountyCountOutputType without action
   */
  export type CountyCountOutputTypeCountPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }

  /**
   * CountyCountOutputType without action
   */
  export type CountyCountOutputTypeCountAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionWhereInput
  }

  /**
   * CountyCountOutputType without action
   */
  export type CountyCountOutputTypeCountCertificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificateWhereInput
  }


  /**
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    certificates: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    certificates?: boolean | PropertyCountOutputTypeCountCertificatesArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountCertificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificateWhereInput
  }


  /**
   * Count Type AuctionCountOutputType
   */

  export type AuctionCountOutputType = {
    certificates: number
    bids: number
  }

  export type AuctionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    certificates?: boolean | AuctionCountOutputTypeCountCertificatesArgs
    bids?: boolean | AuctionCountOutputTypeCountBidsArgs
  }

  // Custom InputTypes
  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionCountOutputType
     */
    select?: AuctionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountCertificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificateWhereInput
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountBidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidWhereInput
  }


  /**
   * Count Type CertificateCountOutputType
   */

  export type CertificateCountOutputType = {
    bids: number
  }

  export type CertificateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bids?: boolean | CertificateCountOutputTypeCountBidsArgs
  }

  // Custom InputTypes
  /**
   * CertificateCountOutputType without action
   */
  export type CertificateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CertificateCountOutputType
     */
    select?: CertificateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CertificateCountOutputType without action
   */
  export type CertificateCountOutputTypeCountBidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    email: string | null
    role: string | null
    status: string | null
    kycStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    email: string | null
    role: string | null
    status: string | null
    kycStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    email: number
    role: number
    status: number
    kycStatus: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    email?: true
    role?: true
    status?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    email?: true
    role?: true
    status?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    email?: true
    role?: true
    status?: true
    kycStatus?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    email: string
    role: string
    status: string | null
    kycStatus: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bids?: boolean | User$bidsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    kycStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "email" | "role" | "status" | "kycStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bids?: boolean | User$bidsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      bids: Prisma.$BidPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      email: string
      role: string
      status: string | null
      kycStatus: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bids<T extends User$bidsArgs<ExtArgs> = {}>(args?: Subset<T, User$bidsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly kycStatus: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.bids
   */
  export type User$bidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    where?: BidWhereInput
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    cursor?: BidWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model County
   */

  export type AggregateCounty = {
    _count: CountyCountAggregateOutputType | null
    _avg: CountyAvgAggregateOutputType | null
    _sum: CountySumAggregateOutputType | null
    _min: CountyMinAggregateOutputType | null
    _max: CountyMaxAggregateOutputType | null
  }

  export type CountyAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type CountySumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type CountyMinAggregateOutputType = {
    id: string | null
    name: string | null
    state: string | null
    countyCode: string | null
    websiteUrl: string | null
    taxCollectorUrl: string | null
    propertyAppraiserUrl: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CountyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    state: string | null
    countyCode: string | null
    websiteUrl: string | null
    taxCollectorUrl: string | null
    propertyAppraiserUrl: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CountyCountAggregateOutputType = {
    id: number
    name: number
    state: number
    countyCode: number
    websiteUrl: number
    taxCollectorUrl: number
    propertyAppraiserUrl: number
    description: number
    latitude: number
    longitude: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CountyAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CountySumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type CountyMinAggregateInputType = {
    id?: true
    name?: true
    state?: true
    countyCode?: true
    websiteUrl?: true
    taxCollectorUrl?: true
    propertyAppraiserUrl?: true
    description?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CountyMaxAggregateInputType = {
    id?: true
    name?: true
    state?: true
    countyCode?: true
    websiteUrl?: true
    taxCollectorUrl?: true
    propertyAppraiserUrl?: true
    description?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CountyCountAggregateInputType = {
    id?: true
    name?: true
    state?: true
    countyCode?: true
    websiteUrl?: true
    taxCollectorUrl?: true
    propertyAppraiserUrl?: true
    description?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CountyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which County to aggregate.
     */
    where?: CountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Counties to fetch.
     */
    orderBy?: CountyOrderByWithRelationInput | CountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Counties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Counties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Counties
    **/
    _count?: true | CountyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CountyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CountySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CountyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CountyMaxAggregateInputType
  }

  export type GetCountyAggregateType<T extends CountyAggregateArgs> = {
        [P in keyof T & keyof AggregateCounty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCounty[P]>
      : GetScalarType<T[P], AggregateCounty[P]>
  }




  export type CountyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CountyWhereInput
    orderBy?: CountyOrderByWithAggregationInput | CountyOrderByWithAggregationInput[]
    by: CountyScalarFieldEnum[] | CountyScalarFieldEnum
    having?: CountyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CountyCountAggregateInputType | true
    _avg?: CountyAvgAggregateInputType
    _sum?: CountySumAggregateInputType
    _min?: CountyMinAggregateInputType
    _max?: CountyMaxAggregateInputType
  }

  export type CountyGroupByOutputType = {
    id: string
    name: string
    state: string
    countyCode: string | null
    websiteUrl: string | null
    taxCollectorUrl: string | null
    propertyAppraiserUrl: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date
    updatedAt: Date
    _count: CountyCountAggregateOutputType | null
    _avg: CountyAvgAggregateOutputType | null
    _sum: CountySumAggregateOutputType | null
    _min: CountyMinAggregateOutputType | null
    _max: CountyMaxAggregateOutputType | null
  }

  type GetCountyGroupByPayload<T extends CountyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CountyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CountyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CountyGroupByOutputType[P]>
            : GetScalarType<T[P], CountyGroupByOutputType[P]>
        }
      >
    >


  export type CountySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    state?: boolean
    countyCode?: boolean
    websiteUrl?: boolean
    taxCollectorUrl?: boolean
    propertyAppraiserUrl?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    properties?: boolean | County$propertiesArgs<ExtArgs>
    auctions?: boolean | County$auctionsArgs<ExtArgs>
    certificates?: boolean | County$certificatesArgs<ExtArgs>
    _count?: boolean | CountyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["county"]>

  export type CountySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    state?: boolean
    countyCode?: boolean
    websiteUrl?: boolean
    taxCollectorUrl?: boolean
    propertyAppraiserUrl?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["county"]>

  export type CountySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    state?: boolean
    countyCode?: boolean
    websiteUrl?: boolean
    taxCollectorUrl?: boolean
    propertyAppraiserUrl?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["county"]>

  export type CountySelectScalar = {
    id?: boolean
    name?: boolean
    state?: boolean
    countyCode?: boolean
    websiteUrl?: boolean
    taxCollectorUrl?: boolean
    propertyAppraiserUrl?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CountyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "state" | "countyCode" | "websiteUrl" | "taxCollectorUrl" | "propertyAppraiserUrl" | "description" | "latitude" | "longitude" | "createdAt" | "updatedAt", ExtArgs["result"]["county"]>
  export type CountyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | County$propertiesArgs<ExtArgs>
    auctions?: boolean | County$auctionsArgs<ExtArgs>
    certificates?: boolean | County$certificatesArgs<ExtArgs>
    _count?: boolean | CountyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CountyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CountyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CountyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "County"
    objects: {
      properties: Prisma.$PropertyPayload<ExtArgs>[]
      auctions: Prisma.$AuctionPayload<ExtArgs>[]
      certificates: Prisma.$CertificatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      state: string
      countyCode: string | null
      websiteUrl: string | null
      taxCollectorUrl: string | null
      propertyAppraiserUrl: string | null
      description: string | null
      latitude: number | null
      longitude: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["county"]>
    composites: {}
  }

  type CountyGetPayload<S extends boolean | null | undefined | CountyDefaultArgs> = $Result.GetResult<Prisma.$CountyPayload, S>

  type CountyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CountyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CountyCountAggregateInputType | true
    }

  export interface CountyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['County'], meta: { name: 'County' } }
    /**
     * Find zero or one County that matches the filter.
     * @param {CountyFindUniqueArgs} args - Arguments to find a County
     * @example
     * // Get one County
     * const county = await prisma.county.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CountyFindUniqueArgs>(args: SelectSubset<T, CountyFindUniqueArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one County that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CountyFindUniqueOrThrowArgs} args - Arguments to find a County
     * @example
     * // Get one County
     * const county = await prisma.county.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CountyFindUniqueOrThrowArgs>(args: SelectSubset<T, CountyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first County that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyFindFirstArgs} args - Arguments to find a County
     * @example
     * // Get one County
     * const county = await prisma.county.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CountyFindFirstArgs>(args?: SelectSubset<T, CountyFindFirstArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first County that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyFindFirstOrThrowArgs} args - Arguments to find a County
     * @example
     * // Get one County
     * const county = await prisma.county.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CountyFindFirstOrThrowArgs>(args?: SelectSubset<T, CountyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Counties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Counties
     * const counties = await prisma.county.findMany()
     * 
     * // Get first 10 Counties
     * const counties = await prisma.county.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const countyWithIdOnly = await prisma.county.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CountyFindManyArgs>(args?: SelectSubset<T, CountyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a County.
     * @param {CountyCreateArgs} args - Arguments to create a County.
     * @example
     * // Create one County
     * const County = await prisma.county.create({
     *   data: {
     *     // ... data to create a County
     *   }
     * })
     * 
     */
    create<T extends CountyCreateArgs>(args: SelectSubset<T, CountyCreateArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Counties.
     * @param {CountyCreateManyArgs} args - Arguments to create many Counties.
     * @example
     * // Create many Counties
     * const county = await prisma.county.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CountyCreateManyArgs>(args?: SelectSubset<T, CountyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Counties and returns the data saved in the database.
     * @param {CountyCreateManyAndReturnArgs} args - Arguments to create many Counties.
     * @example
     * // Create many Counties
     * const county = await prisma.county.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Counties and only return the `id`
     * const countyWithIdOnly = await prisma.county.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CountyCreateManyAndReturnArgs>(args?: SelectSubset<T, CountyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a County.
     * @param {CountyDeleteArgs} args - Arguments to delete one County.
     * @example
     * // Delete one County
     * const County = await prisma.county.delete({
     *   where: {
     *     // ... filter to delete one County
     *   }
     * })
     * 
     */
    delete<T extends CountyDeleteArgs>(args: SelectSubset<T, CountyDeleteArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one County.
     * @param {CountyUpdateArgs} args - Arguments to update one County.
     * @example
     * // Update one County
     * const county = await prisma.county.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CountyUpdateArgs>(args: SelectSubset<T, CountyUpdateArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Counties.
     * @param {CountyDeleteManyArgs} args - Arguments to filter Counties to delete.
     * @example
     * // Delete a few Counties
     * const { count } = await prisma.county.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CountyDeleteManyArgs>(args?: SelectSubset<T, CountyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Counties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Counties
     * const county = await prisma.county.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CountyUpdateManyArgs>(args: SelectSubset<T, CountyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Counties and returns the data updated in the database.
     * @param {CountyUpdateManyAndReturnArgs} args - Arguments to update many Counties.
     * @example
     * // Update many Counties
     * const county = await prisma.county.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Counties and only return the `id`
     * const countyWithIdOnly = await prisma.county.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CountyUpdateManyAndReturnArgs>(args: SelectSubset<T, CountyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one County.
     * @param {CountyUpsertArgs} args - Arguments to update or create a County.
     * @example
     * // Update or create a County
     * const county = await prisma.county.upsert({
     *   create: {
     *     // ... data to create a County
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the County we want to update
     *   }
     * })
     */
    upsert<T extends CountyUpsertArgs>(args: SelectSubset<T, CountyUpsertArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Counties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyCountArgs} args - Arguments to filter Counties to count.
     * @example
     * // Count the number of Counties
     * const count = await prisma.county.count({
     *   where: {
     *     // ... the filter for the Counties we want to count
     *   }
     * })
    **/
    count<T extends CountyCountArgs>(
      args?: Subset<T, CountyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CountyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a County.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CountyAggregateArgs>(args: Subset<T, CountyAggregateArgs>): Prisma.PrismaPromise<GetCountyAggregateType<T>>

    /**
     * Group by County.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CountyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CountyGroupByArgs['orderBy'] }
        : { orderBy?: CountyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CountyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCountyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the County model
   */
  readonly fields: CountyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for County.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CountyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    properties<T extends County$propertiesArgs<ExtArgs> = {}>(args?: Subset<T, County$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auctions<T extends County$auctionsArgs<ExtArgs> = {}>(args?: Subset<T, County$auctionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    certificates<T extends County$certificatesArgs<ExtArgs> = {}>(args?: Subset<T, County$certificatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the County model
   */
  interface CountyFieldRefs {
    readonly id: FieldRef<"County", 'String'>
    readonly name: FieldRef<"County", 'String'>
    readonly state: FieldRef<"County", 'String'>
    readonly countyCode: FieldRef<"County", 'String'>
    readonly websiteUrl: FieldRef<"County", 'String'>
    readonly taxCollectorUrl: FieldRef<"County", 'String'>
    readonly propertyAppraiserUrl: FieldRef<"County", 'String'>
    readonly description: FieldRef<"County", 'String'>
    readonly latitude: FieldRef<"County", 'Float'>
    readonly longitude: FieldRef<"County", 'Float'>
    readonly createdAt: FieldRef<"County", 'DateTime'>
    readonly updatedAt: FieldRef<"County", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * County findUnique
   */
  export type CountyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter, which County to fetch.
     */
    where: CountyWhereUniqueInput
  }

  /**
   * County findUniqueOrThrow
   */
  export type CountyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter, which County to fetch.
     */
    where: CountyWhereUniqueInput
  }

  /**
   * County findFirst
   */
  export type CountyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter, which County to fetch.
     */
    where?: CountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Counties to fetch.
     */
    orderBy?: CountyOrderByWithRelationInput | CountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Counties.
     */
    cursor?: CountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Counties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Counties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Counties.
     */
    distinct?: CountyScalarFieldEnum | CountyScalarFieldEnum[]
  }

  /**
   * County findFirstOrThrow
   */
  export type CountyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter, which County to fetch.
     */
    where?: CountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Counties to fetch.
     */
    orderBy?: CountyOrderByWithRelationInput | CountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Counties.
     */
    cursor?: CountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Counties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Counties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Counties.
     */
    distinct?: CountyScalarFieldEnum | CountyScalarFieldEnum[]
  }

  /**
   * County findMany
   */
  export type CountyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter, which Counties to fetch.
     */
    where?: CountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Counties to fetch.
     */
    orderBy?: CountyOrderByWithRelationInput | CountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Counties.
     */
    cursor?: CountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Counties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Counties.
     */
    skip?: number
    distinct?: CountyScalarFieldEnum | CountyScalarFieldEnum[]
  }

  /**
   * County create
   */
  export type CountyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * The data needed to create a County.
     */
    data: XOR<CountyCreateInput, CountyUncheckedCreateInput>
  }

  /**
   * County createMany
   */
  export type CountyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Counties.
     */
    data: CountyCreateManyInput | CountyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * County createManyAndReturn
   */
  export type CountyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * The data used to create many Counties.
     */
    data: CountyCreateManyInput | CountyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * County update
   */
  export type CountyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * The data needed to update a County.
     */
    data: XOR<CountyUpdateInput, CountyUncheckedUpdateInput>
    /**
     * Choose, which County to update.
     */
    where: CountyWhereUniqueInput
  }

  /**
   * County updateMany
   */
  export type CountyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Counties.
     */
    data: XOR<CountyUpdateManyMutationInput, CountyUncheckedUpdateManyInput>
    /**
     * Filter which Counties to update
     */
    where?: CountyWhereInput
    /**
     * Limit how many Counties to update.
     */
    limit?: number
  }

  /**
   * County updateManyAndReturn
   */
  export type CountyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * The data used to update Counties.
     */
    data: XOR<CountyUpdateManyMutationInput, CountyUncheckedUpdateManyInput>
    /**
     * Filter which Counties to update
     */
    where?: CountyWhereInput
    /**
     * Limit how many Counties to update.
     */
    limit?: number
  }

  /**
   * County upsert
   */
  export type CountyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * The filter to search for the County to update in case it exists.
     */
    where: CountyWhereUniqueInput
    /**
     * In case the County found by the `where` argument doesn't exist, create a new County with this data.
     */
    create: XOR<CountyCreateInput, CountyUncheckedCreateInput>
    /**
     * In case the County was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CountyUpdateInput, CountyUncheckedUpdateInput>
  }

  /**
   * County delete
   */
  export type CountyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
    /**
     * Filter which County to delete.
     */
    where: CountyWhereUniqueInput
  }

  /**
   * County deleteMany
   */
  export type CountyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Counties to delete
     */
    where?: CountyWhereInput
    /**
     * Limit how many Counties to delete.
     */
    limit?: number
  }

  /**
   * County.properties
   */
  export type County$propertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * County.auctions
   */
  export type County$auctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    where?: AuctionWhereInput
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    cursor?: AuctionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * County.certificates
   */
  export type County$certificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    where?: CertificateWhereInput
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    cursor?: CertificateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * County without action
   */
  export type CountyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the County
     */
    select?: CountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the County
     */
    omit?: CountyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountyInclude<ExtArgs> | null
  }


  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyMinAggregateOutputType = {
    id: string | null
    parcelId: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    legalDescription: string | null
    countyId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: string | null
    parcelId: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    legalDescription: string | null
    countyId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    parcelId: number
    address: number
    city: number
    state: number
    zipCode: number
    legalDescription: number
    countyId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PropertyMinAggregateInputType = {
    id?: true
    parcelId?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    legalDescription?: true
    countyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    parcelId?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    legalDescription?: true
    countyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    parcelId?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    legalDescription?: true
    countyId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription: string | null
    countyId: string
    createdAt: Date
    updatedAt: Date
    _count: PropertyCountAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parcelId?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    legalDescription?: boolean
    countyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
    certificates?: boolean | Property$certificatesArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parcelId?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    legalDescription?: boolean
    countyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parcelId?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    legalDescription?: boolean
    countyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    parcelId?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    legalDescription?: boolean
    countyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PropertyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "parcelId" | "address" | "city" | "state" | "zipCode" | "legalDescription" | "countyId" | "createdAt" | "updatedAt", ExtArgs["result"]["property"]>
  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
    certificates?: boolean | Property$certificatesArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      county: Prisma.$CountyPayload<ExtArgs>
      certificates: Prisma.$CertificatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      parcelId: string
      address: string
      city: string
      state: string
      zipCode: string
      legalDescription: string | null
      countyId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties and returns the data updated in the database.
     * @param {PropertyUpdateManyAndReturnArgs} args - Arguments to update many Properties.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    county<T extends CountyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CountyDefaultArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    certificates<T extends Property$certificatesArgs<ExtArgs> = {}>(args?: Subset<T, Property$certificatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Property model
   */
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'String'>
    readonly parcelId: FieldRef<"Property", 'String'>
    readonly address: FieldRef<"Property", 'String'>
    readonly city: FieldRef<"Property", 'String'>
    readonly state: FieldRef<"Property", 'String'>
    readonly zipCode: FieldRef<"Property", 'String'>
    readonly legalDescription: FieldRef<"Property", 'String'>
    readonly countyId: FieldRef<"Property", 'String'>
    readonly createdAt: FieldRef<"Property", 'DateTime'>
    readonly updatedAt: FieldRef<"Property", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property updateManyAndReturn
   */
  export type PropertyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to delete.
     */
    limit?: number
  }

  /**
   * Property.certificates
   */
  export type Property$certificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    where?: CertificateWhereInput
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    cursor?: CertificateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model Auction
   */

  export type AggregateAuction = {
    _count: AuctionCountAggregateOutputType | null
    _min: AuctionMinAggregateOutputType | null
    _max: AuctionMaxAggregateOutputType | null
  }

  export type AuctionMinAggregateOutputType = {
    id: string | null
    countyId: string | null
    auctionDate: Date | null
    status: string | null
    adUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuctionMaxAggregateOutputType = {
    id: string | null
    countyId: string | null
    auctionDate: Date | null
    status: string | null
    adUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuctionCountAggregateOutputType = {
    id: number
    countyId: number
    auctionDate: number
    status: number
    adUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuctionMinAggregateInputType = {
    id?: true
    countyId?: true
    auctionDate?: true
    status?: true
    adUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuctionMaxAggregateInputType = {
    id?: true
    countyId?: true
    auctionDate?: true
    status?: true
    adUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuctionCountAggregateInputType = {
    id?: true
    countyId?: true
    auctionDate?: true
    status?: true
    adUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuctionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auction to aggregate.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auctions
    **/
    _count?: true | AuctionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionMaxAggregateInputType
  }

  export type GetAuctionAggregateType<T extends AuctionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuction[P]>
      : GetScalarType<T[P], AggregateAuction[P]>
  }




  export type AuctionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionWhereInput
    orderBy?: AuctionOrderByWithAggregationInput | AuctionOrderByWithAggregationInput[]
    by: AuctionScalarFieldEnum[] | AuctionScalarFieldEnum
    having?: AuctionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionCountAggregateInputType | true
    _min?: AuctionMinAggregateInputType
    _max?: AuctionMaxAggregateInputType
  }

  export type AuctionGroupByOutputType = {
    id: string
    countyId: string
    auctionDate: Date
    status: string
    adUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: AuctionCountAggregateOutputType | null
    _min: AuctionMinAggregateOutputType | null
    _max: AuctionMaxAggregateOutputType | null
  }

  type GetAuctionGroupByPayload<T extends AuctionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionGroupByOutputType[P]>
        }
      >
    >


  export type AuctionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    countyId?: boolean
    auctionDate?: boolean
    status?: boolean
    adUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
    certificates?: boolean | Auction$certificatesArgs<ExtArgs>
    bids?: boolean | Auction$bidsArgs<ExtArgs>
    _count?: boolean | AuctionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    countyId?: boolean
    auctionDate?: boolean
    status?: boolean
    adUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    countyId?: boolean
    auctionDate?: boolean
    status?: boolean
    adUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectScalar = {
    id?: boolean
    countyId?: boolean
    auctionDate?: boolean
    status?: boolean
    adUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuctionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "countyId" | "auctionDate" | "status" | "adUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["auction"]>
  export type AuctionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
    certificates?: boolean | Auction$certificatesArgs<ExtArgs>
    bids?: boolean | Auction$bidsArgs<ExtArgs>
    _count?: boolean | AuctionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuctionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }
  export type AuctionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
  }

  export type $AuctionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auction"
    objects: {
      county: Prisma.$CountyPayload<ExtArgs>
      certificates: Prisma.$CertificatePayload<ExtArgs>[]
      bids: Prisma.$BidPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      countyId: string
      auctionDate: Date
      status: string
      adUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["auction"]>
    composites: {}
  }

  type AuctionGetPayload<S extends boolean | null | undefined | AuctionDefaultArgs> = $Result.GetResult<Prisma.$AuctionPayload, S>

  type AuctionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionCountAggregateInputType | true
    }

  export interface AuctionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auction'], meta: { name: 'Auction' } }
    /**
     * Find zero or one Auction that matches the filter.
     * @param {AuctionFindUniqueArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionFindUniqueArgs>(args: SelectSubset<T, AuctionFindUniqueArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionFindUniqueOrThrowArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindFirstArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionFindFirstArgs>(args?: SelectSubset<T, AuctionFindFirstArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindFirstOrThrowArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auctions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auctions
     * const auctions = await prisma.auction.findMany()
     * 
     * // Get first 10 Auctions
     * const auctions = await prisma.auction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionWithIdOnly = await prisma.auction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionFindManyArgs>(args?: SelectSubset<T, AuctionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auction.
     * @param {AuctionCreateArgs} args - Arguments to create a Auction.
     * @example
     * // Create one Auction
     * const Auction = await prisma.auction.create({
     *   data: {
     *     // ... data to create a Auction
     *   }
     * })
     * 
     */
    create<T extends AuctionCreateArgs>(args: SelectSubset<T, AuctionCreateArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auctions.
     * @param {AuctionCreateManyArgs} args - Arguments to create many Auctions.
     * @example
     * // Create many Auctions
     * const auction = await prisma.auction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionCreateManyArgs>(args?: SelectSubset<T, AuctionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auctions and returns the data saved in the database.
     * @param {AuctionCreateManyAndReturnArgs} args - Arguments to create many Auctions.
     * @example
     * // Create many Auctions
     * const auction = await prisma.auction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auctions and only return the `id`
     * const auctionWithIdOnly = await prisma.auction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auction.
     * @param {AuctionDeleteArgs} args - Arguments to delete one Auction.
     * @example
     * // Delete one Auction
     * const Auction = await prisma.auction.delete({
     *   where: {
     *     // ... filter to delete one Auction
     *   }
     * })
     * 
     */
    delete<T extends AuctionDeleteArgs>(args: SelectSubset<T, AuctionDeleteArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auction.
     * @param {AuctionUpdateArgs} args - Arguments to update one Auction.
     * @example
     * // Update one Auction
     * const auction = await prisma.auction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionUpdateArgs>(args: SelectSubset<T, AuctionUpdateArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auctions.
     * @param {AuctionDeleteManyArgs} args - Arguments to filter Auctions to delete.
     * @example
     * // Delete a few Auctions
     * const { count } = await prisma.auction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionDeleteManyArgs>(args?: SelectSubset<T, AuctionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auctions
     * const auction = await prisma.auction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionUpdateManyArgs>(args: SelectSubset<T, AuctionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auctions and returns the data updated in the database.
     * @param {AuctionUpdateManyAndReturnArgs} args - Arguments to update many Auctions.
     * @example
     * // Update many Auctions
     * const auction = await prisma.auction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auctions and only return the `id`
     * const auctionWithIdOnly = await prisma.auction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auction.
     * @param {AuctionUpsertArgs} args - Arguments to update or create a Auction.
     * @example
     * // Update or create a Auction
     * const auction = await prisma.auction.upsert({
     *   create: {
     *     // ... data to create a Auction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auction we want to update
     *   }
     * })
     */
    upsert<T extends AuctionUpsertArgs>(args: SelectSubset<T, AuctionUpsertArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionCountArgs} args - Arguments to filter Auctions to count.
     * @example
     * // Count the number of Auctions
     * const count = await prisma.auction.count({
     *   where: {
     *     // ... the filter for the Auctions we want to count
     *   }
     * })
    **/
    count<T extends AuctionCountArgs>(
      args?: Subset<T, AuctionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuctionAggregateArgs>(args: Subset<T, AuctionAggregateArgs>): Prisma.PrismaPromise<GetAuctionAggregateType<T>>

    /**
     * Group by Auction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuctionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionGroupByArgs['orderBy'] }
        : { orderBy?: AuctionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuctionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auction model
   */
  readonly fields: AuctionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    county<T extends CountyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CountyDefaultArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    certificates<T extends Auction$certificatesArgs<ExtArgs> = {}>(args?: Subset<T, Auction$certificatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bids<T extends Auction$bidsArgs<ExtArgs> = {}>(args?: Subset<T, Auction$bidsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auction model
   */
  interface AuctionFieldRefs {
    readonly id: FieldRef<"Auction", 'String'>
    readonly countyId: FieldRef<"Auction", 'String'>
    readonly auctionDate: FieldRef<"Auction", 'DateTime'>
    readonly status: FieldRef<"Auction", 'String'>
    readonly adUrl: FieldRef<"Auction", 'String'>
    readonly createdAt: FieldRef<"Auction", 'DateTime'>
    readonly updatedAt: FieldRef<"Auction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auction findUnique
   */
  export type AuctionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction findUniqueOrThrow
   */
  export type AuctionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction findFirst
   */
  export type AuctionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auctions.
     */
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction findFirstOrThrow
   */
  export type AuctionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auctions.
     */
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction findMany
   */
  export type AuctionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auctions to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction create
   */
  export type AuctionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The data needed to create a Auction.
     */
    data: XOR<AuctionCreateInput, AuctionUncheckedCreateInput>
  }

  /**
   * Auction createMany
   */
  export type AuctionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auctions.
     */
    data: AuctionCreateManyInput | AuctionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auction createManyAndReturn
   */
  export type AuctionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * The data used to create many Auctions.
     */
    data: AuctionCreateManyInput | AuctionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auction update
   */
  export type AuctionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The data needed to update a Auction.
     */
    data: XOR<AuctionUpdateInput, AuctionUncheckedUpdateInput>
    /**
     * Choose, which Auction to update.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction updateMany
   */
  export type AuctionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auctions.
     */
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyInput>
    /**
     * Filter which Auctions to update
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to update.
     */
    limit?: number
  }

  /**
   * Auction updateManyAndReturn
   */
  export type AuctionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * The data used to update Auctions.
     */
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyInput>
    /**
     * Filter which Auctions to update
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auction upsert
   */
  export type AuctionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The filter to search for the Auction to update in case it exists.
     */
    where: AuctionWhereUniqueInput
    /**
     * In case the Auction found by the `where` argument doesn't exist, create a new Auction with this data.
     */
    create: XOR<AuctionCreateInput, AuctionUncheckedCreateInput>
    /**
     * In case the Auction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionUpdateInput, AuctionUncheckedUpdateInput>
  }

  /**
   * Auction delete
   */
  export type AuctionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter which Auction to delete.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction deleteMany
   */
  export type AuctionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auctions to delete
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to delete.
     */
    limit?: number
  }

  /**
   * Auction.certificates
   */
  export type Auction$certificatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    where?: CertificateWhereInput
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    cursor?: CertificateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Auction.bids
   */
  export type Auction$bidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    where?: BidWhereInput
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    cursor?: BidWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * Auction without action
   */
  export type AuctionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
  }


  /**
   * Model Certificate
   */

  export type AggregateCertificate = {
    _count: CertificateCountAggregateOutputType | null
    _avg: CertificateAvgAggregateOutputType | null
    _sum: CertificateSumAggregateOutputType | null
    _min: CertificateMinAggregateOutputType | null
    _max: CertificateMaxAggregateOutputType | null
  }

  export type CertificateAvgAggregateOutputType = {
    faceValue: number | null
    interestRate: number | null
    premium: number | null
  }

  export type CertificateSumAggregateOutputType = {
    faceValue: number | null
    interestRate: number | null
    premium: number | null
  }

  export type CertificateMinAggregateOutputType = {
    id: string | null
    certificateNumber: string | null
    countyId: string | null
    propertyId: string | null
    auctionId: string | null
    status: string | null
    faceValue: number | null
    interestRate: number | null
    premium: number | null
    buyerId: string | null
    purchaseDate: Date | null
    redemptionDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CertificateMaxAggregateOutputType = {
    id: string | null
    certificateNumber: string | null
    countyId: string | null
    propertyId: string | null
    auctionId: string | null
    status: string | null
    faceValue: number | null
    interestRate: number | null
    premium: number | null
    buyerId: string | null
    purchaseDate: Date | null
    redemptionDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CertificateCountAggregateOutputType = {
    id: number
    certificateNumber: number
    countyId: number
    propertyId: number
    auctionId: number
    status: number
    faceValue: number
    interestRate: number
    premium: number
    buyerId: number
    purchaseDate: number
    redemptionDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CertificateAvgAggregateInputType = {
    faceValue?: true
    interestRate?: true
    premium?: true
  }

  export type CertificateSumAggregateInputType = {
    faceValue?: true
    interestRate?: true
    premium?: true
  }

  export type CertificateMinAggregateInputType = {
    id?: true
    certificateNumber?: true
    countyId?: true
    propertyId?: true
    auctionId?: true
    status?: true
    faceValue?: true
    interestRate?: true
    premium?: true
    buyerId?: true
    purchaseDate?: true
    redemptionDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CertificateMaxAggregateInputType = {
    id?: true
    certificateNumber?: true
    countyId?: true
    propertyId?: true
    auctionId?: true
    status?: true
    faceValue?: true
    interestRate?: true
    premium?: true
    buyerId?: true
    purchaseDate?: true
    redemptionDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CertificateCountAggregateInputType = {
    id?: true
    certificateNumber?: true
    countyId?: true
    propertyId?: true
    auctionId?: true
    status?: true
    faceValue?: true
    interestRate?: true
    premium?: true
    buyerId?: true
    purchaseDate?: true
    redemptionDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CertificateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certificate to aggregate.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Certificates
    **/
    _count?: true | CertificateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CertificateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CertificateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CertificateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CertificateMaxAggregateInputType
  }

  export type GetCertificateAggregateType<T extends CertificateAggregateArgs> = {
        [P in keyof T & keyof AggregateCertificate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCertificate[P]>
      : GetScalarType<T[P], AggregateCertificate[P]>
  }




  export type CertificateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificateWhereInput
    orderBy?: CertificateOrderByWithAggregationInput | CertificateOrderByWithAggregationInput[]
    by: CertificateScalarFieldEnum[] | CertificateScalarFieldEnum
    having?: CertificateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CertificateCountAggregateInputType | true
    _avg?: CertificateAvgAggregateInputType
    _sum?: CertificateSumAggregateInputType
    _min?: CertificateMinAggregateInputType
    _max?: CertificateMaxAggregateInputType
  }

  export type CertificateGroupByOutputType = {
    id: string
    certificateNumber: string
    countyId: string
    propertyId: string
    auctionId: string
    status: string
    faceValue: number
    interestRate: number | null
    premium: number | null
    buyerId: string | null
    purchaseDate: Date | null
    redemptionDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CertificateCountAggregateOutputType | null
    _avg: CertificateAvgAggregateOutputType | null
    _sum: CertificateSumAggregateOutputType | null
    _min: CertificateMinAggregateOutputType | null
    _max: CertificateMaxAggregateOutputType | null
  }

  type GetCertificateGroupByPayload<T extends CertificateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CertificateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CertificateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CertificateGroupByOutputType[P]>
            : GetScalarType<T[P], CertificateGroupByOutputType[P]>
        }
      >
    >


  export type CertificateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certificateNumber?: boolean
    countyId?: boolean
    propertyId?: boolean
    auctionId?: boolean
    status?: boolean
    faceValue?: boolean
    interestRate?: boolean
    premium?: boolean
    buyerId?: boolean
    purchaseDate?: boolean
    redemptionDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    bids?: boolean | Certificate$bidsArgs<ExtArgs>
    _count?: boolean | CertificateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certificateNumber?: boolean
    countyId?: boolean
    propertyId?: boolean
    auctionId?: boolean
    status?: boolean
    faceValue?: boolean
    interestRate?: boolean
    premium?: boolean
    buyerId?: boolean
    purchaseDate?: boolean
    redemptionDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certificateNumber?: boolean
    countyId?: boolean
    propertyId?: boolean
    auctionId?: boolean
    status?: boolean
    faceValue?: boolean
    interestRate?: boolean
    premium?: boolean
    buyerId?: boolean
    purchaseDate?: boolean
    redemptionDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectScalar = {
    id?: boolean
    certificateNumber?: boolean
    countyId?: boolean
    propertyId?: boolean
    auctionId?: boolean
    status?: boolean
    faceValue?: boolean
    interestRate?: boolean
    premium?: boolean
    buyerId?: boolean
    purchaseDate?: boolean
    redemptionDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CertificateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "certificateNumber" | "countyId" | "propertyId" | "auctionId" | "status" | "faceValue" | "interestRate" | "premium" | "buyerId" | "purchaseDate" | "redemptionDate" | "createdAt" | "updatedAt", ExtArgs["result"]["certificate"]>
  export type CertificateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    bids?: boolean | Certificate$bidsArgs<ExtArgs>
    _count?: boolean | CertificateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CertificateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type CertificateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    county?: boolean | CountyDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }

  export type $CertificatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Certificate"
    objects: {
      county: Prisma.$CountyPayload<ExtArgs>
      property: Prisma.$PropertyPayload<ExtArgs>
      auction: Prisma.$AuctionPayload<ExtArgs>
      bids: Prisma.$BidPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      certificateNumber: string
      countyId: string
      propertyId: string
      auctionId: string
      status: string
      faceValue: number
      interestRate: number | null
      premium: number | null
      buyerId: string | null
      purchaseDate: Date | null
      redemptionDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["certificate"]>
    composites: {}
  }

  type CertificateGetPayload<S extends boolean | null | undefined | CertificateDefaultArgs> = $Result.GetResult<Prisma.$CertificatePayload, S>

  type CertificateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CertificateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CertificateCountAggregateInputType | true
    }

  export interface CertificateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Certificate'], meta: { name: 'Certificate' } }
    /**
     * Find zero or one Certificate that matches the filter.
     * @param {CertificateFindUniqueArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CertificateFindUniqueArgs>(args: SelectSubset<T, CertificateFindUniqueArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Certificate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CertificateFindUniqueOrThrowArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CertificateFindUniqueOrThrowArgs>(args: SelectSubset<T, CertificateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certificate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindFirstArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CertificateFindFirstArgs>(args?: SelectSubset<T, CertificateFindFirstArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certificate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindFirstOrThrowArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CertificateFindFirstOrThrowArgs>(args?: SelectSubset<T, CertificateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Certificates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Certificates
     * const certificates = await prisma.certificate.findMany()
     * 
     * // Get first 10 Certificates
     * const certificates = await prisma.certificate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const certificateWithIdOnly = await prisma.certificate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CertificateFindManyArgs>(args?: SelectSubset<T, CertificateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Certificate.
     * @param {CertificateCreateArgs} args - Arguments to create a Certificate.
     * @example
     * // Create one Certificate
     * const Certificate = await prisma.certificate.create({
     *   data: {
     *     // ... data to create a Certificate
     *   }
     * })
     * 
     */
    create<T extends CertificateCreateArgs>(args: SelectSubset<T, CertificateCreateArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Certificates.
     * @param {CertificateCreateManyArgs} args - Arguments to create many Certificates.
     * @example
     * // Create many Certificates
     * const certificate = await prisma.certificate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CertificateCreateManyArgs>(args?: SelectSubset<T, CertificateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Certificates and returns the data saved in the database.
     * @param {CertificateCreateManyAndReturnArgs} args - Arguments to create many Certificates.
     * @example
     * // Create many Certificates
     * const certificate = await prisma.certificate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Certificates and only return the `id`
     * const certificateWithIdOnly = await prisma.certificate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CertificateCreateManyAndReturnArgs>(args?: SelectSubset<T, CertificateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Certificate.
     * @param {CertificateDeleteArgs} args - Arguments to delete one Certificate.
     * @example
     * // Delete one Certificate
     * const Certificate = await prisma.certificate.delete({
     *   where: {
     *     // ... filter to delete one Certificate
     *   }
     * })
     * 
     */
    delete<T extends CertificateDeleteArgs>(args: SelectSubset<T, CertificateDeleteArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Certificate.
     * @param {CertificateUpdateArgs} args - Arguments to update one Certificate.
     * @example
     * // Update one Certificate
     * const certificate = await prisma.certificate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CertificateUpdateArgs>(args: SelectSubset<T, CertificateUpdateArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Certificates.
     * @param {CertificateDeleteManyArgs} args - Arguments to filter Certificates to delete.
     * @example
     * // Delete a few Certificates
     * const { count } = await prisma.certificate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CertificateDeleteManyArgs>(args?: SelectSubset<T, CertificateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Certificates
     * const certificate = await prisma.certificate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CertificateUpdateManyArgs>(args: SelectSubset<T, CertificateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certificates and returns the data updated in the database.
     * @param {CertificateUpdateManyAndReturnArgs} args - Arguments to update many Certificates.
     * @example
     * // Update many Certificates
     * const certificate = await prisma.certificate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Certificates and only return the `id`
     * const certificateWithIdOnly = await prisma.certificate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CertificateUpdateManyAndReturnArgs>(args: SelectSubset<T, CertificateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Certificate.
     * @param {CertificateUpsertArgs} args - Arguments to update or create a Certificate.
     * @example
     * // Update or create a Certificate
     * const certificate = await prisma.certificate.upsert({
     *   create: {
     *     // ... data to create a Certificate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Certificate we want to update
     *   }
     * })
     */
    upsert<T extends CertificateUpsertArgs>(args: SelectSubset<T, CertificateUpsertArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateCountArgs} args - Arguments to filter Certificates to count.
     * @example
     * // Count the number of Certificates
     * const count = await prisma.certificate.count({
     *   where: {
     *     // ... the filter for the Certificates we want to count
     *   }
     * })
    **/
    count<T extends CertificateCountArgs>(
      args?: Subset<T, CertificateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CertificateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Certificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CertificateAggregateArgs>(args: Subset<T, CertificateAggregateArgs>): Prisma.PrismaPromise<GetCertificateAggregateType<T>>

    /**
     * Group by Certificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CertificateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CertificateGroupByArgs['orderBy'] }
        : { orderBy?: CertificateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CertificateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Certificate model
   */
  readonly fields: CertificateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Certificate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CertificateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    county<T extends CountyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CountyDefaultArgs<ExtArgs>>): Prisma__CountyClient<$Result.GetResult<Prisma.$CountyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bids<T extends Certificate$bidsArgs<ExtArgs> = {}>(args?: Subset<T, Certificate$bidsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Certificate model
   */
  interface CertificateFieldRefs {
    readonly id: FieldRef<"Certificate", 'String'>
    readonly certificateNumber: FieldRef<"Certificate", 'String'>
    readonly countyId: FieldRef<"Certificate", 'String'>
    readonly propertyId: FieldRef<"Certificate", 'String'>
    readonly auctionId: FieldRef<"Certificate", 'String'>
    readonly status: FieldRef<"Certificate", 'String'>
    readonly faceValue: FieldRef<"Certificate", 'Float'>
    readonly interestRate: FieldRef<"Certificate", 'Float'>
    readonly premium: FieldRef<"Certificate", 'Float'>
    readonly buyerId: FieldRef<"Certificate", 'String'>
    readonly purchaseDate: FieldRef<"Certificate", 'DateTime'>
    readonly redemptionDate: FieldRef<"Certificate", 'DateTime'>
    readonly createdAt: FieldRef<"Certificate", 'DateTime'>
    readonly updatedAt: FieldRef<"Certificate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Certificate findUnique
   */
  export type CertificateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate findUniqueOrThrow
   */
  export type CertificateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate findFirst
   */
  export type CertificateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certificates.
     */
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate findFirstOrThrow
   */
  export type CertificateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certificates.
     */
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate findMany
   */
  export type CertificateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter, which Certificates to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate create
   */
  export type CertificateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * The data needed to create a Certificate.
     */
    data: XOR<CertificateCreateInput, CertificateUncheckedCreateInput>
  }

  /**
   * Certificate createMany
   */
  export type CertificateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Certificates.
     */
    data: CertificateCreateManyInput | CertificateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Certificate createManyAndReturn
   */
  export type CertificateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data used to create many Certificates.
     */
    data: CertificateCreateManyInput | CertificateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Certificate update
   */
  export type CertificateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * The data needed to update a Certificate.
     */
    data: XOR<CertificateUpdateInput, CertificateUncheckedUpdateInput>
    /**
     * Choose, which Certificate to update.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate updateMany
   */
  export type CertificateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Certificates.
     */
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyInput>
    /**
     * Filter which Certificates to update
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to update.
     */
    limit?: number
  }

  /**
   * Certificate updateManyAndReturn
   */
  export type CertificateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data used to update Certificates.
     */
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyInput>
    /**
     * Filter which Certificates to update
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Certificate upsert
   */
  export type CertificateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * The filter to search for the Certificate to update in case it exists.
     */
    where: CertificateWhereUniqueInput
    /**
     * In case the Certificate found by the `where` argument doesn't exist, create a new Certificate with this data.
     */
    create: XOR<CertificateCreateInput, CertificateUncheckedCreateInput>
    /**
     * In case the Certificate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CertificateUpdateInput, CertificateUncheckedUpdateInput>
  }

  /**
   * Certificate delete
   */
  export type CertificateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
    /**
     * Filter which Certificate to delete.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate deleteMany
   */
  export type CertificateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certificates to delete
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to delete.
     */
    limit?: number
  }

  /**
   * Certificate.bids
   */
  export type Certificate$bidsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    where?: BidWhereInput
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    cursor?: BidWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * Certificate without action
   */
  export type CertificateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificateInclude<ExtArgs> | null
  }


  /**
   * Model Bid
   */

  export type AggregateBid = {
    _count: BidCountAggregateOutputType | null
    _avg: BidAvgAggregateOutputType | null
    _sum: BidSumAggregateOutputType | null
    _min: BidMinAggregateOutputType | null
    _max: BidMaxAggregateOutputType | null
  }

  export type BidAvgAggregateOutputType = {
    bidAmount: number | null
  }

  export type BidSumAggregateOutputType = {
    bidAmount: number | null
  }

  export type BidMinAggregateOutputType = {
    id: string | null
    auctionId: string | null
    certificateId: string | null
    userId: string | null
    bidAmount: number | null
    bidType: string | null
    isWinningBid: boolean | null
    bidTime: Date | null
    timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BidMaxAggregateOutputType = {
    id: string | null
    auctionId: string | null
    certificateId: string | null
    userId: string | null
    bidAmount: number | null
    bidType: string | null
    isWinningBid: boolean | null
    bidTime: Date | null
    timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BidCountAggregateOutputType = {
    id: number
    auctionId: number
    certificateId: number
    userId: number
    bidAmount: number
    bidType: number
    isWinningBid: number
    bidTime: number
    timestamp: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BidAvgAggregateInputType = {
    bidAmount?: true
  }

  export type BidSumAggregateInputType = {
    bidAmount?: true
  }

  export type BidMinAggregateInputType = {
    id?: true
    auctionId?: true
    certificateId?: true
    userId?: true
    bidAmount?: true
    bidType?: true
    isWinningBid?: true
    bidTime?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BidMaxAggregateInputType = {
    id?: true
    auctionId?: true
    certificateId?: true
    userId?: true
    bidAmount?: true
    bidType?: true
    isWinningBid?: true
    bidTime?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BidCountAggregateInputType = {
    id?: true
    auctionId?: true
    certificateId?: true
    userId?: true
    bidAmount?: true
    bidType?: true
    isWinningBid?: true
    bidTime?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BidAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bid to aggregate.
     */
    where?: BidWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bids to fetch.
     */
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BidWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bids from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bids.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bids
    **/
    _count?: true | BidCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BidAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BidSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BidMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BidMaxAggregateInputType
  }

  export type GetBidAggregateType<T extends BidAggregateArgs> = {
        [P in keyof T & keyof AggregateBid]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBid[P]>
      : GetScalarType<T[P], AggregateBid[P]>
  }




  export type BidGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidWhereInput
    orderBy?: BidOrderByWithAggregationInput | BidOrderByWithAggregationInput[]
    by: BidScalarFieldEnum[] | BidScalarFieldEnum
    having?: BidScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BidCountAggregateInputType | true
    _avg?: BidAvgAggregateInputType
    _sum?: BidSumAggregateInputType
    _min?: BidMinAggregateInputType
    _max?: BidMaxAggregateInputType
  }

  export type BidGroupByOutputType = {
    id: string
    auctionId: string
    certificateId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid: boolean
    bidTime: Date
    timestamp: Date
    createdAt: Date
    updatedAt: Date
    _count: BidCountAggregateOutputType | null
    _avg: BidAvgAggregateOutputType | null
    _sum: BidSumAggregateOutputType | null
    _min: BidMinAggregateOutputType | null
    _max: BidMaxAggregateOutputType | null
  }

  type GetBidGroupByPayload<T extends BidGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BidGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BidGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BidGroupByOutputType[P]>
            : GetScalarType<T[P], BidGroupByOutputType[P]>
        }
      >
    >


  export type BidSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    certificateId?: boolean
    userId?: boolean
    bidAmount?: boolean
    bidType?: boolean
    isWinningBid?: boolean
    bidTime?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bid"]>

  export type BidSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    certificateId?: boolean
    userId?: boolean
    bidAmount?: boolean
    bidType?: boolean
    isWinningBid?: boolean
    bidTime?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bid"]>

  export type BidSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    certificateId?: boolean
    userId?: boolean
    bidAmount?: boolean
    bidType?: boolean
    isWinningBid?: boolean
    bidTime?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bid"]>

  export type BidSelectScalar = {
    id?: boolean
    auctionId?: boolean
    certificateId?: boolean
    userId?: boolean
    bidAmount?: boolean
    bidType?: boolean
    isWinningBid?: boolean
    bidTime?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BidOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionId" | "certificateId" | "userId" | "bidAmount" | "bidType" | "isWinningBid" | "bidTime" | "timestamp" | "createdAt" | "updatedAt", ExtArgs["result"]["bid"]>
  export type BidInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BidIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BidIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    certificate?: boolean | CertificateDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BidPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bid"
    objects: {
      auction: Prisma.$AuctionPayload<ExtArgs>
      certificate: Prisma.$CertificatePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionId: string
      certificateId: string
      userId: string
      bidAmount: number
      bidType: string
      isWinningBid: boolean
      bidTime: Date
      timestamp: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bid"]>
    composites: {}
  }

  type BidGetPayload<S extends boolean | null | undefined | BidDefaultArgs> = $Result.GetResult<Prisma.$BidPayload, S>

  type BidCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BidFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BidCountAggregateInputType | true
    }

  export interface BidDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bid'], meta: { name: 'Bid' } }
    /**
     * Find zero or one Bid that matches the filter.
     * @param {BidFindUniqueArgs} args - Arguments to find a Bid
     * @example
     * // Get one Bid
     * const bid = await prisma.bid.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BidFindUniqueArgs>(args: SelectSubset<T, BidFindUniqueArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bid that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BidFindUniqueOrThrowArgs} args - Arguments to find a Bid
     * @example
     * // Get one Bid
     * const bid = await prisma.bid.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BidFindUniqueOrThrowArgs>(args: SelectSubset<T, BidFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bid that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidFindFirstArgs} args - Arguments to find a Bid
     * @example
     * // Get one Bid
     * const bid = await prisma.bid.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BidFindFirstArgs>(args?: SelectSubset<T, BidFindFirstArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bid that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidFindFirstOrThrowArgs} args - Arguments to find a Bid
     * @example
     * // Get one Bid
     * const bid = await prisma.bid.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BidFindFirstOrThrowArgs>(args?: SelectSubset<T, BidFindFirstOrThrowArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bids that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bids
     * const bids = await prisma.bid.findMany()
     * 
     * // Get first 10 Bids
     * const bids = await prisma.bid.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bidWithIdOnly = await prisma.bid.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BidFindManyArgs>(args?: SelectSubset<T, BidFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bid.
     * @param {BidCreateArgs} args - Arguments to create a Bid.
     * @example
     * // Create one Bid
     * const Bid = await prisma.bid.create({
     *   data: {
     *     // ... data to create a Bid
     *   }
     * })
     * 
     */
    create<T extends BidCreateArgs>(args: SelectSubset<T, BidCreateArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bids.
     * @param {BidCreateManyArgs} args - Arguments to create many Bids.
     * @example
     * // Create many Bids
     * const bid = await prisma.bid.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BidCreateManyArgs>(args?: SelectSubset<T, BidCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bids and returns the data saved in the database.
     * @param {BidCreateManyAndReturnArgs} args - Arguments to create many Bids.
     * @example
     * // Create many Bids
     * const bid = await prisma.bid.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bids and only return the `id`
     * const bidWithIdOnly = await prisma.bid.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BidCreateManyAndReturnArgs>(args?: SelectSubset<T, BidCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bid.
     * @param {BidDeleteArgs} args - Arguments to delete one Bid.
     * @example
     * // Delete one Bid
     * const Bid = await prisma.bid.delete({
     *   where: {
     *     // ... filter to delete one Bid
     *   }
     * })
     * 
     */
    delete<T extends BidDeleteArgs>(args: SelectSubset<T, BidDeleteArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bid.
     * @param {BidUpdateArgs} args - Arguments to update one Bid.
     * @example
     * // Update one Bid
     * const bid = await prisma.bid.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BidUpdateArgs>(args: SelectSubset<T, BidUpdateArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bids.
     * @param {BidDeleteManyArgs} args - Arguments to filter Bids to delete.
     * @example
     * // Delete a few Bids
     * const { count } = await prisma.bid.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BidDeleteManyArgs>(args?: SelectSubset<T, BidDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bids.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bids
     * const bid = await prisma.bid.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BidUpdateManyArgs>(args: SelectSubset<T, BidUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bids and returns the data updated in the database.
     * @param {BidUpdateManyAndReturnArgs} args - Arguments to update many Bids.
     * @example
     * // Update many Bids
     * const bid = await prisma.bid.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bids and only return the `id`
     * const bidWithIdOnly = await prisma.bid.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BidUpdateManyAndReturnArgs>(args: SelectSubset<T, BidUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bid.
     * @param {BidUpsertArgs} args - Arguments to update or create a Bid.
     * @example
     * // Update or create a Bid
     * const bid = await prisma.bid.upsert({
     *   create: {
     *     // ... data to create a Bid
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bid we want to update
     *   }
     * })
     */
    upsert<T extends BidUpsertArgs>(args: SelectSubset<T, BidUpsertArgs<ExtArgs>>): Prisma__BidClient<$Result.GetResult<Prisma.$BidPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bids.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidCountArgs} args - Arguments to filter Bids to count.
     * @example
     * // Count the number of Bids
     * const count = await prisma.bid.count({
     *   where: {
     *     // ... the filter for the Bids we want to count
     *   }
     * })
    **/
    count<T extends BidCountArgs>(
      args?: Subset<T, BidCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BidCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bid.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BidAggregateArgs>(args: Subset<T, BidAggregateArgs>): Prisma.PrismaPromise<GetBidAggregateType<T>>

    /**
     * Group by Bid.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BidGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BidGroupByArgs['orderBy'] }
        : { orderBy?: BidGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BidGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBidGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bid model
   */
  readonly fields: BidFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bid.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BidClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    certificate<T extends CertificateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CertificateDefaultArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bid model
   */
  interface BidFieldRefs {
    readonly id: FieldRef<"Bid", 'String'>
    readonly auctionId: FieldRef<"Bid", 'String'>
    readonly certificateId: FieldRef<"Bid", 'String'>
    readonly userId: FieldRef<"Bid", 'String'>
    readonly bidAmount: FieldRef<"Bid", 'Float'>
    readonly bidType: FieldRef<"Bid", 'String'>
    readonly isWinningBid: FieldRef<"Bid", 'Boolean'>
    readonly bidTime: FieldRef<"Bid", 'DateTime'>
    readonly timestamp: FieldRef<"Bid", 'DateTime'>
    readonly createdAt: FieldRef<"Bid", 'DateTime'>
    readonly updatedAt: FieldRef<"Bid", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bid findUnique
   */
  export type BidFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter, which Bid to fetch.
     */
    where: BidWhereUniqueInput
  }

  /**
   * Bid findUniqueOrThrow
   */
  export type BidFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter, which Bid to fetch.
     */
    where: BidWhereUniqueInput
  }

  /**
   * Bid findFirst
   */
  export type BidFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter, which Bid to fetch.
     */
    where?: BidWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bids to fetch.
     */
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bids.
     */
    cursor?: BidWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bids from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bids.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bids.
     */
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * Bid findFirstOrThrow
   */
  export type BidFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter, which Bid to fetch.
     */
    where?: BidWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bids to fetch.
     */
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bids.
     */
    cursor?: BidWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bids from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bids.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bids.
     */
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * Bid findMany
   */
  export type BidFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter, which Bids to fetch.
     */
    where?: BidWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bids to fetch.
     */
    orderBy?: BidOrderByWithRelationInput | BidOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bids.
     */
    cursor?: BidWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bids from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bids.
     */
    skip?: number
    distinct?: BidScalarFieldEnum | BidScalarFieldEnum[]
  }

  /**
   * Bid create
   */
  export type BidCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * The data needed to create a Bid.
     */
    data: XOR<BidCreateInput, BidUncheckedCreateInput>
  }

  /**
   * Bid createMany
   */
  export type BidCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bids.
     */
    data: BidCreateManyInput | BidCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bid createManyAndReturn
   */
  export type BidCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * The data used to create many Bids.
     */
    data: BidCreateManyInput | BidCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bid update
   */
  export type BidUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * The data needed to update a Bid.
     */
    data: XOR<BidUpdateInput, BidUncheckedUpdateInput>
    /**
     * Choose, which Bid to update.
     */
    where: BidWhereUniqueInput
  }

  /**
   * Bid updateMany
   */
  export type BidUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bids.
     */
    data: XOR<BidUpdateManyMutationInput, BidUncheckedUpdateManyInput>
    /**
     * Filter which Bids to update
     */
    where?: BidWhereInput
    /**
     * Limit how many Bids to update.
     */
    limit?: number
  }

  /**
   * Bid updateManyAndReturn
   */
  export type BidUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * The data used to update Bids.
     */
    data: XOR<BidUpdateManyMutationInput, BidUncheckedUpdateManyInput>
    /**
     * Filter which Bids to update
     */
    where?: BidWhereInput
    /**
     * Limit how many Bids to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bid upsert
   */
  export type BidUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * The filter to search for the Bid to update in case it exists.
     */
    where: BidWhereUniqueInput
    /**
     * In case the Bid found by the `where` argument doesn't exist, create a new Bid with this data.
     */
    create: XOR<BidCreateInput, BidUncheckedCreateInput>
    /**
     * In case the Bid was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BidUpdateInput, BidUncheckedUpdateInput>
  }

  /**
   * Bid delete
   */
  export type BidDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
    /**
     * Filter which Bid to delete.
     */
    where: BidWhereUniqueInput
  }

  /**
   * Bid deleteMany
   */
  export type BidDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bids to delete
     */
    where?: BidWhereInput
    /**
     * Limit how many Bids to delete.
     */
    limit?: number
  }

  /**
   * Bid without action
   */
  export type BidDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bid
     */
    select?: BidSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bid
     */
    omit?: BidOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    email: 'email',
    role: 'role',
    status: 'status',
    kycStatus: 'kycStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CountyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    state: 'state',
    countyCode: 'countyCode',
    websiteUrl: 'websiteUrl',
    taxCollectorUrl: 'taxCollectorUrl',
    propertyAppraiserUrl: 'propertyAppraiserUrl',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CountyScalarFieldEnum = (typeof CountyScalarFieldEnum)[keyof typeof CountyScalarFieldEnum]


  export const PropertyScalarFieldEnum: {
    id: 'id',
    parcelId: 'parcelId',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    legalDescription: 'legalDescription',
    countyId: 'countyId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const AuctionScalarFieldEnum: {
    id: 'id',
    countyId: 'countyId',
    auctionDate: 'auctionDate',
    status: 'status',
    adUrl: 'adUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuctionScalarFieldEnum = (typeof AuctionScalarFieldEnum)[keyof typeof AuctionScalarFieldEnum]


  export const CertificateScalarFieldEnum: {
    id: 'id',
    certificateNumber: 'certificateNumber',
    countyId: 'countyId',
    propertyId: 'propertyId',
    auctionId: 'auctionId',
    status: 'status',
    faceValue: 'faceValue',
    interestRate: 'interestRate',
    premium: 'premium',
    buyerId: 'buyerId',
    purchaseDate: 'purchaseDate',
    redemptionDate: 'redemptionDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CertificateScalarFieldEnum = (typeof CertificateScalarFieldEnum)[keyof typeof CertificateScalarFieldEnum]


  export const BidScalarFieldEnum: {
    id: 'id',
    auctionId: 'auctionId',
    certificateId: 'certificateId',
    userId: 'userId',
    bidAmount: 'bidAmount',
    bidType: 'bidType',
    isWinningBid: 'isWinningBid',
    bidTime: 'bidTime',
    timestamp: 'timestamp',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BidScalarFieldEnum = (typeof BidScalarFieldEnum)[keyof typeof BidScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringNullableFilter<"User"> | string | null
    kycStatus?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bids?: BidListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrderInput | SortOrder
    kycStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bids?: BidOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringNullableFilter<"User"> | string | null
    kycStatus?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bids?: BidListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrderInput | SortOrder
    kycStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    status?: StringNullableWithAggregatesFilter<"User"> | string | null
    kycStatus?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CountyWhereInput = {
    AND?: CountyWhereInput | CountyWhereInput[]
    OR?: CountyWhereInput[]
    NOT?: CountyWhereInput | CountyWhereInput[]
    id?: StringFilter<"County"> | string
    name?: StringFilter<"County"> | string
    state?: StringFilter<"County"> | string
    countyCode?: StringNullableFilter<"County"> | string | null
    websiteUrl?: StringNullableFilter<"County"> | string | null
    taxCollectorUrl?: StringNullableFilter<"County"> | string | null
    propertyAppraiserUrl?: StringNullableFilter<"County"> | string | null
    description?: StringNullableFilter<"County"> | string | null
    latitude?: FloatNullableFilter<"County"> | number | null
    longitude?: FloatNullableFilter<"County"> | number | null
    createdAt?: DateTimeFilter<"County"> | Date | string
    updatedAt?: DateTimeFilter<"County"> | Date | string
    properties?: PropertyListRelationFilter
    auctions?: AuctionListRelationFilter
    certificates?: CertificateListRelationFilter
  }

  export type CountyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    state?: SortOrder
    countyCode?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    taxCollectorUrl?: SortOrderInput | SortOrder
    propertyAppraiserUrl?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    properties?: PropertyOrderByRelationAggregateInput
    auctions?: AuctionOrderByRelationAggregateInput
    certificates?: CertificateOrderByRelationAggregateInput
  }

  export type CountyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CountyWhereInput | CountyWhereInput[]
    OR?: CountyWhereInput[]
    NOT?: CountyWhereInput | CountyWhereInput[]
    state?: StringFilter<"County"> | string
    countyCode?: StringNullableFilter<"County"> | string | null
    websiteUrl?: StringNullableFilter<"County"> | string | null
    taxCollectorUrl?: StringNullableFilter<"County"> | string | null
    propertyAppraiserUrl?: StringNullableFilter<"County"> | string | null
    description?: StringNullableFilter<"County"> | string | null
    latitude?: FloatNullableFilter<"County"> | number | null
    longitude?: FloatNullableFilter<"County"> | number | null
    createdAt?: DateTimeFilter<"County"> | Date | string
    updatedAt?: DateTimeFilter<"County"> | Date | string
    properties?: PropertyListRelationFilter
    auctions?: AuctionListRelationFilter
    certificates?: CertificateListRelationFilter
  }, "id" | "name">

  export type CountyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    state?: SortOrder
    countyCode?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    taxCollectorUrl?: SortOrderInput | SortOrder
    propertyAppraiserUrl?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CountyCountOrderByAggregateInput
    _avg?: CountyAvgOrderByAggregateInput
    _max?: CountyMaxOrderByAggregateInput
    _min?: CountyMinOrderByAggregateInput
    _sum?: CountySumOrderByAggregateInput
  }

  export type CountyScalarWhereWithAggregatesInput = {
    AND?: CountyScalarWhereWithAggregatesInput | CountyScalarWhereWithAggregatesInput[]
    OR?: CountyScalarWhereWithAggregatesInput[]
    NOT?: CountyScalarWhereWithAggregatesInput | CountyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"County"> | string
    name?: StringWithAggregatesFilter<"County"> | string
    state?: StringWithAggregatesFilter<"County"> | string
    countyCode?: StringNullableWithAggregatesFilter<"County"> | string | null
    websiteUrl?: StringNullableWithAggregatesFilter<"County"> | string | null
    taxCollectorUrl?: StringNullableWithAggregatesFilter<"County"> | string | null
    propertyAppraiserUrl?: StringNullableWithAggregatesFilter<"County"> | string | null
    description?: StringNullableWithAggregatesFilter<"County"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"County"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"County"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"County"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"County"> | Date | string
  }

  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: StringFilter<"Property"> | string
    parcelId?: StringFilter<"Property"> | string
    address?: StringFilter<"Property"> | string
    city?: StringFilter<"Property"> | string
    state?: StringFilter<"Property"> | string
    zipCode?: StringFilter<"Property"> | string
    legalDescription?: StringNullableFilter<"Property"> | string | null
    countyId?: StringFilter<"Property"> | string
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    certificates?: CertificateListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    parcelId?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    legalDescription?: SortOrderInput | SortOrder
    countyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    county?: CountyOrderByWithRelationInput
    certificates?: CertificateOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    parcelId?: string
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    address?: StringFilter<"Property"> | string
    city?: StringFilter<"Property"> | string
    state?: StringFilter<"Property"> | string
    zipCode?: StringFilter<"Property"> | string
    legalDescription?: StringNullableFilter<"Property"> | string | null
    countyId?: StringFilter<"Property"> | string
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    certificates?: CertificateListRelationFilter
  }, "id" | "parcelId">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    parcelId?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    legalDescription?: SortOrderInput | SortOrder
    countyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Property"> | string
    parcelId?: StringWithAggregatesFilter<"Property"> | string
    address?: StringWithAggregatesFilter<"Property"> | string
    city?: StringWithAggregatesFilter<"Property"> | string
    state?: StringWithAggregatesFilter<"Property"> | string
    zipCode?: StringWithAggregatesFilter<"Property"> | string
    legalDescription?: StringNullableWithAggregatesFilter<"Property"> | string | null
    countyId?: StringWithAggregatesFilter<"Property"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
  }

  export type AuctionWhereInput = {
    AND?: AuctionWhereInput | AuctionWhereInput[]
    OR?: AuctionWhereInput[]
    NOT?: AuctionWhereInput | AuctionWhereInput[]
    id?: StringFilter<"Auction"> | string
    countyId?: StringFilter<"Auction"> | string
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    status?: StringFilter<"Auction"> | string
    adUrl?: StringNullableFilter<"Auction"> | string | null
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    updatedAt?: DateTimeFilter<"Auction"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    certificates?: CertificateListRelationFilter
    bids?: BidListRelationFilter
  }

  export type AuctionOrderByWithRelationInput = {
    id?: SortOrder
    countyId?: SortOrder
    auctionDate?: SortOrder
    status?: SortOrder
    adUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    county?: CountyOrderByWithRelationInput
    certificates?: CertificateOrderByRelationAggregateInput
    bids?: BidOrderByRelationAggregateInput
  }

  export type AuctionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuctionWhereInput | AuctionWhereInput[]
    OR?: AuctionWhereInput[]
    NOT?: AuctionWhereInput | AuctionWhereInput[]
    countyId?: StringFilter<"Auction"> | string
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    status?: StringFilter<"Auction"> | string
    adUrl?: StringNullableFilter<"Auction"> | string | null
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    updatedAt?: DateTimeFilter<"Auction"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    certificates?: CertificateListRelationFilter
    bids?: BidListRelationFilter
  }, "id">

  export type AuctionOrderByWithAggregationInput = {
    id?: SortOrder
    countyId?: SortOrder
    auctionDate?: SortOrder
    status?: SortOrder
    adUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuctionCountOrderByAggregateInput
    _max?: AuctionMaxOrderByAggregateInput
    _min?: AuctionMinOrderByAggregateInput
  }

  export type AuctionScalarWhereWithAggregatesInput = {
    AND?: AuctionScalarWhereWithAggregatesInput | AuctionScalarWhereWithAggregatesInput[]
    OR?: AuctionScalarWhereWithAggregatesInput[]
    NOT?: AuctionScalarWhereWithAggregatesInput | AuctionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Auction"> | string
    countyId?: StringWithAggregatesFilter<"Auction"> | string
    auctionDate?: DateTimeWithAggregatesFilter<"Auction"> | Date | string
    status?: StringWithAggregatesFilter<"Auction"> | string
    adUrl?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Auction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Auction"> | Date | string
  }

  export type CertificateWhereInput = {
    AND?: CertificateWhereInput | CertificateWhereInput[]
    OR?: CertificateWhereInput[]
    NOT?: CertificateWhereInput | CertificateWhereInput[]
    id?: StringFilter<"Certificate"> | string
    certificateNumber?: StringFilter<"Certificate"> | string
    countyId?: StringFilter<"Certificate"> | string
    propertyId?: StringFilter<"Certificate"> | string
    auctionId?: StringFilter<"Certificate"> | string
    status?: StringFilter<"Certificate"> | string
    faceValue?: FloatFilter<"Certificate"> | number
    interestRate?: FloatNullableFilter<"Certificate"> | number | null
    premium?: FloatNullableFilter<"Certificate"> | number | null
    buyerId?: StringNullableFilter<"Certificate"> | string | null
    purchaseDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    redemptionDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    createdAt?: DateTimeFilter<"Certificate"> | Date | string
    updatedAt?: DateTimeFilter<"Certificate"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    bids?: BidListRelationFilter
  }

  export type CertificateOrderByWithRelationInput = {
    id?: SortOrder
    certificateNumber?: SortOrder
    countyId?: SortOrder
    propertyId?: SortOrder
    auctionId?: SortOrder
    status?: SortOrder
    faceValue?: SortOrder
    interestRate?: SortOrderInput | SortOrder
    premium?: SortOrderInput | SortOrder
    buyerId?: SortOrderInput | SortOrder
    purchaseDate?: SortOrderInput | SortOrder
    redemptionDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    county?: CountyOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    auction?: AuctionOrderByWithRelationInput
    bids?: BidOrderByRelationAggregateInput
  }

  export type CertificateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    certificateNumber?: string
    AND?: CertificateWhereInput | CertificateWhereInput[]
    OR?: CertificateWhereInput[]
    NOT?: CertificateWhereInput | CertificateWhereInput[]
    countyId?: StringFilter<"Certificate"> | string
    propertyId?: StringFilter<"Certificate"> | string
    auctionId?: StringFilter<"Certificate"> | string
    status?: StringFilter<"Certificate"> | string
    faceValue?: FloatFilter<"Certificate"> | number
    interestRate?: FloatNullableFilter<"Certificate"> | number | null
    premium?: FloatNullableFilter<"Certificate"> | number | null
    buyerId?: StringNullableFilter<"Certificate"> | string | null
    purchaseDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    redemptionDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    createdAt?: DateTimeFilter<"Certificate"> | Date | string
    updatedAt?: DateTimeFilter<"Certificate"> | Date | string
    county?: XOR<CountyScalarRelationFilter, CountyWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    bids?: BidListRelationFilter
  }, "id" | "certificateNumber">

  export type CertificateOrderByWithAggregationInput = {
    id?: SortOrder
    certificateNumber?: SortOrder
    countyId?: SortOrder
    propertyId?: SortOrder
    auctionId?: SortOrder
    status?: SortOrder
    faceValue?: SortOrder
    interestRate?: SortOrderInput | SortOrder
    premium?: SortOrderInput | SortOrder
    buyerId?: SortOrderInput | SortOrder
    purchaseDate?: SortOrderInput | SortOrder
    redemptionDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CertificateCountOrderByAggregateInput
    _avg?: CertificateAvgOrderByAggregateInput
    _max?: CertificateMaxOrderByAggregateInput
    _min?: CertificateMinOrderByAggregateInput
    _sum?: CertificateSumOrderByAggregateInput
  }

  export type CertificateScalarWhereWithAggregatesInput = {
    AND?: CertificateScalarWhereWithAggregatesInput | CertificateScalarWhereWithAggregatesInput[]
    OR?: CertificateScalarWhereWithAggregatesInput[]
    NOT?: CertificateScalarWhereWithAggregatesInput | CertificateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Certificate"> | string
    certificateNumber?: StringWithAggregatesFilter<"Certificate"> | string
    countyId?: StringWithAggregatesFilter<"Certificate"> | string
    propertyId?: StringWithAggregatesFilter<"Certificate"> | string
    auctionId?: StringWithAggregatesFilter<"Certificate"> | string
    status?: StringWithAggregatesFilter<"Certificate"> | string
    faceValue?: FloatWithAggregatesFilter<"Certificate"> | number
    interestRate?: FloatNullableWithAggregatesFilter<"Certificate"> | number | null
    premium?: FloatNullableWithAggregatesFilter<"Certificate"> | number | null
    buyerId?: StringNullableWithAggregatesFilter<"Certificate"> | string | null
    purchaseDate?: DateTimeNullableWithAggregatesFilter<"Certificate"> | Date | string | null
    redemptionDate?: DateTimeNullableWithAggregatesFilter<"Certificate"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Certificate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Certificate"> | Date | string
  }

  export type BidWhereInput = {
    AND?: BidWhereInput | BidWhereInput[]
    OR?: BidWhereInput[]
    NOT?: BidWhereInput | BidWhereInput[]
    id?: StringFilter<"Bid"> | string
    auctionId?: StringFilter<"Bid"> | string
    certificateId?: StringFilter<"Bid"> | string
    userId?: StringFilter<"Bid"> | string
    bidAmount?: FloatFilter<"Bid"> | number
    bidType?: StringFilter<"Bid"> | string
    isWinningBid?: BoolFilter<"Bid"> | boolean
    bidTime?: DateTimeFilter<"Bid"> | Date | string
    timestamp?: DateTimeFilter<"Bid"> | Date | string
    createdAt?: DateTimeFilter<"Bid"> | Date | string
    updatedAt?: DateTimeFilter<"Bid"> | Date | string
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    certificate?: XOR<CertificateScalarRelationFilter, CertificateWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type BidOrderByWithRelationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    certificateId?: SortOrder
    userId?: SortOrder
    bidAmount?: SortOrder
    bidType?: SortOrder
    isWinningBid?: SortOrder
    bidTime?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    auction?: AuctionOrderByWithRelationInput
    certificate?: CertificateOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type BidWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BidWhereInput | BidWhereInput[]
    OR?: BidWhereInput[]
    NOT?: BidWhereInput | BidWhereInput[]
    auctionId?: StringFilter<"Bid"> | string
    certificateId?: StringFilter<"Bid"> | string
    userId?: StringFilter<"Bid"> | string
    bidAmount?: FloatFilter<"Bid"> | number
    bidType?: StringFilter<"Bid"> | string
    isWinningBid?: BoolFilter<"Bid"> | boolean
    bidTime?: DateTimeFilter<"Bid"> | Date | string
    timestamp?: DateTimeFilter<"Bid"> | Date | string
    createdAt?: DateTimeFilter<"Bid"> | Date | string
    updatedAt?: DateTimeFilter<"Bid"> | Date | string
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    certificate?: XOR<CertificateScalarRelationFilter, CertificateWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type BidOrderByWithAggregationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    certificateId?: SortOrder
    userId?: SortOrder
    bidAmount?: SortOrder
    bidType?: SortOrder
    isWinningBid?: SortOrder
    bidTime?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BidCountOrderByAggregateInput
    _avg?: BidAvgOrderByAggregateInput
    _max?: BidMaxOrderByAggregateInput
    _min?: BidMinOrderByAggregateInput
    _sum?: BidSumOrderByAggregateInput
  }

  export type BidScalarWhereWithAggregatesInput = {
    AND?: BidScalarWhereWithAggregatesInput | BidScalarWhereWithAggregatesInput[]
    OR?: BidScalarWhereWithAggregatesInput[]
    NOT?: BidScalarWhereWithAggregatesInput | BidScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bid"> | string
    auctionId?: StringWithAggregatesFilter<"Bid"> | string
    certificateId?: StringWithAggregatesFilter<"Bid"> | string
    userId?: StringWithAggregatesFilter<"Bid"> | string
    bidAmount?: FloatWithAggregatesFilter<"Bid"> | number
    bidType?: StringWithAggregatesFilter<"Bid"> | string
    isWinningBid?: BoolWithAggregatesFilter<"Bid"> | boolean
    bidTime?: DateTimeWithAggregatesFilter<"Bid"> | Date | string
    timestamp?: DateTimeWithAggregatesFilter<"Bid"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Bid"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bid"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    email: string
    role?: string
    status?: string | null
    kycStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    email: string
    role?: string
    status?: string | null
    kycStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    email: string
    role?: string
    status?: string | null
    kycStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CountyCreateInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyCreateNestedManyWithoutCountyInput
    auctions?: AuctionCreateNestedManyWithoutCountyInput
    certificates?: CertificateCreateNestedManyWithoutCountyInput
  }

  export type CountyUncheckedCreateInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutCountyInput
    auctions?: AuctionUncheckedCreateNestedManyWithoutCountyInput
    certificates?: CertificateUncheckedCreateNestedManyWithoutCountyInput
  }

  export type CountyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUpdateManyWithoutCountyNestedInput
    auctions?: AuctionUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUpdateManyWithoutCountyNestedInput
  }

  export type CountyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutCountyNestedInput
    auctions?: AuctionUncheckedUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUncheckedUpdateManyWithoutCountyNestedInput
  }

  export type CountyCreateManyInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CountyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CountyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutPropertiesInput
    certificates?: CertificateCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    countyId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutPropertiesNestedInput
    certificates?: CertificateUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    countyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    countyId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    countyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionCreateInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutAuctionsInput
    certificates?: CertificateCreateNestedManyWithoutAuctionInput
    bids?: BidCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateInput = {
    id?: string
    countyId: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateUncheckedCreateNestedManyWithoutAuctionInput
    bids?: BidUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutAuctionsNestedInput
    certificates?: CertificateUpdateManyWithoutAuctionNestedInput
    bids?: BidUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUncheckedUpdateManyWithoutAuctionNestedInput
    bids?: BidUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionCreateManyInput = {
    id?: string
    countyId: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuctionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificateCreateInput = {
    id?: string
    certificateNumber: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutCertificatesInput
    property: PropertyCreateNestedOneWithoutCertificatesInput
    auction: AuctionCreateNestedOneWithoutCertificatesInput
    bids?: BidCreateNestedManyWithoutCertificateInput
  }

  export type CertificateUncheckedCreateInput = {
    id?: string
    certificateNumber: string
    countyId: string
    propertyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutCertificateInput
  }

  export type CertificateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutCertificatesNestedInput
    property?: PropertyUpdateOneRequiredWithoutCertificatesNestedInput
    auction?: AuctionUpdateOneRequiredWithoutCertificatesNestedInput
    bids?: BidUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateCreateManyInput = {
    id?: string
    certificateNumber: string
    countyId: string
    propertyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidCreateInput = {
    id?: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    auction: AuctionCreateNestedOneWithoutBidsInput
    certificate: CertificateCreateNestedOneWithoutBidsInput
    user: UserCreateNestedOneWithoutBidsInput
  }

  export type BidUncheckedCreateInput = {
    id?: string
    auctionId: string
    certificateId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutBidsNestedInput
    certificate?: CertificateUpdateOneRequiredWithoutBidsNestedInput
    user?: UserUpdateOneRequiredWithoutBidsNestedInput
  }

  export type BidUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidCreateManyInput = {
    id?: string
    auctionId: string
    certificateId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BidListRelationFilter = {
    every?: BidWhereInput
    some?: BidWhereInput
    none?: BidWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BidOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    kycStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PropertyListRelationFilter = {
    every?: PropertyWhereInput
    some?: PropertyWhereInput
    none?: PropertyWhereInput
  }

  export type AuctionListRelationFilter = {
    every?: AuctionWhereInput
    some?: AuctionWhereInput
    none?: AuctionWhereInput
  }

  export type CertificateListRelationFilter = {
    every?: CertificateWhereInput
    some?: CertificateWhereInput
    none?: CertificateWhereInput
  }

  export type PropertyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuctionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CertificateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CountyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    state?: SortOrder
    countyCode?: SortOrder
    websiteUrl?: SortOrder
    taxCollectorUrl?: SortOrder
    propertyAppraiserUrl?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountyAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type CountyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    state?: SortOrder
    countyCode?: SortOrder
    websiteUrl?: SortOrder
    taxCollectorUrl?: SortOrder
    propertyAppraiserUrl?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    state?: SortOrder
    countyCode?: SortOrder
    websiteUrl?: SortOrder
    taxCollectorUrl?: SortOrder
    propertyAppraiserUrl?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CountySumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type CountyScalarRelationFilter = {
    is?: CountyWhereInput
    isNot?: CountyWhereInput
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    parcelId?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    legalDescription?: SortOrder
    countyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    parcelId?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    legalDescription?: SortOrder
    countyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    parcelId?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    legalDescription?: SortOrder
    countyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuctionCountOrderByAggregateInput = {
    id?: SortOrder
    countyId?: SortOrder
    auctionDate?: SortOrder
    status?: SortOrder
    adUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuctionMaxOrderByAggregateInput = {
    id?: SortOrder
    countyId?: SortOrder
    auctionDate?: SortOrder
    status?: SortOrder
    adUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuctionMinOrderByAggregateInput = {
    id?: SortOrder
    countyId?: SortOrder
    auctionDate?: SortOrder
    status?: SortOrder
    adUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PropertyScalarRelationFilter = {
    is?: PropertyWhereInput
    isNot?: PropertyWhereInput
  }

  export type AuctionScalarRelationFilter = {
    is?: AuctionWhereInput
    isNot?: AuctionWhereInput
  }

  export type CertificateCountOrderByAggregateInput = {
    id?: SortOrder
    certificateNumber?: SortOrder
    countyId?: SortOrder
    propertyId?: SortOrder
    auctionId?: SortOrder
    status?: SortOrder
    faceValue?: SortOrder
    interestRate?: SortOrder
    premium?: SortOrder
    buyerId?: SortOrder
    purchaseDate?: SortOrder
    redemptionDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificateAvgOrderByAggregateInput = {
    faceValue?: SortOrder
    interestRate?: SortOrder
    premium?: SortOrder
  }

  export type CertificateMaxOrderByAggregateInput = {
    id?: SortOrder
    certificateNumber?: SortOrder
    countyId?: SortOrder
    propertyId?: SortOrder
    auctionId?: SortOrder
    status?: SortOrder
    faceValue?: SortOrder
    interestRate?: SortOrder
    premium?: SortOrder
    buyerId?: SortOrder
    purchaseDate?: SortOrder
    redemptionDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificateMinOrderByAggregateInput = {
    id?: SortOrder
    certificateNumber?: SortOrder
    countyId?: SortOrder
    propertyId?: SortOrder
    auctionId?: SortOrder
    status?: SortOrder
    faceValue?: SortOrder
    interestRate?: SortOrder
    premium?: SortOrder
    buyerId?: SortOrder
    purchaseDate?: SortOrder
    redemptionDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificateSumOrderByAggregateInput = {
    faceValue?: SortOrder
    interestRate?: SortOrder
    premium?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CertificateScalarRelationFilter = {
    is?: CertificateWhereInput
    isNot?: CertificateWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type BidCountOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    certificateId?: SortOrder
    userId?: SortOrder
    bidAmount?: SortOrder
    bidType?: SortOrder
    isWinningBid?: SortOrder
    bidTime?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BidAvgOrderByAggregateInput = {
    bidAmount?: SortOrder
  }

  export type BidMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    certificateId?: SortOrder
    userId?: SortOrder
    bidAmount?: SortOrder
    bidType?: SortOrder
    isWinningBid?: SortOrder
    bidTime?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BidMinOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    certificateId?: SortOrder
    userId?: SortOrder
    bidAmount?: SortOrder
    bidType?: SortOrder
    isWinningBid?: SortOrder
    bidTime?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BidSumOrderByAggregateInput = {
    bidAmount?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BidCreateNestedManyWithoutUserInput = {
    create?: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput> | BidCreateWithoutUserInput[] | BidUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BidCreateOrConnectWithoutUserInput | BidCreateOrConnectWithoutUserInput[]
    createMany?: BidCreateManyUserInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type BidUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput> | BidCreateWithoutUserInput[] | BidUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BidCreateOrConnectWithoutUserInput | BidCreateOrConnectWithoutUserInput[]
    createMany?: BidCreateManyUserInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BidUpdateManyWithoutUserNestedInput = {
    create?: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput> | BidCreateWithoutUserInput[] | BidUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BidCreateOrConnectWithoutUserInput | BidCreateOrConnectWithoutUserInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutUserInput | BidUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BidCreateManyUserInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutUserInput | BidUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BidUpdateManyWithWhereWithoutUserInput | BidUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type BidUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput> | BidCreateWithoutUserInput[] | BidUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BidCreateOrConnectWithoutUserInput | BidCreateOrConnectWithoutUserInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutUserInput | BidUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BidCreateManyUserInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutUserInput | BidUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BidUpdateManyWithWhereWithoutUserInput | BidUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type PropertyCreateNestedManyWithoutCountyInput = {
    create?: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput> | PropertyCreateWithoutCountyInput[] | PropertyUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutCountyInput | PropertyCreateOrConnectWithoutCountyInput[]
    createMany?: PropertyCreateManyCountyInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type AuctionCreateNestedManyWithoutCountyInput = {
    create?: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput> | AuctionCreateWithoutCountyInput[] | AuctionUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutCountyInput | AuctionCreateOrConnectWithoutCountyInput[]
    createMany?: AuctionCreateManyCountyInputEnvelope
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
  }

  export type CertificateCreateNestedManyWithoutCountyInput = {
    create?: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput> | CertificateCreateWithoutCountyInput[] | CertificateUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutCountyInput | CertificateCreateOrConnectWithoutCountyInput[]
    createMany?: CertificateCreateManyCountyInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutCountyInput = {
    create?: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput> | PropertyCreateWithoutCountyInput[] | PropertyUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutCountyInput | PropertyCreateOrConnectWithoutCountyInput[]
    createMany?: PropertyCreateManyCountyInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type AuctionUncheckedCreateNestedManyWithoutCountyInput = {
    create?: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput> | AuctionCreateWithoutCountyInput[] | AuctionUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutCountyInput | AuctionCreateOrConnectWithoutCountyInput[]
    createMany?: AuctionCreateManyCountyInputEnvelope
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
  }

  export type CertificateUncheckedCreateNestedManyWithoutCountyInput = {
    create?: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput> | CertificateCreateWithoutCountyInput[] | CertificateUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutCountyInput | CertificateCreateOrConnectWithoutCountyInput[]
    createMany?: CertificateCreateManyCountyInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PropertyUpdateManyWithoutCountyNestedInput = {
    create?: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput> | PropertyCreateWithoutCountyInput[] | PropertyUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutCountyInput | PropertyCreateOrConnectWithoutCountyInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutCountyInput | PropertyUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: PropertyCreateManyCountyInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutCountyInput | PropertyUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutCountyInput | PropertyUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type AuctionUpdateManyWithoutCountyNestedInput = {
    create?: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput> | AuctionCreateWithoutCountyInput[] | AuctionUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutCountyInput | AuctionCreateOrConnectWithoutCountyInput[]
    upsert?: AuctionUpsertWithWhereUniqueWithoutCountyInput | AuctionUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: AuctionCreateManyCountyInputEnvelope
    set?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    disconnect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    delete?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    update?: AuctionUpdateWithWhereUniqueWithoutCountyInput | AuctionUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: AuctionUpdateManyWithWhereWithoutCountyInput | AuctionUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
  }

  export type CertificateUpdateManyWithoutCountyNestedInput = {
    create?: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput> | CertificateCreateWithoutCountyInput[] | CertificateUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutCountyInput | CertificateCreateOrConnectWithoutCountyInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutCountyInput | CertificateUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: CertificateCreateManyCountyInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutCountyInput | CertificateUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutCountyInput | CertificateUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutCountyNestedInput = {
    create?: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput> | PropertyCreateWithoutCountyInput[] | PropertyUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutCountyInput | PropertyCreateOrConnectWithoutCountyInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutCountyInput | PropertyUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: PropertyCreateManyCountyInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutCountyInput | PropertyUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutCountyInput | PropertyUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type AuctionUncheckedUpdateManyWithoutCountyNestedInput = {
    create?: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput> | AuctionCreateWithoutCountyInput[] | AuctionUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutCountyInput | AuctionCreateOrConnectWithoutCountyInput[]
    upsert?: AuctionUpsertWithWhereUniqueWithoutCountyInput | AuctionUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: AuctionCreateManyCountyInputEnvelope
    set?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    disconnect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    delete?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    update?: AuctionUpdateWithWhereUniqueWithoutCountyInput | AuctionUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: AuctionUpdateManyWithWhereWithoutCountyInput | AuctionUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
  }

  export type CertificateUncheckedUpdateManyWithoutCountyNestedInput = {
    create?: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput> | CertificateCreateWithoutCountyInput[] | CertificateUncheckedCreateWithoutCountyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutCountyInput | CertificateCreateOrConnectWithoutCountyInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutCountyInput | CertificateUpsertWithWhereUniqueWithoutCountyInput[]
    createMany?: CertificateCreateManyCountyInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutCountyInput | CertificateUpdateWithWhereUniqueWithoutCountyInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutCountyInput | CertificateUpdateManyWithWhereWithoutCountyInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type CountyCreateNestedOneWithoutPropertiesInput = {
    create?: XOR<CountyCreateWithoutPropertiesInput, CountyUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: CountyCreateOrConnectWithoutPropertiesInput
    connect?: CountyWhereUniqueInput
  }

  export type CertificateCreateNestedManyWithoutPropertyInput = {
    create?: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput> | CertificateCreateWithoutPropertyInput[] | CertificateUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutPropertyInput | CertificateCreateOrConnectWithoutPropertyInput[]
    createMany?: CertificateCreateManyPropertyInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type CertificateUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput> | CertificateCreateWithoutPropertyInput[] | CertificateUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutPropertyInput | CertificateCreateOrConnectWithoutPropertyInput[]
    createMany?: CertificateCreateManyPropertyInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type CountyUpdateOneRequiredWithoutPropertiesNestedInput = {
    create?: XOR<CountyCreateWithoutPropertiesInput, CountyUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: CountyCreateOrConnectWithoutPropertiesInput
    upsert?: CountyUpsertWithoutPropertiesInput
    connect?: CountyWhereUniqueInput
    update?: XOR<XOR<CountyUpdateToOneWithWhereWithoutPropertiesInput, CountyUpdateWithoutPropertiesInput>, CountyUncheckedUpdateWithoutPropertiesInput>
  }

  export type CertificateUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput> | CertificateCreateWithoutPropertyInput[] | CertificateUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutPropertyInput | CertificateCreateOrConnectWithoutPropertyInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutPropertyInput | CertificateUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: CertificateCreateManyPropertyInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutPropertyInput | CertificateUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutPropertyInput | CertificateUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type CertificateUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput> | CertificateCreateWithoutPropertyInput[] | CertificateUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutPropertyInput | CertificateCreateOrConnectWithoutPropertyInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutPropertyInput | CertificateUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: CertificateCreateManyPropertyInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutPropertyInput | CertificateUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutPropertyInput | CertificateUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type CountyCreateNestedOneWithoutAuctionsInput = {
    create?: XOR<CountyCreateWithoutAuctionsInput, CountyUncheckedCreateWithoutAuctionsInput>
    connectOrCreate?: CountyCreateOrConnectWithoutAuctionsInput
    connect?: CountyWhereUniqueInput
  }

  export type CertificateCreateNestedManyWithoutAuctionInput = {
    create?: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput> | CertificateCreateWithoutAuctionInput[] | CertificateUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutAuctionInput | CertificateCreateOrConnectWithoutAuctionInput[]
    createMany?: CertificateCreateManyAuctionInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type BidCreateNestedManyWithoutAuctionInput = {
    create?: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput> | BidCreateWithoutAuctionInput[] | BidUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidCreateOrConnectWithoutAuctionInput | BidCreateOrConnectWithoutAuctionInput[]
    createMany?: BidCreateManyAuctionInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type CertificateUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput> | CertificateCreateWithoutAuctionInput[] | CertificateUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutAuctionInput | CertificateCreateOrConnectWithoutAuctionInput[]
    createMany?: CertificateCreateManyAuctionInputEnvelope
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
  }

  export type BidUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput> | BidCreateWithoutAuctionInput[] | BidUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidCreateOrConnectWithoutAuctionInput | BidCreateOrConnectWithoutAuctionInput[]
    createMany?: BidCreateManyAuctionInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type CountyUpdateOneRequiredWithoutAuctionsNestedInput = {
    create?: XOR<CountyCreateWithoutAuctionsInput, CountyUncheckedCreateWithoutAuctionsInput>
    connectOrCreate?: CountyCreateOrConnectWithoutAuctionsInput
    upsert?: CountyUpsertWithoutAuctionsInput
    connect?: CountyWhereUniqueInput
    update?: XOR<XOR<CountyUpdateToOneWithWhereWithoutAuctionsInput, CountyUpdateWithoutAuctionsInput>, CountyUncheckedUpdateWithoutAuctionsInput>
  }

  export type CertificateUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput> | CertificateCreateWithoutAuctionInput[] | CertificateUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutAuctionInput | CertificateCreateOrConnectWithoutAuctionInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutAuctionInput | CertificateUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: CertificateCreateManyAuctionInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutAuctionInput | CertificateUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutAuctionInput | CertificateUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type BidUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput> | BidCreateWithoutAuctionInput[] | BidUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidCreateOrConnectWithoutAuctionInput | BidCreateOrConnectWithoutAuctionInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutAuctionInput | BidUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: BidCreateManyAuctionInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutAuctionInput | BidUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: BidUpdateManyWithWhereWithoutAuctionInput | BidUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type CertificateUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput> | CertificateCreateWithoutAuctionInput[] | CertificateUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CertificateCreateOrConnectWithoutAuctionInput | CertificateCreateOrConnectWithoutAuctionInput[]
    upsert?: CertificateUpsertWithWhereUniqueWithoutAuctionInput | CertificateUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: CertificateCreateManyAuctionInputEnvelope
    set?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    disconnect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    delete?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    connect?: CertificateWhereUniqueInput | CertificateWhereUniqueInput[]
    update?: CertificateUpdateWithWhereUniqueWithoutAuctionInput | CertificateUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: CertificateUpdateManyWithWhereWithoutAuctionInput | CertificateUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
  }

  export type BidUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput> | BidCreateWithoutAuctionInput[] | BidUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidCreateOrConnectWithoutAuctionInput | BidCreateOrConnectWithoutAuctionInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutAuctionInput | BidUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: BidCreateManyAuctionInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutAuctionInput | BidUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: BidUpdateManyWithWhereWithoutAuctionInput | BidUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type CountyCreateNestedOneWithoutCertificatesInput = {
    create?: XOR<CountyCreateWithoutCertificatesInput, CountyUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: CountyCreateOrConnectWithoutCertificatesInput
    connect?: CountyWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutCertificatesInput = {
    create?: XOR<PropertyCreateWithoutCertificatesInput, PropertyUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutCertificatesInput
    connect?: PropertyWhereUniqueInput
  }

  export type AuctionCreateNestedOneWithoutCertificatesInput = {
    create?: XOR<AuctionCreateWithoutCertificatesInput, AuctionUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutCertificatesInput
    connect?: AuctionWhereUniqueInput
  }

  export type BidCreateNestedManyWithoutCertificateInput = {
    create?: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput> | BidCreateWithoutCertificateInput[] | BidUncheckedCreateWithoutCertificateInput[]
    connectOrCreate?: BidCreateOrConnectWithoutCertificateInput | BidCreateOrConnectWithoutCertificateInput[]
    createMany?: BidCreateManyCertificateInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type BidUncheckedCreateNestedManyWithoutCertificateInput = {
    create?: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput> | BidCreateWithoutCertificateInput[] | BidUncheckedCreateWithoutCertificateInput[]
    connectOrCreate?: BidCreateOrConnectWithoutCertificateInput | BidCreateOrConnectWithoutCertificateInput[]
    createMany?: BidCreateManyCertificateInputEnvelope
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CountyUpdateOneRequiredWithoutCertificatesNestedInput = {
    create?: XOR<CountyCreateWithoutCertificatesInput, CountyUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: CountyCreateOrConnectWithoutCertificatesInput
    upsert?: CountyUpsertWithoutCertificatesInput
    connect?: CountyWhereUniqueInput
    update?: XOR<XOR<CountyUpdateToOneWithWhereWithoutCertificatesInput, CountyUpdateWithoutCertificatesInput>, CountyUncheckedUpdateWithoutCertificatesInput>
  }

  export type PropertyUpdateOneRequiredWithoutCertificatesNestedInput = {
    create?: XOR<PropertyCreateWithoutCertificatesInput, PropertyUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutCertificatesInput
    upsert?: PropertyUpsertWithoutCertificatesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutCertificatesInput, PropertyUpdateWithoutCertificatesInput>, PropertyUncheckedUpdateWithoutCertificatesInput>
  }

  export type AuctionUpdateOneRequiredWithoutCertificatesNestedInput = {
    create?: XOR<AuctionCreateWithoutCertificatesInput, AuctionUncheckedCreateWithoutCertificatesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutCertificatesInput
    upsert?: AuctionUpsertWithoutCertificatesInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutCertificatesInput, AuctionUpdateWithoutCertificatesInput>, AuctionUncheckedUpdateWithoutCertificatesInput>
  }

  export type BidUpdateManyWithoutCertificateNestedInput = {
    create?: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput> | BidCreateWithoutCertificateInput[] | BidUncheckedCreateWithoutCertificateInput[]
    connectOrCreate?: BidCreateOrConnectWithoutCertificateInput | BidCreateOrConnectWithoutCertificateInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutCertificateInput | BidUpsertWithWhereUniqueWithoutCertificateInput[]
    createMany?: BidCreateManyCertificateInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutCertificateInput | BidUpdateWithWhereUniqueWithoutCertificateInput[]
    updateMany?: BidUpdateManyWithWhereWithoutCertificateInput | BidUpdateManyWithWhereWithoutCertificateInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type BidUncheckedUpdateManyWithoutCertificateNestedInput = {
    create?: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput> | BidCreateWithoutCertificateInput[] | BidUncheckedCreateWithoutCertificateInput[]
    connectOrCreate?: BidCreateOrConnectWithoutCertificateInput | BidCreateOrConnectWithoutCertificateInput[]
    upsert?: BidUpsertWithWhereUniqueWithoutCertificateInput | BidUpsertWithWhereUniqueWithoutCertificateInput[]
    createMany?: BidCreateManyCertificateInputEnvelope
    set?: BidWhereUniqueInput | BidWhereUniqueInput[]
    disconnect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    delete?: BidWhereUniqueInput | BidWhereUniqueInput[]
    connect?: BidWhereUniqueInput | BidWhereUniqueInput[]
    update?: BidUpdateWithWhereUniqueWithoutCertificateInput | BidUpdateWithWhereUniqueWithoutCertificateInput[]
    updateMany?: BidUpdateManyWithWhereWithoutCertificateInput | BidUpdateManyWithWhereWithoutCertificateInput[]
    deleteMany?: BidScalarWhereInput | BidScalarWhereInput[]
  }

  export type AuctionCreateNestedOneWithoutBidsInput = {
    create?: XOR<AuctionCreateWithoutBidsInput, AuctionUncheckedCreateWithoutBidsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutBidsInput
    connect?: AuctionWhereUniqueInput
  }

  export type CertificateCreateNestedOneWithoutBidsInput = {
    create?: XOR<CertificateCreateWithoutBidsInput, CertificateUncheckedCreateWithoutBidsInput>
    connectOrCreate?: CertificateCreateOrConnectWithoutBidsInput
    connect?: CertificateWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBidsInput = {
    create?: XOR<UserCreateWithoutBidsInput, UserUncheckedCreateWithoutBidsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBidsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AuctionUpdateOneRequiredWithoutBidsNestedInput = {
    create?: XOR<AuctionCreateWithoutBidsInput, AuctionUncheckedCreateWithoutBidsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutBidsInput
    upsert?: AuctionUpsertWithoutBidsInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutBidsInput, AuctionUpdateWithoutBidsInput>, AuctionUncheckedUpdateWithoutBidsInput>
  }

  export type CertificateUpdateOneRequiredWithoutBidsNestedInput = {
    create?: XOR<CertificateCreateWithoutBidsInput, CertificateUncheckedCreateWithoutBidsInput>
    connectOrCreate?: CertificateCreateOrConnectWithoutBidsInput
    upsert?: CertificateUpsertWithoutBidsInput
    connect?: CertificateWhereUniqueInput
    update?: XOR<XOR<CertificateUpdateToOneWithWhereWithoutBidsInput, CertificateUpdateWithoutBidsInput>, CertificateUncheckedUpdateWithoutBidsInput>
  }

  export type UserUpdateOneRequiredWithoutBidsNestedInput = {
    create?: XOR<UserCreateWithoutBidsInput, UserUncheckedCreateWithoutBidsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBidsInput
    upsert?: UserUpsertWithoutBidsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBidsInput, UserUpdateWithoutBidsInput>, UserUncheckedUpdateWithoutBidsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BidCreateWithoutUserInput = {
    id?: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    auction: AuctionCreateNestedOneWithoutBidsInput
    certificate: CertificateCreateNestedOneWithoutBidsInput
  }

  export type BidUncheckedCreateWithoutUserInput = {
    id?: string
    auctionId: string
    certificateId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidCreateOrConnectWithoutUserInput = {
    where: BidWhereUniqueInput
    create: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput>
  }

  export type BidCreateManyUserInputEnvelope = {
    data: BidCreateManyUserInput | BidCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BidUpsertWithWhereUniqueWithoutUserInput = {
    where: BidWhereUniqueInput
    update: XOR<BidUpdateWithoutUserInput, BidUncheckedUpdateWithoutUserInput>
    create: XOR<BidCreateWithoutUserInput, BidUncheckedCreateWithoutUserInput>
  }

  export type BidUpdateWithWhereUniqueWithoutUserInput = {
    where: BidWhereUniqueInput
    data: XOR<BidUpdateWithoutUserInput, BidUncheckedUpdateWithoutUserInput>
  }

  export type BidUpdateManyWithWhereWithoutUserInput = {
    where: BidScalarWhereInput
    data: XOR<BidUpdateManyMutationInput, BidUncheckedUpdateManyWithoutUserInput>
  }

  export type BidScalarWhereInput = {
    AND?: BidScalarWhereInput | BidScalarWhereInput[]
    OR?: BidScalarWhereInput[]
    NOT?: BidScalarWhereInput | BidScalarWhereInput[]
    id?: StringFilter<"Bid"> | string
    auctionId?: StringFilter<"Bid"> | string
    certificateId?: StringFilter<"Bid"> | string
    userId?: StringFilter<"Bid"> | string
    bidAmount?: FloatFilter<"Bid"> | number
    bidType?: StringFilter<"Bid"> | string
    isWinningBid?: BoolFilter<"Bid"> | boolean
    bidTime?: DateTimeFilter<"Bid"> | Date | string
    timestamp?: DateTimeFilter<"Bid"> | Date | string
    createdAt?: DateTimeFilter<"Bid"> | Date | string
    updatedAt?: DateTimeFilter<"Bid"> | Date | string
  }

  export type PropertyCreateWithoutCountyInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutCountyInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutCountyInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput>
  }

  export type PropertyCreateManyCountyInputEnvelope = {
    data: PropertyCreateManyCountyInput | PropertyCreateManyCountyInput[]
    skipDuplicates?: boolean
  }

  export type AuctionCreateWithoutCountyInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateCreateNestedManyWithoutAuctionInput
    bids?: BidCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutCountyInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateUncheckedCreateNestedManyWithoutAuctionInput
    bids?: BidUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutCountyInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput>
  }

  export type AuctionCreateManyCountyInputEnvelope = {
    data: AuctionCreateManyCountyInput | AuctionCreateManyCountyInput[]
    skipDuplicates?: boolean
  }

  export type CertificateCreateWithoutCountyInput = {
    id?: string
    certificateNumber: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutCertificatesInput
    auction: AuctionCreateNestedOneWithoutCertificatesInput
    bids?: BidCreateNestedManyWithoutCertificateInput
  }

  export type CertificateUncheckedCreateWithoutCountyInput = {
    id?: string
    certificateNumber: string
    propertyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutCertificateInput
  }

  export type CertificateCreateOrConnectWithoutCountyInput = {
    where: CertificateWhereUniqueInput
    create: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput>
  }

  export type CertificateCreateManyCountyInputEnvelope = {
    data: CertificateCreateManyCountyInput | CertificateCreateManyCountyInput[]
    skipDuplicates?: boolean
  }

  export type PropertyUpsertWithWhereUniqueWithoutCountyInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutCountyInput, PropertyUncheckedUpdateWithoutCountyInput>
    create: XOR<PropertyCreateWithoutCountyInput, PropertyUncheckedCreateWithoutCountyInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutCountyInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutCountyInput, PropertyUncheckedUpdateWithoutCountyInput>
  }

  export type PropertyUpdateManyWithWhereWithoutCountyInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutCountyInput>
  }

  export type PropertyScalarWhereInput = {
    AND?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    OR?: PropertyScalarWhereInput[]
    NOT?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    id?: StringFilter<"Property"> | string
    parcelId?: StringFilter<"Property"> | string
    address?: StringFilter<"Property"> | string
    city?: StringFilter<"Property"> | string
    state?: StringFilter<"Property"> | string
    zipCode?: StringFilter<"Property"> | string
    legalDescription?: StringNullableFilter<"Property"> | string | null
    countyId?: StringFilter<"Property"> | string
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
  }

  export type AuctionUpsertWithWhereUniqueWithoutCountyInput = {
    where: AuctionWhereUniqueInput
    update: XOR<AuctionUpdateWithoutCountyInput, AuctionUncheckedUpdateWithoutCountyInput>
    create: XOR<AuctionCreateWithoutCountyInput, AuctionUncheckedCreateWithoutCountyInput>
  }

  export type AuctionUpdateWithWhereUniqueWithoutCountyInput = {
    where: AuctionWhereUniqueInput
    data: XOR<AuctionUpdateWithoutCountyInput, AuctionUncheckedUpdateWithoutCountyInput>
  }

  export type AuctionUpdateManyWithWhereWithoutCountyInput = {
    where: AuctionScalarWhereInput
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyWithoutCountyInput>
  }

  export type AuctionScalarWhereInput = {
    AND?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
    OR?: AuctionScalarWhereInput[]
    NOT?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
    id?: StringFilter<"Auction"> | string
    countyId?: StringFilter<"Auction"> | string
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    status?: StringFilter<"Auction"> | string
    adUrl?: StringNullableFilter<"Auction"> | string | null
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    updatedAt?: DateTimeFilter<"Auction"> | Date | string
  }

  export type CertificateUpsertWithWhereUniqueWithoutCountyInput = {
    where: CertificateWhereUniqueInput
    update: XOR<CertificateUpdateWithoutCountyInput, CertificateUncheckedUpdateWithoutCountyInput>
    create: XOR<CertificateCreateWithoutCountyInput, CertificateUncheckedCreateWithoutCountyInput>
  }

  export type CertificateUpdateWithWhereUniqueWithoutCountyInput = {
    where: CertificateWhereUniqueInput
    data: XOR<CertificateUpdateWithoutCountyInput, CertificateUncheckedUpdateWithoutCountyInput>
  }

  export type CertificateUpdateManyWithWhereWithoutCountyInput = {
    where: CertificateScalarWhereInput
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyWithoutCountyInput>
  }

  export type CertificateScalarWhereInput = {
    AND?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
    OR?: CertificateScalarWhereInput[]
    NOT?: CertificateScalarWhereInput | CertificateScalarWhereInput[]
    id?: StringFilter<"Certificate"> | string
    certificateNumber?: StringFilter<"Certificate"> | string
    countyId?: StringFilter<"Certificate"> | string
    propertyId?: StringFilter<"Certificate"> | string
    auctionId?: StringFilter<"Certificate"> | string
    status?: StringFilter<"Certificate"> | string
    faceValue?: FloatFilter<"Certificate"> | number
    interestRate?: FloatNullableFilter<"Certificate"> | number | null
    premium?: FloatNullableFilter<"Certificate"> | number | null
    buyerId?: StringNullableFilter<"Certificate"> | string | null
    purchaseDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    redemptionDate?: DateTimeNullableFilter<"Certificate"> | Date | string | null
    createdAt?: DateTimeFilter<"Certificate"> | Date | string
    updatedAt?: DateTimeFilter<"Certificate"> | Date | string
  }

  export type CountyCreateWithoutPropertiesInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auctions?: AuctionCreateNestedManyWithoutCountyInput
    certificates?: CertificateCreateNestedManyWithoutCountyInput
  }

  export type CountyUncheckedCreateWithoutPropertiesInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auctions?: AuctionUncheckedCreateNestedManyWithoutCountyInput
    certificates?: CertificateUncheckedCreateNestedManyWithoutCountyInput
  }

  export type CountyCreateOrConnectWithoutPropertiesInput = {
    where: CountyWhereUniqueInput
    create: XOR<CountyCreateWithoutPropertiesInput, CountyUncheckedCreateWithoutPropertiesInput>
  }

  export type CertificateCreateWithoutPropertyInput = {
    id?: string
    certificateNumber: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutCertificatesInput
    auction: AuctionCreateNestedOneWithoutCertificatesInput
    bids?: BidCreateNestedManyWithoutCertificateInput
  }

  export type CertificateUncheckedCreateWithoutPropertyInput = {
    id?: string
    certificateNumber: string
    countyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutCertificateInput
  }

  export type CertificateCreateOrConnectWithoutPropertyInput = {
    where: CertificateWhereUniqueInput
    create: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput>
  }

  export type CertificateCreateManyPropertyInputEnvelope = {
    data: CertificateCreateManyPropertyInput | CertificateCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type CountyUpsertWithoutPropertiesInput = {
    update: XOR<CountyUpdateWithoutPropertiesInput, CountyUncheckedUpdateWithoutPropertiesInput>
    create: XOR<CountyCreateWithoutPropertiesInput, CountyUncheckedCreateWithoutPropertiesInput>
    where?: CountyWhereInput
  }

  export type CountyUpdateToOneWithWhereWithoutPropertiesInput = {
    where?: CountyWhereInput
    data: XOR<CountyUpdateWithoutPropertiesInput, CountyUncheckedUpdateWithoutPropertiesInput>
  }

  export type CountyUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auctions?: AuctionUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUpdateManyWithoutCountyNestedInput
  }

  export type CountyUncheckedUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auctions?: AuctionUncheckedUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUncheckedUpdateManyWithoutCountyNestedInput
  }

  export type CertificateUpsertWithWhereUniqueWithoutPropertyInput = {
    where: CertificateWhereUniqueInput
    update: XOR<CertificateUpdateWithoutPropertyInput, CertificateUncheckedUpdateWithoutPropertyInput>
    create: XOR<CertificateCreateWithoutPropertyInput, CertificateUncheckedCreateWithoutPropertyInput>
  }

  export type CertificateUpdateWithWhereUniqueWithoutPropertyInput = {
    where: CertificateWhereUniqueInput
    data: XOR<CertificateUpdateWithoutPropertyInput, CertificateUncheckedUpdateWithoutPropertyInput>
  }

  export type CertificateUpdateManyWithWhereWithoutPropertyInput = {
    where: CertificateScalarWhereInput
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyWithoutPropertyInput>
  }

  export type CountyCreateWithoutAuctionsInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyCreateNestedManyWithoutCountyInput
    certificates?: CertificateCreateNestedManyWithoutCountyInput
  }

  export type CountyUncheckedCreateWithoutAuctionsInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutCountyInput
    certificates?: CertificateUncheckedCreateNestedManyWithoutCountyInput
  }

  export type CountyCreateOrConnectWithoutAuctionsInput = {
    where: CountyWhereUniqueInput
    create: XOR<CountyCreateWithoutAuctionsInput, CountyUncheckedCreateWithoutAuctionsInput>
  }

  export type CertificateCreateWithoutAuctionInput = {
    id?: string
    certificateNumber: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutCertificatesInput
    property: PropertyCreateNestedOneWithoutCertificatesInput
    bids?: BidCreateNestedManyWithoutCertificateInput
  }

  export type CertificateUncheckedCreateWithoutAuctionInput = {
    id?: string
    certificateNumber: string
    countyId: string
    propertyId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutCertificateInput
  }

  export type CertificateCreateOrConnectWithoutAuctionInput = {
    where: CertificateWhereUniqueInput
    create: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput>
  }

  export type CertificateCreateManyAuctionInputEnvelope = {
    data: CertificateCreateManyAuctionInput | CertificateCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type BidCreateWithoutAuctionInput = {
    id?: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    certificate: CertificateCreateNestedOneWithoutBidsInput
    user: UserCreateNestedOneWithoutBidsInput
  }

  export type BidUncheckedCreateWithoutAuctionInput = {
    id?: string
    certificateId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidCreateOrConnectWithoutAuctionInput = {
    where: BidWhereUniqueInput
    create: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput>
  }

  export type BidCreateManyAuctionInputEnvelope = {
    data: BidCreateManyAuctionInput | BidCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type CountyUpsertWithoutAuctionsInput = {
    update: XOR<CountyUpdateWithoutAuctionsInput, CountyUncheckedUpdateWithoutAuctionsInput>
    create: XOR<CountyCreateWithoutAuctionsInput, CountyUncheckedCreateWithoutAuctionsInput>
    where?: CountyWhereInput
  }

  export type CountyUpdateToOneWithWhereWithoutAuctionsInput = {
    where?: CountyWhereInput
    data: XOR<CountyUpdateWithoutAuctionsInput, CountyUncheckedUpdateWithoutAuctionsInput>
  }

  export type CountyUpdateWithoutAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUpdateManyWithoutCountyNestedInput
  }

  export type CountyUncheckedUpdateWithoutAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutCountyNestedInput
    certificates?: CertificateUncheckedUpdateManyWithoutCountyNestedInput
  }

  export type CertificateUpsertWithWhereUniqueWithoutAuctionInput = {
    where: CertificateWhereUniqueInput
    update: XOR<CertificateUpdateWithoutAuctionInput, CertificateUncheckedUpdateWithoutAuctionInput>
    create: XOR<CertificateCreateWithoutAuctionInput, CertificateUncheckedCreateWithoutAuctionInput>
  }

  export type CertificateUpdateWithWhereUniqueWithoutAuctionInput = {
    where: CertificateWhereUniqueInput
    data: XOR<CertificateUpdateWithoutAuctionInput, CertificateUncheckedUpdateWithoutAuctionInput>
  }

  export type CertificateUpdateManyWithWhereWithoutAuctionInput = {
    where: CertificateScalarWhereInput
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyWithoutAuctionInput>
  }

  export type BidUpsertWithWhereUniqueWithoutAuctionInput = {
    where: BidWhereUniqueInput
    update: XOR<BidUpdateWithoutAuctionInput, BidUncheckedUpdateWithoutAuctionInput>
    create: XOR<BidCreateWithoutAuctionInput, BidUncheckedCreateWithoutAuctionInput>
  }

  export type BidUpdateWithWhereUniqueWithoutAuctionInput = {
    where: BidWhereUniqueInput
    data: XOR<BidUpdateWithoutAuctionInput, BidUncheckedUpdateWithoutAuctionInput>
  }

  export type BidUpdateManyWithWhereWithoutAuctionInput = {
    where: BidScalarWhereInput
    data: XOR<BidUpdateManyMutationInput, BidUncheckedUpdateManyWithoutAuctionInput>
  }

  export type CountyCreateWithoutCertificatesInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyCreateNestedManyWithoutCountyInput
    auctions?: AuctionCreateNestedManyWithoutCountyInput
  }

  export type CountyUncheckedCreateWithoutCertificatesInput = {
    id?: string
    name: string
    state: string
    countyCode?: string | null
    websiteUrl?: string | null
    taxCollectorUrl?: string | null
    propertyAppraiserUrl?: string | null
    description?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutCountyInput
    auctions?: AuctionUncheckedCreateNestedManyWithoutCountyInput
  }

  export type CountyCreateOrConnectWithoutCertificatesInput = {
    where: CountyWhereUniqueInput
    create: XOR<CountyCreateWithoutCertificatesInput, CountyUncheckedCreateWithoutCertificatesInput>
  }

  export type PropertyCreateWithoutCertificatesInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutCertificatesInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    countyId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyCreateOrConnectWithoutCertificatesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutCertificatesInput, PropertyUncheckedCreateWithoutCertificatesInput>
  }

  export type AuctionCreateWithoutCertificatesInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutAuctionsInput
    bids?: BidCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutCertificatesInput = {
    id?: string
    countyId: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bids?: BidUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutCertificatesInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutCertificatesInput, AuctionUncheckedCreateWithoutCertificatesInput>
  }

  export type BidCreateWithoutCertificateInput = {
    id?: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    auction: AuctionCreateNestedOneWithoutBidsInput
    user: UserCreateNestedOneWithoutBidsInput
  }

  export type BidUncheckedCreateWithoutCertificateInput = {
    id?: string
    auctionId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidCreateOrConnectWithoutCertificateInput = {
    where: BidWhereUniqueInput
    create: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput>
  }

  export type BidCreateManyCertificateInputEnvelope = {
    data: BidCreateManyCertificateInput | BidCreateManyCertificateInput[]
    skipDuplicates?: boolean
  }

  export type CountyUpsertWithoutCertificatesInput = {
    update: XOR<CountyUpdateWithoutCertificatesInput, CountyUncheckedUpdateWithoutCertificatesInput>
    create: XOR<CountyCreateWithoutCertificatesInput, CountyUncheckedCreateWithoutCertificatesInput>
    where?: CountyWhereInput
  }

  export type CountyUpdateToOneWithWhereWithoutCertificatesInput = {
    where?: CountyWhereInput
    data: XOR<CountyUpdateWithoutCertificatesInput, CountyUncheckedUpdateWithoutCertificatesInput>
  }

  export type CountyUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUpdateManyWithoutCountyNestedInput
    auctions?: AuctionUpdateManyWithoutCountyNestedInput
  }

  export type CountyUncheckedUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    countyCode?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxCollectorUrl?: NullableStringFieldUpdateOperationsInput | string | null
    propertyAppraiserUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutCountyNestedInput
    auctions?: AuctionUncheckedUpdateManyWithoutCountyNestedInput
  }

  export type PropertyUpsertWithoutCertificatesInput = {
    update: XOR<PropertyUpdateWithoutCertificatesInput, PropertyUncheckedUpdateWithoutCertificatesInput>
    create: XOR<PropertyCreateWithoutCertificatesInput, PropertyUncheckedCreateWithoutCertificatesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutCertificatesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutCertificatesInput, PropertyUncheckedUpdateWithoutCertificatesInput>
  }

  export type PropertyUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    countyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionUpsertWithoutCertificatesInput = {
    update: XOR<AuctionUpdateWithoutCertificatesInput, AuctionUncheckedUpdateWithoutCertificatesInput>
    create: XOR<AuctionCreateWithoutCertificatesInput, AuctionUncheckedCreateWithoutCertificatesInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutCertificatesInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutCertificatesInput, AuctionUncheckedUpdateWithoutCertificatesInput>
  }

  export type AuctionUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutAuctionsNestedInput
    bids?: BidUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutCertificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type BidUpsertWithWhereUniqueWithoutCertificateInput = {
    where: BidWhereUniqueInput
    update: XOR<BidUpdateWithoutCertificateInput, BidUncheckedUpdateWithoutCertificateInput>
    create: XOR<BidCreateWithoutCertificateInput, BidUncheckedCreateWithoutCertificateInput>
  }

  export type BidUpdateWithWhereUniqueWithoutCertificateInput = {
    where: BidWhereUniqueInput
    data: XOR<BidUpdateWithoutCertificateInput, BidUncheckedUpdateWithoutCertificateInput>
  }

  export type BidUpdateManyWithWhereWithoutCertificateInput = {
    where: BidScalarWhereInput
    data: XOR<BidUpdateManyMutationInput, BidUncheckedUpdateManyWithoutCertificateInput>
  }

  export type AuctionCreateWithoutBidsInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutAuctionsInput
    certificates?: CertificateCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutBidsInput = {
    id?: string
    countyId: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificates?: CertificateUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutBidsInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutBidsInput, AuctionUncheckedCreateWithoutBidsInput>
  }

  export type CertificateCreateWithoutBidsInput = {
    id?: string
    certificateNumber: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    county: CountyCreateNestedOneWithoutCertificatesInput
    property: PropertyCreateNestedOneWithoutCertificatesInput
    auction: AuctionCreateNestedOneWithoutCertificatesInput
  }

  export type CertificateUncheckedCreateWithoutBidsInput = {
    id?: string
    certificateNumber: string
    countyId: string
    propertyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificateCreateOrConnectWithoutBidsInput = {
    where: CertificateWhereUniqueInput
    create: XOR<CertificateCreateWithoutBidsInput, CertificateUncheckedCreateWithoutBidsInput>
  }

  export type UserCreateWithoutBidsInput = {
    id?: string
    username: string
    password: string
    email: string
    role?: string
    status?: string | null
    kycStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutBidsInput = {
    id?: string
    username: string
    password: string
    email: string
    role?: string
    status?: string | null
    kycStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutBidsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBidsInput, UserUncheckedCreateWithoutBidsInput>
  }

  export type AuctionUpsertWithoutBidsInput = {
    update: XOR<AuctionUpdateWithoutBidsInput, AuctionUncheckedUpdateWithoutBidsInput>
    create: XOR<AuctionCreateWithoutBidsInput, AuctionUncheckedCreateWithoutBidsInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutBidsInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutBidsInput, AuctionUncheckedUpdateWithoutBidsInput>
  }

  export type AuctionUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutAuctionsNestedInput
    certificates?: CertificateUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type CertificateUpsertWithoutBidsInput = {
    update: XOR<CertificateUpdateWithoutBidsInput, CertificateUncheckedUpdateWithoutBidsInput>
    create: XOR<CertificateCreateWithoutBidsInput, CertificateUncheckedCreateWithoutBidsInput>
    where?: CertificateWhereInput
  }

  export type CertificateUpdateToOneWithWhereWithoutBidsInput = {
    where?: CertificateWhereInput
    data: XOR<CertificateUpdateWithoutBidsInput, CertificateUncheckedUpdateWithoutBidsInput>
  }

  export type CertificateUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutCertificatesNestedInput
    property?: PropertyUpdateOneRequiredWithoutCertificatesNestedInput
    auction?: AuctionUpdateOneRequiredWithoutCertificatesNestedInput
  }

  export type CertificateUncheckedUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutBidsInput = {
    update: XOR<UserUpdateWithoutBidsInput, UserUncheckedUpdateWithoutBidsInput>
    create: XOR<UserCreateWithoutBidsInput, UserUncheckedCreateWithoutBidsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBidsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBidsInput, UserUncheckedUpdateWithoutBidsInput>
  }

  export type UserUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutBidsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidCreateManyUserInput = {
    id?: string
    auctionId: string
    certificateId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutBidsNestedInput
    certificate?: CertificateUpdateOneRequiredWithoutBidsNestedInput
  }

  export type BidUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateManyCountyInput = {
    id?: string
    parcelId: string
    address: string
    city: string
    state: string
    zipCode: string
    legalDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuctionCreateManyCountyInput = {
    id?: string
    auctionDate: Date | string
    status?: string
    adUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificateCreateManyCountyInput = {
    id?: string
    certificateNumber: string
    propertyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parcelId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    legalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUpdateManyWithoutAuctionNestedInput
    bids?: BidUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificates?: CertificateUncheckedUpdateManyWithoutAuctionNestedInput
    bids?: BidUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateManyWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    adUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificateUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutCertificatesNestedInput
    auction?: AuctionUpdateOneRequiredWithoutCertificatesNestedInput
    bids?: BidUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateManyWithoutCountyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificateCreateManyPropertyInput = {
    id?: string
    certificateNumber: string
    countyId: string
    auctionId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificateUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutCertificatesNestedInput
    auction?: AuctionUpdateOneRequiredWithoutCertificatesNestedInput
    bids?: BidUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificateCreateManyAuctionInput = {
    id?: string
    certificateNumber: string
    countyId: string
    propertyId: string
    status?: string
    faceValue: number
    interestRate?: number | null
    premium?: number | null
    buyerId?: string | null
    purchaseDate?: Date | string | null
    redemptionDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidCreateManyAuctionInput = {
    id?: string
    certificateId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificateUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: CountyUpdateOneRequiredWithoutCertificatesNestedInput
    property?: PropertyUpdateOneRequiredWithoutCertificatesNestedInput
    bids?: BidUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bids?: BidUncheckedUpdateManyWithoutCertificateNestedInput
  }

  export type CertificateUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateNumber?: StringFieldUpdateOperationsInput | string
    countyId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    faceValue?: FloatFieldUpdateOperationsInput | number
    interestRate?: NullableFloatFieldUpdateOperationsInput | number | null
    premium?: NullableFloatFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redemptionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificate?: CertificateUpdateOneRequiredWithoutBidsNestedInput
    user?: UserUpdateOneRequiredWithoutBidsNestedInput
  }

  export type BidUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    certificateId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidCreateManyCertificateInput = {
    id?: string
    auctionId: string
    userId: string
    bidAmount: number
    bidType: string
    isWinningBid?: boolean
    bidTime?: Date | string
    timestamp?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BidUpdateWithoutCertificateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutBidsNestedInput
    user?: UserUpdateOneRequiredWithoutBidsNestedInput
  }

  export type BidUncheckedUpdateWithoutCertificateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidUncheckedUpdateManyWithoutCertificateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bidAmount?: FloatFieldUpdateOperationsInput | number
    bidType?: StringFieldUpdateOperationsInput | string
    isWinningBid?: BoolFieldUpdateOperationsInput | boolean
    bidTime?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}