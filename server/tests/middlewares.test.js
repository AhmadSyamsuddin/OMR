const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authentication = require('../middlewares/authentication');
const errorHandler = require('../middlewares/errorHandler');

// Mock models
jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should pass if token is valid and user exists', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockImplementationOnce(() => ({ id: 1 }));
    User.findByPk.mockResolvedValueOnce({
      id: 1,
      fullName: 'Test User',
      isMembership: false
    });

    await authentication(req, res, next);

    expect(req.user).toHaveProperty('id', 1);
    expect(req.user).toHaveProperty('name', 'Test User');
    expect(req.user).toHaveProperty('isMembership', false);
    expect(next).toHaveBeenCalled();
  });

  test('should throw error if no authorization header', async () => {
    await expect(authentication(req, res, next)).rejects.toEqual(
      expect.objectContaining({
        name: 'Unauthorized',
        message: 'Invalid Token 1'
      })
    );
  });

  test('should call next with error if token format is invalid', async () => {
    req.headers.authorization = 'InvalidFormat';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('should call next with error if token verification fails', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('should call next with error if user not found', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockImplementationOnce(() => ({ id: 999 }));
    User.findByPk.mockResolvedValueOnce(null);

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Unauthorized',
      message: 'Invalid Token 2'
    }));
  });
});

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    // Mock console.error to suppress logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('should handle Bad Request error', () => {
    const error = {
      name: 'Bad Request',
      message: 'Invalid input'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
  });

  test('should handle SequelizeValidationError', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Test validation error' }]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test validation error',
      errors: error.errors
    });
  });

  test('should handle SequelizeUniqueConstraintError', () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Email must be unique' }]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email must be unique',
      errors: error.errors
    });
  });

  test('should handle Unauthorized error', () => {
    const error = {
      name: 'Unauthorized',
      message: 'Unauthorized access'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
  });

  test('should handle JsonWebTokenError', () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'jwt malformed'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
  });

  test('should handle TokenExpiredError', () => {
    const error = {
      name: 'TokenExpiredError',
      message: 'jwt expired'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Session expired, please login again' });
  });

  test('should handle Not Found error with space', () => {
    const error = {
      name: 'Not Found',
      message: 'Resource not found'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
  });

  test('should handle NotFound error without space', () => {
    const error = {
      name: 'NotFound',
      message: 'Resource not found'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
  });

  test('should default to status 500 for other errors', () => {
    const error = new Error('Server error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});