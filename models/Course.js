const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.CHAR(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
})


module.exports = Course;