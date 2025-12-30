import { calculateScore, ShotEvent } from './score';

describe('calculateScore', () => {
  describe('hits and misses', () => {
    it('should return 0 for empty sequence', () => {
      const result = calculateScore([]);
      expect(result).toEqual({ score: 0, hits: 0, misses: 0 });
    });

    it('should score +10 for a single hit', () => {
      const events: ShotEvent[] = [{ hit: true, distance: 5 }];
      const result = calculateScore(events);
      expect(result).toEqual({ score: 10, hits: 1, misses: 0 });
    });

    it('should score 0 for a miss', () => {
      const events: ShotEvent[] = [{ hit: false, distance: 5 }];
      const result = calculateScore(events);
      expect(result).toEqual({ score: 0, hits: 0, misses: 1 });
    });

    it('should count multiple hits and misses correctly', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: false, distance: 3 },
        { hit: true, distance: 7 },
        { hit: false, distance: 2 },
      ];
      const result = calculateScore(events);
      expect(result.hits).toBe(2);
      expect(result.misses).toBe(2);
      expect(result.score).toBe(20); // 10 + 10, no bonuses
    });
  });

  describe('distance bonus', () => {
    it('should add +5 for hit with distance > 10', () => {
      const events: ShotEvent[] = [{ hit: true, distance: 15 }];
      const result = calculateScore(events);
      expect(result.score).toBe(15); // 10 + 5 distance bonus
    });

    it('should not add distance bonus for distance exactly 10', () => {
      const events: ShotEvent[] = [{ hit: true, distance: 10 }];
      const result = calculateScore(events);
      expect(result.score).toBe(10); // No bonus at exactly 10
    });

    it('should not add distance bonus for miss even with high distance', () => {
      const events: ShotEvent[] = [{ hit: false, distance: 20 }];
      const result = calculateScore(events);
      expect(result.score).toBe(0);
    });

    it('should add distance bonus for multiple long-distance hits', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 12 },
        { hit: true, distance: 15 },
      ];
      const result = calculateScore(events);
      // 2 hits * 10 = 20, 2 distance bonuses * 5 = 10, no combo (only 2 hits)
      expect(result.score).toBe(30);
    });
  });

  describe('combo bonus', () => {
    it('should add +5 combo for 3 consecutive hits', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ];
      const result = calculateScore(events);
      // 3 hits * 10 = 30 + 5 combo = 35
      expect(result.score).toBe(35);
    });

    it('should add +10 combo for 6 consecutive hits (two combos)', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ];
      const result = calculateScore(events);
      // 6 hits * 10 = 60 + 5 (at 3) + 5 (at 6) = 70
      expect(result.score).toBe(70);
    });

    it('should add only one combo for 7 consecutive hits', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ];
      const result = calculateScore(events);
      // 7 hits * 10 = 70 + 5 (at 3) + 5 (at 6) = 80
      expect(result.score).toBe(80);
    });

    it('should reset combo on miss', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: false, distance: 5 }, // Breaks combo
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 }, // New combo starts, this is 3rd consecutive
      ];
      const result = calculateScore(events);
      // 5 hits * 10 = 50 + 5 combo (from last 3) = 55
      expect(result.score).toBe(55);
      expect(result.hits).toBe(5);
      expect(result.misses).toBe(1);
    });

    it('should not award combo for only 2 consecutive hits', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
      ];
      const result = calculateScore(events);
      expect(result.score).toBe(20); // No combo bonus
    });
  });

  describe('mixed scenarios', () => {
    it('should handle combo interrupted after 4 hits', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: true, distance: 5 },
        { hit: true, distance: 5 }, // Combo +5
        { hit: true, distance: 5 },
        { hit: false, distance: 5 }, // Breaks combo
      ];
      const result = calculateScore(events);
      // 4 hits * 10 = 40 + 5 combo = 45
      expect(result.score).toBe(45);
      expect(result.hits).toBe(4);
      expect(result.misses).toBe(1);
    });

    it('should combine distance bonus and combo', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 15 }, // 10 + 5 distance
        { hit: true, distance: 12 }, // 10 + 5 distance
        { hit: true, distance: 11 }, // 10 + 5 distance + 5 combo
      ];
      const result = calculateScore(events);
      // 3 * 10 = 30, 3 * 5 = 15 distance, 5 combo = 50
      expect(result.score).toBe(50);
    });

    it('should handle alternating hits and misses', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },
        { hit: false, distance: 5 },
        { hit: true, distance: 5 },
        { hit: false, distance: 5 },
        { hit: true, distance: 5 },
        { hit: false, distance: 5 },
      ];
      const result = calculateScore(events);
      // 3 hits * 10 = 30, no combo (never 3 in a row)
      expect(result.score).toBe(30);
      expect(result.hits).toBe(3);
      expect(result.misses).toBe(3);
    });

    it('should handle complex mixed sequence', () => {
      const events: ShotEvent[] = [
        { hit: true, distance: 5 },   // 10
        { hit: true, distance: 12 },  // 10 + 5 distance
        { hit: true, distance: 8 },   // 10 + 5 combo
        { hit: false, distance: 5 },  // 0, breaks combo
        { hit: true, distance: 15 },  // 10 + 5 distance
        { hit: true, distance: 20 },  // 10 + 5 distance
        { hit: true, distance: 3 },   // 10 + 5 combo
      ];
      const result = calculateScore(events);
      // Hits: 10 + 15 + 15 + 15 + 15 + 15 = wait, let me recalculate
      // Shot 1: 10
      // Shot 2: 10 + 5 = 15
      // Shot 3: 10 + 5 (combo for 3rd hit) = 15
      // Shot 4: 0 (miss)
      // Shot 5: 10 + 5 = 15
      // Shot 6: 10 + 5 = 15
      // Shot 7: 10 + 5 (combo for 3rd consecutive) = 15
      // Total: 10 + 15 + 15 + 0 + 15 + 15 + 15 = 85
      expect(result.score).toBe(85);
      expect(result.hits).toBe(6);
      expect(result.misses).toBe(1);
    });
  });
});
