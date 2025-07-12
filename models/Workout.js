const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Workout = sequelize.define('Workout', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
})


module.exports = Workout;