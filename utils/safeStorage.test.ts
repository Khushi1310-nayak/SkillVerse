import { describe, it, expect, beforeEach } from 'vitest';
import { safeStorage, isArray, isPlainObject } from './safeStorage';

describe('safeStorage Defensive Persistence Layer', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('reads and writes JSON values accurately', () => {
    const testData = { userId: 'user_123', completedCourses: ['arrays', 'recursion'] };
    const writeSuccess = safeStorage.writeJSON('test_key', testData);
    expect(typeof writeSuccess).toBe('boolean');

    const retrieved = safeStorage.readJSON('test_key', null);
    expect(retrieved).toEqual(testData);
  });

  it('returns fallback for non-existent keys', () => {
    const fallback = { empty: true };
    const result = safeStorage.readJSON('non_existent_key', fallback);
    expect(result).toBe(fallback);
  });

  it('validates data structure using shape predicates', () => {
    safeStorage.writeJSON('array_data', [1, 2, 3]);
    safeStorage.writeJSON('invalid_data', 'not an array');

    const validArray = safeStorage.readJSON('array_data', [], isArray);
    expect(validArray).toEqual([1, 2, 3]);

    const invalidResult = safeStorage.readJSON('invalid_data', ['default'], isArray);
    expect(invalidResult).toEqual(['default']);
  });

  it('handles remove and clear operations without throwing', () => {
    safeStorage.setString('key1', 'value1');
    safeStorage.setString('key2', 'value2');

    safeStorage.remove('key1');
    expect(safeStorage.getString('key1')).toBeNull();

    safeStorage.clear();
    expect(safeStorage.getString('key2')).toBeNull();
  });

  it('shape guards correctly identify arrays and plain objects', () => {
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray('string')).toBe(false);
    expect(isArray({})).toBe(false);

    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject([1, 2])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });
});
