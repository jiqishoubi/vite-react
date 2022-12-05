import { IDBConfig } from '@/indexedDB/types'

const config: IDBConfig = {
  dbName: 'echart',
  tables: [{ tableName: 'config' }],
}

export default config
