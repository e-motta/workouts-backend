const SessionStatsSchema = require("../models/SessionStats");
const OverallStatsSchema = require("../models/OverallStats");
const { getOverallStats } = require("../lib/overallStats");
const { getStatsFromSession } = require("../lib/sessionStats");

exports.registerOverallStatsHook = (schema) => {
  schema.post("validate", async (session) => {
    const sessionsStats = await SessionStatsSchema.find({
      user: session.user,
    });

    sessionsStats.push(getStatsFromSession(session));

    const { avgEstimated1RM, avgTrainingVolume } =
      getOverallStats(sessionsStats);

    const overallStats = new OverallStatsSchema({
      user: session.user,
      latest_session: session.id,
      avgEstimated1RM,
      avgTrainingVolume,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await overallStats.save();
  });
};
