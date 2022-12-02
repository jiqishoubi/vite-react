import { useEffect, useRef } from 'react'
import { IDBConfig } from '../types'

// /**
//  * 打开数据库
//  * @param {object} dbName 数据库的名字
//  * @param {string} storeName 仓库名称
//  * @param {string} version 数据库的版本
//  * @return {object} 该函数会返回一个数据库实例
//  */
// export function openDB(dbName, version = 1) {

// }

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
      let db: IDBDatabase

      // 打开数据库，若没有则会创建
      const request = indexedDB.open(this.dbConfig!.dbName, this.version)

      this.status = 'pendding'

      // 数据库打开成功回调
      request.onsuccess = (event: any) => {
        db = event.target.result // 数据库对象
        console.log('数据库打开成功')
        this.status = 'success'
        return resolve(db)
      }

      // 数据库打开失败的回调
      request.onerror = (event) => {
        console.log('数据库打开报错')
        this.status = 'error'
        return reject(event)
      }

      // 数据库有更新时候的回调
      request.onupgradeneeded = (event: any) => {
        // 数据库创建或升级的时候会触发
        console.log('onupgradeneeded 建表')
        db = event.target.result // 数据库对象

        // 建表
        if (this.dbConfig?.tables && this.dbConfig?.tables.length > 0) {
          for (let i = 0; i < this.dbConfig.tables.length; i++) {
            const tableConfig = this.dbConfig.tables[i]
            let objectStore
            // 创建存储库
            objectStore = db.createObjectStore(tableConfig.tableName, {
              keyPath: 'id', // 这是主键
              // autoIncrement: true // 实现自增
            })
            // // 创建索引，在后面查询数据的时候可以根据索引查
            // objectStore.createIndex('link', 'link', { unique: false })
            // objectStore.createIndex('sequenceId', 'sequenceId', { unique: false })
            // objectStore.createIndex('messageType', 'messageType', { unique: false })
          }
        }
      }
    })
  }
}

function useIndexedDB() {
  const dbRef = useRef(null)
  useEffect(() => {
    // openDB('db_echarts', '2').then((db) => {
    //   dbRef.current = db
    // })
  }, [])

  return {
    db: dbRef,
  }
}

export { IndexedDB, useIndexedDB }
