const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));

// Mock middleware authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

// Mock geminiai helper
jest.mock('../helpers/geminiai', () => ({
  generateGeminiContent: jest.fn()
}));

const app = require('../app');
const { generateGeminiContent } = require('../helpers/geminiai');

describe('Gemini Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /generate-workout-plan', () => {
    const validJsonResponse = JSON.stringify([
      {
        day: 1,
        title: "Day 1: Upper Body Focus",
        exercises: [
          {
            name: "Push-ups",
            sets: "3",
            reps: "10-12",
            rest: "60 seconds",
            notes: "Focus on form"
          }
        ],
        cooldown: "5 minutes stretching",
        tips: "Stay hydrated"
      }
    ]);

    test('should generate workout plan successfully', async () => {
      generateGeminiContent.mockResolvedValueOnce(validJsonResponse);

      const res = await request(app)
        .post('/generate-workout-plan')
        .send({ programName: 'strength' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('programName', 'strength');
      expect(res.body).toHaveProperty('workoutPlan');
      expect(Array.isArray(res.body.workoutPlan)).toBe(true);
      expect(res.body.workoutPlan[0]).toHaveProperty('day', 1);
    });

    test('should handle validation error when program name is missing', async () => {
      const res = await request(app)
        .post('/generate-workout-plan')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Program name is required');
    });

    test('should handle JSON parsing error from Gemini response', async () => {
      generateGeminiContent.mockResolvedValueOnce('Invalid JSON response');

      const res = await request(app)
        .post('/generate-workout-plan')
        .send({ programName: 'strength' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Failed to generate proper workout plan format');
      expect(res.body).toHaveProperty('rawResponse', 'Invalid JSON response');
    });

    test('should handle API errors from Gemini', async () => {
      generateGeminiContent.mockRejectedValueOnce(new Error('API error'));

      const res = await request(app)
        .post('/generate-workout-plan')
        .send({ programName: 'strength' });

      expect(res.status).toBe(500);
    });
  });
});