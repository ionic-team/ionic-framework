import {StorageEngine} from './storage';

import * as util from 'ionic/util';

const DB_NAME = '__ionicstorage';

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
 * storage.query('insert into projects(name, data) values('Cool Project', 'blah')');'
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
  static BACKUP_LOCAL =  2
  static BACKUP_LIBRARY = 1
  static BACKUP_DOCUMENTS = 0

  constructor(options) {
    super();

    let dbOptions = util.defaults({
      name: DB_NAME,
      backupFlag: SqlStorage.BACKUP_LOCAL,
      existingDatabase: false
    }, options);


    if(window.sqlitePlugin) {
      let location = this._getBackupLocation(dbOptions);

      this._db = window.sqlitePlugin.openDatabase(util.extend({
        name: dbOptions.name,
        location: location,
        createFromLocation: dbOptions.existingDatabase ? 1 : 0
      }, dbOptions));
    } else {
      console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

      this._db = window.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
    }
    this._tryInit();
  }

  _getBackupLocation(dbFlag) {
    switch(dbFlag) {
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
    this._db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)', [], (tx, res) => {
      }, (tx, err) => {
        console.error('Storage: Unable to create initial storage tables', tx, err);
      });
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
  query(query, ...params) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        ts.executeSql(query, params, (tx, res) => {
          resolve({
            tx: tx,
            res: res
          });
        }, (tx, err) => {
          reject({
            tx: tx,
            err: err
          });
        })
      });
    })
  }

  /**
   * Get the value in the database identified by the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      try {

        this._db.transaction(tx => {
          tx.executeSql("select key, value from kv where key = ? limit 1", [key], (tx, res) => {
            if(res.rows.length > 0) {
              let item = res.rows.item(0);
              resolve(item.value);
            }
            resolve(null);
          }, (tx, err) => {
            reject({
              tx: tx,
              err: err
            });
          })
        }, err => {
          reject(err);
        });

      } catch(e) {
        reject(e);
      }
    });
  }

  /**
  * Set the value in the database for the given key. Existing values will be overwritten.
  * @param {string} key the key
  * @param {string} value The value (as a string)
  * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
  */
  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        this._db.transaction(tx => {
          tx.executeSql('insert or replace into kv(key, value) values (?, ?)', [key, value], (tx, res) => {
            resolve();
          }, (tx, err) => {
            reject({
              tx: tx,
              err: err
            });
          })
        }, err => {
          reject(err);
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  /**
  * Remove the value in the database for the given key.
  * @param {string} key the key
  * @param {string} value The value (as a string)
  * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
  */
  remove(key) {
    return new Promise((resolve, reject) => {
      try {
        this._db.transaction(tx => {
          tx.executeSql('delete from kv where key = ?', [key], (tx, res) => {
            resolve();
          }, (tx, err) => {
            reject({
              tx: tx,
              err: err
            });
          })
        }, err => {
          reject(err);
        });
      } catch(e) {
        reject(e);
      }
    });

  }
}
