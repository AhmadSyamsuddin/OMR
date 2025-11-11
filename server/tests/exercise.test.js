const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));
const { Exercise } = require('../models');

// Mock middleware authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = require('../app');

describe('Exercise Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /exercises', () => {
    test('should return all exercises', async () => {
      const mockExercises = [
        { id: 1, name: 'Push-up', image: 'pushup.jpg' },
        { id: 2, name: 'Squat', image: 'squat.jpg' }
      ];
      Exercise.findAll.mockResolvedValueOnce(mockExercises);

      const res = await request(app).get('/exercises');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('exercises');
      expect(res.body.exercises).toHaveLength(2);
      expect(Exercise.findAll).toHaveBeenCalled();
    });

    test('should handle error when fetching exercises fails', async () => {
      Exercise.findAll.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/exercises');

      expect(res.status).toBe(500);
    });
  });
});