const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false })


module.exports = Unit;