const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));
const { WorkoutClass, User_WorkoutClass } = require('../models');

// Mock middleware authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = require('../app');

describe('Workout Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /workout-classes', () => {
    test('should return all workout classes', async () => {
      const mockClasses = [
        { id: 1, title: 'Yoga Class', quota: 20, currentQuota: 5 },
        { id: 2, title: 'Pilates', quota: 15, currentQuota: 10 }
      ];
      WorkoutClass.findAll.mockResolvedValueOnce(mockClasses);

      const res = await request(app).get('/workout-classes');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('classes');
      expect(res.body.classes).toHaveLength(2);
      expect(WorkoutClass.findAll).toHaveBeenCalled();
    });

    test('should handle error when fetching workout classes fails', async () => {
      WorkoutClass.findAll.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/workout-classes');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /workout-classes-user', () => {
    test('should return classes for authenticated user', async () => {
      const mockUserClasses = [
        { 
          id: 1, 
          UserId: 1, 
          WorkoutClassId: 1,
          WorkoutClass: { id: 1, title: 'Yoga Class' }
        }
      ];
      User_WorkoutClass.findAll.mockResolvedValueOnce(mockUserClasses);

      const res = await request(app).get('/workout-classes-user');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('classes');
      expect(User_WorkoutClass.findAll).toHaveBeenCalledWith({
        where: { UserId: 1 },
        include: [WorkoutClass]
      });
    });

    test('should handle error when fetching user classes fails', async () => {
      User_WorkoutClass.findAll.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/workout-classes-user');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /workout-classes/:classId', () => {
    test('should join a workout class successfully', async () => {
      const mockClass = {
        id: 1,
        title: 'Yoga Class',
        quota: 20,
        currentQuota: 5,
        increment: jest.fn().mockResolvedValueOnce({})
      };
      WorkoutClass.findByPk.mockResolvedValueOnce(mockClass);
      User_WorkoutClass.findOne.mockResolvedValueOnce(null);
      User_WorkoutClass.create.mockResolvedValueOnce({
        id: 1,
        UserId: 1,
        WorkoutClassId: '1'
      });

      const res = await request(app).post('/workout-classes/1');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userWorkoutClass');
      expect(mockClass.increment).toHaveBeenCalledWith('currentQuota');
      expect(User_WorkoutClass.create).toHaveBeenCalledWith({
        UserId: 1,
        WorkoutClassId: '1'
      });
    });

    test('should reject if class not found', async () => {
      WorkoutClass.findByPk.mockResolvedValueOnce(null);

      const res = await request(app).post('/workout-classes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Workout class not found');
    });

    test('should reject if class is full', async () => {
      const mockFullClass = {
        id: 1,
        quota: 10,
        currentQuota: 10
      };
      WorkoutClass.findByPk.mockResolvedValueOnce(mockFullClass);

      const res = await request(app).post('/workout-classes/1');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Workout class is full');
    });

    test('should reject if user already joined', async () => {
      const mockClass = {
        id: 1,
        quota: 10,
        currentQuota: 5
      };
      WorkoutClass.findByPk.mockResolvedValueOnce(mockClass);
      User_WorkoutClass.findOne.mockResolvedValueOnce({ id: 1 });

      const res = await request(app).post('/workout-classes/1');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already joined this class');
    });
  });

  describe('DELETE /workout-classes/:classId', () => {
    test('should leave a workout class successfully', async () => {
      const mockClass = {
        id: 1,
        decrement: jest.fn().mockResolvedValueOnce({})
      };
      WorkoutClass.findByPk.mockResolvedValueOnce(mockClass);
      User_WorkoutClass.destroy.mockResolvedValueOnce(1);

      const res = await request(app).delete('/workout-classes/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(mockClass.decrement).toHaveBeenCalledWith('currentQuota');
      expect(User_WorkoutClass.destroy).toHaveBeenCalledWith({
        where: { UserId: 1, WorkoutClassId: '1' }
      });
    });

    test('should reject if class not found', async () => {
      WorkoutClass.findByPk.mockResolvedValueOnce(null);

      const res = await request(app).delete('/workout-classes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Workout class not found');
    });
  });
});