const { User, Course, Lesson, Module, FAQ, Answer, Polling } = require('../models/associations.js')
const bcrypt = require('bcrypt');
const { raw } = require('express');
const jwt = require('jsonwebtoken')


exports.getMain = function (request, response) {
    return response.render('main.hbs');
}


exports.getLogin = function (request, response) {
    return response.render('login.hbs')
}

exports.postLogin = async function (request, response) {
    const { login, password } = request.body;
    console.log(login)
    const user = await User.findOne({ where: { login }, raw: true })
    if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
            console.log(token)
            response.cookie('token', token)
            return response.redirect('/')
        }
    }
    return response.redirect('/login')
}




exports.getTreners = async function (request, response) {
    const treners = await User.findAll({ where: { role: 'trener' }, raw: true })
    return response.render('treners.hbs', { treners, script: 'treners.js' })
}


exports.getClients = async function (request, response) {
    const clients = await User.findAll({ where: { role: 'client' }, raw: true })
    return response.render('clients.hbs', { clients, script: 'clients.js' })
}

exports.postCreateTrener = async function (request, response) {
    const { password, ...other } = request.body;
    console.log(other, password)
    const isValid = Object.values({ ...other, password }).every((el) => !!el)

    const resMessage = { success: true }
    console.log(isValid)
    if (!isValid) {
        return response.json(JSON.stringify(resMessage))
    }
    const salt = await bcrypt.genSalt()
    const cryptPassword = await bcrypt.hash(password, salt)
    const user = await User.create({ ...other, password: cryptPassword, role: 'trener' });
    resMessage['body'] = { success: true, fio: user.fio, phone: user.phone, id: user.id }

    return response.json(resMessage)
}
exports.postCreateClient = async function (request, response) {
    const { fio, phone } = request.body;
    const isValid = Object.values({ fio, phone }).every((el) => !!el)

    const resMessage = { success: true }
    console.log(isValid)
    if (!isValid) {
        return response.json(JSON.stringify(resMessage))
    }
    const user = await User.create({ fio, phone, role: 'client', trenerId: response.locals['User'].id });
    resMessage['body'] = { success: true, fio: user.fio, phone: user.phone, id: user.id }

    return response.json(resMessage)
}

exports.logout = function (request, response) {
    response.clearCookie('token');
    return response.redirect('/login')
}


exports.getTrener = async function (request, response) {
    const trener = await User.findOne({ where: { id: request.params['id'] }, raw: true })
    const rawCourses = await Course.findAll({ where: { UserId: trener.id }, raw: true })
    const courses = await Promise.all(rawCourses.map(async (el1) => {
        const modules = await Module.findAll({ where: { CourseId: el1.id }, raw: true });
        await Promise.all(modules.map(async (el2) => {
            console.log(el2)

            const lessons = await Lesson.findAll({ where: { ModuleId: el2.id }, raw: true })
            el2['lessons'] = lessons;
            return el2;
        }))
        el1['modules'] = modules;
        return el1;
    }))
    const clients = await User.findAll({ where: { role: 'client', trenerId: trener.id } })
    console.log(clients)
    return response.render('trener.hbs', { trener, courses, clients })
}





exports.getFaqs = async function (request, response) {
    const faqs = await FAQ.findAll({ where: { UserId: response.locals['User'].id } })
    return response.render('faqs.hbs', { faqs })
}

exports.getPollings = async function (request, response) {
    const pollings = await Polling.findAll({ where: { UserId: response.locals['User'].id }, raw: true })
    await Promise.all(pollings.map(async (el) => {
        const answers = await Answer.findAll({ where: { PollingId: el.id }, raw: true });
        el['answers'] = answers;
        console.log(el)
        return el;
    }))
    console.log(pollings)
    return response.render('pollings.hbs', { pollings })
}


exports.getCourses = async function (request, response) {
    const courses = await Course.findAll({ where: { UserId: response.locals['User'].id }, raw: true })
    return response.render('courses.hbs', { courses })
}


exports.createCourse = async function (request, response) {
    console.log(request.body)
    const isValid = Object.values(request.body).every(el => !!el)
    if (!isValid) {
        return request.json({ success: false })
    }
    const { courseTitle, courseDescription, modules } = request.body;
    const trenerId = response.locals['User'].id
    const course = await Course.create({ title: courseTitle, description: courseDescription, UserId: trenerId });
    await Promise.all(modules.map(async (el) => {
        const modulel = await Module.create({ title: el.title, description: el.description, CourseId: course.id })
        Promise.all(el.lessons.map(async (el2) => {
            Lesson.create({ title: el2.title, content: el2.content, ModuleId: modulel.id })
        }))
    }))
    const shortDescription = courseDescription.length > 135 ? courseDescription.slice(0, 135) + '...' : courseDescription;

    return response.json({ title: courseTitle, id: course.id, shortDescription, success: true })
}


exports.getCourse = async function (request, response) {
    const course = await Course.findOne({ where: { id: request.params['id'] }, raw: true });
    const modules = [...await Module.findAll({ where: { CourseId: course.id }, raw: true })]
    await Promise.all(modules.map(async (el) => {
        const lessons = await Lesson.findAll({ where: { ModuleId: el.id } })
        el['lessons'] = lessons;
        return el;
    }))

    return response.render('course.hbs', { course, modules })
}

exports.createLesson = async function (request, response) {
    const { title, content } = request.body;
    const isValid = [title, content].every(el => !!el);
    if (!isValid) {
        return response.json({ success: false })
    }
    const course = await Course.findOne({ where: { id: request.params['id'] } })
    const lesson = await Lesson.create({ title, content, CourseId: course.id })
    console.log(request.body)
    return response.json({ title: lesson.title, content: lesson.content, id: lesson.id, success: true })
}

exports.updateLesson = async function (request, response) {
    const { content } = request.body;
    const isValid = !!content
    if (!isValid) {
        return response.json({ success: false })
    }
    await Lesson.update({ content }, { where: { id: request.params['lessonId'] } })
    return response.json({ success: true })
}
exports.deleteLesson = async function (request, response) {
    console.log('im here serv')
    await Lesson.destroy({ where: { id: request.params['lessonId'] } })
    return response.json({ success: true })
}


exports.addModule = async function (request, response) {
    const { title, description } = request.body;
    const isValid = [title, description].every(el => !!el);
    if (!isValid) {
        return response.json({ success: false })
    }
    const course = await Course.findOne({ where: { id: request.params['id'] } })
    const modulel = await Module.create({ title, description, CourseId: course.id })
    return response.json({ title: modulel.title, description: modulel.description, id: modulel.id, success: true })
}

exports.addLesson = async function (request, response) {
    const { title, content } = request.body;
    const isValid = [title, content].every(el => !!el);
    if (!isValid) {
        return response.json({ success: false })
    }
    const modulel = await Module.findOne({ where: { id: request.params['moduleId'] } })
    const lesson = await Lesson.create({ title, content, ModuleId: modulel.id })
    return response.json({ title: modulel.title, content: modulel.content, id: lesson.id, success: true })
}


exports.createFAQ = async function (request, response) {
    const { question, answer } = request.body;
    const isValid = [question, answer].every(el => !!el);
    if (!isValid) {
        return { success: false }
    }
    const faq = FAQ.create({ question, answer, UserId: response.locals['User'].id })
    return response.json({ success: true, question, answer, faqId: faq.id })
}

exports.deleteFAQ = async function (request, response) {
    const faqId = request.params['id'];
    await FAQ.destroy({ where: { id: faqId } })
    return response.json({ success: true })
}

exports.createPolling = async function (request, response) {
    console.log(request.body)

    const { question, answers } = request.body;
    const isValid = [question, ...answers].every(el => !!el);
    if (!isValid) {
        return { success: false }
    }
    const polling = await Polling.create({ question, UserId: response.locals['User'].id })
    console.log(polling.id)
    await Promise.all(answers.map(el => Answer.create({ data: el, PollingId: polling.id })))
    return response.json({ success: true, id: polling.id, question, answers })
}


exports.deletePolling = async function (request, response) {
    const pollingId = request.params['id'];
    await Polling.destroy({ where: { id: pollingId } })
    return response.json({ success: true })
}


exports.deleteCourse = async function (request, response) {
    const courseId = request.params['id'];
    await Course.destroy({ where: { id: courseId } })
    return response.json({ success: true })
}


exports.deleteClient = async function (request, response) {
    const clientId = request.params['id'];
    await User.destroy({ where: { id: clientId } })
    return response.json({ success: true })
}


exports.deleteTrener = async function (request, response) {
    const trenerId = request.params['id'];
    await User.destroy({ where: { id: trenerId } })
    return response.json({ success: true })
}

