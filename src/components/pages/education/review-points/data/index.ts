// Re-export from unified data for backwards compatibility
import { educationData } from "@/data/education";

export const sampleReviewPoints = educationData.reviewPoints;

export function getReviewPointsByLearned(learned: boolean) {
  return educationData.reviewPoints.filter(
    (point) => point.isLearned === learned
  );
}

export function getReviewPointsByDifficulty(difficulty: string) {
  return educationData.reviewPoints.filter(
    (point) => point.difficulty === difficulty
  );
}

export function getReviewPointsByCategory(category: string) {
  return educationData.reviewPoints.filter(
    (point) => point.category === category
  );
}

export function toggleReviewPointLearned(pointId: string) {
  return educationData.reviewPoints.map((point) =>
    point.id === pointId
      ? {
          ...point,
          isLearned: !point.isLearned,
          lastReviewed: new Date().toISOString(),
        }
      : point
  );
}
