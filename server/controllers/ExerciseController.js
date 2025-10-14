const {Exercise} = require('../models');

class ExerciseController {
    static async getAllExercises(req, res, next) {
        try {
            const exercises = await Exercise.findAll();
            res.status(200).json({ exercises });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ExerciseController;