const User = require('./User.js')
const Course = require('./Course.js')
const Lesson = require('./Lesson.js')
const Module = require('./Module.js')
const FAQ = require('./FAQ.js')
const Polling = require('./Polling.js')
const Answer = require('./Answer.js')

User.hasMany(Course, { allowNull: true, onDelete: 'CASCADE' })
Course.belongsTo(User, { allowNull: true, onDelete: 'CASCADE' })

Course.hasMany(Module, { onDelete: 'CASCADE' })
Module.belongsTo(Course, { onDelete: 'CASCADE' })

Module.hasMany(Lesson, { onDelete: 'CASCADE' })
Lesson.belongsTo(Module, { onDelete: 'CASCADE' })

User.hasMany(FAQ, { allowNull: true, onDelete: 'CASCADE' })
FAQ.belongsTo(User, { allowNull: true, onDelete: 'CASCADE' })

Polling.hasMany(Answer, { allowNull: false, onDelete: 'CASCADE' })
Answer.belongsTo(Polling, { allowNull: false, onDelete: 'CASCADE' })

User.hasMany(Polling, { allowNull: true, onDelete: 'CASCADE' })
Polling.belongsTo(User, { allowNull: true, onDelete: 'CASCADE' })

module.exports = { User, Course, Lesson, Module, FAQ, Answer, Polling }