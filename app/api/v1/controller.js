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
    const email = request.body.email;
    const password = request.body.password;
    const response = await user.loginUser(email, password)
    return response;
}

module.exports = {
    registerUser,
    loginUser,
}