const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));
const { User, WorkoutClass, User_WorkoutClass } = require('../models');

// Mock middleware untuk test yang perlu authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

// Mock Gemini
jest.mock('../helpers/geminiai', () => ({
  generateGeminiContent: jest.fn()
}));

// Mock midtrans
jest.mock('midtrans-client', () => {
  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: jest.fn().mockResolvedValue({
        token: 'test-token',
        redirect_url: 'http://test-redirect-url.com'
      }),
      transaction: {
        notification: jest.fn().mockImplementation((payload) => {
          // Pengujian berbagai kondisi fraud_status dan transaction_status
          if (payload && payload.fraud_status === 'challenge') {
            return Promise.resolve({
              order_id: 'MEMBERSHIP-1-123',
              transaction_status: 'pending',
              fraud_status: 'challenge'
            });
          }
          return Promise.resolve({
            order_id: 'MEMBERSHIP-1-123',
            transaction_status: 'capture',
            fraud_status: 'accept'
          });
        }),
        status: jest.fn().mockResolvedValue({
          order_id: 'ORDER-123',
          transaction_status: 'settlement'
        })
      }
    }))
  };
});

const app = require('../app');
const { generateGeminiContent } = require('../helpers/geminiai');

describe('Additional Branch Tests', () => {
  
  // Extra tests for WorkoutController
  describe('WorkoutController Branches', () => {
    test('POST /workout-classes/:classId - should return 404 when class not found', async () => {
      WorkoutClass.findByPk.mockResolvedValueOnce(null);
      
      const res = await request(app).post('/workout-classes/999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Workout class not found');
    });
    
    test('POST /workout-classes/:classId - should return 400 when class is full', async () => {
      WorkoutClass.findByPk.mockResolvedValueOnce({
        id: 1,
        currentQuota: 10,
        quota: 10
      });
      
      const res = await request(app).post('/workout-classes/1');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Workout class is full');
    });
    
    test('POST /workout-classes/:classId - should return 400 when user already joined', async () => {
      WorkoutClass.findByPk.mockResolvedValueOnce({
        id: 1,
        currentQuota: 5,
        quota: 10
      });
      
      User_WorkoutClass.findOne.mockResolvedValueOnce({ id: 1 });
      
      const res = await request(app).post('/workout-classes/1');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already joined this class');
    });
  });
  
  // Extra tests for GeminiController
  describe('GeminiController Branches', () => {
    test('POST /generate-workout-plan - should return 400 when no programName provided', async () => {
      const res = await request(app)
        .post('/generate-workout-plan')
        .send({});
        
      expect(res.status).toBe(400);
    });
    
    test('POST /generate-workout-plan - should handle invalid JSON response', async () => {
      generateGeminiContent.mockResolvedValueOnce('Not a valid JSON');
      
      const res = await request(app)
        .post('/generate-workout-plan')
        .send({ programName: 'test' });
        
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  // Test PaymentController notification dengan kondisi berbeda
  describe('Payment Notification Branches', () => {
    test('should handle different transaction statuses', async () => {
      const Snap = require('midtrans-client').Snap;
      Snap().transaction.notification.mockResolvedValueOnce({
        order_id: 'MEMBERSHIP-1-123',
        transaction_status: 'deny',
        fraud_status: 'reject'
      });
      
      const res = await request(app)
        .post('/payment/notification')
        .send({ fraud_status: 'reject' });
        
      expect(res.status).toBe(200);
    });
  });
});