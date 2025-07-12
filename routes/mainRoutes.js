const express = require('express');
const mainRouter = express.Router();
const mainControllers = require('../controllers/mainControllers.js')

mainRouter.get('/', mainControllers.getMain);
mainRouter.get('/login', mainControllers.getLogin);
mainRouter.post('/login', mainControllers.postLogin);

mainRouter.get('/logout', mainControllers.logout);
// mainRouter.get('/createLessons', mainControllers.getCreateLessons);
// mainRouter.get('/createFaq', mainControllers.getCreateFaq);
// mainRouter.get('/createPolling', mainControllers.getCreatePolling);

mainRouter.get('/courses', mainControllers.getCourses)
mainRouter.post('/createCourse', mainControllers.createCourse)
mainRouter.post('/deleteCourse/:id', mainControllers.deleteCourse)
mainRouter.get('/course/:id', mainControllers.getCourse)
mainRouter.post('/course/:id/addLesson', mainControllers.createLesson)

mainRouter.post('/course/:id/addModule', mainControllers.addModule)
mainRouter.post('/course/:id/module/:moduleId/addLesson', mainControllers.addLesson)
mainRouter.post('/course/:id/updateLesson/:lessonId', mainControllers.updateLesson)
mainRouter.post('/course/:id/deleteLesson/:lessonId', mainControllers.deleteLesson)




mainRouter.get('/clients', mainControllers.getClients)
mainRouter.get('/client/:id', mainControllers.getClient)
mainRouter.post('/createClient', mainControllers.postCreateClient);
mainRouter.post('/deleteClient/:id', mainControllers.deleteClient);


mainRouter.get('/faqs', mainControllers.getFaqs)
mainRouter.post('/createFAQ', mainControllers.createFAQ)
mainRouter.post('/deleteFAQ/:id', mainControllers.deleteFAQ)

mainRouter.get('/pollings', mainControllers.getPollings)
mainRouter.post('/createPolling', mainControllers.createPolling)
mainRouter.post('/deletePolling/:id', mainControllers.deletePolling)


mainRouter.get('/treners', mainControllers.getTreners);
mainRouter.get('/trener/:id', mainControllers.getTrener);
mainRouter.post('/createTrener', mainControllers.postCreateTrener);
mainRouter.post('/deleteTrener/:id', mainControllers.deleteTrener);

mainRouter.get('/tags', mainControllers.getTags)
mainRouter.post('/createTag', mainControllers.createTag)
mainRouter.post('/deleteTag/:id', mainControllers.deleteTag)

mainRouter.get('/workouts', mainControllers.getWorkouts)
mainRouter.post('/createWorkout', mainControllers.createWorkout)
mainRouter.post('/deleteWorkout/:id', mainControllers.deleteWorkout)


mainRouter.post('/getUnits', mainControllers.getUnits);

mainRouter.post('/assignWorkout', mainControllers.assignWorkout);

// mainRouter.get('/trener', mainControllers.postCreateTrener);


module.exports = mainRouter;