let sql = require("mssql");

const config = {
    server: 'localhost',
    database: 'master',
    user: 'sa',
    password: 'sa',
    port: 1434
};

async function connect(){
    try {
        let pool = await new sql.ConnectionPool(config).connect()
        return {pool:pool,sql:sql}
    } catch (error) {
        console.log(error)
        reject(error);
    }
}

module.exports = {
    connect
}

