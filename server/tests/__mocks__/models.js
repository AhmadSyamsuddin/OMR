// Mock models untuk testing
const mockUser = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn()
};

const mockExercise = {
  findAll: jest.fn()
};

const mockWorkoutClass = {
  findAll: jest.fn(),
  findByPk: jest.fn()
};

const mockUserWorkoutClass = {
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn()
};

module.exports = {
  User: mockUser,
  Exercise: mockExercise,
  WorkoutClass: mockWorkoutClass,
  User_WorkoutClass: mockUserWorkoutClass,
  sequelize: {
    close: jest.fn(),
    sync: jest.fn()
  }
};