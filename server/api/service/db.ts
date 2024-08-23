import { Sequelize } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: '/Users/smuratov/Documents/sqlitedbs/optic-vault.db',
});

export default sequelize;