const request = require('supertest');

// Mock models
jest.mock('../models', () => require('./__mocks__/models'));
const { User } = require('../models');

// Mock jwt dan bcrypt
jest.mock('../helpers/jwt', () => ({
  signToken: jest.fn(() => 'fake-token')
}));

jest.mock('../helpers/bcrypt', () => ({
  comparePassword: jest.fn()
}));

// Mock google-auth-library
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({ email: 'test@google.com', name: 'Test User' })
      })
    }))
  };
});

// Mock middleware authentication
jest.mock('../middlewares/authentication', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = require('../app');
const { comparePassword } = require('../helpers/bcrypt');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    test('should register a user successfully', async () => {
      User.create.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com'
      });

      const res = await request(app)
        .post('/register')
        .send({
          fullName: 'Test User',
          email: 'user@test.com',
          password: 'password'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('email', 'user@test.com');
      expect(User.create).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'user@test.com',
        password: 'password'
      });
    });

    test('should handle registration error', async () => {
      User.create.mockRejectedValueOnce(new Error('Registration failed'));

      const res = await request(app)
        .post('/register')
        .send({
          fullName: 'Test User',
          email: 'user@test.com',
          password: 'password'
        });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /login', () => {
    test('should login successfully with correct credentials', async () => {
      User.findOne.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com',
        password: 'hashedPassword'
      });
      comparePassword.mockReturnValueOnce(true);

      const res = await request(app)
        .post('/login')
        .send({
          email: 'user@test.com',
          password: 'password'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token', 'fake-token');
    });

    test('should reject login with invalid credentials', async () => {
      User.findOne.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com',
        password: 'hashedPassword'
      });
      comparePassword.mockReturnValueOnce(false);

      const res = await request(app)
        .post('/login')
        .send({
          email: 'user@test.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });

    test('should reject login when user not found', async () => {
      User.findOne.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password'
        });

      expect(res.status).toBe(401);
    });

    test('should reject login without email', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          password: 'password'
        });

      expect(res.status).toBe(400);
    });

    test('should reject login without password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'user@test.com'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /google-login', () => {
    test('should login with Google when user exists', async () => {
      User.findOne.mockResolvedValueOnce({
        id: 1,
        email: 'test@google.com'
      });

      const res = await request(app)
        .post('/google-login')
        .send({
          googleToken: 'valid-google-token'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token', 'fake-token');
    });

    test('should create new user and login when user does not exist', async () => {
      User.findOne.mockResolvedValueOnce(null);
      User.create.mockResolvedValueOnce({
        id: 2,
        email: 'test@google.com'
      });

      const res = await request(app)
        .post('/google-login')
        .send({
          googleToken: 'valid-google-token'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token', 'fake-token');
      expect(User.create).toHaveBeenCalled();
    });
  });

  describe('GET /user', () => {
    test('should return authenticated user data', async () => {
      User.findByPk.mockResolvedValueOnce({
        id: 1,
        fullName: 'Test User',
        email: 'user@test.com',
        isMembership: false
      });

      const res = await request(app).get('/user');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('fullName', 'Test User');
    });

    test('should handle error when user not found', async () => {
      User.findByPk.mockResolvedValueOnce(null);

      const res = await request(app).get('/user');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /memberships', () => {
    test('should update membership status', async () => {
      const updateMock = jest.fn().mockResolvedValueOnce({});
      User.findByPk.mockResolvedValueOnce({
        id: 1,
        email: 'user@test.com',
        isMembership: false,
        update: updateMock
      });

      const res = await request(app).patch('/memberships');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Membership status updated successfully');
      expect(updateMock).toHaveBeenCalledWith({ isMembership: true });
    });

    test('should handle error when user not found', async () => {
      User.findByPk.mockResolvedValueOnce(null);

      const res = await request(app).patch('/memberships');

      expect(res.status).toBe(404);
    });
  });
});