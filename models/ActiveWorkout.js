const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const ActiveWorkout = sequelize.define('ActiveWorkout', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = ActiveWorkout;