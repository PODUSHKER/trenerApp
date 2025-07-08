const expressHbs = require('express-handlebars')
const { Lesson, } = require('../models/associations.js')
const { raw } = require('express')

const hbsConfig = expressHbs.engine({
    defaultLayout: 'base',
    layoutsDir: 'templates/layouts',
    extname: 'hbs',

    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    },

    helpers: {
        eq(a, b) { return a === b },
        isAdmin(role) { return role === 'admin' },
        shortDescription(descr) {
            return descr.length > 135? descr.slice(0, 135)+'...' : descr;
        },
        isTrener(role) { return role === 'trener' },

    }
})


module.exports = hbsConfig;