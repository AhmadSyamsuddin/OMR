const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const UserController = require('./controllers/UserController');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// User
app.post('/register', UserController.register);
app.post('/login', UserController.login);

// Exercise
// app.get('/exercises', ExerciseController.getAllExercises);

// WorkoutClass
// app.get('/workout-classes', WorkoutClassController.getAllWorkoutClasses);
// app.post('/workout-classes', WorkoutClassController.createWorkoutClass);
// app.delete('/workout-classes/:id', WorkoutClassController.deleteWorkoutClass);

// Membership
// app.put('/memberships', MembershipController.updateMembership);
app.use(errorHandler)

module.exports = app;