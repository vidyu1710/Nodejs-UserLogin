const userDao = require('./dao/userDao');
const { createSession, checkSession } = require('../../../../session');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

function generatePasswordhash(password) {
    const passwordHash = bcrypt.hashSync(password, salt);
    return passwordHash;
}

function compareHash(password, passwordHash) {
    const result = bcrypt.compareSync(password, passwordHash);
    return result;
}

async function registerUser(email, password, firstName, lastName, companyName) {
    let result;
    try {
        const passwordHash = generatePasswordhash(password);
        const user = await userDao.getUserInformation(email);
        if(user.length === 0){
            const response = await userDao.registerUser(email, passwordHash, firstName, lastName, companyName);
            if(response.length > 0){
                result = {
                    status: 'success',
                    message: 'User registered successfully'
                };
                return {statusCode : 200, body: result};
            }
            else {
                result = {
                    status: 'error',
                    message: 'Some error occured in user registration'
                };
                return {statusCode : 500, body: result};
            }
        } else {
            result = {
                status: 'error',
                message: 'User already exist in the system'
            };
            return {statusCode : 409, body: result};
        }
        
    } catch(e) {
        result = {
            status: 'error',
            message: 'Internal Server Error'
        };
        return {statusCode : 500, body: result};
    }
}

async function loginUser(email, password) {
    let result;
    try {
        const user = await userDao.getUserInformation(email);
        if(user && user.length > 0){
            const isPasswordCorrect = compareHash(password, user[0].passwordHash);
            if(isPasswordCorrect === true) {
                const sessionResponse = await createSession({employeeId: user[0].employeeId, email});
                result = {
                    status: 'success',
                    message: 'User logged in successfully',
                    data: sessionResponse
                };
                return {statusCode : 200, body: result};
            } else {
                result = {
                    status: 'error',
                    message: 'Authentication failed. Incorrect username or password'
                };
                return {statusCode : 401, body: result};
            }
        } else {
            result = {
                status: 'error',
                message: 'User not found'
            };
            return {statusCode : 404, body: result};
        }
    } catch(e) {
        result = {
            status: 'error',
            message: 'Internal Server Error'
        };
        return {statusCode : 500, body: result};
    }

}

async function getUserList(lastPageNo, requiredRecords, searchParams, token, sortBy) {
    let result;
    try {
        const sessionResponse = await checkSession(token)
        if(sessionResponse && sessionResponse.sessionValid === true && sessionResponse.tokenExpired === false) {
            let totalLastRecords = 0;
            if (!requiredRecords) 
                requiredRecords = 10;
            if (lastPageNo > 0) 
                totalLastRecords = (lastPageNo * requiredRecords);
            const response = await userDao.getUserList(totalLastRecords, requiredRecords, searchParams, sortBy);
            if(response.length > 0){
                result = {
                    status: 'success',
                    data: response
                };
                return {statusCode : 200, body: result};
            }
            else {
                result = {
                    status: 'error',
                    message: 'No user data found'
                };
                return {statusCode : 404, body: result};
            }
        } else {
            result = {
                status: 'error',
                message: 'Invalid user session'
            };
            return {statusCode : 401, body: result};
        }
    } catch(e) {
        result = {
            status: 'error',
            message: e.message
        };
        return {statusCode : 500, body: result};
    }
}
module.exports = {
    registerUser,
    loginUser,
    getUserList,
}