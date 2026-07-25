const levels = ['Easy', 'Medium', 'Hard']

export function getNextDifficulty(currentDifficulty, lastScore) {
  const idx = levels.indexOf(currentDifficulty)
  
  if (lastScore >= 8 && idx < levels.length - 1) {
    return levels[idx + 1]
  }
  if (lastScore <= 4 && idx > 0) {
    return levels[idx - 1]
  }
  return currentDifficulty
}

// not using this rn but might be useful later
export function getPerformanceBadge(avgScore) {
  if (avgScore >= 8) return 'Excellent'
  if (avgScore >= 5) return 'Good'
  return 'Keep Practicing'
}
