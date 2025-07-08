const Sequelize = require('sequelize')
const path = require('path')


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(path.dirname(__dirname), 'trenerdb.db'),
})


module.exports = { sequelize, DataTypes: Sequelize.DataTypes }