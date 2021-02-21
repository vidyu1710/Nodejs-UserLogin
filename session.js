const jwt = require('jsonwebtoken');
const SessionExpiredError = require('./sessionErrors').SessionExpiredError
const InvalidTokenError = require('./sessionErrors').InvalidTokenError
const RefreshTokenRequiredError = require('./sessionErrors').RefreshTokenRequiredError

const secretKey = "somerandomkey9654781515"

async function createSession(userSessionData) {
    delete userSessionData.password
    const data = { ...userSessionData, nonce: Math.floor(Math.random() * 1000) }
    const token = jwt.sign(data, secretKey, { expiresIn: 15*60 });
    const refreshToken = jwt.sign({ ...userSessionData, nonce: Math.floor(Math.random() * 1000000) }, secretKey, { expiresIn: 60*60 })
    return { token, refreshToken }
}

async function checkSession(token) {
    try {
        let data = jwt.verify(token, secretKey)
        if (token && data) {
            return {
                sessionValid: true,
                tokenExpired: false
            }
        }
        else {
            throw new SessionExpiredError("User has already Logged Out")
        }
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new RefreshTokenRequiredError("User token has Expired")
        } else if (err.name === 'RefreshTokenRequiredError') {
            throw new RefreshTokenRequiredError("User token has Expired. Refresh token is required")
        } else {
            throw new InvalidTokenError("Invalid token was supplied")
        }
    }
}

async function refreshSession(token, refreshToken) {
    try {
        let data = jwt.verify(refreshToken, secretKey)
        if (data && data.token === token) {
            const tokenData = {
                employeeId: data.employeeId,
                email: data.email,
                nonce: Math.floor(Math.random() * 1000)
            }
            const token = jwt.sign(tokenData, secretKey, { expiresIn: 15*60 });
            return { token }
        } else {
            throw new SessionExpiredError("User has already Logged Out")
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new SessionExpiredError("Refresh Token Has Expired")
        } else
            throw new InvalidTokenError("Invalid Token Supplied")
    }
}

module.exports = {
    createSession: createSession,
    checkSession: checkSession,
    refreshSession: refreshSession,
}