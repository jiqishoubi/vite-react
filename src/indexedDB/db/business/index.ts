import { IDBConfig } from '@/indexedDB/types'

const config: IDBConfig = {
  dbName: 'business',
  tables: [{ tableName: 'staff' }],
}

export default config
