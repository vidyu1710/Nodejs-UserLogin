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

function getSearchQuery(searchParams, sortBy = null, isList = 1) {
    let queryValue = '';
    if(searchParams) {
        if (searchParams.firstName && searchParams.firstName.length > 1) queryValue += `${" AND e.first_name like '%"}${searchParams.firstName}%'`;
        if (searchParams.lastName && searchParams.lastName.length > 1) queryValue += `${" AND e.last_name like '%"}${searchParams.lastName}%'`;
        if (searchParams.employeeId && searchParams.employeeId.length > 1) queryValue += `${" AND e.id like '%"}${searchParams.employeeId}%'`;
    }  
    if(sortBy && isList === 1) {
        if (sortBy === 'firstName') queryValue += ` ORDER BY e.first_name`;
        if (sortBy === 'lastName') queryValue += ` ORDER BY e.last_name`;
        if (sortBy === 'email') queryValue += ` ORDER BY u.email`;
        if (sortBy === 'employeeId') queryValue += ` ORDER BY e.id`;
        if (sortBy === 'companyName') queryValue += ` ORDER BY e.organization_name`;

    } else if (!sortBy && isList === 1) {
        queryValue += ` ORDER BY u.created_at DESC`
    }
    return queryValue;
}

async function getUserList(totalLastRecords, requiredRecords, searchParams, sortBy) {
    let query = queries.getUserList;
    let connection = await sqlConnection.connect()
    let pool = connection.pool
    let sql = connection.sql
    let request = await pool.request()
    request.input('totalLastRecords', sql.Int, totalLastRecords)
    request.input('requiredRecords', sql.Int, requiredRecords)
    query = query.replace('searchSubQuery', getSearchQuery(searchParams, null, 0))
    .replace('searchSubQuery', getSearchQuery(searchParams, sortBy, 1));
    let response = await request.query(query);
    response.recordset[0].users = JSON.parse(response.recordset[0].users);
    return response.recordset;
}

module.exports = {
    getUserInformation,
    registerUser,
    getUserList,
}