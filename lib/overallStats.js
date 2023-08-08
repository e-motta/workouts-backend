exports.getAvgEstimated1RM = function (estimated1RMArray) {
  return (
    estimated1RMArray.reduce((a, b) => a + b, 0) / estimated1RMArray.length
  );
};

exports.getFitnessScore = function (avgEstimated1RM, totalTrainingVolume) {
  return avgEstimated1RM * 0.4 + totalTrainingVolume * 0.6;
};
