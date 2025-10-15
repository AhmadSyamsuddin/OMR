const {WorkoutClass, User_WorkoutClass} = require('../models');

class WorkoutClassController {
  static async getAllWorkoutClasses(req, res, next) {
    try {
        const classes = await WorkoutClass.findAll();
      res.status(200).json({ classes });
    } catch (error) {
      next(error);
    }
  }

  static async createWorkoutClass(req, res, next) {
    try {
      const {id} = req.user;
      const {classId} = req.params;

      const workoutClass = await WorkoutClass.findByPk(classId);
      if (!workoutClass) {
        throw { name: 'NotFound', message: 'Workout class not found' };
      }

      if(workoutClass.currentQuota >= workoutClass.quota) {
        throw { name: 'Bad Request', message: 'Workout class is full' };
      }

      const currentUserWorkoutClass = await User_WorkoutClass.findOne({
        where: {
          UserId: id,
          WorkoutClassId: classId
        }
      });

      if(currentUserWorkoutClass) {
        throw { name: 'Bad Request', message: 'User already joined this class' };
      }

      const userWorkoutClass = await User_WorkoutClass.create({
        UserId: id,
        WorkoutClassId: classId
      });

        await workoutClass.increment('currentQuota');
      res.status(201).json({ userWorkoutClass });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWorkoutClass(req, res, next) {
    try {
        const {id} = req.user;
      const { classId } = req.params;
      const workoutClass = await WorkoutClass.findByPk(classId);
      if (!workoutClass) {
        throw { name: 'NotFound', message: 'Workout class not found' };
      }

      await workoutClass.decrement('currentQuota');

      await User_WorkoutClass.destroy({
        where: {
          UserId: id,
          WorkoutClassId: classId
        }
      });
      res.status(200).json({ message: `Workout class with id ${classId} deleted for User with id ${id}` });
    } catch (error) {
      next(error);
    }
  }

  static async getAllWorkoutClassesbyUserId(req, res, next) {
    try {
      const { id } = req.user;
      const userClasses = await User_WorkoutClass.findAll({
        where: { UserId: id },
        include: [WorkoutClass]
      });
      res.status(200).json({ classes: userClasses });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = WorkoutClassController;