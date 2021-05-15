/** @type {import('firebase-admin')} */
let admin
const initializeApp = (_admin) => {
  admin = _admin
}

/**
 * @template T
 * @typedef {T extends string
 *  ? "string"
 *  : T extends number
 *  ? "number"
 *  : T extends boolean
 *  ? "boolean"
 *  : T extends bigint
 *  ? "bigint"
 *  : T extends undefined
 *  ? "boolean"
 *  : T extends Function
 *  ? "function"
 *  : T extends Array<any>
 *  ? "array"
 *  : "object"} TypeName
 */
/**
 * @typedef {{
 *  string: string
 *  number: number
 *  boolean: boolean
 *  bigint: bigint
 *  undefined: undefined
 *  "function": function
 *  array: Array<any>
 *  object: object
 * }} NameType
 */
/** @type {NameType} */
var NAME_TYPE = {}

/**
 * @typedef {{
 *  STRING: "string";
 *  NUMBER: "number";
 *  BOOLEAN: 'boolean';
 *  OBJECT: 'object';
 *  ARRAY: 'array';
 * }} DataType
 */
/** @type {DataType} */
const DataTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
}

/**
 * @typedef {{
 *  [name: string]: Data | Column
 * }} Attrs
 */
/**
 * @typedef {string | number | boolean | {}} Data
 */

/**
 * @template TAttrs
 * @typedef {Extract<TAttrs, Attrs>} AttrsLike
 */
/**
 * @template T
 * @typedef {{
 *  type: TypeName<T>
 *  required?: boolean;
 *  default?: T
 * }} ColumnT
 */

/**
 * @typedef {ColumnT<Data>} Column
 */
/**
 * @template T
 * @typedef {T extends Column ? (typeof NAME_TYPE[T['type']]) : never} ColumnType
 */
/**
 * @template TAttrs
 * @typedef {{
 *  [K in keyof TAttrs]: TAttrs[K] extends Column ? ColumnType<TAttrs[K]> : TAttrs[K] extends Data ? TAttrs[K] : never
 * }} Props
 */

/**
 * @template TAttrs
 * @template TKey
 * @typedef {TKey extends keyof TAttrs ? (TAttrs[TKey] extends Column ? ColumnType<TAttrs[TKey]> : TAttrs[TKey] extends Data ? TAttrs[TKey] : never) : never} PropsItem
 */

/**
 * @typedef {import('@google-cloud/firestore').DocumentData} DocumentData
 * @typedef {import('@google-cloud/firestore').WriteResult} WriteResult
 * @typedef {import('@google-cloud/firestore').DocumentSnapshot} DocumentSnapshot
 * @typedef {import('@google-cloud/firestore').QuerySnapshot} QuerySnapshot
 * @typedef {import('@google-cloud/firestore').DocumentReference} DocumentReference
 * @typedef {import('@google-cloud/firestore').WhereFilterOp} WhereFilterOp
 * @typedef {import('@google-cloud/firestore').OrderByDirection} OrderByDirection
 * @typedef {import('@google-cloud/firestore').FieldPath} FieldPath
 * @typedef {import('@google-cloud/firestore').QueryDocumentSnapshot} QueryDocumentSnapshot
 * @typedef {import('@google-cloud/firestore').CollectionReference} CollectionReference
 * @typedef {import('@google-cloud/firestore').Query} Query
 * @typedef {import('@google-cloud/firestore').FieldValue} FieldValue
 */

/**
 * @template TAttrs
 * @typedef {Partial<Props<TAttrs>>} OptionalProps
 */

/**
 * @template TAttrs
 * @typedef {{ [K in keyof TAttrs]?: PropsItem<TAttrs, K> | FieldValue }} UpdateProps
 */

/**
 * @template TModel
 * @typedef {OptionalProps<ModelAttrs<TModel>>} ModelInput
 */

/**
 * @template TModel
 * @typedef {UpdateProps<ModelAttrs<TModel>>} ModelUpdateInput
 */

/**
 * @template TModel
 * @template TName
 * @typedef {Extract<TModel, { name: TName }>} ModelLike
 */
/**
 * @template TModelList
 * @typedef {TModelList[number] extends { name: string } ? TModelList : never} ModelListLike
 */
/**
 * @template TModelList
 * @typedef {ModelListLike<TModelList>[number]} ModelItemLike
 */
/**
 * @template TModelList
 * @template TName
 * @typedef {ModelLike<ModelItemLike<TModelList>, TName>} ModelItem
 */

/**
 * @template TModelList
 * @template TName
 * @typedef {OptionalProps<ModelAttrs<ModelItem<TModelList, TName>>>} ModelItemProps
 */
/**
 * @template TModelList
 * @typedef {ModelItemLike<TModelList>['name']} ModelItemName
 */
/**
 * @template TModel
 * @typedef {TModel extends { name: string } ? TModel['__attributes'] : never} ModelAttrs
 */

/**
 * @template TWhere
 * @typedef {TWhere extends WhereFilter<infer TAttrs> ? Extract<TAttrs, Attrs>: never} WhereAttrs
 */
/**
 * @template TAttrs
 * @typedef {{
 *  [K in keyof TAttrs]: TAttrs[K] extends Column ? TAttrs[K] : TAttrs[K] extends Data ? ColumnT<TAttrs[K]> : never
 * }} AttrsColumn
 */

/**
 * @template TAttrs
 * @typedef {{
 *  [K in keyof TAttrs]?: PropsItem<TAttrs, K> | { value: PropsItem<TAttrs, K>; operation?: WhereFilterOp }
 * }} WhereFilter
 */

/**
 * @template TWhere
 * @typedef {{
 *  [K in keyof WhereAttrs<TWhere>]: { value: Props<WhereAttrs<TWhere>>[K]; operation: WhereFilterOp }
 * }} NormalizedWhereFilter
 */

/**
 * @template TSubs
 * @typedef {{ ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }} DestroyOption
 */

/**
 * @template TAttrs
 * @typedef {[keyof TAttrs | FieldPath, OrderByDirection]} OrderFilter
 */

/**
 * @template TAttrs
 * @typedef {{
 *  ids?: string[]
 *  where?: WhereFilter<TAttrs>
 *  order?: OrderFilter<TAttrs>[]
 *  limit?: number
 *  offset?: number
 * }} Filter
 */

/**
 * @typedef {{ parentPath?: string; }} ParentOption
 * @typedef {ParentOption & { id: string }} ModelOption
 */
/**
 * @template TAttrs
 * @typedef {Partial<ModelOption> & Filter<TAttrs>} FilterOption
 */

/**
 * @template TSubs
 * @typedef {{
 *  collectionCreate<TName extends ModelItemName<TSubs>>(name: TName, model: ModelInput<ModelItem<TSubs, TName>>, opts?: Omit<Partial<ModelOption>, 'parentPath'>): ReturnType<ModelItem<TSubs, TName>['create']>
 *  collectionUpdate<TName extends ModelItemName<TSubs>>(name: TName, model: ModelUpdateInput<ModelItem<TSubs, TName>>, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'>): ReturnType<Model<TSubs, TName>['update']>
 *  collectionDestroy<TName extends ModelItemName<TSubs>>(name: TName, opts: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'> & { force?: boolean } & DestroyOption<TSubs>): ReturnType<ModelItem<TSubs, TName>['destroy']>
 *  collectionDrop<TName extends ModelItemName<TSubs>>(name: TName, opts?: DestroyOption<TSubs>): ReturnType<ModelItem<TSubs, TName>['drop']>
 *  collectionFindOne<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'>): ReturnType<ModelItem<TSubs, TName>['findOne']>
 *  collectionFindOrCreate<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath'> & { defaults?: ModelInput<ModelItem<TSubs, TName>> }): ReturnType<ModelItem<TSubs, TName>['findOrCreate']>
 *  collectionFindAll<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath' | 'id'>): ReturnType<ModelItem<TSubs, TName>['findAll']>
 *  collectionSync<TName extends ModelItemName<TSubs>>(name: TName, opts?: Omit<FilterOption<ModelAttrs<ModelItem<TSubs, TName>>>, 'parentPath' | 'id'>): ReturnType<ModelItem<TSubs, TName>['sync']>
 * }} SubsMethods
 */

/**
 * @template TAttrs
 * @template TSubs
 * @typedef {Props<AttrsLike<TAttrs>> & SubsMethods<TSubs> & {
 *  prototype: any
 *  data: Props<AttrsLike<TAttrs>>
 *  getId(): string;
 *  setId(id: string): void
 *  readonly ref: DocumentReference
 *  destroy(opts?: DestroyOption<TSubs>): Promise<WriteResult>
 *  save(setModel?: boolean): Promise<WriteResult>
 *  update(model: UpdateProps<TAttrs>): Promise<WriteResult>
 *  readonly path: string
 *  toJSON(): { id: string; data: Props<TAttrs>; path: string; parentPath?: string; }
 * }} Model
 */

/**
 * @template TName
 * @template TAttrs
 * @template TSubs
 * @typedef {{
 *  new (model: OptionalProps<TAttrs>, opts: ModelOption): Model<TAttrs, TSubs>
 *  (model: OptionalProps<TAttrs>, opts: ModelOption): Model<TAttrs, TSubs>
 *  private __attributes: TAttrs
 *  readonly name: TName
 *  readonly prototype: Model<TAttrs, TSubs>
 *  readonly attributes: AttrsColumn<TAttrs>
 *  readonly subcollections: { [K in ModelItemName<TSubs>]: ModelItem<TSubs, K> }
 *  path(parentPath?: string): string
 *  create(model: OptionalProps<TAttrs>, opts?: Partial<ModelOption>): Promise<Model<TAttrs, TSubs>>
 *  update(model: OptionalProps<TAttrs>, opts?: FilterOption<TAttrs>): Promise<WriteResult> | Promise<WriteResult[]>
 *  destroy(opts: FilterOption<TAttrs> & { force?: boolean } & DestroyOption<TSubs>): Promise<WriteResult>
 *  drop(opts?: ParentOption & DestroyOption<TSubs>): Promise<WriteResult[]>
 *  findOne(opts?: FilterOption<TAttrs>): Promise<Model<TAttrs, TSubs>>
 *  findOrCreate(opts?: FilterOption<TAttrs> & { defaults: OptionalProps<TAttrs> }): Promise<[Model<TAttrs, TSubs>, boolean]>
 *  findAll(opts?: Omit<FilterOption<TAttrs>, 'id'>): Promise<Model<TAttrs, TSubs>[]>
 *  docIds(opts?: FilterOption<TAttrs>): Promise<Model<TAttrs, TSubs>[]>
 *  sync(opts?: Omit<FilterOption<TAttrs>, 'id'> & { setModel?: boolean }): Promise<Model<TAttrs, TSubs>[]>
 *  formatData(model: OptionalProps<TAttrs>): Props<TAttrs>
 *  subcollectionNames(opts?: DestroyOption<TSubs>): ModelItemName<TSubs>[]
 *  normalizeWhereFilter<TWhere extends WhereFilter<TAttrs>>(where: TWhere | WhereFilter<TAttrs>): NormalizedWhereFilter<TWhere>
 *  buildQuery(collection: CollectionReference, opts: Filter<TAttrs>): Query
 * }} ModelConstructor
 * 
 */

/**
 * @template TSubs
 * @typedef {{
 *  subcollections?: TSubs[number] extends { name: string } ? TSubs : never
 * }} CreationOptions
 */

/**
 * @template TName
 * @template TAttrs
 * @template TSubs
 * @param {Extract<TName, string>} name 
 * @param {TAttrs extends Attrs ? TAttrs : Attrs} attributes 
 * @param {CreationOptions<TSubs>} [options]
 * @returns {ModelConstructor<Extract<TName, string>, Extract<TAttrs, Attrs>, TSubs[number] extends { name: string } ? TSubs : never>}
 */
function defineModel(name, attributes, options = {}) {
  options.subcollections = options.subcollections || [];

  /** @type {AttrsColumn<TAttrs>} */
  const normalized_attributes = {}
  for (const key in attributes) {
    if (typeof attributes[key] !== 'object' || typeof attributes[key].type == 'undefined') {
      const value = attributes[key]
      normalized_attributes[key] = {
        'default': value,
        type: typeof value,
        required: false,
      }
    } else {
      normalized_attributes[key] = {
        'default': attributes[key].default || null,
        type: attributes[key].type || 'string',
        required: attributes[key].required || false,
      }
    }
  }

  /** @type {{ [K in ModelItemName<TSubs>]: ModelItem<TSubs, K> }} */
  const subcollections = {}
  for (const subcollection of options.subcollections) {
    subcollections[subcollection.name] = subcollection
  }

  class Model {
    /**
     * @param {OptionalProps<TAttrs>} model
     * @param {{ id: string; parentPath?: string; }} opts
     */
    constructor(model, opts) {
      /** @private */
      this.__id = opts.id
      this.data = Model.formatData(model)
      /** @private */
      this.parentPath = opts.parentPath
      /**
       * @private
       * @type {{ [name: string]: ModelItem<TSubs, string, ModelConstructor<string, Attrs>>}}
       */
      this.subcollections = subcollections
    }

    getId() {
      return this.__id
    }
    /** @param {string} id */
    setId(id) {
      this.__id = id
    }
    get path() {
      return this.parentPath ? `${this.parentPath}/${Model.name}/${this.getId()}` : `${Model.name}/${this.getId()}`
    }
    get ref() {
      return admin.firestore().doc(this.path)
    }
    save(setModel = false) {
      if (setModel) {
        return this.ref.set(this.data)
      } else {
        return this.ref.update(this.data)
      }
    }
    /**
     * @param {{ ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }} opts 
     */
    destroy(opts = {}) {
      const subcollectionNames = Model.subcollectionNames(opts)
      const promise = subcollectionNames.reduce((promise, name) => {
        return promise.then(() => this.collectionDestroy(name, { force: true }))
      }, Promise.resolve())
      return promise.then(() => this.ref.delete())
    }
    /**
     * @param {OptionalProps<TAttrs> & { [field in keyof TAttrs]: FieldValue }} model 
     */
    update(model) {
      const data = Model.filterData(model)
      return this.ref.update(data)
    }
    toJSON() {
      return {
        id: this.getId(),
        data: this.data,
        path: this.path,
        parentPath: this.parentPath,
      }
    }
  }
  if (options.subcollections.length) {
    Model.prototype.collectionCreate = function collectionCreate(subcollectionName, subcollectionModel, opts) {
      return this.subcollections[subcollectionName].create(subcollectionModel, { ...opts, parentPath: this.path })
    }
    Model.prototype.collectionUpdate = function collectionUpdate(subcollectionName, subcollectionModel, opts) {
      return this.subcollections[subcollectionName].update(subcollectionModel, { ...opts, parentPath: this.path })
    }
    Model.prototype.collectionDestroy = function collectionDestroy(subcollectionName, opts) {
      return this.subcollections[subcollectionName].destroy({ ...opts, parentPath: this.path })
    }
    Model.prototype.collectionDrop = function collectionDrop(subcollectionName, opts) {
      return this.subcollections[subcollectionName].drop({ ...opts, parentPath: this.path })
    }
    Model.prototype.collectionFindOne = function collectionFindOne(subcollectionName, opts) {
      return this.subcollections[subcollectionName].findOne({ ...opts, parentPath: this.path })
    }
    Model.prototype.collectionFindAll = function collectionFindAll(subcollectionName, opts) {
      return this.subcollections[subcollectionName].findAll({ ...opts, parentPath: this.path })
    }
    Model.prototype.collectionFindOrCreate = function collectionFindOrCreate(subcollectionName, opts) {
      return this.subcollections[subcollectionName].findOrCreate({ ...opts, parentPath: this.path })
    }
    Model.prototype.collectionSync = function collectionFindOrCreate(subcollectionName, opts) {
      return this.subcollections[subcollectionName].sync({ ...opts, parentPath: this.path })
    }
  } else {
    Model.prototype.collectionCreate = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionUpdate = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionDestroy = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionDrop = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionFindOne = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionFindAll = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionFindOrCreate = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
    Model.prototype.collectionSync = function () {
      return Promise.reject(new Error('This method is for subcollections only'))
    }
  }
  /**
   * @param {CollectionReference} collection
   * @param {Filter<TAttrs>} opts
   * @return {Query}
   */
  Model.buildQuery = function buildQuery(collection, opts) {
    let query = collection
    if (Array.isArray(opts.ids) && opts.ids.length > 0) {
      query = query.where(admin.firestore.FieldPath.documentId(), 'in', opts.ids)
    }
    if (opts.where) {
      const where = Model.normalizeWhereFilter(opts.where)
      for (const field in where) {
        const { operation, value } = where[field]
        query = query.where(field, operation, value)
      }
    }
    if (opts.order) {
      for (const item of opts.order) {
        query = query.orderBy(item[0], item[1] || 'asc')
      }
    }
    if (typeof opts.limit != 'undefined') {
      query = query.limit(opts.limit)
    }
    if (typeof opts.offset != 'undefined') {
      query = query.offset(opts.offset)
    }
    return query
  }
  /**
   * @template TWhere
   * @param {TWhere | WhereFilter<TAttrs>} where
   */
  Model.normalizeWhereFilter = function normalizeWhereFilter(where) {
    /** @type {NormalizedWhereFilter<TWhere>} */
    const res = {}
    for (const field in where) {
      /** @type {WhereFilterOp} */
      let operation
      let value
      if (where[field] && where[field].operation) {
        operation = where[field].operation
        value = where[field].value
      } else {
        operation = '=='
        value = typeof where[field] == 'object' && typeof where[field].value != 'undefined' ? where[field].value : where[field]
      }
      res[field] = {
        operation,
        value,
      }
    }
    return res
  }

  /** @param {string} [parentPath] */
  Model.path = function (parentPath) {
    return parentPath ? `${parentPath}/${Model.name}` : Model.name
  }
  /**
   * @param {OptionalProps<TAttrs>} model
   * @return {Props<TAttrs>}
   */
  Model.formatData = function (model) {
    const ret = {}
    for (const key in normalized_attributes) {
      ret[key] = typeof model[key] != 'undefined' ? model[key] : normalized_attributes[key].default
    }
    return ret
  }
  /**
   * @param {UpdateProps<TAttrs>} model
   * @return {UpdateProps<TAttrs>}
   */
  Model.filterData = function (model) {
    const ret = {}
    for (const key in normalized_attributes) {
      if (typeof model[key] != 'undefined') {
        ret[key] = model[key]
      }
    }
    return ret
  }
  /**
   * @param {OptionalProps<TAttrs>} model 
   * @param {{ id?: string; parentPath?: string }} [opts]
   */
  Model.create = function (model, opts = {}) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    if (typeof opts.id != 'undefined') {
      return collection.doc(opts.id).set(Model.formatData(model)).then(() => new Model(model, opts))
    }
    return collection.add(Model.formatData(model)).then(res => new Model(model, { ...opts, id: res.id }))
  }
  /**
   * @param {UpdateProps<TAttrs>} model 
   * @param {{ id?: string; parentPath?: string } & Filter<TAttrs>} [opts]
   */
  Model.update = function (model, opts = {}) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    if (typeof opts.id != 'undefined') {
      return collection.doc(opts.id).update(Model.filterData(model))
    }
    const query = Model.buildQuery(collection, opts)
    return query.get().then((snap) => {
      if (snap.empty) {
        return
      }
      const batch = admin.firestore().batch()
      snap.docs.forEach(doc => batch.update(doc.ref, Model.filterData(model)))
      return batch.commit()
    })
  }
  /**
   * @param {{ parentPath?: string; ignoreSucollections?: boolean | ModelItemName<Tsubs>[] }} opts 
   */
  Model.drop = function (opts = {}) {
    return Model.destroy({
      force: true,
      parentPath: opts.parentPath,
      ignoreSubcollections: opts.ignoreSucollections,
    })
  }
  /**
   * @param {{ id?: string; parentPath?: string; force?: boolean; ignoreSubcollections?: boolean | ModelItemName<TSubs>[] } & Filter<TAttrs>} opts
   */
  Model.destroy = function (opts) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    if (typeof opts.id != 'undefined') {
      return collection.doc(opts.id).delete()
    }
    if (
      !opts.force
      && (
        !Array.isArray(opts.ids)
        || opts.ids.length == 0
      ) && (
        !opts.where || Object.keys(opts.where).length == 0
      )
    ) {
      throw new Error(`You are trying to delete all records in Collection "${collection.path}"`)
    }
    const query = Model.buildQuery(collection, opts)
    return query.get().then((snap) => {
      if (snap.empty) {
        return
      }
      const batch = admin.firestore().batch()
      const subcollectionNames = Model.subcollectionNames(opts)
      const promise = snap.docs.reduce((promise, doc) => {
        batch.delete(doc.ref)
        for (const name of subcollectionNames) {
          promise = promise.then(() => Model.subcollections[name].destroy({
            force: true,
            parentPath: collection.doc(doc.id).path,
          }))
        }
        return promise
      }, Promise.resolve())
      return promise.then(() => batch.commit())
    })
  }
  /**
   * @param {{ ignoreSubcollections?: boolean | ModelItemName<TSubs>[] }} opts
   * @return {string[]}
   */
  Model.subcollectionNames = function (opts = {}) {
    if (opts.ignoreSubcollections === true) {
      return []
    }
    if (Array.isArray(opts.ignoreSubcollections)) {
      return options.subcollections.filter(sub => {
        return opts.ignoreSubcollections.indexOf(sub.name) === -1
      }).map(sub => sub.name)
    } else {
      return options.subcollections.map(sub => sub.name)
    }
  }
  /**
   * @param {{ id?: string; parentPath?: string } & Filter<TAttrs>} [opts]
   */
  Model.findOne = function (opts = {}) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    if (typeof opts.id != 'undefined') {
      return collection.doc(opts.id).get().then(res => {
        return res.exists ? new Model(res.data(), { id: opts.id, parentPath: opts.parentPath }) : null
      })
    }
    const query = Model.buildQuery(collection, opts)
    return query.limit(1).get().then((snap) => {
      return snap.empty ? null : new Model(snap.docs[0].data(), { id: snap.docs[0].id, parentPath: opts.parentPath })
    })
  }
  /**
   * @param {{ id?: string; parentPath?: string; defaults?: OptionalProps<TAttrs> } & Filter<TAttrs>} [opts]
   */
  Model.findOrCreate = function (opts) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    if (typeof opts.id != 'undefined') {
      return collection.doc(opts.id).get().then(res => {
        if (res.exists) {
          return [new Model(res.data(), { id: opts.id, parentPath: opts.parentPath }), false]
        }
        return Model.create({ ...opts.defaults }, opts).then(model => ([model, true]))
      })
    }
    const query = Model.buildQuery(collection, opts)
    return query.limit(1).get().then((snap) => {
      if (!snap.empty) {
        return [new Model(snap.docs[0].data(), { id: snap.docs[0].id, parentPath: opts.parentPath }), false]
      }
      return Model.create({ ...opts.defaults }, opts).then(model => ([model, true]))
    })
  }
  /**
   * @param {{ parentPath?: string } & Filter<TAttrs>} [opts]
   */
  Model.findAll = function (opts = {}) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    const query = Model.buildQuery(collection, opts)
    return query.get().then((snap) => {
      return snap.docs.map(doc => new Model(doc.data(), { id: doc.id, parentPath: opts.parentPath }))
    })
  }
  /**
   * @param {{ parentPath?: string }} [opts]
   */
  Model.docIds = function (opts = {}) {
    const collection = admin.firestore().collection(Model.path(opts.parentPath))
    return collection.listDocuments().then((docs) => {
      return docs.map(doc => new Model({}, { id: doc.id, parentPath: opts.parentPath }))
    })
  }
  /**
   * @param {{ parentPath?: string; setModel?: boolean } & Filter<TAttrs>} [opts]
   */
  Model.sync = function (opts = {}) {
    return Model.findAll(opts).then(models => {
      const batch = admin.firestore().batch()
      models.forEach(model => {
        opts.setModel ? batch.set(model.ref, model.data) : batch.update(model.ref, model.data)
      })
      return batch.commit().then(() => models)
    })
  }

  /** @type {Props<TAttrs>} */
  const properties = {};
  for (const key in attributes) {
    properties[key] = {
      /** @this {Model} */
      "get": function () {
        return this.data[key];
      },
      /** @this {Model} */
      "set": function (val) {
        this.data[key] = val;
      }
    }
  }
  Object.defineProperties(Model.prototype, properties);
  Object.defineProperty(Model, 'name', { value: name, configurable: true })
  /** @type {AttrsColumn<TAttrs>} */
  Model.attributes = normalized_attributes
  Model.subcollections = subcollections

  return Model;
}

module.exports = { defineModel, initializeApp, DataTypes };