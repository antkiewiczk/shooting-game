"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateScore = calculateScore;
/**
 * Calculate score from shot events according to rules:
 * - Hit: +10 pts; miss: 0
 * - Distance bonus (hit only): +5 pts if distance > 10
 * - Combo: +5 pts for every full 3 consecutive hits
 */
function calculateScore(events) {
    let score = 0;
    let hits = 0;
    let misses = 0;
    let consecutiveHits = 0;
    for (const event of events) {
        if (event.hit) {
            hits++;
            consecutiveHits++;
            // Base hit score
            score += 10;
            // Distance bonus
            if (event.distance > 10) {
                score += 5;
            }
            // Combo bonus: +5 for every 3 consecutive hits
            if (consecutiveHits > 0 && consecutiveHits % 3 === 0) {
                score += 5;
            }
        }
        else {
            misses++;
            consecutiveHits = 0; // Reset combo on miss
        }
    }
    return { score, hits, misses };
}
