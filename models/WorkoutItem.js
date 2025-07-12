const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const WorkoutItem = sequelize.define('WorkoutItem', {
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
    num: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: false })


module.exports = WorkoutItem;