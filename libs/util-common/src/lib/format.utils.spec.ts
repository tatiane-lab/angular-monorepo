import { truncate } from './format.utils';
import { addDays, toIsoDate } from './date.utils';

describe('util-common', () => {
  it('truncates long text', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
    expect(truncate('abc', 5)).toBe('abc');
  });
  it('adds days immutably', () => {
    const d = new Date('2026-01-01T12:00:00Z');
    expect(toIsoDate(addDays(d, 2))).toBe('2026-01-03');
    expect(toIsoDate(d)).toBe('2026-01-01');
  });
});
