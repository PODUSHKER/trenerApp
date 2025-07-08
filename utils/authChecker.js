const jwt = require('jsonwebtoken');
const { User } = require('../models/associations.js');
const { resourceUsage } = require('process');

async function authChecker(request, response, next) {
    const token = request.cookies['token'];
    if (token) {
        const userId = jwt.verify(token, process.env.JWT_SECRET)['id'];
        const user = await User.findOne({ where: { id: userId }, raw: true })
        if (user) {
            response.locals['User'] = user;
            return next()
        }
    }
    else if (request.originalUrl !== '/login') {
        return response.redirect('/login')
    }
    return next()
}


module.exports = authChecker;