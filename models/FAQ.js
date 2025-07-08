const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const FAQ = sequelize.define('FAQ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
})


module.exports = FAQ;