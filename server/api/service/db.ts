import {Sequelize} from '@sequelize/core';
import {SqliteDialect} from '@sequelize/sqlite3';
import {dirname} from 'path';

const appDir = dirname(process.cwd());
console.info('Dir', appDir)

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: appDir + '/optic-vault/optic-vault.db',
});

export default sequelize;