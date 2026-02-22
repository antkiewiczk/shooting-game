import { calculateScore } from '@shared/core';

describe('Scoring', () => {
  describe('calculateScore', () => {
    it('should return 0 for empty sequence', () => {
      const result = calculateScore([]);
      expect(result).toEqual({ score: 0, hits: 0, misses: 0 });
    });

    it('should calculate hits correctly', () => {
      const result = calculateScore([
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: false, distance: 5 },
      ]);
      expect(result.hits).toBe(2);
      expect(result.misses).toBe(1);
      expect(result.score).toBe(20); // 2 hits * 10
    });

    it('should add distance bonus for hits > 10', () => {
      const result = calculateScore([
        { hit: true, distance: 15 },
      ]);
      expect(result.score).toBe(15); // 10 (hit) + 5 (distance bonus)
    });

    it('should not add distance bonus for hits <= 10', () => {
      const result = calculateScore([
        { hit: true, distance: 10 },
      ]);
      expect(result.score).toBe(10); // 10 (hit) only
    });

    it('should add combo bonus every 3 consecutive hits', () => {
      const result = calculateScore([
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ]);
      expect(result.score).toBe(35); // 3*10 + 5 (combo)
    });

    it('should not add combo after miss interrupts streak', () => {
      const result = calculateScore([
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: false, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ]);
      expect(result.score).toBe(45); // 4*10 + 5 (combo for last 3)
    });

    it('should handle all miss sequence', () => {
      const result = calculateScore([
        { hit: false, distance: 5 },
        { hit: false, distance: 5 },
        { hit: false, distance: 5 },
      ]);
      expect(result.score).toBe(0);
      expect(result.hits).toBe(0);
      expect(result.misses).toBe(3);
    });
  });
});
