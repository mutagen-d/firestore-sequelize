import { DocumentReference, FieldPath, OrderByDirection, WhereFilterOp, WriteResult, CollectionReference, Query, FieldValue } from "@google-cloud/firestore"
import * as Admin from "firebase-admin"

export function initializeApp(admin: typeof Admin): void

export type TypeName<T> = T extends string
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

export type NameType<T> = T extends "string"
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
  [name: string]: Data | Column
}

export type Data = string | number | boolean | ArrayLike<any> | object

export type ColumnT<T> = {
  type: TypeName<T>
  required?: boolean
  default?: T
}

export type Column = ColumnT<Data>

export type ColumnType<T> = T extends Column ? NameType<T['type']> : never

export type Props<TAttrs extends Attrs> = {
  [K in keyof TAttrs]: TAttrs[K] extends Column ? ColumnType<TAttrs[K]> : TAttrs[K] extends Data ? TAttrs[K] : never
}

export type PropsItem<TAttrs, TKey> = TKey extends keyof TAttrs ? (TAttrs[TKey] extends Column ? ColumnType<TAttrs[TKey]> : TAttrs[TKey] extends Data ? TAttrs[TKey] : never) : never

export type OptionalProps<TAttrs extends Attrs> = Partial<Props<TAttrs>>

export type UpdateProps<TAttrs extends Attrs> = { [K in keyof TAttrs]?: PropsItem<TAttrs, K> | FieldValue }

export type ModelInput<TModel> = OptionalProps<ModelAttrs<TModel>>

export type ModelUpdateInput<TModel> = UpdateProps<ModelAttrs<TModel>>

export type ModelLike<TModel, TName extends string = string> = Extract<TModel, {
  name: TName;
  create: any;
  update: any;
  destroy: any;
  findOne: any;
  findAll: any;
  findOrCreate: any;
  sync: any
}>

export type ModelListLike<TModelList extends ArrayLike<any>> = TModelList[number] extends { name: string } ? TModelList : never

export type ModelItemLike<TModelList extends ArrayLike<any>> = ModelListLike<TModelList>[number]

export type ModelItem<TModelList extends ArrayLike<any>, TName extends string = string> = ModelLike<ModelItemLike<TModelList>, TName>

export type ModelItemProps<TModelList extends ArrayLike<any>, TName extends string = string> = OptionalProps<ModelAttrs<ModelItem<TModelList, TName>>>

export type ModelItemName<TModelList extends ArrayLike<any>> = ModelItemLike<TModelList>['name']

export type ModelAttrs<TModel> = TModel extends { name: string; __attributes: any } ? TModel['__attributes'] : never

export type ModelOption = { id: string; parentPath?: string }

export type WhereAttrs<TWhere extends WhereFilter> = TWhere extends WhereFilter<infer TAttrs> ? Extract<TAttrs, Attrs> : never

export type AttrsColumn<TAttrs extends Attrs> = {
  [K in keyof TAttrs]: TAttrs[K] extends Column ? TAttrs[K] : TAttrs[K] extends Data ? ColumnT<TAttrs[K]> : never
}

export type WhereFilter<TAttrs extends Attrs = Attrs> = { id?: string } & {
  [K in keyof TAttrs]?: PropsItem<TAttrs, K> | { value: PropsItem<TAttrs, K>; operation?: WhereFilterOp }
}

export type NormalizedWhereFilter<TWhere extends WhereFilter> = {
  [K in keyof WhereAttrs<TWhere>]: { value: PropsItem<WhereAttrs<TWhere>, K>; operation: WhereFilterOp }
}
export type ParentOption = { parentPath?: string }

export type DestroyOption<TSubs extends ArrayLike<{ name: string }>> = { ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }

export type OrderFilter<TAttrs extends Attrs> = [keyof TAttrs | FieldPath, OrderByDirection]

export type Filter<TAttrs extends Attrs> = {
  ids?: string[]
  where?: WhereFilter<TAttrs>
  order?: OrderFilter<TAttrs>[]
  limit?: number
  offset?: number
}

export type FilterOption<TAttrs extends Attrs> = Partial<ModelOption> & Filter<TAttrs>

export type Model<TAttrs extends Attrs = Attrs, TSubs extends ArrayLike<{ name: string }> = ModelConstructor<string, Attrs, { name: string }[]>[]> = Props<TAttrs> & {
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

  collectionCreate<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, model: ModelInput<TModel>, opts?: Omit<Partial<ModelOption>, 'parentPath'>): ReturnType<TModel['create']>
  collectionUpdate<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, model: ModelUpdateInput<TModel>, opts?: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath'>): ReturnType<TModel['update']>
  collectionDestroy<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath'> & { force?: boolean } & DestroyOption<TSubs>): ReturnType<TModel['destroy']>
  collectionDrop<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts: ParentOption & DestroyOption<TSubs>): ReturnType<TModel['destroy']>
  collectionFindOne<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath'>): ReturnType<TModel['findOne']>
  collectionFindOrCreate<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath'> & { defaults?: ModelInput<TModel> }): ReturnType<TModel['findOrCreate']>
  collectionFindAll<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath' | 'id'>): ReturnType<TModel['findAll']>
  collectionSync<TName extends ModelItemName<TSubs>, TModel extends ModelItem<TSubs, TName>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<TModel>>, 'parentPath' | 'id'>): ReturnType<TModel['sync']>
}

export type ModelConstructor<TName extends string = string, TAttrs extends Attrs = Attrs, TSubs extends ArrayLike<{ name: string }> = ModelConstructor<string, Attrs, { name: string }[]>[]> = {
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
  normalizeWhereFilter<TWhere extends WhereFilter<TAttrs>>(where: TWhere | WhereFilter<TAttrs>): NormalizedWhereFilter<TWhere>
  buildQuery(collection: CollectionReference, opts: Filter<TAttrs>): Query
}

export type SubcollectionListLike<TSubs extends ArrayLike<{ name: string }>> = TSubs[number] extends { name: string } ? TSubs : never

export type CreationAttributes<TSubs extends ArrayLike<{ name: string }>> = {
  subcollections?: SubcollectionListLike<TSubs>
}

export function defineModel<TName extends string, TAttrs extends Attrs, TSubs extends ArrayLike<{ name: string }> = ModelConstructor<string, Attrs, { name: string }[]>[]>(name: TName, attributes: TAttrs | Attrs, opts?: CreationAttributes<TSubs>): ModelConstructor<TName, TAttrs, TSubs>