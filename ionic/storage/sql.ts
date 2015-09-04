import {StorageEngine} from './storage';

import * as util from 'ionic/util';

const DB_NAME = '__ionicstorage';

export class SqlStorage extends StorageEngine {
  static BACKUP_LOCAL =  2
  static BACKUP_LIBRARY = 1
  static BACKUP_DOCUMENTS = 0

  constructor(options) {
    super();

    let dbOptions = util.defaults({
      name: DB_NAME,
      backupFlag: SqlStorage.BACKUP_NONE,
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
