const { ActiveWorkout, WorkoutItem, Workout, User, Unit } = require('../models/associations.js')
const bot = require('./botSettings.js');


async function manageWorkouts() {
    const delay = 86400000;
    setTimeout(async function inner() {
        const activeWorkouts = await ActiveWorkout.findAll({ raw: true, nest: true, include: [User, Workout] });
        for (let activeWorkout of activeWorkouts) {

            const date = new Date(activeWorkout.date).setHours(0, 0, 0, 0);
            const today = new Date().setHours(0, 0, 0, 0);
            if (today >= date) {
                if (today === date) {
                    const client = await User.findOne({ where: { id: activeWorkout.clientId }, raw: true })
                    const workoutItemsStr = (await WorkoutItem.findAll({ where: { WorkoutId: activeWorkout.Workout.id }, raw: true, nest: true, include: Unit })).map(el => {
                        return `${el.name} - ${el.num}${el.Unit.name}`
                    }).join('\n')
                    if (client.telegramId) {
                        bot.sendMessage(client.telegramId, `У вас сегодня тренеровка ${activeWorkout.Workout.title} с тренером ${activeWorkout.User.fio}!\n\nВаша тренировка:\n${workoutItemsStr}\n\nОписание:\n${activeWorkout.Workout.description}`)
                    }
                }
                ActiveWorkout.destroy({ where: { id: activeWorkout.id } })
            }
        }
        setTimeout(inner, delay)
    }, delay)
}

module.exports = manageWorkouts;