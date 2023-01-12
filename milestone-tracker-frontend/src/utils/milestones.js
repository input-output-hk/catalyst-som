const getPrevMilestone = (milestones, current) => {
  const otherMilestones = milestones.filter(ml => (ml)).filter(
    (ml) => ml.milestone < current
  ).sort((a, b) => b.milestone - a.milestone)
  if (otherMilestones.length) {
    return otherMilestones[0]
  } else {
    return null
  }
}

export {
  getPrevMilestone
}
