const SessionStatsSchema = require("../models/SessionStats");
const { getStatsFromSession } = require("../lib/sessionStats");

exports.registerSessionStatsHook = (schema) => {
  schema.post("save", async (session) => {
    const stats = getStatsFromSession(session);

    let sessionStats = await SessionStatsSchema.findOne({
      exercise: session.exercise,
      workout: session.workout,
    });

    if (!sessionStats) {
      sessionStats = new SessionStatsSchema({
        user: session.user,
        session: session.id,
        exercise: session.exercise,
        ...stats,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      sessionStats.set({
        ...stats,
        updated_at: new Date(),
      });
    }

    await sessionStats.save();
  });
};
