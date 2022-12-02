import { useEffect, useRef } from 'react'
import { IDBConfig } from '../types'

class IndexedDB {
  dbConfig: IDBConfig | undefined
  version: number = 1
  db: IDBDatabase | undefined
  status: '' | 'pendding' | 'success' | 'error' = ''

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
              objectStore.createIndex('name', '姓名', { unique: false })
              objectStore.createIndex('age', '年龄', { unique: false })
            }
          }
        }
      }
    })
  }

  // 增删改查
  add(tableName, record) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('this.db undefined')
      //IndexdDB都是通过事务操作的，此处开启一个事务，赋予读写的权限
      var transaction = this.db.transaction([tableName], 'readwrite')
      //获取表的实例，得到objectStore 就可以开始操作了
      var objectStore = transaction.objectStore(tableName)
      //此处添加一个student对象
      var request = objectStore.add(record)
      //每一个操作都会有成功和是失败的回调
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
}

function useIndexedDB(indexedDB: IndexedDB) {
  useEffect(() => {
    console.log('🚀 ~ indexedDB 状态改变', indexedDB)
  }, [indexedDB.status])
}

export { IndexedDB, useIndexedDB }
