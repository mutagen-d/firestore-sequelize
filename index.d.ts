import { DocumentReference, FieldPath, OrderByDirection, WhereFilterOp, WriteResult, CollectionReference, Query, FieldValue } from "@google-cloud/firestore"
import * as Admin from "firebase-admin"

export function initializeApp(admin: typeof Admin): void

type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends bigint
  ? "bigint"
  : T extends undefined
  ? "boolean"
  : T extends Function
  ? "function"
  : T extends ArrayLike<any>
  ? "array"
  : "object"

type NameType<T> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "bigint"
  ? bigint
  : T extends "symbol"
  ? symbol
  : T extends "function"
  ? Function
  : T extends "array"
  ? Array<any>
  : object

export type Attrs = {
  [name: string]: DataType | Column
}

type DataType = string | number | boolean | Array<any> | object

type Column<T = DataType> = T extends string
  ? ColumnShape<string>
  : T extends number
  ? ColumnShape<number>
  : T extends boolean
  ? ColumnShape<boolean>
  : T extends Array<any>
  ? ColumnShape<T>
  : T extends object
  ? ColumnShape<T>
  : never

type ColumnShape<T = DataType> = {
  type: TypeName<T>;
  required?: boolean
  default?: T
}

/**
 * type of `type` property of column
 */
type ColumnType<TCol extends Column> = NameType<TCol['type']>

/**
 * type of `default` property of column if exists, otherwise type of `type` property
 */
type ColumnDefault<TCol extends Column> = TCol['default'] extends undefined ? ColumnType<TCol> : TCol['default']

/**
 * if typeof `default` prop extends typeof `type` prop, then take `default`, otherwise take `type`
 */
type ColumnDataType<TCol extends Column> = ColumnDefault<TCol> extends ColumnType<TCol> ? ColumnDefault<TCol> : ColumnType<TCol>

type AttrDataType<T extends DataType | Column> = T extends Column ? ColumnDataType<T> : T

type AttrColumn<T extends DataType | Column> = T extends Column ? T : Column<T>

export type Props<TAttrs extends Attrs> = {
  [K in keyof TAttrs]: AttrDataType<TAttrs[K]>
}

type PropsItem<TAttrs extends Attrs, TKey extends keyof TAttrs> = AttrDataType<TAttrs[TKey]>

type OptionalProps<TAttrs extends Attrs> = Partial<Props<TAttrs>>

type UpdateProps<TAttrs extends Attrs> = { [K in keyof TAttrs]?: PropsItem<TAttrs, K> | FieldValue }

type ModelInput<TModel> = OptionalProps<ModelAttrs<TModel>>

type ModelUpdateInput<TModel> = UpdateProps<ModelAttrs<TModel>>

type ModelShapeLike<TName extends string = string> = {
  name: TName;
  create: any;
  update: any;
  destroy: any;
  drop: any;
  findOne: any;
  findAll: any;
  findOrCreate: any;
  sync: any
}

export type ModelLike<TModel, TName extends string = string> = Extract<TModel, ModelShapeLike<TName>>

type ModelListLike<TModelList extends ArrayLike<any>> = TModelList[number] extends { name: string } ? TModelList : never

type ModelItemLike<TModelList extends ArrayLike<any>> = ModelListLike<TModelList>[number]

type ModelItem<TModelList extends ArrayLike<any>, TName extends string = string> = ModelLike<ModelItemLike<TModelList>, TName>

type ModelItemProps<TModelList extends ArrayLike<any>, TName extends string = string> = OptionalProps<ModelAttrs<ModelItem<TModelList, TName>>>

type ModelItemName<TModelList extends ArrayLike<any>> = ModelItemLike<TModelList>['name']

type ModelAttrs<TModel> = TModel extends { name: string; __attributes: any } ? TModel['__attributes'] : never

type ModelOption = { id: string; parentPath?: string }

type WhereAttrs<TWhere extends WhereFilter> = TWhere extends WhereFilter<infer TAttrs> ? Extract<TAttrs, Attrs> : never

export type AttrsColumn<TAttrs extends Attrs> = {
  [K in keyof TAttrs]: AttrColumn<TAttrs[K]>
}

type DataTypeOrColumn = DataType | Column

type WhereData<T extends DataTypeOrColumn = DataTypeOrColumn, TOp extends WhereFilterOp = WhereFilterOp> = TOp extends ('in' | 'not-in' | 'array-contains-any') ? {
  value: AttrDataType<T>[]
  operation: TOp
} : {
  value: AttrDataType<T>
  operation?: TOp
}

type Where<TAttrs extends Attrs> = {
  [K in keyof TAttrs]?: WhereData<TAttrs[K]>
}

type WhereFilter<TAttrs extends Attrs = Attrs, TWhere extends Where<TAttrs> = Where<TAttrs>> = {
  [K in keyof TAttrs]?: AttrDataType<TAttrs[K]> | WhereData<TAttrs[K], TWhere[K]['operation']>
}

type NormalizedWhereFilter<TAttrs extends Attrs, TWhere extends WhereFilter<TAttrs>> = {
  [K in keyof TAttrs]: TWhere[K] extends AttrDataType<TAttrs[K]> ? { value: TWhere[K]; operation: '==' } : Required<TWhere[K]>
}
type ParentOption = { parentPath?: string }

type DestroyOption<TSubs extends ArrayLike<{ name: string }>> = { ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }

type OrderFilter<TAttrs extends Attrs> = [keyof TAttrs | FieldPath, OrderByDirection]

export type Filter<TAttrs extends Attrs> = {
  ids?: string[]
  where?: WhereFilter<TAttrs>
  order?: OrderFilter<TAttrs>[]
  limit?: number
  offset?: number
}

export type FilterOption<TAttrs extends Attrs> = Partial<ModelOption> & Filter<TAttrs>

type DefaultModelConstructor = ModelConstructor<string, Attrs, never>

type SubsMethods<TSubs extends ArrayLike<{ name: string }>> = {
  collectionCreate<TName extends ModelItemName<TSubs>>(name: TName, model: ModelInput<ModelItem<TSubs, TName>>, opts?: Omit<Partial<ModelOption>, 'parentPath'>): ReturnType<ModelItem<TSubs, TName>['create']>
  collectionUpdate<TName extends ModelItemName<TSubs>>(name: TName, model: ModelUpdateInput<ModelItem<TSubs, TName>>, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'>): ReturnType<ModelItem<TSubs, TName>['update']>
  collectionDestroy<TName extends ModelItemName<TSubs>>(name: TName, opts: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'> & { force?: boolean } & DestroyOption<TSubs>): ReturnType<ModelItem<TSubs, TName>['destroy']>
  collectionDrop<TName extends ModelItemName<TSubs>>(name: TName, opts: ParentOption & DestroyOption<TSubs>): ReturnType<ModelItem<TSubs, TName>['destroy']>
  collectionFindOne<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'>): ReturnType<ModelItem<TSubs, TName>['findOne']>
  collectionFindOrCreate<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'> & { defaults?: ModelInput<ModelItem<TSubs, TName>> }): ReturnType<ModelItem<TSubs, TName>['findOrCreate']>
  collectionFindAll<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath' | 'id'>): ReturnType<ModelItem<TSubs, TName>['findAll']>
  collectionSync<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath' | 'id'>): ReturnType<ModelItem<TSubs, TName>['sync']>
}

export type Model<TAttrs extends Attrs = Attrs, TSubs extends ArrayLike<{ name: string }> = DefaultModelConstructor[]> = Props<TAttrs> & SubsMethods<TSubs> & {
  prototype: any;
  data: Props<TAttrs>
  getId(): string
  setId(id: string): void
  readonly ref: DocumentReference
  readonly path: string
  toJSON(): { id: string; data: Props<TAttrs>; path: string; parentPath?: string; }
  destroy(opts?: DestroyOption<TSubs>): Promise<WriteResult>
  save(setModel?: boolean): Promise<WriteResult>
  update(model: UpdateProps<TAttrs>): Promise<WriteResult>
}

export type ModelConstructor<TName extends string = string, TAttrs extends Attrs = Attrs, TSubs extends ArrayLike<{ name: string }> = DefaultModelConstructor[]> = {
  new (model: OptionalProps<TAttrs>, opts: ModelOption): Model<TAttrs, TSubs>
  (model: OptionalProps<TAttrs>, opts: ModelOption): Model<TAttrs, TSubs>
  readonly name: TName
  readonly prototype: Model<TAttrs, TSubs>
  readonly __attributes: TAttrs
  readonly attributes: AttrsColumn<TAttrs>
  readonly subcollections: { [K in ModelItemName<TSubs>]: ModelItem<TSubs, K> }
  path(parentPath?: string): string
  create(model: OptionalProps<TAttrs>, opts?: Partial<ModelOption>): Promise<Model<TAttrs, TSubs>>
  update(model: UpdateProps<TAttrs>, opts?: FilterOption<TAttrs>): Promise<WriteResult>
  destroy(opts: FilterOption<TAttrs> & { force?: boolean } & DestroyOption<TSubs>): Promise<WriteResult>
  drop(opts: ParentOption & DestroyOption<TSubs>): Promise<WriteResult[]>
  findOne(opts?: FilterOption<TAttrs>): Promise<Model<TAttrs, TSubs>>
  findOrCreate(opts?: FilterOption<TAttrs> & { defaults?: OptionalProps<TAttrs> }): Promise<[Model<TAttrs, TSubs>, boolean]>
  findAll(opts?: Omit<FilterOption<TAttrs>, 'id'>): Promise<Model<TAttrs, TSubs>[]>
  docIds(opts?: FilterOption<TAttrs>): Promise<Model<TAttrs, TSubs>[]>
  sync(opts?: Omit<FilterOption<TAttrs>, 'id'> & { setModel?: boolean }): Promise<Model<TAttrs, TSubs>[]>
  formatData(model: OptionalProps<TAttrs>): Props<TAttrs>
  subcollectionNames(opts?: { ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }): ModelItemName<TSubs>[]
  normalizeWhereFilter<TWhere extends WhereFilter<TAttrs>>(where: TWhere | WhereFilter<TAttrs>): NormalizedWhereFilter<TAttrs, TWhere>
  buildQuery(collection: CollectionReference, opts: Filter<TAttrs>): Query
}

type SubcollectionListLike<TSubs extends ArrayLike<{ name: string }>> = TSubs[number] extends { name: string } ? TSubs : never

export type CreationAttributes<TSubs extends ArrayLike<{ name: string }>> = {
  subcollections?: SubcollectionListLike<TSubs>
}

export function defineModel<TName extends string, TAttrs extends Attrs, TSubs extends ArrayLike<{ name: string }> = DefaultModelConstructor[]>(name: TName, attributes: TAttrs | Attrs, opts?: CreationAttributes<TSubs>): ModelConstructor<TName, TAttrs, TSubs>

export declare const DataTypes: {
  STRING: 'string';
  NUMBER: 'number';
  BOOLEAN: 'boolean';
  OBJECT: 'object';
  ARRAY: 'array';
}
