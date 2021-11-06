# Firestore Sequelize
[![Build Status](https://app.travis-ci.com/mutagen-d/firestore-sequelize.svg?branch=master)](https://app.travis-ci.com/github/mutagen-d/firestore-sequelize)

A simple Sequelize like ORM for Firestore
# Simple Firebase ORM
If you like to use Sequelize and use models in your backend projects try to use FirestoreSequelize, some features:
  - Create Models for your Collections;
  - Construct Select queries like Sequelize using where and orderBy;
  - Default Attributes values for Collection Models;
  - Sync command to update Collection Structure;
  - Any level of Subcollections;
  - Typescript and JSDoc support;

## Installation
```bash
npm i firestore-sequelize
```
or using `yarn`
```bash
yarn add firestore-sequelize
```
## Initialization
First initialize your `firebase-admin`
```javascript
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```
And then initialize `firestore-sequelize`
```javascript
const sequelize = require("firestore-sequelize")
sequelize.initializeApp(admin)
```

## Model Definition
```javascript
const { defineModel, DataTypes } = require("firestore-sequelize");
const User = defineModel("users", {
  login: "",
  name: "",
  email: "",
  admin: {
    type: DataTypes.BOOLEAN,
    required: true,
    default: false,
  },
  coins: 0,
  years: {
    type: 'number',
  },
});

// Subcollections
const Team = defineModel("teams", {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  specialization: {
    type: DataTypes.STRING,
    required: true,
  },
}, {
  subcollections: [User],
})
```
## API

| Static Methods                              | Return Type                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| [`create()`](#create)                       | `Promise<Model>`                                      |
| [`findOne()`](#findone)                     | `Promise<Model \| null>`                              |
| [`findOrCreate()`](#findorcreate)           | `Promise<[Model, boolean]>`                           |
| [`findAll()`](#findall)                     | `Promise<Model[]>`                                    |
| [`update()`](#update)                       | `Promise<WriteResult> \| Promise<WriteResult[]>`      |
| [`destroy()`](#destroy)                     | `Promise<WriteResult> \| Promise<WriteResult[]>`      |
| `drop()`                                    | `Promise<WriteResult> \| Promise<WriteResult[]>`      |
| `docIds()`                                  | `Promise<Model[]>`                                    |
| `sync()`                                    | `Promise<Model[]>`                                    |

| Methods                                     | Return Type                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| `getId()`                                   | `string`                                              |
| `setId()`                                   | `void`                                                |
| `save()`                                    | `Promise<WriteResult>`                                |
| `update()`                                  | `Promise<WriteResult>`                                |
| `destroy()`                                 | `Promise<WriteResult>`                                |
| [`collectionCreate()`](#collectioncreate)   | `Promise<Model>`                                      |
| [`collectionFindOne()`](#collectionfindone) | `Promise<Model \| null>`                              |
| [`collectionFindOrCreate()`](#collectionfindorcreate) | `Promise<[Model, boolean]>`                 |
| [`collectionFindAll()`](#collectionfindall) | `Promise<Model[]>`                                    |
| [`collectionUpdate()`](#collectionupdate)   | `Promise<WriteResult> \| Promise<WriteResult[]>`      |
| [`collectionDestroy()`](#collectiondestroy) | `Promise<WriteResult> \| Promise<WriteResult[]>`      |
| [`collectionDrop()`](#collectiondrop)       | `Promise<WriteResult> \| Promise<WriteResult[]>`      |

| Properties                                  | Value Type                                            |
| ------------------------------------------- | ----------------------------------------------------- |
| `ref`                                       | `DocumentReference`                                   |
| `path`                                      | `string`                                              |

## Filtering
### `where` clauses
Use standard firestore operations `==`, `>`, `>=`, `<`, `<=`, `!=`, `in`, `not-in`, `array-contains`, `array-contains-any`
```javascript
const users = await User.findAll({
  where: {
    years: {
      '>': 10,
      '<=': 40,
    },
  },
})
```
### `id` clauses
Use `id` clauses to filter by `documentId`
```javascript
const users = await User.findAll({
  id: {
    'not-in': [
      'e855cafd-6578-441d-afb8-efc37de90b8f',
      '776b0026-aff0-48c2-a952-69619d7578c4',
    ],
  },
})
```
You can combine `id` and `where` clauses
```javascript
const users = await User.findAll({
  where: {
    years: {
      '>': 10,
      '<=': 40,
    },
  },
  id: {
    'not-in': [
      'e855cafd-6578-441d-afb8-efc37de90b8f',
      '776b0026-aff0-48c2-a952-69619d7578c4',
    ],
  },
})
```
## CRUD operations
### `create`
Create record
```javascript
const user = await User.create({
  login: "john",
  name: "John Doe" ,
  years: 40,
  email: "john.doe@example.com",
  admin: false,
});
```
Another way to create user (not recommended)
```javascript
const user = new User({
  login: "john",
  name: "John Doe",
  email: "john.doe@example.com",
  years: 40,
  admin: false,
}, {
  id: 'john',
});
await user.save(true)
```
### `findOne`
Find by id
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
```
Find using where
```javascript
const user = await User.findOne({
  where: {
    years: {
      '>': 20,
      '<=': 50,
    },
  },
})
```
### `findOrCreate`
Find or create if not found
```javascript
const [user, created] = await User.findOrCreate({
  where: { login: "jane" },
  defaults: {
    login: "jane",
    email: "jane.doe@example.com",
    name: "Jane Doe",
    admin: false,
  },
})
```
### `findAll`
Find all not admin users ordered by login using where and order
```javascript
const users = await User.findAll({
  where: { admin: false },
  order: [["login", "asc"]],
});
```
Find all users by ids ordered by name
```javascript
const users = await User.findAll({
  id: [
    "e855cafd-6578-441d-afb8-efc37de90b8f",
    "776b0026-aff0-48c2-a952-69619d7578c4",
  ],
  order: [["name"]],
})
// or
const users = await User.findAll({
  id: {
    '>': '12bc',
    '<': 'def',
  },
  order: [["name"]],
})
```
### `update`
Update user name using static class
```javascript
await User.update({
  name: "Johnny Doe",
  coins: admin.firestore.FieldValue.increment(10),
}, {
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
```
Update user name using user instance
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
await user.update({
  name: 'Johnny Doe',
  coins: admin.firestore.FieldValue.increment(10),
})
```
Another way to update
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
user.name = "Johnny Doe";
user.coins += 10
await user.save();
```
### `destroy`
Delete User record using static class. By **default** all subcollections **will be deleted**, see [Subcollections](##Subcollections)
```javascript
await User.destory({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
```
Use `ignoreSubcollections: true` to prevent subcollections from being deleted
```javascript
await User.destroy({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
  ignoreSubcollections: true,
});
```
Delete User record using user instance
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
await user.destroy();
```
Delete all User records
```javascript
await User.destroy({ force: true })
// or
await User.drop() // syntactic sugar for `User.destroy({ force: true })`
```
## Subcollections
```javascript
const Photo = defineModel("photos", {
  url: '',
  name: '',
  description: '',
});
const User = defineModel("users", {
  login: "",
  name: "",
  email: "",
  admin: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
}, {
  subcollections: [Photo]
});
```
### `collectionCreate`
Create photo using user instance
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
const photo = await user.collectionCreate('photos', {
  url: 'https://example.com/user/john/photos/photo1.jpg',
})
```
Create photo using Photo static class (not recommended)
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
const photo = await Photo.create({
  url: 'https://example.com/user/john/photos/photo2.png',
  name: 'photo2',
}, {
  parentPath: user.path,
})
```
### `collectionFindOne`
Find photo using user instance
```javascript
const photo = await user.collectionFindOne('photos', {
  where: { name: 'photo2' },
})
```
Find photo using Photo static class (not recommended)
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
const photo = await Photo.findOne({
  where: { name: 'photo2' },
}, {
  parentPath: user.path,
})
```
### `collectionFindAll`
Find all photos using user instance
```javascript
const photos = await user.collectionFindAll('photos', {
  where: {
    name: { '>=': 'photo' },
  }
})
```
### `collectionUpdate`
Update photo using user instance
```javascript
await user.collectionUpdate('photos', {
  description: "John's photo",
}, {
  where: { name: 'photo2' },
})
```
Update photo using photo instance
```javascript
const photo = await user.collectionFindOne('photos', {
  where: { name: 'photo2' }
})
await photo.update({
  description: 'New photo',
})
```
### `collectionDestroy`
Delete photo using user instance
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
await user.collectionDestroy('photos', {
  where: { name: 'photo2' },
})
```
Delete photo using photo instance
```javascript
const photo = await user.collectionFindOne('photos', {
  where: { name: 'photo2' }
})
await photo.destroy()
```
Delete all photos of user
```javascript
const user = await User.findOne({
  id: "e855cafd-6578-441d-afb8-efc37de90b8f",
});
await user.collectionDrop('photos')
```
