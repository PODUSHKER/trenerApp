const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Answer = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },

})

module.exports = Answer;