const { describe, expect, test, beforeEach } = require('@jest/globals')
const database = require('../database-for-tests')
const { mockFirebase } = require('firestore-jest-mock')
const {
  mockCollection,
  mockAdd,
  mockDoc,
  mockSet,
  mockWhere,
  mockLimit,
  mockGet,
  mockUpdate,
  mockOrderBy,
  mockOffset,
  mockBatchUpdate,
  mockBatchCommit,
  mockDelete,
  mockBatch,
  mockBatchDelete,
  mockBatchSet,
  mockListDocuments,
} = require('firestore-jest-mock/mocks/firestore')
const { defineModel, initializeApp } = require('../index')

const Photo = defineModel('photos', {
  url: '',
})
const Post = defineModel('posts', {
  title: '',
  keywords: {
    type: 'array',
    default: [],
  },
  created: '',
  content: '',
}, {
  subcollections: [Photo],
})
const User = defineModel('users', {
  name: '',
  email: '',
  coins: 0,
  avatar_url: '',
}, {
  subcollections: [Post],
})

const johnUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar_url: 'https://example.com/user/john/avatar/photo123.jpg',
}

/** @type {import('firebase-admin')} */
let admin
describe('Collections', () => {
  mockFirebase({ database })
  admin = require('firebase-admin')
  initializeApp(admin)
  admin.initializeApp()
  const clearAllMocks = () => {
    jest.clearAllMocks()
  }
  describe('attributes default values', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('number value', async () => {
      expect(User.attributes.coins.default).toBe(0)
      expect(User.attributes.name.default).toBe('')
      const user = await User.create(johnUser)
      expect(user.coins).toBe(0)
    })
    test('array value', async () => {
      expect(Post.attributes.keywords.default).toEqual([])
      const post = await Post.create({})
      expect(post.keywords).toEqual([])
    })
  })
  describe('utils', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('buildQuery', () => {
      const collection = admin.firestore().collection('users')
      User.buildQuery(collection, {
        ids: database.users.map(u => u.id),
        where: {
          coins: {
            '>=': 7,
            '<': 20,
          },
        },
        limit: 10,
        offset: 4,
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('coins', '>=', 7)
      expect(mockWhere).toHaveBeenCalledWith('coins', '<', 20)
      expect(mockLimit).toHaveBeenCalledWith(10)
      expect(mockOffset).toHaveBeenCalledWith(4)
    })
    test('subcollectionNames with 0 args', () => {
      const names = User.subcollectionNames()
      expect(names.length).toBe(1)
      expect(names[0]).toBe('posts')
    })
    test('subcollectionNames ignore = true', () => {
      const names = User.subcollectionNames({ ignoreSubcollections: true })
      expect(names.length).toBe(0)
    })
    test('subcollectionNames ignore = Array', () => {
      const names = User.subcollectionNames({ ignoreSubcollections: ['posts'] })
      expect(names.length).toBe(0)
    })
  })
  describe('create', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('with random id', async () => {
      const user = await User.create(johnUser)
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockAdd).toHaveBeenCalledWith(User.formatData(johnUser))
      expect(user.name).toBe(johnUser.name)
      expect(user.coins).toBe(User.attributes.coins.default)
    })
    test('with predefined id', async () => {
      const data = {
        ...johnUser,
        coins: 1,
      }
      const user = await User.create(data, { id: 'john123' })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith('john123')
      expect(mockSet).toHaveBeenCalledWith(User.formatData(data))
      expect(user.getId()).toBe('john123')
    })
    test('with save method', async () => {
      const user = new User(johnUser, { id: 'john321' })
      await user.save(true)
      expect(mockDoc).toHaveBeenCalledWith(user.path)
      expect(mockSet).toHaveBeenCalledWith(User.formatData(johnUser))
    })
  })
  describe('findOne', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('by id', async () => {
      const user = await User.findOne({ id: database.users[0].id })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockGet).toHaveBeenCalled()
      expect(user.getId()).toBe(database.users[0].id)
    })
    test('by using where clauses', async () => {
      const user = await User.findOne({ where: { name: database.users[0].name } })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('name', '==', database.users[0].name)
      expect(mockLimit).toHaveBeenCalledWith(1)
      expect(mockGet).toHaveBeenCalled()
    })
  })
  describe('findOrCreate', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('by id - created', async () => {
      const [user, created] = await User.findOrCreate({
        id: 'john1',
        defaults: { ...johnUser },
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith('john1')
      expect(mockGet.mock.calls.length).toEqual(1)
      expect(mockSet.mock.calls.length).toBe(1)
      expect(created).toBe(true)
    })
    test('by id - NOT created', async () => {
      const [user, created] = await User.findOrCreate({
        id: database.users[0].id,
        defaults: { ...johnUser },
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(database.users[0].id)
      expect(mockSet.mock.calls.length).toBe(0)
    })
    test('by where clause - created', async () => {
      const data = { ...johnUser }
      data.name = 'jack1'
      const [user, created] = await User.findOrCreate({
        where: { name: data.name },
        defaults: { ...data },
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('name', '==', data.name)
      expect(mockLimit).toHaveBeenCalledWith(1)
      expect(mockGet).toHaveBeenCalled()
      if (created) {
        expect(mockAdd).toHaveBeenCalled()
      } else {
        expect(mockAdd).not.toHaveBeenCalled()
      }
    })
    test('by where clause - NOT created', async () => {
      const [user, created] = await User.findOrCreate({
        where: { name: johnUser.name },
        defaults: { ...johnUser },
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('name', '==', johnUser.name)
      expect(mockLimit).toHaveBeenCalledWith(1)
      expect(mockGet).toHaveBeenCalled()
      if (created) {
        expect(mockAdd).toHaveBeenCalled()
      } else {
        expect(mockAdd).not.toHaveBeenCalled()
      }
    })
  })
  describe('findAll', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('by ids', async () => {
      const ids = database.users.map(u => u.id)
      const users = await User.findAll({ id: ids })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith(admin.firestore.FieldPath.documentId(), 'in', ids)
      expect(mockGet).toHaveBeenCalled()
    })
    test('by using where clause', async () => {
      const ids = database.users.map(u => u.id)
      const users = await User.findAll({ where: { coins: { '>': 10 } }, id: { 'in': ids } })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('coins', '>', 10)
      expect(mockWhere).toHaveBeenCalledWith(admin.firestore.FieldPath.documentId(), 'in', ids)
      expect(mockGet).toHaveBeenCalled()
    })
    test('ordered list', async () => {
      const users = await User.findAll({
        where: { coins: { '>': 10 } },
        order: [['name']],
        limit: 10,
        offset: 20,
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('coins', '>', 10)
      expect(mockOrderBy).toHaveBeenCalledWith('name', 'asc')
      expect(mockLimit).toHaveBeenCalledWith(10)
      expect(mockOffset).toHaveBeenCalledWith(20)
      expect(mockGet).toHaveBeenCalled()
    })
  })
  describe('update', () => {
    beforeEach(() => {
      clearAllMocks()
    })
    test('by id', async () => {
      const data = {
        avatar_url: admin.firestore.FieldValue.delete(),
      }
      await User.update(data, {
        id: database.users[0].id,
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(database.users[0].id)
      expect(mockUpdate).toHaveBeenCalledWith(data)
    })
    test('by conditional clauses', async () => {
      const data = {
        avatar_url: admin.firestore.FieldValue.delete(),
      }
      await User.update(data, {
        where: {
          name: database.users[0].name,
        },
        limit: 10,
        offset: 1,
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('name', '==', database.users[0].name)
      expect(mockLimit).toHaveBeenCalledWith(10)
      expect(mockOffset).toHaveBeenCalledWith(1)
      expect(mockBatchUpdate.mock.calls.length).toBeGreaterThan(0)
      expect(mockBatchCommit).toHaveBeenCalledWith()
    })
    test('by model instance', async () => {
      const user = await User.findOne({ id: database.users[0].id })
      await user.update({
        'coins': admin.firestore.FieldValue.increment(10),
      })
      expect(mockUpdate).toHaveBeenCalledWith({
        'coins': admin.firestore.FieldValue.increment(10),
      })
      user.avatar_url = ''
      await user.save()
      expect(mockUpdate).toHaveBeenCalledWith(User.formatData(user.getData()))
    })
  })
  describe('destroy', () => {
    test('by id', async () => {
      const res = await User.destroy({ id: database.users[0].id })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockDoc).toHaveBeenCalledWith(database.users[0].id)
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })
    test('by where clause', async () => {
      const res = await User.destroy({
        where: [
          ['coins', { '<': 10 }],
        ],
      })
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockWhere).toHaveBeenCalledWith('coins', '<', 10)
      expect(mockGet).toHaveBeenCalled()
      expect(mockBatch).toHaveBeenCalled()
      expect(mockBatchDelete).toHaveBeenCalled()
    })
    test('by instance', async () => {
      const user = await User.findOne({ id: database.users[0].id })
      await user.destroy()
      expect(mockDelete).toHaveBeenCalled()
    })
    test('using drop', async () => {
      await User.drop()
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockBatch).toHaveBeenCalled()
      expect(mockBatchDelete).toHaveBeenCalled()
      expect(mockBatchCommit).toHaveBeenCalled()
    })
    test('try to destroy all', async () => {
      expect.assertions(2)
      try {
        await User.destroy({})
      } catch (e) {
        expect(e.message).toMatch('You are trying to delete all records')
      }
      expect(mockCollection).toHaveBeenCalledWith('users')
    })
  })
  describe('misc', () => {
    beforeEach(() => {
      clearAllMocks()
    })

    test('sync', async () => {
      await User.sync({ setModel: true })
      expect(mockBatch).toHaveBeenCalled()
      expect(mockBatchSet).toHaveBeenCalled()
      expect(mockBatchCommit).toHaveBeenCalled()
    })
    test('docIds', async () => {
      await User.docIds()
      expect(mockCollection).toHaveBeenCalledWith('users')
      expect(mockListDocuments).toHaveBeenCalledTimes(1)
    })
    test('toJSON', async () => {
      const user = await User.findOne({ id: database.users[0].id })
      const json = JSON.stringify(user)
      expect(JSON.parse(json)).toEqual(user.toJSON())
    })
    test('setId', async () => {
      const user = await User.findOne({ id: database.users[0].id })
      user.setId('123')
      expect(user.getId()).toBe('123')
    })
  })
  describe('subcollections', () => {
    beforeEach(async () => {
      clearAllMocks()
    })
    test('create', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      const post = await user.collectionCreate('posts', {
        title: 'post title',
        content: 'post content',
      })
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('update', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      await user.collectionUpdate('posts', {
        title: 'post title',
        content: 'post content',
      }, {
        id: database.users[1]._collections.posts[0].id,
      })
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('findOne', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      const post = await user.collectionFindOne('posts', {
        id: database.users[1]._collections.posts[0].id,
      })
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('findOrCreate', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      const [post, created] = await user.collectionFindOrCreate('posts', {
        id: database.users[1]._collections.posts[0].id,
        defaults: {},
      })
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('findAll', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      const posts = await user.collectionFindAll('posts')
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('destroy', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      await user.collectionDestroy('posts', { id: database.users[1]._collections.posts[0].id })
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('drop', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      await user.collectionDrop('posts')
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('sync', async () => {
      const user = await User.findOne({ id: database.users[1].id })
      await user.collectionSync('posts')
      expect(mockCollection).toHaveBeenCalledWith(Post.path(user.path))
    })
    test('collection{Method} calling errors', async () => {
      const photo = await Photo.create({ url: '' })
      const errorMessage = 'This method is for subcollections only'
      expect.assertions(8)
      try {
        await photo.collectionCreate('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionUpdate('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionFindOne('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionFindOrCreate('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionFindAll('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionSync('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionDestroy('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
      try {
        await photo.collectionDrop('subcollection')
      } catch (e) {
        expect(e.message).toMatch(errorMessage)
      }
    })
  })
})