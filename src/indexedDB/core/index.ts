import { useEffect, useRef } from 'react'
import { IDBConfig } from '../types'

class IndexedDB {
  dbConfig: IDBConfig | undefined
  version: number = 1
  db: IDBDatabase | undefined
  status: '' | 'pendding' | 'success' | 'error' = ''
  transactionCaches: {
    [propName: string]: {
      transaction: IDBTransaction
      objectStore: IDBObjectStore
    }
  } = {} // 事务缓存

  static _instanceCaches = {}

  constructor(dbConfig: IDBConfig, version = 1) {
    if (new.target !== IndexedDB) {
      return
    }
    if (!IndexedDB._instanceCaches[dbConfig.dbName]) {
      // 没创建过这个数据库
      // 创建
      this.dbConfig = dbConfig
      this.version = version
      this.db = undefined
      this.open()

      IndexedDB._instanceCaches[dbConfig.dbName] = this
    }
    return IndexedDB._instanceCaches[dbConfig.dbName]
  }

  // 连接/创建 数据库
  open() {
    return new Promise((resolve, reject) => {
      //  兼容浏览器
      // @ts-ignore
      var indexedDB: IDBFactory = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

      // 打开数据库，若没有则会创建
      const request = indexedDB.open(this.dbConfig!.dbName, this.version)

      this.status = 'pendding'

      // 数据库打开成功回调
      request.onsuccess = (event: any) => {
        console.log('数据库打开成功')
        this.db = event.target.result // 数据库对象
        this.status = 'success'
        return resolve(this.db)
      }

      // 数据库打开失败的回调
      request.onerror = (event) => {
        console.log('数据库打开报错')
        this.db = undefined
        this.status = 'error'
        return reject(this.db)
      }

      // 数据库有更新时候的回调
      request.onupgradeneeded = (event: any) => {
        // 数据库创建或升级的时候会触发
        console.log('onupgradeneeded 建表')
        this.db = event.target.result // 数据库对象

        // 建表
        if (this.db && this.dbConfig?.tables && this.dbConfig?.tables.length > 0) {
          for (let i = 0; i < this.dbConfig.tables.length; i++) {
            const tableConfig = this.dbConfig.tables[i]
            if (this.db.objectStoreNames.contains(tableConfig.tableName)) {
              continue
            } else {
              let objectStore
              // 创建存储库
              objectStore = this.db!.createObjectStore(tableConfig.tableName, {
                keyPath: 'id', // 这是主键
                autoIncrement: true, // 实现自增
              })
              // 创建索引，在后面查询数据的时候可以根据索引查
              // todo
              objectStore.createIndex('name', '姓名', { unique: false })
              objectStore.createIndex('age', '年龄', { unique: false })
            }
          }
        }
      }
    })
  }

  // 增删改查
  getTransaction(tableName) {
    // if (this.transactionCaches[tableName]) { // 当所有请求都已完成并且在控制返回到事件循环之前没有进一步的请求时，索引数据库事务会自动提交。换句话说 - 您可以在先前请求的成功或错误回调中发出新请求，但不能在事件处理程序等其他异步回调中发出新请求。您需要在点击处理程序中启动一个新事务，因为任何先前的事务都将自动提交。
    if (false) {
      // 本来就有
    } else {
      //IndexdDB都是通过事务操作的，此处开启一个事务，赋予读写的权限
      var transaction = this.db!.transaction([tableName], 'readwrite')
      const transactionObj = {
        transaction,
        objectStore: transaction.objectStore(tableName),
      }
      this.transactionCaches[tableName] = transactionObj
    }
    return this.transactionCaches[tableName]
  }
  add(tableName, record) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('this.db undefined')
      var objectStore = this.getTransaction(tableName)?.objectStore
      var request = objectStore!.add(record)
      request.onsuccess = (event: any) => {
        console.log('添加成功', event)
        const id = event.target.result
        return resolve({
          id,
          ...record,
        })
      }
      request.onerror = (event) => {
        console.log('添加失败', event)
        return reject(event)
      }
    })
  }
  delete(tableName, id) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('this.db undefined')
      var objectStore = this.getTransaction(tableName)?.objectStore

      var request = objectStore!.delete(id)
      request.onsuccess = (event) => {
        console.log('删除成功')
        return resolve(true)
      }
      request.onerror = (event) => {
        console.log('删除失败')
        return reject(false)
      }
    })
  }
  update(tableName, { id, ...restRecord }) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('this.db undefined')
      var objectStore = this.getTransaction(tableName)?.objectStore

      var request = objectStore!.put(restRecord, id)
      request.onsuccess = (event) => {
        console.log('修改成功')
        return resolve(true)
      }
      request.onerror = (event) => {
        console.log('修改失败')
        return reject(false)
      }
    })
  }
  // 查询
  // 根据主键查询
  getById(tableName, id) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('this.db undefined')
      var objectStore = this.getTransaction(tableName)?.objectStore

      var request = objectStore!.get(id)
      request.onsuccess = (event: any) => {
        console.log('查询成功')
        const record = event.target.result ?? null
        return record ? resolve(record) : reject(false)
      }
      request.onerror = (event) => {
        console.log('查询失败')
        return reject(false)
      }
    })
  }
  // 根据索引查询
  getByIndex() {
    // todo
  }
}

function useIndexedDB(indexedDB: IndexedDB) {
  useEffect(() => {
    console.log('🚀 ~ indexedDB 状态改变', indexedDB)
  }, [indexedDB.status])
}

export { IndexedDB, useIndexedDB }
