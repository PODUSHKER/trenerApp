const bot = require('../utils/botSettings.js')
const { User, Module, Course, Lesson, FAQ } = require('../models/associations.js')


bot.on('text', async (msg) => {
    if (msg.text === '/start') {
        await bot.sendMessage(msg.chat.id, 'Отправьте ваш номер для авторизации!')
    }
    if (msg.text.match(/^(\+7|8)[0-9]{10}$/)) {
        console.log(msg.text)
        const client = await User.findOne({ where: { role: 'client', phone: msg.text } });
        if (!client['telegramId']) {
            client['telegramId'] = msg.chat.id;
            await client.save()
        }
        if (client) {
            const trener = await User.findOne({ where: { id: client.trenerId, role: 'trener' } })
            const callbackButtons = [
                [{ text: 'Инфо', callback_data: `trenerInfo_${trener.id}` }],
                [{ text: 'Часто задаваемые вопросы', callback_data: `trenerFAQ_${trener.id}` }],
                [{ text: 'Курсы', callback_data: `trenerСourses_${trener.id}` }],
            ]
            const resultMsg = `Здравствуйте, ${client.fio}!`;

            await bot.sendMessage(msg.chat.id, resultMsg, {
                reply_markup: {
                    inline_keyboard: callbackButtons,
                    resize_keyboard: true
                }
            })
        }
        else {
            await bot.sendMessage(msg.chat.id, 'Клиент не найден!')
        }
    } else {
        console.log(msg.text, msg.text.match(/^(\+7|8)[0-9]{10}$/))
    }
})

bot.on('callback_query', async (callback) => {
    if (callback.data.match(/^getMain_[0-9]+$/)) {
        const clientId = callback.data.split('_')[1];
        const client = await User.findOne({ where: { id: clientId } })
        const callbackButtons = [
            [{ text: 'Инфо', callback_data: `trenerInfo_${client.trenerId}` }],
            [{ text: 'Часто задаваемые вопросы', callback_data: `trenerFAQ_${client.trenerId}` }],
            [{ text: 'Курсы', callback_data: `trenerСourses_${client.trenerId}` }],
        ]
        const resultMsg = `Здравствуйте, ${client.fio}!`;

        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: callbackButtons,
                resize_keyboard: true
            }
        })
    }
    if (callback.data.match(/^trenerСourses_[0-9]+$/)) {
        const client = await User.findOne({ where: { role: 'client', telegramId: callback.from.id } })
        const trenerId = callback.data.split('_')[1];
        const trener = await User.findOne({ where: { id: trenerId } })
        const courses = await Course.findAll({ where: { UserId: trener.id } })
        console.log(courses)
        const callbackCourses = []
        const resultMsg = `Ваши курсы от тренера ${trener.fio}:`;
        for (let course of courses) {
            callbackCourses.push([{ text: course.title, callback_data: `course_${course.id}` }])
        }
        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: [...callbackCourses, [{ text: '<<< Назад', callback_data: `getMain_${client.id}` }]],
                resize_keyboard: true
            }
        })
    }
    if (callback.data.match(/^trenerFAQ_[0-9]+$/)) {
        const client = await User.findOne({ where: { role: 'client', telegramId: callback.from.id } })
        const trenerId = callback.data.split('_')[1];
        const trener = await User.findOne({ where: { id: trenerId } })
        const FAQs = await FAQ.findAll({ where: { UserId: trenerId } })
        const callbackFAQs = []
        const resultMsg = `Часто задаваемые вопросы:\n\n`;
        for (let faq of FAQs) {
            callbackFAQs.push(`${faq.question}\n${faq.answer}`)
        }
        await bot.sendMessage(callback.from.id, resultMsg+callbackFAQs.join('\n\n'), {
            reply_markup: {
                inline_keyboard: [[{ text: '<<< Назад', callback_data: `getMain_${client.id}` }]],
                resize_keyboard: true
            }
        })
    }
    if (callback.data.match(/^trenerInfo_[0-9]+$/)) {
        const client = await User.findOne({ where: { role: 'client', telegramId: callback.from.id } })
        const trenerId = callback.data.split('_')[1];
        const trener = await User.findOne({ where: { id: trenerId } })
        const callbackInfo = [`Ваш тренер: \n${trener.fio}\n${trener.phone}\n и тд.`]
        const resultMsg = `Информация:\n\n`;
        await bot.sendMessage(callback.from.id, resultMsg+callbackInfo.join('\n\n'), {
            reply_markup: {
                inline_keyboard: [[{ text: '<<< Назад', callback_data: `getMain_${client.id}` }]],
                resize_keyboard: true
            }
        })
    }
    if (callback.data.match(/^course_[0-9]+$/)) {
        const toDeleteMsgId = callback.message.message_id;
        const courseId = callback.data.split('_')[1];
        const course = await Course.findOne({ where: { id: courseId } })
        const trener = await User.findOne({ where: { id: course.UserId, role: 'trener' } })

        const modules = await Module.findAll({ where: { CourseId: courseId } });
        const callbackModules = [];
        const resultMsg = `Доступные модули:`;
        for (let module of modules) {
            callbackModules.push([{ text: module.title, callback_data: `module_${module.id}` }])
        }
        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: [...callbackModules, [{ text: '<<< Назад', callback_data: `trener_${trener.id}` }]],
                resize_keyboard: true
            }
        })
        await bot.deleteMessage(callback.from.id, toDeleteMsgId)
    }

    if (callback.data.match(/^module_[0-9]+$/)) {
        const toDeleteMsgId = callback.message.message_id;
        const moduleId = callback.data.split('_')[1];
        const module = await Module.findOne({ where: { id: moduleId } })
        const lessons = await Lesson.findAll({ where: { ModuleId: moduleId } });
        const callbackLessons = [];
        const resultMsg = `Доступные уроки:`;
        for (let lesson of lessons) {
            callbackLessons.push([{ text: lesson.title, callback_data: `lesson_${lesson.id}` }])
        }
        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: [...callbackLessons, [{ text: '<<< Назад', callback_data: `course_${module.CourseId}` }]],
                resize_keyboard: true
            }
        })
        await bot.deleteMessage(callback.from.id, toDeleteMsgId)
    }
    if (callback.data.match(/^lesson_[0-9]+$/)) {
        const toDeleteMsgId = callback.message.message_id;
        const lessonId = callback.data.split('_')[1];
        const lesson = await Lesson.findOne({ where: { id: lessonId } });
        const resultMsg = `${lesson.title}:\n${lesson.content}`;

        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '<<< Назад', callback_data: `module_${lesson.ModuleId}` }]
                ],
                resize_keyboard: true
            }
        })
        await bot.deleteMessage(callback.from.id, toDeleteMsgId)
    }
    if (callback.data.match(/^trener_[0-9]+$/)) {
        const client = await User.findOne({ where: { telegramId: callback.from.id } })
        const toDeleteMsgId = callback.message.message_id;
        const trenerId = callback.data.split('_');
        const trener = await User.findOne({ where: { id: trenerId, role: 'trener' } })
        const courses = await Course.findAll({ where: { UserId: trener.id } })
        const callbackCourses = []
        const resultMsg = `Ваши курсы от тренера ${trener.fio}:`;
        for (let course of courses) {
            callbackCourses.push([{ text: course.title, callback_data: `course_${course.id}` }])
        }
        console.log(callbackCourses)
        await bot.sendMessage(callback.from.id, resultMsg, {
            reply_markup: {
                inline_keyboard: [...callbackCourses, [{ text: '<<< Назад', callback_data: `getMain_${client.id}` }]],
                resize_keyboard: true
            }
        })
        await bot.deleteMessage(callback.from.id, toDeleteMsgId)
    }
})

module.exports = bot;