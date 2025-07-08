const { sequelize, DataTypes } = require('../utils/dbSettings.js')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    fio: {
        type: DataTypes.CHAR(100),
        allowNull: true,
    },
    role: {
        type: DataTypes.CHAR(30),
        allowNull: false,
    },
    phone: {
        type: DataTypes.CHAR(15),
        allowNull: false
    },

    login: {
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telegramId: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    trenerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})


module.exports = User;