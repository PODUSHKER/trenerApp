const jwt = require('jsonwebtoken');
const { User } = require('../models/associations.js');

async function authChecker(request, response, next) {
    const token = request.cookies['token'];
    if (token) {
        const userId = jwt.verify(token, process.env.JWT_SECRET)['id'];
        const user = await User.findOne({ where: { id: userId }, raw: true })
        if (user) {
            response.locals['User'] = user;
            return next()
        }
        else {
            response.clearCookie('token')
            return response.redirect('/login')
        }
    }
    else if (request.originalUrl !== '/login') {
        return response.redirect('/login')
    }
    return next()
}


module.exports = authChecker;