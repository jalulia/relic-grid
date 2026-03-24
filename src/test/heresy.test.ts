import { describe, it, expect } from 'vitest';
import { generateHeresyReport, generateSystemMessage, SECTS } from '../game/heresy';

describe('generateHeresyReport', () => {
  it('returns a valid heresy report', () => {
    const report = generateHeresyReport(1);
    expect(report.id).toBe(1);
    expect(report.sect).toBeDefined();
    expect(report.message).toBeTruthy();
    expect(report.timestamp).toBeGreaterThan(0);
  });

  it('returns a sect from the SECTS array', () => {
    const report = generateHeresyReport(1);
    expect(SECTS).toContainEqual(report.sect);
  });

  it('message contains sect name', () => {
    // Run multiple times since sect is random
    let found = false;
    for (let i = 0; i < 20; i++) {
      const report = generateHeresyReport(i);
      if (report.message.includes(report.sect.name)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

describe('generateSystemMessage', () => {
  it('returns a valid system message', () => {
    const msg = generateSystemMessage(1);
    expect(msg.id).toBe(1);
    expect(msg.message).toBeTruthy();
    expect(msg.timestamp).toBeGreaterThan(0);
  });

  it('message starts with >', () => {
    const msg = generateSystemMessage(1);
    expect(msg.message.startsWith('>')).toBe(true);
  });

  it('sect id is "system"', () => {
    const msg = generateSystemMessage(1);
    expect(msg.sect.id).toBe('system');
  });
});

describe('SECTS', () => {
  it('has 5 sects', () => {
    expect(SECTS).toHaveLength(5);
  });

  it('each sect has required fields', () => {
    SECTS.forEach(sect => {
      expect(sect.id).toBeTruthy();
      expect(sect.name).toBeTruthy();
      expect(sect.colorClass).toBeTruthy();
      expect(sect.dotClass).toBeTruthy();
    });
  });
});
