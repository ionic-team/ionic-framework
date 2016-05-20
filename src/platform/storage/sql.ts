import {StorageEngine} from './storage';

import {defaults, assign} from '../../util/util';

const DB_NAME: string = '__ionicstorage';
const win: any = window;

/**
 * SqlStorage uses SQLite or WebSQL (development only!) to store data in a
 * persistent SQL store on the filesystem.
 *
 * This is the preferred storage engine, as data will be stored in appropriate
 * app storage, unlike Local Storage which is treated differently by the OS.
 *
 * For convenience, the engine supports key/value storage for simple get/set and blob
 * storage. The full SQL engine is exposed underneath through the `query` method.
 *
 * @usage
 ```js
 * let storage = new Storage(SqlStorage, options);
 * storage.set('name', 'Max');
 * storage.get('name').then((name) => {
 * });
 *
 * // Sql storage also exposes the full engine underneath
 * storage.query('insert into projects(name, data) values("Cool Project", "blah")');
 * storage.query('select * from projects').then((resp) => {})
 * ```
 *
 * The `SqlStorage` service supports these options:
 * {
 *   name: the name of the database (__ionicstorage by default)
 *   backupFlag: // where to store the file, default is BACKUP_LOCAL which DOES NOT store to iCloud. Other options: BACKUP_LIBRARY, BACKUP_DOCUMENTS
 *   existingDatabase: whether to load this as an existing database (default is false)
 * }
 *
 */
export class SqlStorage extends StorageEngine {
  static BACKUP_LOCAL = 2;
  static BACKUP_LIBRARY = 1;
  static BACKUP_DOCUMENTS = 0;

  private _db: any;

  constructor(options = {}) {
    super();

    let dbOptions = defaults(options, {
      name: DB_NAME,
      backupFlag: SqlStorage.BACKUP_LOCAL,
      existingDatabase: false
    });

    if (win.sqlitePlugin) {
      let location = this._getBackupLocation(dbOptions.backupFlag);

      this._db = win.sqlitePlugin.openDatabase(assign({
        name: dbOptions.name,
        location: location,
        createFromLocation: dbOptions.existingDatabase ? 1 : 0
      }, dbOptions));

    } else {
      console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

      this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
    }
    this._tryInit();
  }

  _getBackupLocation(dbFlag: number): number {
    switch (dbFlag) {
      case SqlStorage.BACKUP_LOCAL:
        return 2;
      case SqlStorage.BACKUP_LIBRARY:
        return 1;
      case SqlStorage.BACKUP_DOCUMENTS:
        return 0;
      default:
        throw Error('Invalid backup flag: ' + dbFlag);
    }
  }

  // Initialize the DB with our required tables
  _tryInit() {
    this.query('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)').catch(err => {
      console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
    });
  }

  /**
   * Perform an arbitrary SQL operation on the database. Use this method
   * to have full control over the underlying database through SQL operations
   * like SELECT, INSERT, and UPDATE.
   *
   * @param {string} query the query to run
   * @param {array} params the additional params to use for query placeholders
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  query(query: string, params = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._db.transaction((tx) => {
          tx.executeSql(query, params,
            (tx, res) => resolve({ tx: tx, res: res }),
            (tx, err) => reject({ tx: tx, err: err }));
        },
          (err) => reject({ err: err }));
      } catch (err) {
        reject({ err: err });
      }
    });
  }

  /**
   * Get the value in the database identified by the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  get(key: string): Promise<any> {
    return this.query('select key, value from kv where key = ? limit 1', [key]).then(data => {
      if (data.res.rows.length > 0) {
        return data.res.rows.item(0).value;
      }
    });
  }

  /**
  * Set the value in the database for the given key. Existing values will be overwritten.
  * @param {string} key the key
  * @param {string} value The value (as a string)
  * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
  */
  set(key: string, value: string): Promise<any> {
    return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
  }

  /**
  * Remove the value in the database for the given key.
  * @param {string} key the key
  * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
  */
  remove(key: string): Promise<any> {
    return this.query('delete from kv where key = ?', [key]);
  }

  clear(): Promise<any> {
    return this.query('delete from kv');
  }
}
