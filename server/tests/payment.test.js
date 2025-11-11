const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));
const { User } = require('../models');

// Mock middleware authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

// Mock midtrans-client
jest.mock('midtrans-client', () => {
  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: jest.fn().mockResolvedValue({
        token: 'test-token',
        redirect_url: 'http://test-redirect-url.com'
      }),
      transaction: {
        notification: jest.fn().mockResolvedValue({
          order_id: 'MEMBERSHIP-1-123456',
          transaction_status: 'capture',
          fraud_status: 'accept'
        }),
        status: jest.fn().mockResolvedValue({
          order_id: 'MEMBERSHIP-1-123456',
          transaction_status: 'settlement'
        })
      }
    }))
  };
});

const app = require('../app');
const midtransClient = require('midtrans-client');

describe('Payment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /payment/generate-token', () => {
    test('should generate payment token successfully', async () => {
      User.findByPk.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com',
        fullName: 'Test User'
      });

      const res = await request(app).post('/payment/generate-token');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', 'test-token');
      expect(res.body).toHaveProperty('redirect_url', 'http://test-redirect-url.com');
    });

    test('should handle error when user not found', async () => {
      User.findByPk.mockResolvedValueOnce(null);

      const res = await request(app).post('/payment/generate-token');

      expect(res.status).toBe(404);
    });

    test('should handle midtrans error', async () => {
      User.findByPk.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com',
        fullName: 'Test User'
      });

      // Mock createTransaction to throw error
      midtransClient.Snap.mockImplementationOnce(() => ({
        createTransaction: jest.fn().mockRejectedValue(new Error('Midtrans error'))
      }));

      const res = await request(app).post('/payment/generate-token');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /payment/notification', () => {
    beforeEach(() => {
      // Mock console.log to suppress logs
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    test('should process capture with accept status', async () => {
      const snap = midtransClient.Snap();
      snap.transaction.notification.mockResolvedValueOnce({
        order_id: 'MEMBERSHIP-1-123456',
        transaction_status: 'capture',
        fraud_status: 'accept'
      });
      User.update.mockResolvedValueOnce([1]);

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'capture', fraud_status: 'accept' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
      expect(User.update).toHaveBeenCalledWith(
        { isMembership: true },
        { where: { id: '1' }}
      );
    });

    test('should process settlement status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-2-123456',
            transaction_status: 'settlement',
            fraud_status: 'accept'
          })
        }
      }));
      User.update.mockResolvedValueOnce([1]);

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'settlement' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
      expect(User.update).toHaveBeenCalledWith(
        { isMembership: true },
        { where: { id: '2' }}
      );
    });

    test('should handle cancel status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-3-123456',
            transaction_status: 'cancel',
            fraud_status: 'accept'
          })
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'cancel' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
    });

    test('should handle deny status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-4-123456',
            transaction_status: 'deny',
            fraud_status: 'reject'
          })
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'deny' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
    });

    test('should handle expire status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-5-123456',
            transaction_status: 'expire',
            fraud_status: 'accept'
          })
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'expire' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
    });

    test('should handle pending status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-6-123456',
            transaction_status: 'pending',
            fraud_status: 'accept'
          })
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'pending' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
    });

    test('should handle capture with non-accept fraud status', async () => {
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockResolvedValue({
            order_id: 'MEMBERSHIP-7-123456',
            transaction_status: 'capture',
            fraud_status: 'challenge'
          })
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({ transaction_status: 'capture', fraud_status: 'challenge' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Notification processed');
    });

    test('should handle errors in notification processing', async () => {
      // Override the mock for this test
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          notification: jest.fn().mockRejectedValue(new Error('Notification error'))
        }
      }));

      const res = await request(app)
        .post('/payment/notification')
        .send({});

      expect(res.status).toBe(500);
    });
  });

  describe('GET /payment/status/:orderId', () => {
    test('should return payment status successfully', async () => {
      const res = await request(app).get('/payment/status/MEMBERSHIP-1-123456');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('order_id', 'MEMBERSHIP-1-123456');
      expect(res.body).toHaveProperty('transaction_status', 'settlement');
    });

    test('should handle error in status check', async () => {
      // Override the mock for this test
      midtransClient.Snap.mockImplementationOnce(() => ({
        transaction: {
          status: jest.fn().mockRejectedValue(new Error('Status error'))
        }
      }));

      const res = await request(app).get('/payment/status/invalid-order');

      expect(res.status).toBe(500);
    });
  });
});