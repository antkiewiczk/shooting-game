export interface ShotEvent {
    hit: boolean;
    distance: number;
}
export interface ScoreResult {
    score: number;
    hits: number;
    misses: number;
}
/**
 * Calculate score from shot events according to rules:
 * - Hit: +10 pts; miss: 0
 * - Distance bonus (hit only): +5 pts if distance > 10
 * - Combo: +5 pts for every full 3 consecutive hits
 */
export declare function calculateScore(events: ShotEvent[]): ScoreResult;
//# sourceMappingURL=score.d.ts.map