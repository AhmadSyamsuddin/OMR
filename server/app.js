require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const UserController = require('./controllers/UserController');
const ExerciseController = require('./controllers/ExerciseController');
const authentication = require('./middlewares/authentication');
const app = express();
const WorkoutClassController = require('./controllers/WorkoutController');
const PaymentController = require('./controllers/PaymentController');
const GeminiController = require('./controllers/GeminiController');
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
app.post('/google-login', UserController.googleLogin);

// Payment Notification (must be before authentication - called by Midtrans server)
app.post('/payment/notification', PaymentController.handleNotification);


app.use(authentication)
app.get('/user', UserController.getUser);
// Exercise
app.get('/exercises', ExerciseController.getAllExercises);

// WorkoutClass
app.get('/workout-classes', WorkoutClassController.getAllWorkoutClasses);
app.get('/workout-classes-user', WorkoutClassController.getAllWorkoutClassesbyUserId);
app.post('/workout-classes/:classId', WorkoutClassController.createWorkoutClass);
app.delete('/workout-classes/:classId', WorkoutClassController.deleteWorkoutClass);

// Membership
app.patch('/memberships', UserController.updateMembership);

// Payment - Midtrans
app.post('/payment/generate-token', PaymentController.generateToken);
app.get('/payment/status/:orderId', PaymentController.checkPaymentStatus);

// Gemini AI
app.post('/generate-workout-plan', GeminiController.generateWorkoutPlan);

app.use(errorHandler)

module.exports = app;