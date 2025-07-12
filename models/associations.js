const User = require('./User.js')
const Course = require('./Course.js')
const Lesson = require('./Lesson.js')
const Module = require('./Module.js')
const FAQ = require('./FAQ.js')
const Polling = require('./Polling.js')
const Answer = require('./Answer.js')
const Tag = require('./Tag.js')
const Workout = require('./Workout.js')
const WorkoutItem = require('./WorkoutItem.js')
const Unit = require('./Unit.js')
const ActiveWorkout = require('./ActiveWorkout.js')

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

Tag.hasMany(Course, { allowNull: true, onDelete: 'SET NULL' })
Course.belongsTo(Tag, { allowNull: true, onDelete: 'SET NULL' })

Tag.hasMany(User, { allowNull: true, onDelete: 'SET NULL' })
User.belongsTo(Tag, { allowNull: true, onDelete: 'SET NULL' })

Tag.hasMany(Workout, { allowNull: true, onDelete: 'SET NULL' })
Workout.belongsTo(Tag, { allowNull: true, onDelete: 'SET NULL' })

User.hasMany(Workout, { allowNull: true, onDelete: 'CASCADE' })
Workout.hasMany(User, { allowNull: true, onDelete: 'CASCADE' })

Workout.hasMany(WorkoutItem, { allowNull: false, onDelete: 'CASCADE' })
WorkoutItem.belongsTo(Workout, { allowNull: false, onDelete: 'CASCADE' })

Unit.hasMany(WorkoutItem, { allowNull: false, onDelete: 'CASCADE' })
WorkoutItem.belongsTo(Unit, { allowNull: false, onDelete: 'CASCADE' })

Workout.hasMany(ActiveWorkout, { allowNull: false, onDelete: 'CASCADE' })
ActiveWorkout.belongsTo(Workout, { allowNull: false, onDelete: 'CASCADE' })

User.hasMany(ActiveWorkout, { allowNull: false, onDelete: 'CASCADE' })
ActiveWorkout.belongsTo(User, { allowNull: false, onDelete: 'CASCADE' })



module.exports = { User, Course, Lesson, Module, FAQ, Answer, Polling, Tag, Workout, WorkoutItem, Unit, ActiveWorkout }