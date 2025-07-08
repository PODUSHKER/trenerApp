const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Polling = sequelize.define('Polling', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})


module.exports = Polling;