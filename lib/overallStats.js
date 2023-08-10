function getAvgEstimated1RM(estimated1RMArray) {
  return !estimated1RMArray
    ? 0
    : estimated1RMArray.reduce((a, b) => a + b, 0) / estimated1RMArray.length;
}

function getAvgTrainingVolume(trainingVolumeArray) {
  return !trainingVolumeArray
    ? 0
    : trainingVolumeArray.reduce((a, b) => a + b, 0) /
        trainingVolumeArray.length;
}

exports.getOverallStats = function (sessionsStats) {
  const estimated1RMArray = [];
  const trainingVolumeArray = [];

  sessionsStats?.forEach((stats) => {
    estimated1RMArray.push(stats.estimated1RM);
    trainingVolumeArray.push(stats.trainingVolume);
  });

  const avgEstimated1RM = getAvgEstimated1RM(estimated1RMArray);
  const avgTrainingVolume = getAvgTrainingVolume(trainingVolumeArray);

  return {
    avgEstimated1RM,
    avgTrainingVolume,
  };
};
