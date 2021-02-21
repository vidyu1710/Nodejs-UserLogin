const { autoInject } = require('async');
const user = require('./core/user');

async function registerUser(request) {
    const email = request.body.email;
    const password = request.body.password;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const companyName = request.body.companyName;
    const response = await user.registerUser(email, password, firstName, lastName, companyName)
    return response;
}

async function loginUser(request) {
    const email = request.query.email;
    const password = request.query.password;
    const response = await user.loginUser(email, password)
    return response;
}

async function getUserList(request) {
    const lastPageNo = request.body.lastPageNo;
    const requiredRecords = request.body.requiredRecords;
    const searchParams = request.body.searchParams;
    const sortBy = request.body.sortBy;
    const token = request.headers.authorization;
    const response = await user.getUserList(lastPageNo, requiredRecords, searchParams, token, sortBy);
    return response;
}

module.exports = {
    registerUser,
    loginUser,
    getUserList,
}