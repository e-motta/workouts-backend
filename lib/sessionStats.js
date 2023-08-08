function getEstimated1RM(weight, reps) {
  return weight * (1 + reps / 30);
}

function getRelativeIntensity(weight, estimated1RM) {
  return weight / estimated1RM;
}

function getTrainingVolume(sets, weight, reps) {
  return sets * weight * reps;
}

function getDensityLoad(sets, weight, reps, rest) {
  return (sets * weight * reps) / rest;
}

exports.getStatsFromSession = function (session) {
  const estimated1RM = getEstimated1RM(session.weight, session.reps);

  return {
    estimated1RM,
    relativeIntensity: getRelativeIntensity(session.weight, estimated1RM),
    trainingVolume: getTrainingVolume(
      session.sets,
      session.weight,
      session.reps
    ),
    densityLoad: getDensityLoad(
      session.sets,
      session.weight,
      session.reps,
      session.rest
    ),
  };
};
