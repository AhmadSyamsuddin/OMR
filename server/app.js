require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const UserController = require('./controllers/UserController');
const ExerciseController = require('./controllers/ExerciseController');
const authentication = require('./middlewares/authentication');
const app = express();
const WorkoutClassController = require('./controllers/WorkoutController');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// User
app.post('/register', UserController.register);
app.post('/login', UserController.login);

app.use(authentication)
// Exercise
app.get('/exercises', ExerciseController.getAllExercises);

// WorkoutClass
app.get('/workout-classes', WorkoutClassController.getAllWorkoutClasses);
app.post('/workout-classes/:classId', WorkoutClassController.createWorkoutClass);
app.delete('/workout-classes/:classId', WorkoutClassController.deleteWorkoutClass);

// Membership
app.patch('/memberships', UserController.updateMembership);
app.use(errorHandler)

module.exports = app;