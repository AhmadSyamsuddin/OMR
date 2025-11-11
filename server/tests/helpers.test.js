// Load environment variables before importing helpers
require('./setup.test.js');

// Jangan menggunakan mock untuk jwt dan bcrypt, test implementasi aslinya
const { signToken, verifyToken } = require('../helpers/jwt');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateGeminiContent } = require('../helpers/geminiai');

// Hanya mock Gemini API
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockResolvedValue({
          text: 'mocked response'
        })
      }
    }))
  };
});

describe('JWT Helper Functions', () => {
  test('signToken should create a valid JWT token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = signToken(payload);

    // Verifikasi token itu string dan bisa di-decode
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20); // Token harus punya panjang tertentu

    // Verifikasi token valid
    const decoded = verifyToken(token);
    expect(decoded).toHaveProperty('id', 1);
    expect(decoded).toHaveProperty('email', 'test@example.com');
  });

  test('signToken should create different tokens for different payloads', () => {
    const payload1 = { id: 1, email: 'user1@test.com' };
    const payload2 = { id: 2, email: 'user2@test.com' };

    const token1 = signToken(payload1);
    const token2 = signToken(payload2);

    expect(token1).not.toBe(token2);

    const decoded1 = verifyToken(token1);
    const decoded2 = verifyToken(token2);

    expect(decoded1.id).toBe(1);
    expect(decoded2.id).toBe(2);
  });

  test('verifyToken should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow();
  });

  test('verifyToken should throw error for empty token', () => {
    expect(() => {
      verifyToken('');
    }).toThrow();
  });

  test('verifyToken should throw error for malformed token', () => {
    expect(() => {
      verifyToken('malformed.token.here');
    }).toThrow();
  });
});

describe('Bcrypt Helper Functions', () => {
  test('hashPassword should create different hash for same input', () => {
    const password = 'secret123';
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);

    expect(hash1).not.toBe(hash2); // Harus berbeda karena salt random
    expect(hash1).not.toBe(password); // Hash tidak boleh sama dengan plaintext
  });

  test('hashPassword should create hash for different passwords', () => {
    const password1 = 'secret123';
    const password2 = 'different456';

    const hash1 = hashPassword(password1);
    const hash2 = hashPassword(password2);

    expect(hash1).not.toBe(hash2);
    expect(hash1.length).toBeGreaterThan(20);
    expect(hash2.length).toBeGreaterThan(20);
  });

  test('comparePassword should return true for matching password', () => {
    const password = 'secret123';
    const hash = hashPassword(password);

    const result = comparePassword(password, hash);
    expect(result).toBe(true);
  });

  test('comparePassword should return false for non-matching password', () => {
    const password = 'secret123';
    const wrongPassword = 'wrong123';
    const hash = hashPassword(password);

    const result = comparePassword(wrongPassword, hash);
    expect(result).toBe(false);
  });

  test('comparePassword should return false for empty password', () => {
    const password = 'secret123';
    const hash = hashPassword(password);

    const result = comparePassword('', hash);
    expect(result).toBe(false);
  });

  test('hashPassword should work with special characters', () => {
    const password = 'p@ssw0rd!#$%';
    const hash = hashPassword(password);

    expect(hash).not.toBe(password);
    expect(comparePassword(password, hash)).toBe(true);
    expect(comparePassword('wrong', hash)).toBe(false);
  });
});

describe('Gemini Helper Function', () => {
  test('generateGeminiContent should call API and return response text', async () => {
    const prompt = 'Test prompt';
    const response = await generateGeminiContent(prompt);

    expect(response).toBe('mocked response');
  });

  test('generateGeminiContent should work with different prompts', async () => {
    const prompt1 = 'Create a workout plan';
    const prompt2 = 'Generate nutrition advice';

    const response1 = await generateGeminiContent(prompt1);
    const response2 = await generateGeminiContent(prompt2);

    expect(response1).toBe('mocked response');
    expect(response2).toBe('mocked response');
  });

  // Testing error handling
  test('generateGeminiContent should handle errors', async () => {
    // Override mock untuk simulasi error
    const { GoogleGenAI } = require('@google/genai');
    const mockAi = GoogleGenAI.mock.results[0].value;
    mockAi.models.generateContent.mockRejectedValueOnce(new Error('API error'));

    await expect(generateGeminiContent('prompt')).rejects.toThrow('API error');
  });

  test('generateGeminiContent should handle network errors', async () => {
    const { GoogleGenAI } = require('@google/genai');
    const mockAi = GoogleGenAI.mock.results[0].value;
    mockAi.models.generateContent.mockRejectedValueOnce(new Error('Network error'));

    await expect(generateGeminiContent('test')).rejects.toThrow('Network error');
  });
});