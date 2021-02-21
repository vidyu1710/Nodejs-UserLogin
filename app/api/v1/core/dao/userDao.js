const queries = require('./queries');
const sqlConnection = require('../../../../../sqlConnection');

async function registerUser(email, passwordHash, firstName, lastName, companyName) {
    try{
        const query = queries.addUser;
        let connection = await sqlConnection.connect()
        let pool = connection.pool
        let sql = connection.sql
        let request = await pool.request()
        request.input('email', sql.VarChar, email)
        request.input('passwordHash', sql.VarChar, passwordHash)
        request.input('firstName', sql.VarChar, firstName)
        request.input('lastName', sql.VarChar, lastName)
        request.input('companyName', sql.VarChar, companyName)
        const response = await request.query(query);
        return response.rowsAffected;
    } catch(e) {
        throw e;
    }
    
}

async function getUserInformation(email) {
    const query = queries.getUserInformation;
    let connection = await sqlConnection.connect()
    let pool = connection.pool
    let sql = connection.sql
    let request = await pool.request()
    request.input('email', sql.VarChar, email)
    const response = await request.query(query);
    return response.recordset;
}
module.exports = {
    getUserInformation,
    registerUser,
}